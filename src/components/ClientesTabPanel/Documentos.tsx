"use client";
import { useContext } from "react";
import { AuthContext } from "../Providers";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import RubenContratoAutonomo from "./Documents/Ruben/contrato-autonomo";

export default function Documentos({ _id }: { _id: string }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [openContratoAutonomo, setOpenContratoAutonomo] = React.useState(false);
  const handleClickOpenContratoAutonomo = () => {
    setOpenContratoAutonomo(true);
  };
  const handleCloseContratoAutonomo = () => {
    setOpenContratoAutonomo(false);
    handleClose()
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
        Documentos
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
        <MenuItem onClick={handleClickOpenContratoAutonomo}>
          Contrato Autónomo
        </MenuItem>
      </Menu>
      {/* Rubén Contrato Autónomo */}
      <RubenContratoAutonomo
        _id={_id}
        open={openContratoAutonomo}
        handleClose={handleCloseContratoAutonomo}
      />
    </div>
  );
}
