import React from "react";
import { Box, useTheme, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from "@mui/material";
import { useGetCustomersQuery, useCreateCustomerMutation, useUpdateCustomerMutation, useDeleteCustomerMutation } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { geoData } from "state/geoData";
import FlexBetween from "components/FlexBetween";
import { useContext } from "react";
import { NotificationContext } from "../../App";
import { useDispatch, useSelector } from "react-redux";

const Customers = () => {
  const theme = useTheme();
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
  const [originalEditForm, setOriginalEditForm] = React.useState(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState("");
  const [deleteName, setDeleteName] = React.useState("");

  const countryOptions = geoData.features.map(f => ({ code: f.id, name: f.properties.name }));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    try {
      const res = await createCustomer(form);
      if (res && res.data) {
        showNotification("Customer created successfully!", "success");
        setOpen(false);
        setForm({ name: "", email: "", password: "", city: "", country: "", occupation: "", phoneNumber: "", role: "user" });
      } else throw res.error;
    } catch (e) {
      const msg = e && e.data && e.data.message ? e.data.message : "Failed to create customer!";
      showNotification(msg, "error");
    }
  };
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSave = async () => {
    try {
      const res = await updateCustomer({ id: editForm._id, ...editForm });
      if (res && res.data) {
        showNotification("Customer updated successfully!", "success");
        setEditOpen(false);
        setEditForm({ _id: "", name: "", email: "", password: "", city: "", country: "", occupation: "", phoneNumber: "", role: "user" });
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
      <FlexBetween mb={2}>
        <Header title="CUSTOMERS" subtitle="List of Customers" />
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Create Customer
        </Button>
      </FlexBetween>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Customer</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400 }}>
          <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
          <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
          <TextField label="Password" name="password" value={form.password || ""} onChange={handleChange} type="password" fullWidth />
          <TextField label="City" name="city" value={form.city} onChange={handleChange} fullWidth />
          <TextField select label="Country" name="country" value={form.country} onChange={handleChange} fullWidth>
            {countryOptions.map(option => (
              <MenuItem key={option.code} value={option.code}>
                {option.name} ({option.code})
              </MenuItem>
            ))}
          </TextField>
          <TextField label="Occupation" name="occupation" value={form.occupation} onChange={handleChange} fullWidth />
          <TextField label="Phone Number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ fontSize: '1rem', fontWeight: 600, py: 1.5 }}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary" sx={{ fontSize: '1rem', fontWeight: 600, py: 1.5 }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400 }}>
          <TextField label="Name" name="name" value={editForm.name} onChange={handleEditChange} fullWidth />
          <TextField label="Email" name="email" value={editForm.email} onChange={handleEditChange} fullWidth />
          <TextField label="Password" name="password" value={editForm.password || ""} onChange={handleEditChange} type="password" fullWidth />
          <TextField label="City" name="city" value={editForm.city} onChange={handleEditChange} fullWidth />
          <TextField select label="Country" name="country" value={editForm.country} onChange={handleEditChange} fullWidth>
            {countryOptions.map(option => (
              <MenuItem key={option.code} value={option.code}>
                {option.name} ({option.code})
              </MenuItem>
            ))}
          </TextField>
          <TextField label="Occupation" name="occupation" value={editForm.occupation} onChange={handleEditChange} fullWidth />
          <TextField label="Phone Number" name="phoneNumber" value={editForm.phoneNumber} onChange={handleEditChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} sx={{ fontSize: '1rem', fontWeight: 600, py: 1.5 }}>
            Cancel
          </Button>
          <Button onClick={handleEditSave} variant="contained" color="primary" disabled={isEditUnchanged} sx={{ fontSize: '1rem', fontWeight: 600, py: 1.5 }}>
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
          rows={data || []}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Customers;
