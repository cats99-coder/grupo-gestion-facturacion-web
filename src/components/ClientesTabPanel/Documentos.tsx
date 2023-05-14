"use client";
import { useContext } from "react";
import { AuthContext } from "../Providers";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FiscalService } from "@/services/fiscal.service";

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
  const blobProcess = (blob: Blob) => {
    const objectURL = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectURL;
    a.title = 'invoice.pdf'
    a.target = "_blank";
    a.click();
  };
  const handleContratoAutonomo = () => {
    new FiscalService()
      .imprimir({ _id })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const res = await response.blob();
        return res;
      })
      .then((blob) => blobProcess(blob))
      .catch((err) => {
        console.log(err);
      });
    handleClose();
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
        <MenuItem onClick={handleContratoAutonomo}>Contrato Autónomo</MenuItem>
      </Menu>
    </div>
  );
}
