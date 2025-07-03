import React, { useState, useContext } from "react";
import { Box, Button, TextField, Typography, Paper, MenuItem, Avatar, IconButton, useTheme, Tooltip, CircularProgress } from "@mui/material";
import { useRegisterMutation } from "state/api";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../App";
import { geoData } from "state/geoData";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "state";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    country: "",
    occupation: "",
    phoneNumber: "",
  });
  const [registerApi] = useRegisterMutation();
  const navigate = useNavigate();
  const showNotification = useContext(NotificationContext);
  const [loading, setLoading] = useState(false);
  const countryOptions = geoData.features.map(f => ({ code: f.id, name: f.properties.name }));
  const theme = useTheme();
  const dispatch = useDispatch();
  const mode = theme.palette.mode;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerApi(form);
      if (res && res.data && res.data.user) {
        showNotification("Registration successful! Please login.", "success");
        navigate("/login", { state: { email: form.email } });
      } else throw res.error;
    } catch (e) {
      const msg = e && e.data && e.data.message ? e.data.message : "Registration failed!";
      showNotification(msg, "error");
    }
    setLoading(false);
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" sx={{ background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)', fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>
      <Box position="absolute" top={24} right={24} zIndex={10}>
        <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          <IconButton onClick={() => {
            console.log("Register page - Current mode before toggle:", mode);
            dispatch(setMode());
            console.log("Register page - Mode toggle dispatched");
          }} sx={{ bgcolor: 'background.paper', boxShadow: 2 }}>
            {mode === 'dark' ? <LightModeIcon sx={{ color: '#ffb300' }} /> : <DarkModeIcon sx={{ color: '#333' }} />}
          </IconButton>
        </Tooltip>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" width="100%" maxWidth={600}>
        <Paper elevation={0} sx={{
          p: 5,
          width: '100%',
          maxWidth: 600,
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.25)',
        }}>
          {/* Logo/Brand */}
          <Box mb={2} display="flex" alignItems="center" gap={1}>
            {/* <img src="/favicon.ico" alt="logo" style={{ width: 32, height: 32, borderRadius: 8 }} /> */}
            <Typography variant="h5" fontWeight={700} color="#185a9d" letterSpacing={2} sx={{ textShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>Test Application</Typography>
          </Box>
          <Avatar sx={{
            m: 1,
            width: 56,
            height: 56,
            boxShadow: 2,
            bgcolor: 'secondary.main',
            backgroundImage: 'url(https://www.transparenttextures.com/patterns/cubes.png), linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '2px solid #fff',
          }}>
            <PersonAddAlt1Icon fontSize="large" style={{ color: '#fff' }} />
          </Avatar>
          <Typography variant="h4" mb={1} fontWeight={700} color="#185a9d" letterSpacing={1.5}>Sign Up</Typography>
          <Typography variant="body2" mb={2} color="#43cea2">Create your account to get started!</Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }} autoComplete="off">
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required autoFocus sx={{ gridColumn: 'span 1', borderRadius: 2, background: theme.palette.background.paper, transition: 'box-shadow 0.2s' }} />
              <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required sx={{ gridColumn: 'span 1', borderRadius: 2, background: theme.palette.background.paper, transition: 'box-shadow 0.2s' }} />
              <TextField label="Password" name="password" value={form.password} onChange={handleChange} type="password" fullWidth margin="normal" required sx={{ gridColumn: 'span 1', borderRadius: 2, background: theme.palette.background.paper, transition: 'box-shadow 0.2s' }} />
              <TextField label="City" name="city" value={form.city} onChange={handleChange} fullWidth margin="normal" required sx={{ gridColumn: 'span 1', borderRadius: 2, background: theme.palette.background.paper, transition: 'box-shadow 0.2s' }} />
              <TextField select label="Country" name="country" value={form.country} onChange={handleChange} fullWidth margin="normal" required sx={{ gridColumn: 'span 1', borderRadius: 2, background: theme.palette.background.paper, transition: 'box-shadow 0.2s' }}>
                {countryOptions.map(option => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.name} ({option.code})
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="Occupation" name="occupation" value={form.occupation} onChange={handleChange} fullWidth margin="normal" required sx={{ gridColumn: 'span 1', borderRadius: 2, background: theme.palette.background.paper, transition: 'box-shadow 0.2s' }} />
              <TextField label="Phone Number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} fullWidth margin="normal" required sx={{ gridColumn: 'span 2', borderRadius: 2, background: theme.palette.background.paper, transition: 'box-shadow 0.2s' }} />
            </Box>
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, py: 1.5, fontWeight: 600, fontSize: '1.1rem', borderRadius: 2, letterSpacing: 1, boxShadow: '0 2px 8px 0 rgba(67,206,162,0.15)', background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)', color: '#fff', '&:hover': { background: 'linear-gradient(90deg, #185a9d 0%, #43cea2 100%)' } }} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
            </Button>
          </form>
        </Paper>
        <Button onClick={() => navigate("/login")}
          sx={{
            mt: 2,
            color: '#fff',
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: 'none',
            background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
            boxShadow: '0 2px 8px 0 rgba(67,206,162,0.15)',
            borderRadius: 2,
            width: '100%',
            maxWidth: 600,
            alignSelf: 'center',
            '&:hover': { background: 'linear-gradient(90deg, #185a9d 0%, #43cea2 100%)' }
          }}
        >
          Already have an account? Login
        </Button>
      </Box>
    </Box>
  );
};

export default Register; 