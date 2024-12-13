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
    Paper
} from '@mui/material';
import CategoryModal from '../components/category/categoryModal';
import { fetchCategories, handleDelete, handleDeleteSelected } from '../utils/categoryUtils/categoryApi'; 
import { fetchProducts } from '../utils/productUtils/productApi';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton'; 
import 'react-loading-skeleton/dist/skeleton.css';
import ConfirmModal from '../components/products/confirmModal';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]); 
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [sortOrder, setSortOrder] = useState('');
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const categoriesData = await fetchCategories();
                const productsData = await fetchProducts(); 
                setCategories(categoriesData);
                setProducts(productsData);
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredCategories = categories
        .filter(category => category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.categoryName.localeCompare(b.categoryName);
            } else if (sortOrder === 'desc') {
                return b.categoryName.localeCompare(a.categoryName);
            }
            return 0;
        });

    const getProductCount = (categoryId) => {
        return products.filter(product => product.categoryID === categoryId).length; 
    };

    const handleAddCategory = () => {
        setNewCategory({ name: '', description: '' }); 
    };

    const handleClickOpen = () => {
        handleAddCategory();
        setOpen(true); 
        setEditingCategory(null); 
    };

    const handleClose = async () => {
        const updatedCategories = await fetchCategories();
        setCategories(updatedCategories);
        setOpen(false); 
    };

    const handleCloseConfirmModal = () => {
        setConfirmModalOpen(false); 
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setOpen(true); 
    };

    const handleDeleteCategory = async (id) => {
        setSelectedItems((prevItems) => [...prevItems, id]);
        setConfirmModalOpen(true);
    };

    const handleSelectAll = () => {
        if (selectedItems.length === filteredCategories.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredCategories.map(category => category.categoryID));
        }
    };

    const handleSelectItem = (categoryID) => {
        setSelectedItems(prev => {
            if (prev.includes(categoryID)) {
                return prev.filter(id => id !== categoryID);
            } else {
                return [...prev, categoryID];
            }
        });
    };

    const handleConfirmDelete = async () => {
        handleDeleteSelected(selectedItems)
        const updatedCategories = await fetchCategories();
        setCategories(updatedCategories);
        setSelectedItems([]);
        setConfirmModalOpen(false);
    };

    return (
        <div className="border rounded-3 p-4 bg-white shadow mx-auto" style={{ margin: '0 auto', height: '95vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Typography variant="h4">Categories</Typography>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    + Category
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
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    displayEmpty
                    size='small'
                    variant="outlined"
                    sx={{ width: '100%', maxWidth: '130px', marginRight: '10px', marginBottom: '10px' }}
                >
                    <MenuItem value="">
                        <em>Sort by</em>
                    </MenuItem>
                    <MenuItem value="asc">A-Z</MenuItem>
                    <MenuItem value="desc">Z-A</MenuItem>
                </Select>
            </Box>
            <TableContainer style={{ maxHeight: 550, height: '50vh' }} component={Paper}> 
                <Table stickyHeader>
                    <TableHead> 
                        <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                            <TableCell padding="checkbox"></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Product Count</TableCell>
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
                                </TableRow>
                            ))
                        ) : (
                            filteredCategories.map((category) => (
                                <TableRow key={category.categoryID}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedItems.includes(category.categoryID)}
                                            onChange={() => handleSelectItem(category.categoryID)}
                                        />
                                    </TableCell>
                                    <TableCell>{category.categoryName}</TableCell>
                                    <TableCell>{getProductCount(category.categoryID)}</TableCell>
                                    <TableCell>
                                        <FaEdit
                                            style={{ cursor: 'pointer', marginRight: '10px' }}
                                            onClick={() => handleEditCategory(category)}
                                        />
                                        <FaTrash
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleDeleteCategory(category.categoryID)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
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
                    {selectedItems.length === filteredCategories.length 
                        ? 'Unselect All' 
                        : 'Select All'}
                </Button>
                <Button 
                    variant="contained" 
                    color="error"
                    disabled={selectedItems.length === 0}
                    onClick={handleConfirmDelete} 
                    startIcon={<FaTrash />}
                    sx={{ textTransform: 'none' }}
                >
                    Delete ({selectedItems.length})
                </Button>
            </div>
            <div>
                <CategoryModal
                    isOpen={open}
                    onRequestClose={handleClose}
                    category={editingCategory}
                    mode={editingCategory ? 'edit' : 'create'}
                    editingCategory={editingCategory}
                />
            <ConfirmModal 
                isOpen={confirmModalOpen} 
                onConfirm={handleConfirmDelete} 
                onClose={handleCloseConfirmModal} 
                message={selectedItems.length > 1 
                    ? `Are you sure you want to delete ${selectedItems.length} items?` 
                    : `Are you sure you want to delete this category?`}
            />
            </div>
        </div>
    );
};

export default CategoryPage;