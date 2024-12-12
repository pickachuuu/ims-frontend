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
    Checkbox
} from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa';
import SupplierModal from '../components/supplier/supplierModal';
import { fetchSuppliers } from '../utils/supplierUtils/supplierApi';

const SuppliersPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [sortOrder, setSortOrder] = useState('');

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

    const handleClickOpen = () => {
        setOpen(true);
        setEditingSupplier(null);
    }

    const handleClose = () => {
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
        // Implement supplier deletion logic
    };

    const handleConfirmDelete = async () => {
        // Implement bulk supplier deletion logic
        const updatedSuppliers = await fetchSuppliers();
        setSuppliers(updatedSuppliers);
        setSelectedItems([]);
    };

    // Fetch suppliers on component mount
    useEffect(() => {
        const fetchInitialSuppliers = async () => {
            try {
                const supplierData = await fetchSuppliers();
                setSuppliers(supplierData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
                setLoading(false);
            }
        };

        fetchInitialSuppliers();
    }, []);

    return (
        <div className="border rounded-3 p-4 bg-white shadow mx-auto" style={{ margin: '0 auto', height: '95vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Typography variant="h4">Suppliers</Typography>
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
                                    <Checkbox
                                        checked={selectedItems.length === filteredSuppliers.length}
                                        indeterminate={selectedItems.length > 0 && selectedItems.length < filteredSuppliers.length}
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                                <TableCell>Supplier Name</TableCell>
                                <TableCell>Contact No</TableCell>
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
            <SupplierModal
                isOpen={open}
                onRequestClose={handleClose}
                supplier={editingSupplier}
                mode={editingSupplier ? 'edit' : 'create'}
                editingSupplier={editingSupplier}
            />
        </div>
    );
};

export default SuppliersPage;