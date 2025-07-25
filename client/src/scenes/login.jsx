import React, { useState, useContext, useEffect } from "react";
import { Box, Button, TextField, Typography, Paper, Avatar, IconButton, useTheme, Tooltip, CircularProgress, Alert, InputAdornment } from "@mui/material";
import { useLoginMutation } from "state/api";
import { useDispatch, useSelector } from "react-redux";
import { login, setMode } from "state";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../App";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { validateEmail, validatePassword, isFormValid } from "../utils/validation";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loginApi] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showNotification = useContext(NotificationContext);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const mode = theme.palette.mode;



  // Real-time validation
  useEffect(() => {
    if (touched.email) {
      const emailError = validateEmail(form.email);
      setErrors(prev => ({ ...prev, email: emailError }));
    }
  }, [form.email, touched.email]);

  useEffect(() => {
    if (touched.password) {
      const passwordError = validatePassword(form.password);
      setErrors(prev => ({ ...prev, password: passwordError }));
    }
  }, [form.password, touched.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Mark field as touched when user starts typing
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const checkFormValid = () => {
    return !errors.email && !errors.password && form.email && form.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields on submit
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    
    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });
    
    if (emailError || passwordError) {
      showNotification("Please fix the validation errors", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await loginApi(form);
      if (res && res.data && res.data.token) {
        dispatch(login({ user: res.data.user, token: res.data.token }));
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        showNotification("Login successful!", "success");
        navigate("/dashboard");
      } else throw res.error;
    } catch (e) {
      const msg = e && e.data && e.data.message ? e.data.message : "Login failed!";
      showNotification(msg, "error");
    }
    setLoading(false);
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>
      <Box position="absolute" top={24} right={24} zIndex={10}>
        <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          <IconButton onClick={() => {
            console.log("Login page - Current mode before toggle:", mode);
            dispatch(setMode());
            console.log("Login page - Mode toggle dispatched");
          }} sx={{ bgcolor: 'background.paper', boxShadow: 2 }}>
            {mode === 'dark' ? <LightModeIcon sx={{ color: '#ffb300' }} /> : <DarkModeIcon sx={{ color: '#333' }} />}
          </IconButton>
        </Tooltip>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" width="100%" maxWidth={400}>
        <Paper elevation={0} sx={{
          p: 5,
          width: '100%',
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
            <Typography variant="h5" fontWeight={700} color="primary.main" letterSpacing={2} sx={{ textShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>Test Application</Typography>
          </Box>
          <Avatar sx={{
            m: 1,
            width: 56,
            height: 56,
            boxShadow: 2,
            bgcolor: 'primary.main',
            backgroundImage: 'url(https://www.transparenttextures.com/patterns/cubes.png), linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '2px solid #fff',
          }}>
            <AccountCircleIcon fontSize="large" style={{ color: '#fff' }} />
          </Avatar>
          <Typography variant="h4" mb={1} fontWeight={700} color="primary.main" letterSpacing={1.5}>Sign In</Typography>
          <Typography variant="body2" mb={2} color="text.secondary">Welcome back! Please enter your credentials.</Typography>
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }} autoComplete="off">
            <TextField 
              label=""
              placeholder="Email"
              name="email" 
              value={form.email} 
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth 
              margin="normal" 
              required 
              autoFocus 
              type="email"
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color={touched.email && !errors.email && form.email ? "success" : "action"} />
                  </InputAdornment>
                ),
                endAdornment: touched.email && (
                  <InputAdornment position="end">
                    {!errors.email && form.email ? (
                      <CheckCircleIcon color="success" />
                    ) : errors.email ? (
                      <ErrorIcon color="error" />
                    ) : null}
                  </InputAdornment>
                )
              }}
              sx={{ 
                borderRadius: 2, 
                background: theme.palette.background.paper, 
                transition: 'box-shadow 0.2s',
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: errors.email ? 'error.main' : 'primary.main',
                  },
                }
              }} 
            />
            
            <TextField 
              label=""
              placeholder="Password"
              name="password" 
              value={form.password} 
              onChange={handleChange}
              onBlur={handleBlur}
              type={showPassword ? "text" : "password"} 
              fullWidth 
              margin="normal" 
              required 
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color={touched.password && !errors.password && form.password ? "success" : "action"} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                    {touched.password && (
                      !errors.password && form.password ? (
                        <CheckCircleIcon color="success" />
                      ) : errors.password ? (
                        <ErrorIcon color="error" />
                      ) : null
                    )}
                  </InputAdornment>
                )
              }}
              sx={{ 
                borderRadius: 2, 
                background: theme.palette.background.paper, 
                transition: 'box-shadow 0.2s',
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: errors.password ? 'error.main' : 'primary.main',
                  },
                }
              }} 
            />
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              disabled={loading || !checkFormValid()}
              sx={{ 
                mt: 2, 
                py: 1.5, 
                fontWeight: 600, 
                fontSize: '1.1rem', 
                borderRadius: 2, 
                letterSpacing: 1, 
                boxShadow: '0 2px 8px 0 rgba(102,126,234,0.15)',
                opacity: checkFormValid() ? 1 : 0.6
              }} 
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign in"}
            </Button>
          </form>
        </Paper>
        <Button onClick={() => navigate("/register")}
          sx={{
            mt: 2,
            color: '#fff',
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: 'none',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 2px 8px 0 rgba(102,126,234,0.15)',
            borderRadius: 2,
            width: '100%',
            maxWidth: 400,
            alignSelf: 'center',
            '&:hover': { background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)' }
          }}
        >
          Don't have an account? Register
        </Button>
      </Box>
    </Box>
  );
};

export default Login; 