import React, { useState, useContext } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import Header from "components/Header";
import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from "state/api";
import FlexBetween from "components/FlexBetween";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { NotificationContext } from "../../App";

const Product = ({
  _id,
  name,
  description,
  price,
  rating,
  category,
  supply,
  stat,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 14 }}
          color={theme.palette.secondary[700]}
          gutterBottom
        >
          {category}
        </Typography>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
          ${Number(price).toFixed(2)}
        </Typography>
        <Rating value={rating} readOnly />

        <Typography variant="body2">{description}</Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          See More
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<EditIcon />}
          sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none', ml: 1 }}
          onClick={() => onEdit({ _id, name, description, price, rating, category, supply })}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none', ml: 1 }}
          onClick={() => onDelete(_id, name)}
        >
          Delete
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{
          color: theme.palette.neutral[300],
        }}
      >
        <CardContent>
          <Typography>id: {_id}</Typography>
          <Typography>Supply Left: {supply}</Typography>
          <Typography>
            Yearly Sales This Year: {stat.yearlySalesTotal}
          </Typography>
          <Typography>
            Yearly Units Sold This Year: {stat.yearlyTotalSoldUnits}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const Products = () => {
  const { data, isLoading } = useGetProductsQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    rating: "",
    supply: "",
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    _id: "",
    name: "",
    price: "",
    description: "",
    category: "",
    rating: "",
    supply: "",
  });
  const [originalEditForm, setOriginalEditForm] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const showNotification = useContext(NotificationContext);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    try {
      const res = await createProduct({
        ...form,
        price: parseFloat(form.price),
        rating: parseFloat(form.rating),
        supply: parseInt(form.supply, 10),
      });
      if (res && res.data) {
        showNotification("Product created successfully!", "success");
        setOpen(false);
        setForm({ name: "", price: "", description: "", category: "", rating: "", supply: "" });
      } else throw res.error;
    } catch (e) {
      const msg = e && e.data && e.data.message ? e.data.message : "Failed to create product!";
      showNotification(msg, "error");
    }
  };
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSave = async () => {
    try {
      const res = await updateProduct({
        id: editForm._id,
        name: editForm.name,
        price: parseFloat(editForm.price),
        description: editForm.description,
        category: editForm.category,
        rating: parseFloat(editForm.rating),
        supply: parseInt(editForm.supply, 10),
      });
      if (res && res.data) {
        showNotification("Product updated successfully!", "success");
        setEditOpen(false);
        setEditForm({ _id: "", name: "", price: "", description: "", category: "", rating: "", supply: "" });
      } else throw res.error;
    } catch (e) {
      const msg = e && e.data && e.data.message ? e.data.message : "Failed to update product!";
      showNotification(msg, "error");
    }
  };
  const handleEdit = (product) => {
    setEditForm(product);
    setOriginalEditForm(product);
    setEditOpen(true);
  };
  const isEditUnchanged = originalEditForm &&
    editForm.name === originalEditForm.name &&
    String(editForm.price) === String(originalEditForm.price) &&
    editForm.description === originalEditForm.description &&
    editForm.category === originalEditForm.category &&
    String(editForm.rating) === String(originalEditForm.rating) &&
    String(editForm.supply) === String(originalEditForm.supply);
  const handleDelete = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
    setDeleteOpen(true);
  };
  const handleDeleteConfirm = async () => {
    try {
      const res = await deleteProduct(deleteId);
      if (res && res.data) {
        showNotification("Product deleted successfully!", "success");
        setDeleteOpen(false);
        setDeleteId("");
        setDeleteName("");
      } else throw res.error;
    } catch (e) {
      const msg = e && e.data && e.data.message ? e.data.message : "Failed to delete product!";
      showNotification(msg, "error");
    }
  };
  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween mb={2}>
        <Header title="PRODUCTS" subtitle="See your list of products." />
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Create Product
        </Button>
      </FlexBetween>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Product</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400 }}>
          <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
          <TextField label="Price" name="price" value={form.price} onChange={handleChange} type="number" fullWidth />
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth />
          <TextField label="Category" name="category" value={form.category} onChange={handleChange} fullWidth />
          <TextField label="Rating" name="rating" value={form.rating} onChange={handleChange} type="number" fullWidth />
          <TextField label="Supply" name="supply" value={form.supply} onChange={handleChange} type="number" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400 }}>
          <TextField label="Name" name="name" value={editForm.name} onChange={handleEditChange} fullWidth />
          <TextField label="Price" name="price" value={editForm.price} onChange={handleEditChange} type="number" fullWidth />
          <TextField label="Description" name="description" value={editForm.description} onChange={handleEditChange} fullWidth />
          <TextField label="Category" name="category" value={editForm.category} onChange={handleEditChange} fullWidth />
          <TextField label="Rating" name="rating" value={editForm.rating} onChange={handleEditChange} type="number" fullWidth />
          <TextField label="Supply" name="supply" value={editForm.supply} onChange={handleEditChange} type="number" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary" disabled={isEditUnchanged}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <b>{deleteName}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      {data || !isLoading ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {data.map(
            ({
              _id,
              name,
              description,
              price,
              rating,
              category,
              supply,
              stat,
            }) => (
              <Product
                key={_id}
                _id={_id}
                name={name}
                description={description}
                price={price}
                rating={rating}
                category={category}
                supply={supply}
                stat={stat}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )
          )}
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default Products;
