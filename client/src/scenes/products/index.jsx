import React, { useState, useContext, useEffect } from "react";
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
  InputAdornment,
} from "@mui/material";
import Header from "components/Header";
import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from "state/api";
import FlexBetween from "components/FlexBetween";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { NotificationContext } from "../../App";
import { validateProductName, validatePrice, validateProductDescription, validateProductCategory, validateRating, validateSupply } from "../../utils/validation";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Search from '@mui/icons-material/Search';

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
  const theme = useTheme();
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
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    rating: "",
    supply: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    price: false,
    description: false,
    category: false,
    rating: false,
    supply: false,
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
  const [editErrors, setEditErrors] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    rating: "",
    supply: "",
  });
  const [editTouched, setEditTouched] = useState({
    name: false,
    price: false,
    description: false,
    category: false,
    rating: false,
    supply: false,
  });
  const [originalEditForm, setOriginalEditForm] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const showNotification = useContext(NotificationContext);

  // Real-time validation for create form
  useEffect(() => {
    if (touched.name) {
      const nameError = validateProductName(form.name);
      setErrors(prev => ({ ...prev, name: nameError }));
    }
  }, [form.name, touched.name]);

  useEffect(() => {
    if (touched.price) {
      const priceError = validatePrice(form.price);
      setErrors(prev => ({ ...prev, price: priceError }));
    }
  }, [form.price, touched.price]);

  useEffect(() => {
    if (touched.description) {
      const descriptionError = validateProductDescription(form.description);
      setErrors(prev => ({ ...prev, description: descriptionError }));
    }
  }, [form.description, touched.description]);

  useEffect(() => {
    if (touched.category) {
      const categoryError = validateProductCategory(form.category);
      setErrors(prev => ({ ...prev, category: categoryError }));
    }
  }, [form.category, touched.category]);

  useEffect(() => {
    if (touched.rating) {
      const ratingError = validateRating(form.rating);
      setErrors(prev => ({ ...prev, rating: ratingError }));
    }
  }, [form.rating, touched.rating]);

  useEffect(() => {
    if (touched.supply) {
      const supplyError = validateSupply(form.supply);
      setErrors(prev => ({ ...prev, supply: supplyError }));
    }
  }, [form.supply, touched.supply]);

  // Real-time validation for edit form
  useEffect(() => {
    if (editTouched.name) {
      const nameError = validateProductName(editForm.name);
      setEditErrors(prev => ({ ...prev, name: nameError }));
    }
  }, [editForm.name, editTouched.name]);

  useEffect(() => {
    if (editTouched.price) {
      const priceError = validatePrice(editForm.price);
      setEditErrors(prev => ({ ...prev, price: priceError }));
    }
  }, [editForm.price, editTouched.price]);

  useEffect(() => {
    if (editTouched.description) {
      const descriptionError = validateProductDescription(editForm.description);
      setEditErrors(prev => ({ ...prev, description: descriptionError }));
    }
  }, [editForm.description, editTouched.description]);

  useEffect(() => {
    if (editTouched.category) {
      const categoryError = validateProductCategory(editForm.category);
      setEditErrors(prev => ({ ...prev, category: categoryError }));
    }
  }, [editForm.category, editTouched.category]);

  useEffect(() => {
    if (editTouched.rating) {
      const ratingError = validateRating(editForm.rating);
      setEditErrors(prev => ({ ...prev, rating: ratingError }));
    }
  }, [editForm.rating, editTouched.rating]);

  useEffect(() => {
    if (editTouched.supply) {
      const supplyError = validateSupply(editForm.supply);
      setEditErrors(prev => ({ ...prev, supply: supplyError }));
    }
  }, [editForm.supply, editTouched.supply]);

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
      !errors.price &&
      !errors.description &&
      !errors.category &&
      !errors.rating &&
      !errors.supply &&
      form.name &&
      form.price &&
      form.description &&
      form.category &&
      form.rating &&
      form.supply
    );
  };

  const isEditFormValid = () => {
    return (
      !editErrors.name &&
      !editErrors.price &&
      !editErrors.description &&
      !editErrors.category &&
      !editErrors.rating &&
      !editErrors.supply &&
      editForm.name &&
      editForm.price &&
      editForm.description &&
      editForm.category &&
      editForm.rating &&
      editForm.supply
    );
  };

  const handleSave = async () => {
    // Validate all fields on submit
    const nameError = validateProductName(form.name);
    const priceError = validatePrice(form.price);
    const descriptionError = validateProductDescription(form.description);
    const categoryError = validateProductCategory(form.category);
    const ratingError = validateRating(form.rating);
    const supplyError = validateSupply(form.supply);
    
    setErrors({
      name: nameError,
      price: priceError,
      description: descriptionError,
      category: categoryError,
      rating: ratingError,
      supply: supplyError,
    });
    setTouched({
      name: true,
      price: true,
      description: true,
      category: true,
      rating: true,
      supply: true,
    });

    if (nameError || priceError || descriptionError || categoryError || ratingError || supplyError) {
      showNotification("Please fix the validation errors", "error");
      return;
    }

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
        setErrors({ name: "", price: "", description: "", category: "", rating: "", supply: "" });
        setTouched({ name: false, price: false, description: false, category: false, rating: false, supply: false });
      } else throw res.error;
    } catch (e) {
      const msg = e && e.data && e.data.message ? e.data.message : "Failed to create product!";
      showNotification(msg, "error");
    }
  };

  const handleEditSave = async () => {
    // Validate all fields on submit
    const nameError = validateProductName(editForm.name);
    const priceError = validatePrice(editForm.price);
    const descriptionError = validateProductDescription(editForm.description);
    const categoryError = validateProductCategory(editForm.category);
    const ratingError = validateRating(editForm.rating);
    const supplyError = validateSupply(editForm.supply);
    
    setEditErrors({
      name: nameError,
      price: priceError,
      description: descriptionError,
      category: categoryError,
      rating: ratingError,
      supply: supplyError,
    });
    setEditTouched({
      name: true,
      price: true,
      description: true,
      category: true,
      rating: true,
      supply: true,
    });

    if (nameError || priceError || descriptionError || categoryError || ratingError || supplyError) {
      showNotification("Please fix the validation errors", "error");
      return;
    }

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
        setEditErrors({ name: "", price: "", description: "", category: "", rating: "", supply: "" });
        setEditTouched({ name: false, price: false, description: false, category: false, rating: false, supply: false });
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
    // Reset validation state for edit form
    setEditErrors({ name: "", price: "", description: "", category: "", rating: "", supply: "" });
    setEditTouched({ name: false, price: false, description: false, category: false, rating: false, supply: false });
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

  // Filter products based on search term
  const filteredProducts = data ? data.filter(product => {
    if (!searchTerm) return true; // Show all products if search is empty
    
    const searchLower = searchTerm.toLowerCase();
    
    // Safely get string values with null checks
    const name = product.name ? product.name.toLowerCase() : '';
    const description = product.description ? product.description.toLowerCase() : '';
    const category = product.category ? product.category.toLowerCase() : '';
    const price = product.price ? product.price.toString() : '';
    const rating = product.rating ? product.rating.toString() : '';
    const supply = product.supply ? product.supply.toString() : '';
    
    return (
      name.includes(searchLower) ||
      description.includes(searchLower) ||
      category.includes(searchLower) ||
      price.includes(searchTerm) ||
      rating.includes(searchTerm) ||
      supply.includes(searchTerm)
    );
  }) : [];

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween mb={2} flexWrap="wrap" gap={2}>
        <Header title="PRODUCTS" subtitle="See your list of products." />
        <Box display="flex" gap={2} width={isNonMobile ? 'auto' : '100%'}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: isNonMobile ? '300px' : '100%',
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
            Create Product
          </Button>
        </Box>
      </FlexBetween>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Product</DialogTitle>
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
            label="Price" 
            name="price" 
            value={form.price} 
            onChange={handleChange} 
            onBlur={handleBlur}
            type="number" 
            fullWidth 
            error={touched.price && !!errors.price}
            helperText={touched.price && errors.price}
            InputProps={{
              endAdornment: touched.price && (
                <InputAdornment position="end">
                  {!errors.price && form.price ? (
                    <CheckCircleIcon color="success" />
                  ) : errors.price ? (
                    <ErrorIcon color="error" />
                  ) : null}
                </InputAdornment>
              )
            }}
          />
          <TextField 
            label="Description" 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            onBlur={handleBlur}
            fullWidth 
            multiline
            rows={3}
            error={touched.description && !!errors.description}
            helperText={touched.description && errors.description}
            InputProps={{
              endAdornment: touched.description && (
                <InputAdornment position="end">
                  {!errors.description && form.description ? (
                    <CheckCircleIcon color="success" />
                  ) : errors.description ? (
                    <ErrorIcon color="error" />
                  ) : null}
                </InputAdornment>
              )
            }}
          />
          <TextField 
            label="Category" 
            name="category" 
            value={form.category} 
            onChange={handleChange} 
            onBlur={handleBlur}
            fullWidth 
            error={touched.category && !!errors.category}
            helperText={touched.category && errors.category}
            InputProps={{
              endAdornment: touched.category && (
                <InputAdornment position="end">
                  {!errors.category && form.category ? (
                    <CheckCircleIcon color="success" />
                  ) : errors.category ? (
                    <ErrorIcon color="error" />
                  ) : null}
                </InputAdornment>
              )
            }}
          />
          <TextField 
            label="Rating" 
            name="rating" 
            value={form.rating} 
            onChange={handleChange} 
            onBlur={handleBlur}
            type="number" 
            fullWidth 
            error={touched.rating && !!errors.rating}
            helperText={touched.rating && errors.rating}
            InputProps={{
              endAdornment: touched.rating && (
                <InputAdornment position="end">
                  {!errors.rating && form.rating ? (
                    <CheckCircleIcon color="success" />
                  ) : errors.rating ? (
                    <ErrorIcon color="error" />
                  ) : null}
                </InputAdornment>
              )
            }}
          />
          <TextField 
            label="Supply" 
            name="supply" 
            value={form.supply} 
            onChange={handleChange} 
            onBlur={handleBlur}
            type="number" 
            fullWidth 
            error={touched.supply && !!errors.supply}
            helperText={touched.supply && errors.supply}
            InputProps={{
              endAdornment: touched.supply && (
                <InputAdornment position="end">
                  {!errors.supply && form.supply ? (
                    <CheckCircleIcon color="success" />
                  ) : errors.supply ? (
                    <ErrorIcon color="error" />
                  ) : null}
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary" disabled={!isFormValid()}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Product</DialogTitle>
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
            label="Price" 
            name="price" 
            value={editForm.price} 
            onChange={handleEditChange} 
            onBlur={handleEditBlur}
            type="number" 
            fullWidth 
            error={editTouched.price && !!editErrors.price}
            helperText={editTouched.price && editErrors.price}
            InputProps={{
              endAdornment: editTouched.price && (
                <InputAdornment position="end">
                  {!editErrors.price && editForm.price ? (
                    <CheckCircleIcon color="success" />
                  ) : editErrors.price ? (
                    <ErrorIcon color="error" />
                  ) : null}
                </InputAdornment>
              )
            }}
          />
          <TextField 
            label="Description" 
            name="description" 
            value={editForm.description} 
            onChange={handleEditChange} 
            onBlur={handleEditBlur}
            fullWidth 
            multiline
            rows={3}
            error={editTouched.description && !!editErrors.description}
            helperText={editTouched.description && editErrors.description}
            InputProps={{
              endAdornment: editTouched.description && (
                <InputAdornment position="end">
                  {!editErrors.description && editForm.description ? (
                    <CheckCircleIcon color="success" />
                  ) : editErrors.description ? (
                    <ErrorIcon color="error" />
                  ) : null}
                </InputAdornment>
              )
            }}
          />
          <TextField 
            label="Category" 
            name="category" 
            value={editForm.category} 
            onChange={handleEditChange} 
            onBlur={handleEditBlur}
            fullWidth 
            error={editTouched.category && !!editErrors.category}
            helperText={editTouched.category && editErrors.category}
            InputProps={{
              endAdornment: editTouched.category && (
                <InputAdornment position="end">
                  {!editErrors.category && editForm.category ? (
                    <CheckCircleIcon color="success" />
                  ) : editErrors.category ? (
                    <ErrorIcon color="error" />
                  ) : null}
                </InputAdornment>
              )
            }}
          />
          <TextField 
            label="Rating" 
            name="rating" 
            value={editForm.rating} 
            onChange={handleEditChange} 
            onBlur={handleEditBlur}
            type="number" 
            fullWidth 
            error={editTouched.rating && !!editErrors.rating}
            helperText={editTouched.rating && editErrors.rating}
            InputProps={{
              endAdornment: editTouched.rating && (
                <InputAdornment position="end">
                  {!editErrors.rating && editForm.rating ? (
                    <CheckCircleIcon color="success" />
                  ) : editErrors.rating ? (
                    <ErrorIcon color="error" />
                  ) : null}
                </InputAdornment>
              )
            }}
          />
          <TextField 
            label="Supply" 
            name="supply" 
            value={editForm.supply} 
            onChange={handleEditChange} 
            onBlur={handleEditBlur}
            type="number" 
            fullWidth 
            error={editTouched.supply && !!editErrors.supply}
            helperText={editTouched.supply && editErrors.supply}
            InputProps={{
              endAdornment: editTouched.supply && (
                <InputAdornment position="end">
                  {!editErrors.supply && editForm.supply ? (
                    <CheckCircleIcon color="success" />
                  ) : editErrors.supply ? (
                    <ErrorIcon color="error" />
                  ) : null}
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary" disabled={!isEditFormValid()}>Save</Button>
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
          {filteredProducts.length === 0 ? (
            <Box gridColumn="1 / -1" textAlign="center" py={4}>
              <Typography variant="h6" color="textSecondary">
                {searchTerm ? 'No products match your search.' : 'No products found.'}
              </Typography>
            </Box>
          ) : (
            filteredProducts.map(({
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
            ))
          )}
        </Box>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <Typography>Loading products...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Products;
