import React, { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Box,
    TextField,
    Select,
    MenuItem,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa';

const handleClickOpen = () => {
    console.log("test");
}

const SuppliersPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [sortOrder, setSortOrder] = useState('');

    const filteredSuppliers = suppliers
    .filter(category => category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.supplierName.localeCompare(b.supplierName);
        } else if (sortOrder === 'desc') {
            return b.supplierName.localeCompare(a.supplierName);
        }
        return 0;
    });


    const handleSelectAll = () => {
        if (selectedItems.length === filteredSuppliers.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredSuppliers.map(supplier => supplier.supplierID));
        }
    };

    const handleConfirmDelete = async () => {
        handleDeleteSelected(selectedItems)
        const updatedSuppliers = await fetchCategories();
        setCategories(updatedSuppliers);
        setSelectedItems([]);
    };

    return (
        <div className="border rounded-3 p-4 bg-white shadow mx-auto" style={{ margin: '0 auto', height: '95vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Typography variant="h4">Supplier</Typography>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    + Add Supplier
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
                <TableContainer style={{ maxHeight: 550, height: '50vh' }}> 
                    <Table stickyHeader>
                        <TableHead> 
                            <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                                <TableCell padding="checkbox">
                                </TableCell>
                                <TableCell>Supplier`</TableCell>
                                <TableCell>Contact no</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSuppliers.map((supplier) => (
                                <TableRow key={supplier.supplierID}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedItems.includes(supplier.supplierID)}
                                            onChange={() => handleSelectItem(supplier.supplierID)}
                                        />
                                    </TableCell>
                                    <TableCell>{supplier.supplierName}</TableCell>
                                    <TableCell>{supplier.supplierID}</TableCell>
                                    <TableCell>
                                        <FaEdit
                                            style={{ cursor: 'pointer', marginRight: '10px' }}
                                            onClick={() => handleEditCategory(supplier)}
                                        />
                                        <FaTrash
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleDeleteCategory(supplier.supplierID)}
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
                    {selectedItems.length === filteredSuppliers.length 
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
            </div>
        </div>
    );
};

export default SuppliersPage;