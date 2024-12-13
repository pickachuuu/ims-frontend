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
} from '@mui/material';
import { fetchProducts } from '../utils/productUtils/productApi'; // Adjust the import path as necessary

const LowStockPage = () => {
    const [lowStockItems, setLowStockItems] = useState([]);
    const lowStockThreshold = 5; // Define the low stock threshold

    useEffect(() => {
        const loadProducts = async () => {
            const products = await fetchProducts();
            const lowStock = products.filter(product => product.quantity <= lowStockThreshold);
            setLowStockItems(lowStock);
        };

        loadProducts();
    }, []);

    return (
        <div className="border rounded-3 p-4 bg-white shadow mx-auto" style={{ margin: '0 auto', height: '95vh' }}>
            <Typography variant="h4" className="mb-4">Low Stock Report</Typography>
            <hr />
            {lowStockItems.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Supplier</TableCell> 
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lowStockItems.map((item) => (
                                <TableRow key={item.productID}>
                                    <TableCell>{item.productName}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.supplierName}</TableCell> 
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="h6">No low stock items found.</Typography>
            )}
        </div>
    );
};

export default LowStockPage;