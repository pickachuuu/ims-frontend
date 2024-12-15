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
    Paper,
    Card
} from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa';
import CreateProductModal from '../components/products/createProductModal';
import ConfirmModal from '../components/products/confirmModal'; 
import { fetchProducts, handleDeleteSelected, handleDelete } from '../utils/productUtils/productApi'; 
import { fetchCategories } from '../utils/categoryUtils/categoryApi';
import { fetchSuppliers } from '../utils/supplierUtils/supplierApi';
import Skeleton from 'react-loading-skeleton'; 
import 'react-loading-skeleton/dist/skeleton.css'; 

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
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // State for the product being edited

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
        setEditingProduct(null); 
    };

    const handleClose = async () => {
        const updateProducts = await fetchProducts();
        setProducts(updateProducts);
        setEditingProduct([]);
        setOpen(false); 
    };

    const handleEditClick = (product) => {
        setEditingProduct(product); 
        setOpen(true); 
    };

    const handleSelectAll = () => {
        if (selectedItems.length === filteredProducts.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredProducts.map(product => product.productID));
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

    const handleDelete = (productId) => {
        setSelectedItems((prevItems) => [...prevItems, productId]);
        setConfirmModalOpen(true);
    }
    const handleDeleteClick = () => {
        setConfirmModalOpen(true); 
    };

    const handleConfirmDelete = async () => {
        await handleDeleteSelected(selectedItems);
        console.log(selectedItems);
        const updatedProducts = await fetchProducts(); 
        setProducts(updatedProducts); 
        setSelectedItems([]); 
        setConfirmModalOpen(false); 
    };

    const handleCloseConfirmModal = () => {
        setConfirmModalOpen(false); 
    };

    const categoryMap = categories.reduce((acc, category) => {
        acc[category.categoryID] = category.categoryName; 
        return acc;
    }, {});

    const supplierMap = suppliers.reduce((acc, supplier) => {
        acc[supplier.supplierID] = supplier.supplierName; 
        return acc;
    }, {});

    return (
        <div className="border rounded-3 p-4 bg-white shadow mx-auto" style={{ margin: '0 auto', height: '100vh' , overflow: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Typography variant="h4">Product</Typography>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    + Product
                </Button>
            </div>
            <hr />
            <div className='border rounded-3 p-4 bg-white shadow'> 
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
                    sx={{ width: '100%', maxWidth: '130px', marginRight: '10px', marginBottom: '10px' }}
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
                    sx={{ width: '100%', maxWidth: '130px', marginRight: '10px', marginBottom: '10px' }}
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
                    sx={{ width: '100%', maxWidth: '130px', marginRight: '0', marginBottom: '10px' }}
                >
                    <MenuItem value="">
                        <em>Sort by Stock</em>
                    </MenuItem>
                    <MenuItem value="highToLow">Highest to Lowest</MenuItem>
                    <MenuItem value="lowToHigh">Lowest to Highest</MenuItem>
                </Select>
            </Box>
            <TableContainer style={{ maxHeight: 550, height: '50vh' }} component={Card}> 
                <Table stickyHeader>
                    <TableHead>
                        <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                            <TableCell padding="checkbox" ></TableCell>
                            <TableCell>Product</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Supplier</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            [...Array(5)].map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell padding="checkbox"><Skeleton circle width={20} height={20} /></TableCell>
                                    <TableCell><Skeleton /></TableCell>
                                    <TableCell><Skeleton /></TableCell>
                                    <TableCell><Skeleton /></TableCell>
                                    <TableCell><Skeleton /></TableCell>
                                    <TableCell><Skeleton /></TableCell>
                                    <TableCell><Skeleton /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredProducts.length > 0 ? (
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
                                        <FaEdit 
                                            style={{ cursor: 'pointer', marginRight: '10px' }} 
                                            onClick={() => handleEditClick(product)} 
                                        />
                                        <FaTrash 
                                            style={{ cursor: 'pointer' }} 
                                            onClick={() => handleDelete(product.productID)} 
                                        />
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
                    {filteredProducts.length === 0 
                        ? 'Select All' 
                        : selectedItems.length === filteredProducts.length 
                            ? 'Unselect All' 
                            : 'Select All'}
                </Button>
                <Button 
                    variant="contained" 
                    color="error"
                    disabled={selectedItems.length === 0}
                    onClick={handleDeleteClick} 
                    startIcon={<FaTrash />}
                    sx={{ textTransform: 'none' }}
                >
                    Delete ({selectedItems.length})
                </Button>
            </div>
            <CreateProductModal 
                isOpen={open} 
                onRequestClose={handleClose} 
                categories={categories} 
                suppliers={suppliers} 
                product={editingProduct} 
                mode={editingProduct ? 'edit' : 'create'}
            />
            <ConfirmModal 
                isOpen={confirmModalOpen} 
                onConfirm={handleConfirmDelete} 
                onClose={handleCloseConfirmModal} 
                message={selectedItems.length > 1 
                    ? `Are you sure you want to delete ${selectedItems.length} items?` 
                    : `Are you sure you want to delete this item?`}
            />
        </div>
    </div>
    );
};

export default ProductPage;