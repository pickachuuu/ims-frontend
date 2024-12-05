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

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });

    useEffect(() => {
        // Fetch existing categories (static data for now)
        const fetchCategories = () => {
            const existingCategories = [
                { id: 1, name: 'Electronics', description: 'Devices and gadgets' },
                { id: 2, name: 'Furniture', description: 'Home and office furniture' },
                { id: 3, name: 'Clothing', description: 'Apparel and accessories' },
            ];
            setCategories(existingCategories);
        };
        fetchCategories();
    }, []);

    const handleAddCategory = () => {
        // Temporary function for adding a category
        console.log('Add Category:', newCategory);
        setNewCategory({ name: '', description: '' }); // Reset form
    };

    const handleEditCategory = (id) => {
        // Temporary function for editing a category
        console.log('Edit Category ID:', id);
    };

    const handleDeleteCategory = (id) => {
        // Temporary function for deleting a category
        console.log('Delete Category ID:', id);
    };

    return (
        <div className="border rounded-3 p-4 bg-white shadow mx-auto" style={{ margin: '0 auto', height: '95vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Typography variant="h4">Categories</Typography>
                <Button variant="contained" color="primary" >
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
                                <TableRow key={category.id}>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>{category.description}</TableCell>
                                    <TableCell>
                                        <FaEdit
                                            style={{ cursor: 'pointer', marginRight: '10px' }}
                                            onClick={() => handleEditCategory(category.id)}
                                        />
                                        <FaTrash
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleDeleteCategory(category.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default CategoryPage;