import React, { useEffect, useState, useContext } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';  
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'; 
import { Link } from 'react-router-dom';
import {
    Typography,
    Skeleton,
    Button
} from '@mui/material';
import { fetchProducts, fetchCategories, fetchSuppliers } from '../utils/productUtils/productApi';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AuthContext } from '../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement); 

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { business } = useContext(AuthContext); 
    const lowStockThreshold = 50;


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

    const generatePDF = () => {
        const doc = new jsPDF();
        const margin = 10; 
        const startY = 16;

        doc.setFont("helvetica", "bold");
        const title = `${business}'s Inventory Report`;
        const titleWidth = doc.getTextWidth(title);
        const pageWidth = doc.internal.pageSize.getWidth();
        const titleX = (pageWidth - titleWidth) / 2;
        doc.text(title, titleX, startY);
        doc.setFont("helvetica", "normal");
        doc.text(`Products`, 14, 32);

        const categoryMap = categories.reduce((acc, category) => {
            acc[category.categoryID] = category.categoryName; 
            return acc;
        }, {});
    
        const supplierMap = suppliers.reduce((acc, supplier) => {
            acc[supplier.supplierID] = supplier.supplierName; 
            return acc;
        }, {});
    
        const productTableData = products.map(item => [
            item.productName, 
            item.quantity, 
            item.price, 
            supplierMap[item.supplierID] || 'N/A', 
            categoryMap[item.categoryID] || 'N/A' 
        ]);
    
        const productTableStartY = startY + margin + 10; 
        doc.autoTable({
            head: [['Product Name', 'Quantity', 'Price', 'Supplier', 'Category']],
            body: productTableData,
            startY: productTableStartY,
        });
    
        doc.addPage();
        const lowStockTitleY = margin; 
        doc.text("Low Stock Report", 14, 32);
    
        const lowStockItems = products.filter(item => item.quantity <= lowStockThreshold);
        const lowStockTableData = lowStockItems.map(item => {
            const supplier = suppliers.find(supp => supp.supplierID === item.supplierID);
            return [
                item.productName,
                item.quantity,
                supplier ? supplierMap[item.supplierID] : 'N/A', 
                supplier ? supplier.contactNo : 'N/A',
                categoryMap[item.categoryID] || 'N/A'  
            ];
        });
    
        const lowStockTableStartY = lowStockTitleY + margin + 16;
        doc.autoTable({
            head: [['Product Name', 'Quantity', 'Supplier', 'Contact No', 'Category']], 
            body: lowStockTableData,
            startY: lowStockTableStartY, 
        });

        const date = new Date();
        const month = date.toLocaleString('default', { month: 'long' }).toLowerCase();
        const year = date.getFullYear();

        const sanitizedBusinessName = business
            .replace(/\./g, '')    
            .replace(/\s+/g, '-')     
            .toLowerCase();            

        doc.save(`${sanitizedBusinessName}-${month}-${year}-report.pdf`);
    };

    const websiteColors = [
        '#0d6efd', // Bootstrap primary blue
        '#3d8bfd', // lighter blue
        '#6ea8fe', // even lighter blue
        '#9ec5fe', // very light blue
        '#cfe2ff', // extremely light blue
        '#0b5ed7', // slightly darker blue
        '#084298', // darker blue
        '#032a5d', // very dark blue
        '#5c636a', // gray blue
        '#4d97ff', // bright blue
        '#1e4faf', // muted blue
        '#2563eb'  // vivid blue
    ];

    const chartData = {
        labels: products.map(product => product.productName),
        datasets: [{
            label: 'Quantity',
            data: products.map(product => product.quantity),
            backgroundColor: '#0d6efd', 
        }],
    };

    const categoryData = categories.map(category => {
        const categoryQuantity = products
            .filter(product => product.categoryID === category.categoryID) 
            .reduce((acc, product) => acc + product.quantity, 0);
        return {
            name: category.categoryName, 
            value: categoryQuantity,
        };
    }).filter(data => data.value > 0); 

    const pieData = {
        labels: categoryData.map(data => data.name),
        datasets: [{
            data: categoryData.map(data => data.value),
            backgroundColor: websiteColors.slice(0, categoryData.length),
        }],
    };

    return (
        <div className="border rounded-3 p-4 bg-white shadow mx-auto" style={{ margin: '0 auto', height: '100vh', overflow: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Typography variant="h4">Dashboard</Typography>
                <Button variant="contained" color="primary" onClick={generatePDF} className='border rounded-3 p-2 bg-primary shadow'>
                    Report
                </Button>
            </div>
            <hr />
            <div className="row mb-4 justify-content-center">
                {loading ? (
                    [1, 2, 3, 4].map((_, index) => (
                        <div key={index} className="col-6 col-md-3 mb-3">
                            <div className="card text-center border rounded-3 p-4 bg-white shadow">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <Skeleton variant="text" width="80%" style={{ margin: '0 auto' }} />
                                    </h5>
                                    <p className="card-text">
                                        <Skeleton variant="text" width="40%" style={{ margin: '0 auto' }} />
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        <div className="col-6 col-md-3 mb-3">
                            <Link to="/home/products" className="dashboard-card">
                                <div className="card text-center border rounded-3 p-4 bg-white shadow">
                                    <div className="card-body">
                                        <h5 className="card-title">Total Products</h5>
                                        <p className="card-text">{products.length}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="col-6 col-md-3 mb-3">
                            <Link to="/home/lowstock" className="dashboard-card">
                                <div className="card text-center border rounded-3 p-4 bg-white shadow">
                                    <div className="card-body">
                                        <h5 className="card-title">Low-Stock</h5>
                                        <p className="card-text">
                                            {products.filter(product => product.quantity <= lowStockThreshold).length}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="col-6 col-md-3 mb-3">
                            <Link to="/home/categories" className="dashboard-card">
                                <div className="card text-center border rounded-3 p-4 bg-white shadow">
                                    <div className="card-body">
                                        <h5 className="card-title">Categories</h5>
                                        <p className="card-text">{categories.length}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="col-6 col-md-3 mb-3">
                            <Link to="/home/suppliers" className="dashboard-card">
                                <div className="card text-center border rounded-3 p-4 bg-white shadow">
                                    <div className="card-body">
                                        <h5 className="card-title">Suppliers</h5>
                                        <p className="card-text">{suppliers.length}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </>
                )}
            </div>
            <div className='row mt-4 justify-content-center'>
                <div className='col-12 col-md-6 d-flex justify-content-center align-items-center mx-auto border rounded-3 p-4 bg-white shadow' > 
                    <Bar 
                        data={chartData} 
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Product Quantity',
                                },
                            },
                        }}
                        height={400} 
                    />
                </div>
                <div className='col-12 col-md-5 d-flex justify-content-center align-items-center mx-auto border rounded-3 p-4 bg-white shadow' > 
                    {categoryData.length > 0 ? (
                        <div style={{ height: '100%', width: '100%' }}> 
                            <Doughnut 
                                data={pieData} 
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                        title: {
                                            display: true,
                                            text: 'Category Distribution',
                                        },
                                    },
                                }}
                                height={400}
                            />
                        </div>
                    ) : (
                        <Typography variant="h6">No data available for categories.</Typography>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard