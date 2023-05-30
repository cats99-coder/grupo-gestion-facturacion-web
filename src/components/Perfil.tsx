"use client";
import { useContext } from "react";
import { AuthContext } from "./Providers";
import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Avatar, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { deepPurple } from "@mui/material/colors";
import { UsuariosService } from "@/services/usuarios.service";

export default function Perfil() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openChange, setOpenChange] = React.useState(false);
  const { user } = useContext<any>(AuthContext);
  const router = useRouter();
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickOpenChange = () => {
    setOpenChange(true);
  };
  const handleChangePassword = () => {
    new UsuariosService().changePassword(oldPassword, newPassword).then(() => {
      setOpenChange(false);
    });
  };
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const handleCloseChange = () => {
    setOpenChange(false);
  };
  const logout = () => {
    Cookies.remove("token");
    handleClose();
    router.push("/login");
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Avatar sx={{ bgcolor: deepPurple[500] }}></Avatar>
        <p className="ml-3 text-white font-bold">{user.nombre}</p>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => router.push("/estadisticas")}>
          Ver Estadísticas
        </MenuItem>
        <MenuItem onClick={() => handleClickOpenChange()}>
          Cambiar Contraseña
        </MenuItem>
        <MenuItem onClick={logout}>Cerrar Sesión</MenuItem>
      </Menu>
      <Dialog
        open={openChange}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="oldPassword"
            label="Contraseña Anterior"
            type="password"
            fullWidth
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            variant="outlined"
          />
          <TextField
            autoFocus
            margin="dense"
            id="newPassword"
            label="Contraseña Nueva"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChange}>Cancelar</Button>
          <Button onClick={handleChangePassword} autoFocus>
            Cambiar Contraseña
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
