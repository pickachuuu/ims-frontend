import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts';

const data = [
    { name: 'Low Stock', value: 5 },
    { name: 'In Stock', value: 145 },
];

const COLORS = ['#FF6384', '#36A2EB'];

const Dashboard = () => {
    return (
        <div className="border rounded-3 p-4 bg-white shadow mx-auto" style={{ margin: '0 auto', height: '95vh' }}>
            <h1 className="text-center">Dashboard</h1>
            <div className="row mb-4">
                {/* Overview Cards */}
                <div className="col-6 col-md-3 mb-3"> {/* Added mb-3 for vertical margin on mobile */}
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Total Products</h5>
                            <p className="card-text">150</p>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3 mb-3"> {/* Added mb-3 for vertical margin on mobile */}
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Low-Stock Alerts</h5>
                            <p className="card-text">5</p>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3 mb-3"> {/* Added mb-3 for vertical margin on mobile */}
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Categories</h5>
                            <p className="card-text">10</p>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3 mb-3"> {/* Added mb-3 for vertical margin on mobile */}
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
            <div className="notifications mb-4">
                <h2>Notifications</h2>
                <p>Products low on stock: 5</p>
            </div>
        </div>
    );
};

export default Dashboard;