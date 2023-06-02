import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridRowParams,
  MuiEvent,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridColDef,
} from "@mui/x-data-grid";
import { Autocomplete, TextField } from "@mui/material";
import { UsuariosService } from "@/services/usuarios.service";

const ObjectId = (rnd = (r16) => Math.floor(r16).toString(16)) =>
  rnd(Date.now() / 1000) +
  " ".repeat(16).replace(/./g, () => rnd(Math.random() * 16));
interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const _id = ObjectId();
    setRows((oldRows) => [
      ...oldRows,
      { _id, tipo: "GENERAL", concepto: "", importe: 0, isNew: true },
    ]);

    setRowModesModel((oldModel) => ({
      ...oldModel,
      [_id]: { mode: GridRowModes.Edit, fieldToFocus: "concepto" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Nuevo Cobro
      </Button>
    </GridToolbarContainer>
  );
}

export default function Cobros({ initialRows, handleCobros, suplidos }: any) {
  const [rows, setRows] = React.useState(
    initialRows.map((i: any) => {
      if (i.suplidoRef) {
        i.suplidoRef = suplidos.find((suplido: any) => {
          return i.suplido === suplido._id;
        });
      }
      return i;
    })
  );
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const [colaboradores, setColaboradores] = React.useState<Array<Cobro>>([]);
  React.useEffect(() => {
    new UsuariosService().getAll().then(async (response) => {
      const res: Array<Cobro> = await response.json();
      setColaboradores(res);
    });
  }, []);
  React.useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);
  React.useEffect(() => {
    handleCobros(rows);
  }, [rows]);
  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (_id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [_id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (_id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [_id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (_id: GridRowId) => () => {
    setRows(rows.filter((row) => row._id !== _id));
  };
  const handleCancelClick = (_id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [_id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row._id === _id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row._id !== _id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row._id === newRow._id ? updatedRow : row)));
    return updatedRow;
  };
  const handleTipo = (id: string, cobradoPor: CobroType | null) => {
    setRows(rows.map((row) => (row._id === id ? { ...row, cobradoPor } : row)));
  };
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const tipos: CobroType[] = ["BIZUM C", "EFECTIVO R"];
  const columns: GridColDef = [
    {
      field: "tipo",
      headerName: "Tipo",
      width: 350,
      renderCell(params) {
        if (params.row.tipo === "GENERAL") {
          return (
            <div className="p-2">
              <Autocomplete
                // disablePortal
                id="combo-box-demo"
                options={tipos}
                value={params.row?.cobradoPor}
                onChange={(e, value: CobroType | null) =>
                  handleTipo(params.id, value)
                }
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} size="small" label="" />
                )}
              />
            </div>
          );
        }
        if (params.row.tipo === "SUPLIDO") {
          if (params.row.suplidoRef) {
            return `SUPLIDO: ${params.row.suplidoRef.concepto}`;
          }
          return <div className="bg-red-800 py-1 px-2 text-white">Error</div>;
        }
      },
    },
    {
      field: "fecha",
      headerName: "Fecha",
      type: "date",
      width: 150,
      valueGetter: function (params) {
        return new Date(params.row.fecha);
      },
      editable: true,
    },
    {
      field: "importe",
      headerName: "Importe",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Guardar"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancelar"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        className="h-full"
        sx={{ height: "100%" }}
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        getRowId={(row) => row._id}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}
