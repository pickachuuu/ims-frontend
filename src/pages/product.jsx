import React, { useEffect, useState } from 'react';
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
    Box,
} from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa';
import CreateProductModal from '../components/products/createProductModal';
import { fetchProducts, fetchCategories, fetchSuppliers } from '../utils/productUtils/productApi';

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
        const loadData = async () => {
            try {
                const productsData = await fetchProducts();
                setProducts(productsData);
                const categoriesData = await fetchCategories();
                setCategories(categoriesData);
                const suppliersData = await fetchSuppliers();
                setSuppliers(suppliersData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? product.categoryID === selectedCategory : true;
        const matchesSupplier = selectedSupplier ? product.supplierID === selectedSupplier : true;
        const matchesLowStock = lowStock ? product.quantity <= 5 : true;
        return matchesSearch && matchesCategory && matchesSupplier && matchesLowStock;
    });

    const handleClickOpen = () => {
        setOpen(true); 
    };

    const handleClose = async () => {
        const updateProducts = await fetchProducts();
        setProducts(updateProducts);
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
                    style={{ width: '100%', maxWidth: '250px', marginBottom: '20px' }} 
                />
                <Box className="mb-3" sx={{ display: 'block', marginBottom: '20px' }}>
                    <Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        displayEmpty
                        size='small'
                        variant="outlined"
                        style={{ width: '100%', maxWidth: '150px', marginRight: '10px', marginBottom: '10px' }}
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
                        size='small'
                        variant="outlined"
                        style={{ width: '100%', maxWidth: '150px', marginBottom: '10px' }}
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
                    <div style={{ display: 'inline-block', alignItems: 'center' }}>
                        <Checkbox
                            checked={lowStock}
                            onChange={(e) => setLowStock(e.target.checked)}
                        />
                        <label style={{ marginLeft: '5px' }}>Low Stock</label>
                    </div>
                </Box>
                <TableContainer style={{ maxHeight: 400 }}> 
                    <Table stickyHeader>
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
                                <TableCell>Actions</TableCell>
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
                                        <TableCell>
                                            <FaEdit style={{ cursor: 'pointer' }} />
                                            <FaTrash style={{ cursor: 'pointer' }} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
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