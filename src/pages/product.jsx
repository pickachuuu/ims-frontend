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
import { FaEdit, FaTrash } from 'react-icons/fa';;
import CreateProductModal from '../components/products/createProductModal';
import { fetchProducts, fetchCategories, fetchSuppliers, handleDeleteSelected } from '../utils/productUtils/productApi';
import axios from 'axios';
import Cookies from 'js-cookie';    

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [suppliers, setSuppliers] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [stockSort, setStockSort] = useState('');
    const [open, setOpen] = useState(false); 
    const [selectedItems, setSelectedItems] = useState([]);

    const selectStyle = {
        width: '100%',
        maxWidth: '150px',
        marginRight: '10px',
        marginBottom: '10px',
        '@media (max-width: 600px)': {
            maxWidth: '100px',
            fontSize: '0.875rem'
        }
    };

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
        return matchesSearch && matchesCategory && matchesSupplier;
    }).sort((a, b) => {
        if (stockSort === 'highToLow') {
            return b.quantity - a.quantity;
        } else if (stockSort === 'lowToHigh') {
            return a.quantity - b.quantity;
        }
        return 0;
    });

    const handleClickOpen = () => {
        setOpen(true); 
    };

    const handleClose = async () => {
        const updateProducts = await fetchProducts();
        setProducts(updateProducts);
        setOpen(false); 
    };

    const handleSelectAll = () => {
        if (selectedItems.length === filteredProducts.length) {
            setSelectedItems([]); // Unselect all
        } else {
            setSelectedItems(filteredProducts.map(product => product.productID)); // Select all
        }
    };

    const handleSelectItem = (productID) => {
        setSelectedItems(prev => {
            if (prev.includes(productID)) {
                return prev.filter(id => id !== productID);
            } else {
                return [...prev, productID];
            }
        });
    };

    const DeleteSelected = () => {
        handleDeleteSelected(selectedItems);
        setProducts(updatedProducts);
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
        <div style={{
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '110vh',
            padding: '20px',
        }}>
            <div className="border rounded-5 p-3 bg-white shadow mx-auto" style={{
                margin: '0 auto'
            }}>
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
                        sx={selectStyle}
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
                        sx={selectStyle}
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
                    <Select
                        value={stockSort}
                        onChange={(e) => setStockSort(e.target.value)}
                        displayEmpty
                        size='small'
                        variant="outlined"
                        sx={{...selectStyle, marginRight: 0}}
                    >
                        <MenuItem value="">
                            <em>Sort by Stock</em>
                        </MenuItem>
                        <MenuItem value="highToLow">Highest to Lowest</MenuItem>
                        <MenuItem value="lowToHigh">Lowest to Highest</MenuItem>
                    </Select>
                </Box>
                <TableContainer style={{ maxHeight: 400 }}> 
                    <Table stickyHeader>
                        <TableHead >
                            <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                                <TableCell padding="checkbox">
                                </TableCell>
                                <TableCell>Product</TableCell>
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
                                            <Checkbox
                                                checked={selectedItems.includes(product.productID)}
                                                onChange={() => handleSelectItem(product.productID)}
                                            />
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
                <div className='mt-3 d-flex align-items-center gap-2'>
                    <Button 
                        variant="outlined"
                        onClick={handleSelectAll}
                        sx={{ textTransform: 'none' }}
                    >
                        {selectedItems.length === filteredProducts.length ? 'Unselect All' : 'Select All'}
                    </Button>
                    <Button 
                        variant="contained" 
                        color="error"
                        disabled={selectedItems.length === 0}
                        onClick={DeleteSelected}
                        startIcon={<FaTrash />}
                        sx={{ textTransform: 'none' }}
                    >
                        Delete ({selectedItems.length})
                    </Button>
                </div>
                <CreateProductModal isOpen={open} onRequestClose={handleClose} categories={categories} suppliers={suppliers} />
            </div>
        </div>
    );
};

export default ProductPage;