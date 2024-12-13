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
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import {
    Typography,
    Skeleton,
} from '@mui/material';
import { fetchProducts, fetchCategories, fetchSuppliers } from '../utils/productUtils/productApi';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const fetchedProducts = await fetchProducts();
            const fetchedCategories = await fetchCategories();
            const fetchedSuppliers = await fetchSuppliers();
            setProducts(fetchedProducts);
            setCategories(fetchedCategories);
            setSuppliers(fetchedSuppliers);
            setLoading(false);
        };

        loadData();
    }, []);

    const chartData = products.map(product => ({
        name: product.productName,
        quantity: product.quantity,
        lowStock: product.quantity <= 20,
    }));

    // Create category data based on fetched categories
    const categoryData = categories.map(category => {
        const categoryQuantity = products
            .filter(product => product.categoryID === category.categoryID) // Use categoryID for filtering
            .reduce((acc, product) => acc + product.quantity, 0);
        return {
            name: category.categoryName, // Use categoryName for display
            value: categoryQuantity,
        };
    }).filter(data => data.value > 0); // Filter out categories with zero quantity

    return (
        <div className="border rounded-3 p-4 bg-white shadow mx-auto" style={{ margin: '0 auto', height: '95vh', overflow: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Typography variant="h4">Dashboard</Typography>
            </div>
            <hr />
            <div className="row mb-4 justify-content-center">
                {loading ? (
                    // Skeleton loaders for cards
                    [1, 2, 3, 4].map((_, index) => (
                        <div key={index} className="col-6 col-md-3 mb-3">
                            <div className="card text-center">
                                <div className="card-body">
                                    <Skeleton variant="text" width="80%" />
                                    <Skeleton variant="text" width="60%" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <>
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
                                    <p className="card-text">{categories.length}</p> 
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3 mb-3">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h5 className="card-title">Suppliers</h5>
                                    <p className="card-text">{suppliers.length}</p> 
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className='row justify-content-center mt-4'>
                <div className='col-md-5 text-center'> 
                    <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 300 : 400}>
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
                <div className='col-md-5 text-center'> 
                    {categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 300 : 400}>
                            <PieChart>
                                <Pie 
                                    data={categoryData} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    cx="50%"    
                                    cy="50%" 
                                    outerRadius={150} 
                                    fill="#82ca9d" 
                                    label={({ name }) => name}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#82ca9d' : '#8884d8'} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <Typography variant="h6">No data available for categories.</Typography>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;