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
    TableBody,
    Checkbox,
    Paper
} from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa';
import SupplierModal from '../components/supplier/supplierModal';
import { fetchSuppliers, handleDeleteSelected } from '../utils/supplierUtils/supplierApi';
import Skeleton from 'react-loading-skeleton'; 
import 'react-loading-skeleton/dist/skeleton.css';
import ConfirmModal from '../components/products/confirmModal';

const SuppliersPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [sortOrder, setSortOrder] = useState('');
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const suppliersData = await fetchSuppliers();
                setSuppliers(suppliersData);
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredSuppliers = suppliers
    .filter(supplier => supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.supplierName.localeCompare(b.supplierName);
        } else if (sortOrder === 'desc') {
            return b.supplierName.localeCompare(a.supplierName);
        }
        return 0;
    });

    const refreshData = async () => {
        const suppliersData = await fetchSuppliers();
        setSuppliers(suppliersData);
    }

    const handleClickOpen = () => {
        setOpen(true);
        setEditingSupplier(null);
        refreshData();
    }

    const handleCloseConfirmModal = () => {
        setConfirmModalOpen(false); 
    };

    const handleClose = async () => {
        await refreshData();
        setEditingSupplier([]);
        setOpen(false);
    }

    const handleSelectItem = (supplierId) => {
        setSelectedItems(prev => 
            prev.includes(supplierId) 
                ? prev.filter(id => id !== supplierId)
                : [...prev, supplierId]
        );
    };
    
    const handleSelectAll = () => {
        if (selectedItems.length === filteredSuppliers.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredSuppliers.map(supplier => supplier.supplierID));
        }
    };

    const handleEditSupplier = (supplier) => {
        setEditingSupplier(supplier);
        setOpen(true);
    };

    const handleDeleteSupplier = async (supplierId) => {
        setSelectedItems((prevItems) => [...prevItems, supplierId]);
        setConfirmModalOpen(true);
    };
    
    const confirmDeleteSelected = () => {
        setConfirmModalOpen(true);
    }

    const handleConfirmDelete = async () => {
        handleDeleteSelected(selectedItems)
        const updatedSuppliers = await fetchSuppliers();
        setSuppliers(updatedSuppliers);
        setSelectedItems([]);
        setConfirmModalOpen(false);
        refreshData();
    };

    return (
        <div className="border rounded-3 p-4 bg-white shadow mx-auto" style={{ margin: '0 auto', height: '100vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Typography variant="h4">Suppliers</Typography>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    + Supplier
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
                            <TableCell>Supplier</TableCell>
                            <TableCell>Contact No</TableCell>
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
                        ) : filteredSuppliers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                                    No suppliers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredSuppliers.map((supplier) => (
                                <TableRow key={supplier.supplierID}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedItems.includes(supplier.supplierID)}
                                            onChange={() => handleSelectItem(supplier.supplierID)}
                                        />
                                    </TableCell>
                                    <TableCell>{supplier.supplierName}</TableCell>
                                    <TableCell>{supplier.contactNo}</TableCell>
                                    <TableCell>
                                        <FaEdit
                                            style={{ cursor: 'pointer', marginRight: '10px' }}
                                            onClick={() => handleEditSupplier(supplier)}
                                        />
                                        <FaTrash
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleDeleteSupplier(supplier.supplierID)}
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
                    {selectedItems.length === filteredSuppliers.length 
                        ? 'Unselect All' 
                        : 'Select All'}
                </Button>
                <Button 
                    variant="contained" 
                    color="error"
                    disabled={selectedItems.length === 0}
                    onClick={confirmDeleteSelected} 
                    startIcon={<FaTrash />}
                    sx={{ textTransform: 'none' }}
                >
                    Delete ({selectedItems.length})
                </Button>
            </div>
            <SupplierModal
                isOpen={open}
                onRequestClose={handleClose}
                supplier={editingSupplier}
                mode={editingSupplier ? 'edit' : 'create'}
                editingSupplier={editingSupplier}
            />
            <ConfirmModal 
                isOpen={confirmModalOpen} 
                onConfirm={handleConfirmDelete} 
                onClose={handleCloseConfirmModal} 
                message={selectedItems.length > 1 
                    ? `Are you sure you want to delete ${selectedItems.length} items?` 
                    : `Are you sure you want to delete this supplier?`}
            />
        </div>
    </div>
    );
};

export default SuppliersPage;