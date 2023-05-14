"use client";
import { esES } from "@mui/x-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { ReactNode, useState, Suspense, createContext } from "react";
import {
  Alert,
  AlertTitle,
  Snackbar,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const ToastContext = createContext({});
export const AuthContext = createContext({});

export default function Providers({
  children,
  token,
}: {
  children: ReactNode;
  token: RequestCookie | undefined;
}) {
  const theme = createTheme(
    {
      palette: {
        primary: { main: "#1976d2" },
      },
    },
    esES
  );
  const [openWarning, setOpenWarning] = useState(false);
  const [messageWarning, setMessageWarning] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState("");
  const [user, setUser] = useState(() => {
    if (token) {
      return token;
    } else {
      return {};
    }
  });
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <ToastContext.Provider
        value={{
          setOpenWarning,
          setMessageWarning,
          setOpenSuccess,
          setMessageSuccess,
        }}
      >
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <Suspense>{children}</Suspense>
            {/* //Warning */}
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={openWarning}
              onClose={() => setOpenWarning(false)}
              autoHideDuration={2000}
            >
              <Alert severity="warning" sx={{ width: "100%" }}>
                <AlertTitle>Error</AlertTitle>
                {messageWarning}
              </Alert>
            </Snackbar>
            {/* //Success */}
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={openSuccess}
              onClose={() => setOpenSuccess(false)}
              autoHideDuration={2000}
            >
              <Alert severity="success" sx={{ width: "100%" }}>
                <AlertTitle>Correcto</AlertTitle>
                {messageSuccess}
              </Alert>
            </Snackbar>
          </LocalizationProvider>
        </ThemeProvider>
      </ToastContext.Provider>
    </AuthContext.Provider>
  );
}
