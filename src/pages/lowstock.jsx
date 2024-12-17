import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Card
} from '@mui/material';
import { fetchProducts } from '../utils/productUtils/productApi';
import { fetchSuppliers } from '../utils/supplierUtils/supplierApi';
import Skeleton from '@mui/material/Skeleton';

const LowStockPage = () => {
    const [lowStockItems, setLowStockItems] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const lowStockThreshold = 50;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const products = await fetchProducts();
                const suppliersData = await fetchSuppliers();
                
                // Create a map of suppliers for easy lookup
                const supplierMap = suppliersData.reduce((acc, supplier) => {
                    acc[supplier.supplierID] = supplier;
                    return acc;
                }, {});

                // Filter low stock items and add supplier information
                const lowStock = products
                    .filter(product => product.quantity <= lowStockThreshold)
                    .map(product => ({
                        ...product,
                        supplierName: supplierMap[product.supplierID]?.supplierName || 'N/A',
                        supplierContact: supplierMap[product.supplierID]?.contactNo || 'N/A'
                    }));

                setLowStockItems(lowStock);
                setSuppliers(suppliersData);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    return (
        <div className="border rounded-3 p-4 bg-white shadow mx-auto" style={{ margin: '0 auto', height: '100vh' }}>
            <Typography variant="h4" className="mb-4">Low Stock</Typography>
            <hr />
            <div className='border rounded-3 p-4 bg-white shadow'> 
                <TableContainer style={{ maxHeight: 550, height: '50vh', overflow: 'auto' }} component={Card}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Supplier</TableCell>
                                <TableCell>Contact Number</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                // Show 5 skeleton rows while loading
                                [...Array(5)].map((_, index) => (
                                    <TableRow key={`skeleton-${index}`}>
                                        <TableCell><Skeleton animation="wave" /></TableCell>
                                        <TableCell><Skeleton animation="wave" /></TableCell>
                                        <TableCell><Skeleton animation="wave" /></TableCell>
                                        <TableCell><Skeleton animation="wave" /></TableCell>
                                    </TableRow>
                                ))
                            ) : lowStockItems.length > 0 ? (
                                lowStockItems.map((item) => (
                                    <TableRow key={item.productID}>
                                        <TableCell>{item.productName}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.supplierName}</TableCell>
                                        <TableCell>{item.supplierContact}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No low stock items found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default LowStockPage;