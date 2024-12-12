import React, { useEffect, useState } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
} from 'recharts';
import {
    Typography,
    Button,
} from '@mui/material';
import { fetchProducts } from '../utils/productUtils/productApi';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            const fetchedProducts = await fetchProducts();
            setProducts(fetchedProducts);
            setLoading(false);
        };

        loadProducts();
    }, []);

    const chartData = products.map(product => ({
        name: product.productName,
        quantity: product.quantity,
        lowStock: product.quantity <= 20,
    }));

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="border rounded-3 p-4 bg-white shadow mx-auto" style={{ margin: '0 auto', height: '95vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Typography variant="h4">Dashboard</Typography>
            </div>
            <div className="row mb-4 justify-content-center">
                <div className="col-6 col-md-3 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Total Products</h5>
                            <p className="card-text">{products.length}</p>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Low-Stock Alerts</h5>
                            <p className="card-text">{products.filter(product => product.quantity <= 20).length}</p>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Categories</h5>
                            <p className="card-text">10</p> 
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Suppliers</h5>
                            <p className="card-text">8</p> 
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center mb-4">
                <button className="btn btn-primary mx-2">Add Product</button>
                <button className="btn btn-secondary mx-2">Generate Stock Report</button>
            </div>
            <div className='row justify-content-center'>
                <div className='col-md-12 text-center'>
                    <ResponsiveContainer width='100%' height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="quantity" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="mt-4">
                <h2 className="text-center">Top Products</h2>
                <ul className="list-group">
                    {products.slice(0, 5).map(product => ( 
                        <li key={product.productID} className="list-group-item">
                            {product.productName} - Quantity: {product.quantity} {product.quantity <= 5 ? '(Low Stock)' : ''}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;