import React from "react";
import { Box, useTheme, useMediaQuery, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, InputAdornment } from "@mui/material";
import { useGetCustomersQuery, useCreateCustomerMutation, useUpdateCustomerMutation, useDeleteCustomerMutation } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { geoData } from "state/geoData";
import FlexBetween from "components/FlexBetween";
import { useContext, useEffect } from "react";
import { NotificationContext } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { validateEmail, validatePassword, validateName, validatePhone, validateRequired } from "../../utils/validation";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Search from '@mui/icons-material/Search';

const Customers = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data, isLoading } = useGetCustomersQuery();
  const [createCustomer] = useCreateCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();
  const showNotification = useContext(NotificationContext);
  const userId = useSelector((state) => state.global.userId);

  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    city: "",
    country: "",
    occupation: "",
    phoneNumber: "",
    role: "user",
  });
  const [errors, setErrors] = React.useState({
    name: "",
    email: "",
    password: "",
    city: "",
    country: "",
    occupation: "",
    phoneNumber: "",
  });
  const [touched, setTouched] = React.useState({
    name: false,
    email: false,
    password: false,
    city: false,
    country: false,
    occupation: false,
    phoneNumber: false,
  });

  const [editOpen, setEditOpen] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    _id: "",
    name: "",
    email: "",
    password: "",
    city: "",
    country: "",
    occupation: "",
    phoneNumber: "",
    role: "user",
  });
  const [editErrors, setEditErrors] = React.useState({
    name: "",
    email: "",
    password: "",
    city: "",
    country: "",
    occupation: "",
    phoneNumber: "",
  });
  const [editTouched, setEditTouched] = React.useState({
    name: false,
    email: false,
    password: false,
    city: false,
    country: false,
    occupation: false,
    phoneNumber: false,
  });
  const [originalEditForm, setOriginalEditForm] = React.useState(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState("");
  const [deleteName, setDeleteName] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");

  const countryOptions = geoData.features.map(f => ({ code: f.id, name: f.properties.name }));

  // Filter customers based on search term
  const filteredCustomers = data ? data.filter(customer => {
    if (!searchTerm) return true; // Show all customers if search is empty
    
    const searchLower = searchTerm.toLowerCase();
    
    // Safely get string values with null checks
    const name = customer.name ? customer.name.toLowerCase() : '';
    const email = customer.email ? customer.email.toLowerCase() : '';
    const phoneNumber = customer.phoneNumber ? customer.phoneNumber : '';
    const country = customer.country ? customer.country.toLowerCase() : '';
    const occupation = customer.occupation ? customer.occupation.toLowerCase() : '';
    const role = customer.role ? customer.role.toLowerCase() : '';
    
    return (
      name.includes(searchLower) ||
      email.includes(searchLower) ||
      phoneNumber.includes(searchTerm) ||
      country.includes(searchLower) ||
      occupation.includes(searchLower) ||
      role.includes(searchLower)
    );
  }) : [];

  // Real-time validation for create form
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

  // Real-time validation for edit form
  useEffect(() => {
    if (editTouched.name) {
      const nameError = validateName(editForm.name);
      setEditErrors(prev => ({ ...prev, name: nameError }));
    }
  }, [editForm.name, editTouched.name]);

  useEffect(() => {
    if (editTouched.email) {
      const emailError = validateEmail(editForm.email);
      setEditErrors(prev => ({ ...prev, email: emailError }));
    }
  }, [editForm.email, editTouched.email]);

  useEffect(() => {
    if (editTouched.password && editForm.password) {
      const passwordError = validatePassword(editForm.password);
      setEditErrors(prev => ({ ...prev, password: passwordError }));
    }
  }, [editForm.password, editTouched.password]);

  useEffect(() => {
    if (editTouched.city) {
      const cityError = validateRequired(editForm.city, "City");
      setEditErrors(prev => ({ ...prev, city: cityError }));
    }
  }, [editForm.city, editTouched.city]);

  useEffect(() => {
    if (editTouched.country) {
      const countryError = validateRequired(editForm.country, "Country");
      setEditErrors(prev => ({ ...prev, country: countryError }));
    }
  }, [editForm.country, editTouched.country]);

  useEffect(() => {
    if (editTouched.occupation) {
      const occupationError = validateRequired(editForm.occupation, "Occupation");
      setEditErrors(prev => ({ ...prev, occupation: occupationError }));
    }
  }, [editForm.occupation, editTouched.occupation]);

  useEffect(() => {
    if (editTouched.phoneNumber) {
      const phoneError = validatePhone(editForm.phoneNumber);
      setEditErrors(prev => ({ ...prev, phoneNumber: phoneError }));
    }
  }, [editForm.phoneNumber, editTouched.phoneNumber]);

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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
    if (!editTouched[name]) {
      setEditTouched(prev => ({ ...prev, [name]: true }));
    }
  };

  const handleEditBlur = (e) => {
    const { name } = e.target;
    setEditTouched(prev => ({ ...prev, [name]: true }));
  };

  const isFormValid = () => {
    return (
      !errors.name &&
      !errors.email &&
      !errors.password &&
      !errors.city &&
      !errors.country &&
      !errors.occupation &&
      !errors.phoneNumber &&
      form.name &&
      form.email &&
      form.password &&
      form.city &&
      form.country &&
      form.occupation &&
      form.phoneNumber
    );
  };

  const isEditFormValid = () => {
    return (
      !editErrors.name &&
      !editErrors.email &&
      !editErrors.city &&
      !editErrors.country &&
      !editErrors.occupation &&
      !editErrors.phoneNumber &&
      editForm.name &&
      editForm.email &&
      editForm.city &&
      editForm.country &&
      editForm.occupation &&
      editForm.phoneNumber
    );
  };

  const handleSave = async () => {
    // Validate all fields on submit
    const nameError = validateName(form.name);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    const cityError = validateRequired(form.city, "City");
    const countryError = validateRequired(form.country, "Country");
    const occupationError = validateRequired(form.occupation, "Occupation");
    const phoneError = validatePhone(form.phoneNumber);
    
    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      city: cityError,
      country: countryError,
      occupation: occupationError,
      phoneNumber: phoneError,
    });
    setTouched({
      name: true,
      email: true,
      password: true,
      city: true,
      country: true,
      occupation: true,
      phoneNumber: true,
    });

    if (nameError || emailError || passwordError || cityError || countryError || occupationError || phoneError) {
      showNotification("Please fix the validation errors", "error");
      return;
    }

    try {
      const res = await createCustomer(form);
      if (res && res.data) {
        showNotification("Customer created successfully!", "success");
        setOpen(false);
        setForm({ name: "", email: "", password: "", city: "", country: "", occupation: "", phoneNumber: "", role: "user" });
        setErrors({ name: "", email: "", password: "", city: "", country: "", occupation: "", phoneNumber: "" });
        setTouched({ name: false, email: false, password: false, city: false, country: false, occupation: false, phoneNumber: false });
      } else throw res.error;
    } catch (e) {
      const msg = e && e.data && e.data.message ? e.data.message : "Failed to create customer!";
      showNotification(msg, "error");
    }
  };

  const handleEditSave = async () => {
    // Validate all fields on submit
    const nameError = validateName(editForm.name);
    const emailError = validateEmail(editForm.email);
    const cityError = validateRequired(editForm.city, "City");
    const countryError = validateRequired(editForm.country, "Country");
    const occupationError = validateRequired(editForm.occupation, "Occupation");
    const phoneError = validatePhone(editForm.phoneNumber);
    const passwordError = editForm.password ? validatePassword(editForm.password) : "";
    
    setEditErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      city: cityError,
      country: countryError,
      occupation: occupationError,
      phoneNumber: phoneError,
    });
    setEditTouched({
      name: true,
      email: true,
      password: true,
      city: true,
      country: true,
      occupation: true,
      phoneNumber: true,
    });

    if (nameError || emailError || passwordError || cityError || countryError || occupationError || phoneError) {
      showNotification("Please fix the validation errors", "error");
      return;
    }

    try {
      const res = await updateCustomer({ id: editForm._id, ...editForm });
      if (res && res.data) {
        showNotification("Customer updated successfully!", "success");
        setEditOpen(false);
        setEditForm({ _id: "", name: "", email: "", password: "", city: "", country: "", occupation: "", phoneNumber: "", role: "user" });
        setEditErrors({ name: "", email: "", password: "", city: "", country: "", occupation: "", phoneNumber: "" });
        setEditTouched({ name: false, email: false, password: false, city: false, country: false, occupation: false, phoneNumber: false });
      } else throw res.error;
    } catch (e) {
      const msg = e && e.data && e.data.message ? e.data.message : "Failed to update customer!";
      showNotification(msg, "error");
    }
  };

  const handleEdit = (customer) => {
    setEditForm(customer);
    setOriginalEditForm(customer);
    setEditOpen(true);
    // Reset validation state for edit form
    setEditErrors({ name: "", email: "", password: "", city: "", country: "", occupation: "", phoneNumber: "" });
    setEditTouched({ name: false, email: false, password: false, city: false, country: false, occupation: false, phoneNumber: false });
  };

  const handleDelete = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await deleteCustomer(deleteId);
      if (res && res.data) {
        showNotification("Customer deleted successfully!", "success");
        setDeleteOpen(false);
        setDeleteId("");
        setDeleteName("");
      } else throw res.error;
    } catch (e) {
      const msg = e && e.data && e.data.message ? e.data.message : "Failed to delete customer!";
      showNotification(msg, "error");
    }
  };

  const isEditUnchanged = originalEditForm &&
    editForm.name === originalEditForm.name &&
    editForm.email === originalEditForm.email &&
    editForm.phoneNumber === originalEditForm.phoneNumber &&
    editForm.country === originalEditForm.country &&
    editForm.occupation === originalEditForm.occupation &&
    editForm.role === originalEditForm.role;

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 0.5,
      renderCell: (params) => {
        return params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
      },
    },
    {
      field: "country",
      headerName: "Country",
      flex: 0.4,
    },
    {
      field: "occupation",
      headerName: "Occupation",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.7,
      sortable: false,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<EditIcon />}
            sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none', ml: 1 }}
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button>
          {params.row._id !== userId && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none', ml: 1 }}
              onClick={() => handleDelete(params.row._id, params.row.name)}
            >
              Delete
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween mb={2} flexWrap="wrap" gap={2}>
        <Header title="CUSTOMERS" subtitle="List of Customers" />
        <Box display="flex" gap={2} width={useMediaQuery(theme.breakpoints.down('sm')) ? '100%' : 'auto'}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: isMobile ? '100%' : '300px',
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.alt,
                borderRadius: '9px',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setOpen(true)}
            sx={{
              whiteSpace: 'nowrap',
              minWidth: 'fit-content',
            }}
          >
            Create Customer
          </Button>
        </Box>
      </FlexBetween>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Customer</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400 }}>
          <TextField 
            label="Name" 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            fullWidth 
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
          />
          <TextField 
            label="Email" 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            fullWidth 
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
          />
          <TextField 
            label="Password" 
            name="password" 
            value={form.password || ""} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            type="password" 
            fullWidth 
            error={touched.password && !!errors.password}
            helperText={touched.password && errors.password}
            InputProps={{
              endAdornment: touched.password && (
                <InputAdornment position="end">
                  {!errors.password && form.password ? (
                    <CheckCircleIcon color="success" />
                  ) : errors.password ? (
                    <ErrorIcon color="error" />
                  ) : null}
                </InputAdornment>
              )
            }}
          />
          <TextField 
            label="City" 
            name="city" 
            value={form.city} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            fullWidth 
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
          />
          <TextField 
            select 
            label="Country" 
            name="country" 
            value={form.country} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            fullWidth 
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
          >
            {countryOptions.map(option => (
              <MenuItem key={option.code} value={option.code}>
                {option.name} ({option.code})
              </MenuItem>
            ))}
          </TextField>
          <TextField 
            label="Occupation" 
            name="occupation" 
            value={form.occupation} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            fullWidth 
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
          />
          <TextField 
            label="Phone Number" 
            name="phoneNumber" 
            value={form.phoneNumber} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            fullWidth 
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ fontSize: '1rem', fontWeight: 600, py: 1.5 }}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary" sx={{ fontSize: '1rem', fontWeight: 600, py: 1.5 }} disabled={!isFormValid()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400 }}>
          <TextField 
            label="Name" 
            name="name" 
            value={editForm.name} 
            onChange={handleEditChange} 
            onBlur={handleEditBlur} 
            fullWidth 
            error={editTouched.name && !!editErrors.name}
            helperText={editTouched.name && editErrors.name}
            InputProps={{
              endAdornment: editTouched.name && (
                <InputAdornment position="end">
                  {!editErrors.name && editForm.name ? (
                    <CheckCircleIcon color="success" />
                  ) : editErrors.name ? (
                    <ErrorIcon color="error" />
                  ) : null}
                </InputAdornment>
              )
            }}
          />
          <TextField 
            label="Email" 
            name="email" 
            value={editForm.email} 
            onChange={handleEditChange} 
            onBlur={handleEditBlur} 
            fullWidth 
            error={editTouched.email && !!editErrors.email}
            helperText={editTouched.email && editErrors.email}
            InputProps={{
              endAdornment: editTouched.email && (
                <InputAdornment position="end">
                  {!editErrors.email && editForm.email ? (
                    <CheckCircleIcon color="success" />
                  ) : editErrors.email ? (
                    <ErrorIcon color="error" />
                  ) : null}
                </InputAdornment>
              )
            }}
          />
          <TextField 
            label="Password" 
            name="password" 
            value={editForm.password || ""} 
            onChange={handleEditChange} 
            onBlur={handleEditBlur} 
            type="password" 
            fullWidth 
            error={editTouched.password && !!editErrors.password}
            helperText={editTouched.password && editErrors.password}
            InputProps={{
              endAdornment: editTouched.password && (
                <InputAdornment position="end">
                  {!editErrors.password && editForm.password ? (
                    <CheckCircleIcon color="success" />
                  ) : editErrors.password ? (
                    <ErrorIcon color="error" />
                  ) : null}
                </InputAdornment>
              )
            }}
          />
          <TextField 
            label="City" 
            name="city" 
            value={editForm.city} 
            onChange={handleEditChange} 
            onBlur={handleEditBlur} 
            fullWidth 
            error={editTouched.city && !!editErrors.city}
            helperText={editTouched.city && editErrors.city}
            InputProps={{
              endAdornment: editTouched.city && (
                <InputAdornment position="end">
                  {!editErrors.city && editForm.city ? (
                    <CheckCircleIcon color="success" />
                  ) : editErrors.city ? (
                    <ErrorIcon color="error" />
                  ) : null}
                </InputAdornment>
              )
            }}
          />
          <TextField 
            select 
            label="Country" 
            name="country" 
            value={editForm.country} 
            onChange={handleEditChange} 
            onBlur={handleEditBlur} 
            fullWidth 
            error={editTouched.country && !!editErrors.country}
            helperText={editTouched.country && editErrors.country}
            InputProps={{
              endAdornment: editTouched.country && (
                <InputAdornment position="end">
                  {!editErrors.country && editForm.country ? (
                    <CheckCircleIcon color="success" />
                  ) : editErrors.country ? (
                    <ErrorIcon color="error" />
                  ) : null}
                </InputAdornment>
              )
            }}
          >
            {countryOptions.map(option => (
              <MenuItem key={option.code} value={option.code}>
                {option.name} ({option.code})
              </MenuItem>
            ))}
          </TextField>
          <TextField 
            label="Occupation" 
            name="occupation" 
            value={editForm.occupation} 
            onChange={handleEditChange} 
            onBlur={handleEditBlur} 
            fullWidth 
            error={editTouched.occupation && !!editErrors.occupation}
            helperText={editTouched.occupation && editErrors.occupation}
            InputProps={{
              endAdornment: editTouched.occupation && (
                <InputAdornment position="end">
                  {!editErrors.occupation && editForm.occupation ? (
                    <CheckCircleIcon color="success" />
                  ) : editErrors.occupation ? (
                    <ErrorIcon color="error" />
                  ) : null}
                </InputAdornment>
              )
            }}
          />
          <TextField 
            label="Phone Number" 
            name="phoneNumber" 
            value={editForm.phoneNumber} 
            onChange={handleEditChange} 
            onBlur={handleEditBlur} 
            fullWidth 
            error={editTouched.phoneNumber && !!editErrors.phoneNumber}
            helperText={editTouched.phoneNumber && editErrors.phoneNumber}
            InputProps={{
              endAdornment: editTouched.phoneNumber && (
                <InputAdornment position="end">
                  {!editErrors.phoneNumber && editForm.phoneNumber ? (
                    <CheckCircleIcon color="success" />
                  ) : editErrors.phoneNumber ? (
                    <ErrorIcon color="error" />
                  ) : null}
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} sx={{ fontSize: '1rem', fontWeight: 600, py: 1.5 }}>
            Cancel
          </Button>
          <Button onClick={handleEditSave} variant="contained" color="primary" sx={{ fontSize: '1rem', fontWeight: 600, py: 1.5 }} disabled={!isEditFormValid()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <b>{deleteName}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} sx={{ fontSize: '1rem', fontWeight: 600, py: 1.5 }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" sx={{ fontSize: '1rem', fontWeight: 600, py: 1.5 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={searchTerm ? filteredCustomers : (data || [])}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Customers;
