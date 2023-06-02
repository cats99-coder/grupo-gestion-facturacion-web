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
  GridColDef,
  GridRowParams,
  MuiEvent,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
} from "@mui/x-data-grid";

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
      { _id, concepto: "", importe: 0, isNew: true },
    ]);

    setRowModesModel((oldModel) => ({
      ...oldModel,
      [_id]: { mode: GridRowModes.Edit, fieldToFocus: "concepto" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Nuevo Suplido
      </Button>
    </GridToolbarContainer>
  );
}

export default function Suplidos({ initialRows, handleSuplidos, facturado }) {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  React.useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);
  React.useEffect(() => {
    handleSuplidos(rows);
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
  const getTogglableColumns = (columns: GridColDef[]) => {
    return columns;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const columns: GridColDef[] = [
    { field: "concepto", headerName: "Concepto", width: 350, editable: true },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 0.3,
      type: "date",
      valueGetter: function (params) {
        return new Date(params.row.fecha);
      },
      editable: true,
    },
    {
      field: "importe",
      headerName: "Importe",
      flex: 0.3,
      type: "number",
      editable: true,
    },
    {
      field: "pendiente",
      headerName: "Pendiente",
      flex: 0.3,
      type: "number",
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      width: 150,
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
          toolbar: !facturado ? EditToolbar : null,
        }}
        getRowId={(row) => row._id}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}
