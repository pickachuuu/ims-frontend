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
import CategoryModal from '../components/category/categoryModal';
import { fetchCategories, handleDelete } from '../utils/categoryUtils/categoryApi';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]); // State for selected categories
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [sortOrder, setSortOrder] = useState(''); // State for sorting order

    useEffect(() => {
        const loadData = async () => {
            try {
                const categoriesData = await fetchCategories();
                setCategories(categoriesData);
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

    const handleClickOpen = () => {
        setOpen(true); 
        setEditingCategory(null); 
    };

    const handleClose = async () => {
        const updatedCategories = await fetchCategories();
        setCategories(updatedCategories);
        setOpen(false); 
    };

    const handleAddCategory = () => {
        setNewCategory({ name: '', description: '' }); 
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setOpen(true); 
    };

    const handleDeleteCategory = async (id) => {
        try {
            await handleDelete(id);
            const updatedCategories = await fetchCategories();
            setCategories(updatedCategories);
        } catch (error) {
            console.error('Error deleting category:', error);
        }
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

    const handleDeleteSelected = async () => {
        for (const id of selectedItems) {
            await handleDelete(id);
        }
        const updatedCategories = await fetchCategories();
        setCategories(updatedCategories);
        setSelectedItems([]);
    };

    return (
        <div className="border rounded-3 p-4 bg-white shadow mx-auto" style={{ margin: '0 auto', height: '95vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Typography variant="h4">Categories</Typography>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    + Add category
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
            <div className='p-3'>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                                <TableCell padding="checkbox">
                                </TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCategories.map((category) => (
                                <TableRow key={category.categoryID}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedItems.includes(category.categoryID)}
                                            onChange={() => handleSelectItem(category.categoryID)}
                                        />
                                    </TableCell>
                                    <TableCell>{category.categoryName}</TableCell>
                                    <TableCell>{category.description}</TableCell>
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
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
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
                    onClick={handleDeleteSelected} 
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
            </div>
        </div>
    );
};

export default CategoryPage;