import React, { useEffect, useState, useContext } from 'react';
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
    Cell
} from 'recharts';
import {
    Typography,
    Skeleton,
    Button
} from '@mui/material';
import { fetchProducts, fetchCategories, fetchSuppliers } from '../utils/productUtils/productApi';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { business } = useContext(AuthContext); 
    const lowStockThreshold = 5;

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
        const title = `${business}`;
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

        doc.save(`${business}_inventory_report`);
    };

    const chartData = products.map(product => ({
        name: product.productName,
        quantity: product.quantity,
        lowStock: product.quantity <= 20,
    }));

    const categoryData = categories.map(category => {
        const categoryQuantity = products
            .filter(product => product.categoryID === category.categoryID) 
            .reduce((acc, product) => acc + product.quantity, 0);
        return {
            name: category.categoryName, 
            value: categoryQuantity,
        };
    }).filter(data => data.value > 0); 

    return (
        <div className="border rounded-3 p-4 bg-white shadow mx-auto" style={{ margin: '0 auto', height: '95vh', overflow: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Typography variant="h4">Dashboard</Typography>
                <Button variant="contained" color="primary" onClick={generatePDF}>
                Generate Inventory Report
            </Button>
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
                <div className='col-md-7 text-center'> 
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