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
    MenuItem,
    Select,
} from '@mui/material';
import CreateProductModal from '../components/products/createProductModal';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [suppliers, setSuppliers] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [lowStock, setLowStock] = useState(false);
    const [open, setOpen] = useState(false); 

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

        const fetchCategories = async () => {
            try {
                const token = Cookies.get('authToken');
                const response = await axios.get('http://localhost:3000/api/categories/get', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategories(response.data.categories);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchSuppliers = async () => {
            try {
                const token = Cookies.get('authToken');
                const response = await axios.get('http://localhost:3000/api/suppliers/get', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(suppliers);
                setSuppliers(response.data.suppliers);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchProducts();
        fetchCategories();
        fetchSuppliers();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? product.categoryID === selectedCategory : true;
        const matchesSupplier = selectedSupplier ? product.supplierID === selectedSupplier : true;
        const matchesLowStock = lowStock ? product.quantity < 20 : true;
        return matchesSearch && matchesCategory && matchesSupplier && matchesLowStock;
    });

    const handleClickOpen = () => {
        setOpen(true); 
    };

    const handleClose = () => {
        setOpen(false); 
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const categoryMap = categories.reduce((acc, category) => {
        acc[category.categoryID] = category.categoryName; 
        return acc;
    }, {});

    const supplierMap = suppliers.reduce((acc, supplier) => {
        acc[supplier.supplierID] = supplier.supplierName; 
        return acc;
    }, {});

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
                        {categories.map((category) => (
                            <MenuItem key={category.categoryID} value={category.categoryID}>
                                {category.categoryName}
                            </MenuItem>
                        ))}
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
                        {suppliers.map((supplier) => (
                            <MenuItem key={supplier.supplierID} value={supplier.supplierID}>
                                {supplier.supplierName}
                            </MenuItem>
                        ))}
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
                                        <TableCell>{categoryMap[product.categoryID] || 'N/A'}</TableCell> 
                                        <TableCell>{supplierMap[product.supplierID] || 'N/A'}</TableCell> 
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
                <CreateProductModal isOpen={open} onRequestClose={handleClose} categories={categories} suppliers={suppliers} />
            </div>
        </div>
    );
};

export default ProductPage;