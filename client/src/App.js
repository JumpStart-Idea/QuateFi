import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import Products from "scenes/products";
import Customers from "scenes/customers";
import Transactions from "scenes/transactions";
import Geography from "scenes/geography";
import Overview from "scenes/overview";
import Daily from "scenes/daily";
import Monthly from "scenes/monthly";
import Breakdown from "scenes/breakdown";
import Admin from "scenes/admin";
import Performance from "scenes/performance";
import Settings from "scenes/settings";
import React, { createContext, useState, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { setMode, login } from "state";
import Login from "scenes/login";
import Register from "scenes/register";

export const NotificationContext = createContext();

function NotificationProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const showNotification = useCallback((msg, sev = "success") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </MuiAlert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

function PrivateRoute({ children }) {
  const token = useSelector((state) => state.global.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const dispatch = useDispatch();
  React.useEffect(() => {
    const storedMode = localStorage.getItem("themeMode");
    if (storedMode) {
      dispatch(setMode(storedMode));
    }
  }, [dispatch]); // Only run on mount
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <NotificationProvider>
      <div className="app">
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/geography" element={<Geography />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/daily" element={<Daily />} />
                <Route path="/monthly" element={<Monthly />} />
                <Route path="/breakdown" element={<Breakdown />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/performance" element={<Performance />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </div>
    </NotificationProvider>
  );
}

export default App;
