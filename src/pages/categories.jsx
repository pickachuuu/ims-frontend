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

    return (
        <div className="border rounded-3 p-4 bg-white shadow mx-auto" style={{ margin: '0 auto', height: '95vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Typography variant="h4">Categories</Typography>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    + Add category
                </Button>
            </div>
            <hr />
            <div className='p-3'>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.categoryID}>
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