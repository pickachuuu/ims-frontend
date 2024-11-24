import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    TextField,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Select,
} from '@mui/material';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [lowStock, setLowStock] = useState(false);
    const [open, setOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', quantity: '', price: '', category: '', supplier: '' }); // State for new product fields

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = Cookies.get('authToken');
                const response = await axios.get('http://localhost:3000/api/products/get', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProducts(response.data.products);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
        const matchesSupplier = selectedSupplier ? product.supplier === selectedSupplier : true;
        const matchesLowStock = lowStock ? product.quantity < 5 : true; // Assuming low stock is defined as less than 5

        return matchesSearch && matchesCategory && matchesSupplier && matchesLowStock;
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNewProduct({ name: '', quantity: '', price: '', category: '', supplier: '' }); 
    };

    const handleAddProduct = () => {
        handleClose();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mt-5">
            <div className="border rounded-5 p-3 bg-white shadow mx-auto">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Typography variant="h4">In Stock</Typography>
                    <Button variant="contained" color="primary" onClick={handleClickOpen}>
                        + New Stock
                    </Button>
                </div>
                <hr />
                <TextField
                    label="Quick search"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '250px', marginBottom: '20px' }}
                />
                <div className="d-flex mb-3">
                    <Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        displayEmpty
                        variant="outlined"
                        style={{ marginRight: '10px', width: '150px', height: '40px' }}
                    >
                        <MenuItem value="">
                            <em>By Category</em>
                        </MenuItem>
                        <MenuItem value="Category1">Category 1</MenuItem>
                        <MenuItem value="Category2">Category 2</MenuItem>
                    </Select>
                    <Select
                        value={selectedSupplier}
                        onChange={(e) => setSelectedSupplier(e.target.value)}
                        displayEmpty
                        variant="outlined"
                        style={{ marginRight: '10px', width: '150px', height: '40px' }}
                    >
                        <MenuItem value="">
                            <em>By Supplier</em>
                        </MenuItem>
                        {/* Add supplier options here */}
                        <MenuItem value="Supplier1">Supplier 1</MenuItem>
                        <MenuItem value="Supplier2">Supplier 2</MenuItem>
                    </Select>
                    <div>
                        <Checkbox
                            checked={lowStock}
                            onChange={(e) => setLowStock(e.target.checked)}
                        />
                        <label>Low Stock</label>
                    </div>
                </div>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox />
                                </TableCell>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Supplier</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <TableRow key={product.productID}>
                                        <TableCell padding="checkbox">
                                            <Checkbox />
                                        </TableCell>
                                        <TableCell>{product.productName || 'N/A'}</TableCell>
                                        <TableCell>{product.quantity || 'N/A'}</TableCell>
                                        <TableCell>{product.price || 'N/A'}</TableCell>
                                        <TableCell>{product.category || 'N/A'}</TableCell>
                                        <TableCell>{product.supplier || 'N/A'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add Product</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <TextField 
                                autoFocus 
                                margin="dense" 
                                label="Product Name" 
                                fullWidth 
                                name="name" 
                                value={newProduct.name} 
                                onChange={handleInputChange} 
                            />
                            <TextField 
                                margin="dense" 
                                label="Quantity" 
                                type="number" 
                                fullWidth 
                                name="quantity" 
                                value={newProduct.quantity} 
                                onChange={handleInputChange} 
                            />
                            <TextField 
                                margin="dense" 
                                label="Price" 
                                type="number" 
                                fullWidth 
                                name="price" 
                                value={newProduct.price} 
                                onChange={handleInputChange} 
                            />
                            <TextField 
                                margin="dense" 
                                label="Category" 
                                fullWidth 
                                name="category" 
                                value={newProduct.category} 
                                onChange={handleInputChange} 
                            />
                            <TextField 
                                margin="dense" 
                                label="Supplier" 
                                fullWidth 
                                name="supplier" 
                                value={newProduct.supplier} 
                                onChange={handleInputChange} 
                            />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleAddProduct} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default ProductPage;