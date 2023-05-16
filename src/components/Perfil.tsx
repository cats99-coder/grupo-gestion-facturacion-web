"use client";
import { useContext } from "react";
import { AuthContext } from "./Providers";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Avatar } from "@mui/material";
import { deepPurple } from "@mui/material/colors";

export default function Perfil() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { user } = useContext<any>(AuthContext);
  const router = useRouter();
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
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
        <Avatar sx={{ bgcolor: deepPurple[500] }}>
          {user.nombre.substring(0, 1)}
        </Avatar>
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
        <MenuItem onClick={logout}>Cerrar Sesión</MenuItem>
      </Menu>
    </div>
  );
}
