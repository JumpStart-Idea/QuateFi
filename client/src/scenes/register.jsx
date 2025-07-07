import React, { useState, useContext, useEffect } from "react";
import { Box, Button, TextField, Typography, Paper, MenuItem, Avatar, IconButton, useTheme, Tooltip, CircularProgress, InputAdornment } from "@mui/material";
import { useRegisterMutation } from "state/api";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../App";
import { geoData } from "state/geoData";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "state";
import { validateEmail, validatePassword, validateName, validatePhone, validateRequired } from "../utils/validation";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    country: "",
    occupation: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    country: "",
    occupation: "",
    phoneNumber: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    city: false,
    country: false,
    occupation: false,
    phoneNumber: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerApi] = useRegisterMutation();
  const navigate = useNavigate();
  const showNotification = useContext(NotificationContext);
  const [loading, setLoading] = useState(false);
  const countryOptions = geoData.features.map(f => ({ code: f.id, name: f.properties.name }));
  const theme = useTheme();
  const dispatch = useDispatch();
  const mode = theme.palette.mode;

  // Real-time validation
  useEffect(() => {
    if (touched.name) {
      const nameError = validateName(form.name);
      setErrors(prev => ({ ...prev, name: nameError }));
    }
  }, [form.name, touched.name]);

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

  useEffect(() => {
    if (touched.confirmPassword) {
      const confirmPasswordError =
        !form.confirmPassword
          ? "Please confirm your password"
          : form.confirmPassword !== form.password
          ? "Passwords do not match"
          : "";
      setErrors(prev => ({ ...prev, confirmPassword: confirmPasswordError }));
    }
  }, [form.confirmPassword, form.password, touched.confirmPassword]);

  useEffect(() => {
    if (touched.city) {
      const cityError = validateRequired(form.city, "City");
      setErrors(prev => ({ ...prev, city: cityError }));
    }
  }, [form.city, touched.city]);

  useEffect(() => {
    if (touched.country) {
      const countryError = validateRequired(form.country, "Country");
      setErrors(prev => ({ ...prev, country: countryError }));
    }
  }, [form.country, touched.country]);

  useEffect(() => {
    if (touched.occupation) {
      const occupationError = validateRequired(form.occupation, "Occupation");
      setErrors(prev => ({ ...prev, occupation: occupationError }));
    }
  }, [form.occupation, touched.occupation]);

  useEffect(() => {
    if (touched.phoneNumber) {
      const phoneError = validatePhone(form.phoneNumber);
      setErrors(prev => ({ ...prev, phoneNumber: phoneError }));
    }
  }, [form.phoneNumber, touched.phoneNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const isFormValid = () => {
    return (
      !errors.name &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword &&
      !errors.city &&
      !errors.country &&
      !errors.occupation &&
      !errors.phoneNumber &&
      form.name &&
      form.email &&
      form.password &&
      form.confirmPassword &&
      form.city &&
      form.country &&
      form.occupation &&
      form.phoneNumber &&
      form.password === form.confirmPassword
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all fields on submit
    const nameError = validateName(form.name);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    const confirmPasswordError =
      !form.confirmPassword
        ? "Please confirm your password"
        : form.confirmPassword !== form.password
        ? "Passwords do not match"
        : "";
    const cityError = validateRequired(form.city, "City");
    const countryError = validateRequired(form.country, "Country");
    const occupationError = validateRequired(form.occupation, "Occupation");
    const phoneError = validatePhone(form.phoneNumber);
    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      city: cityError,
      country: countryError,
      occupation: occupationError,
      phoneNumber: phoneError,
    });
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      city: true,
      country: true,
      occupation: true,
      phoneNumber: true,
    });
    if (
      nameError ||
      emailError ||
      passwordError ||
      confirmPasswordError ||
      cityError ||
      countryError ||
      occupationError ||
      phoneError
    ) {
      showNotification("Please fix the validation errors", "error");
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...submitForm } = form;
      const res = await registerApi(submitForm);
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
            dispatch(setMode());
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
              <TextField 
                label=""
                placeholder="Name"
                name="name" 
                value={form.name} 
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth 
                margin="normal" 
                required 
                autoFocus 
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                InputProps={{
                  endAdornment: touched.name && (
                    <InputAdornment position="end">
                      {!errors.name && form.name ? (
                        <CheckCircleIcon color="success" />
                      ) : errors.name ? (
                        <ErrorIcon color="error" />
                      ) : null}
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  gridColumn: 'span 1', 
                  borderRadius: 2, 
                  background: theme.palette.background.paper, 
                  transition: 'box-shadow 0.2s',
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: errors.name ? 'error.main' : 'primary.main',
                    },
                  }
                }} 
              />
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
                type="email"
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                InputProps={{
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
                  gridColumn: 'span 1', 
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
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        tabIndex={-1}
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
                  gridColumn: 'span 1', 
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
              <TextField 
                label=""
                placeholder="Confirm Password"
                name="confirmPassword" 
                value={form.confirmPassword} 
                onChange={handleChange}
                onBlur={handleBlur}
                type={showConfirmPassword ? "text" : "password"} 
                fullWidth 
                margin="normal" 
                required 
                error={touched.confirmPassword && !!errors.confirmPassword}
                helperText={touched.confirmPassword && errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                      {touched.confirmPassword && (
                        !errors.confirmPassword && form.confirmPassword ? (
                          <CheckCircleIcon color="success" />
                        ) : errors.confirmPassword ? (
                          <ErrorIcon color="error" />
                        ) : null
                      )}
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  gridColumn: 'span 1', 
                  borderRadius: 2, 
                  background: theme.palette.background.paper, 
                  transition: 'box-shadow 0.2s',
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: errors.confirmPassword ? 'error.main' : 'primary.main',
                    },
                  }
                }} 
              />
              <TextField 
                label=""
                placeholder="City"
                name="city" 
                value={form.city} 
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth 
                margin="normal" 
                required 
                error={touched.city && !!errors.city}
                helperText={touched.city && errors.city}
                InputProps={{
                  endAdornment: touched.city && (
                    <InputAdornment position="end">
                      {!errors.city && form.city ? (
                        <CheckCircleIcon color="success" />
                      ) : errors.city ? (
                        <ErrorIcon color="error" />
                      ) : null}
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  gridColumn: 'span 1', 
                  borderRadius: 2, 
                  background: theme.palette.background.paper, 
                  transition: 'box-shadow 0.2s',
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: errors.city ? 'error.main' : 'primary.main',
                    },
                  }
                }} 
              />
              <TextField 
                select
                label=""
                name="country" 
                value={form.country} 
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth 
                margin="normal" 
                required 
                error={touched.country && !!errors.country}
                helperText={touched.country && errors.country}
                InputProps={{
                  endAdornment: touched.country && (
                    <InputAdornment position="end">
                      {!errors.country && form.country ? (
                        <CheckCircleIcon color="success" />
                      ) : errors.country ? (
                        <ErrorIcon color="error" />
                      ) : null}
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  gridColumn: 'span 1', 
                  borderRadius: 2, 
                  background: theme.palette.background.paper, 
                  transition: 'box-shadow 0.2s',
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: errors.country ? 'error.main' : 'primary.main',
                    },
                  }
                }}
              >
                <MenuItem value="" disabled>Select Country</MenuItem>
                {countryOptions.map(option => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.name} ({option.code})
                  </MenuItem>
                ))}
              </TextField>
              <TextField 
                label=""
                placeholder="Occupation"
                name="occupation" 
                value={form.occupation} 
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth 
                margin="normal" 
                required 
                error={touched.occupation && !!errors.occupation}
                helperText={touched.occupation && errors.occupation}
                InputProps={{
                  endAdornment: touched.occupation && (
                    <InputAdornment position="end">
                      {!errors.occupation && form.occupation ? (
                        <CheckCircleIcon color="success" />
                      ) : errors.occupation ? (
                        <ErrorIcon color="error" />
                      ) : null}
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  gridColumn: 'span 1', 
                  borderRadius: 2, 
                  background: theme.palette.background.paper, 
                  transition: 'box-shadow 0.2s',
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: errors.occupation ? 'error.main' : 'primary.main',
                    },
                  }
                }} 
              />
              <TextField 
                label=""
                placeholder="Phone Number"
                name="phoneNumber" 
                value={form.phoneNumber} 
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth 
                margin="normal" 
                required 
                error={touched.phoneNumber && !!errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
                InputProps={{
                  endAdornment: touched.phoneNumber && (
                    <InputAdornment position="end">
                      {!errors.phoneNumber && form.phoneNumber ? (
                        <CheckCircleIcon color="success" />
                      ) : errors.phoneNumber ? (
                        <ErrorIcon color="error" />
                      ) : null}
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  gridColumn: 'span 1', 
                  borderRadius: 2, 
                  background: theme.palette.background.paper, 
                  transition: 'box-shadow 0.2s',
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: errors.phoneNumber ? 'error.main' : 'primary.main',
                    },
                  }
                }} 
              />
            </Box>
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              disabled={loading || !isFormValid()}
              sx={{ 
                mt: 2, 
                py: 1.5, 
                fontWeight: 600, 
                fontSize: '1.1rem', 
                borderRadius: 2, 
                letterSpacing: 1, 
                boxShadow: '0 2px 8px 0 rgba(67,206,162,0.15)', 
                background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)', 
                color: '#fff', 
                '&:hover': { background: 'linear-gradient(90deg, #185a9d 0%, #43cea2 100%)' },
                opacity: isFormValid() ? 1 : 0.6
              }} 
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
            </Button>
          </form>
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
        </Paper>
      </Box>
    </Box>
  );
};

export default Register; 