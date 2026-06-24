import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../Pages/HomePage/Home";
import Navbar from "../Shared/Navbar";
import Food from "../Pages/Fooditem/Food";
import FoodDetails from "../Pages/Fooditem/Fooddetails";
import Footer from "../Shared/Footer";
import DashboardLayout from "../Dashbaord/DashboardLayout";
import Dashboard from "../Dashbaord/Dashboard";
import Login from "../Authentication/Login/Login";
import Register from "../Authentication/Register/Register";
import PaymentSuccess from "../Dashbaord/Customer/PaymentSuccess";
import PaymentCancel from "../Dashbaord/Customer/PaymentCancel";
import PrivateRoute from "../Authentication/Privateroute/PrivateRoute";

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
            <Route path="/foods" element={<><Navbar /><Food /><Footer /></>} />
            
            <Route 
                path="/food/:id" 
                element={
                    <PrivateRoute>
                        <><Navbar /><FoodDetails /><Footer /></>
                    </PrivateRoute>
                } 
            />

            <Route 
                path="/payment-success" 
                element={
                    <PrivateRoute>
                        <PaymentSuccess />
                    </PrivateRoute>
                } 
            />
            <Route 
                path="/payment-cancel" 
                element={
                    <PrivateRoute>
                        <PaymentCancel />
                    </PrivateRoute>
                } 
            />

            <Route 
                path="/dashboard" 
                element={
                    <PrivateRoute>
                        <DashboardLayout />
                    </PrivateRoute>
                }
            >
                <Route index element={<Dashboard />} />
                
                {/* Customer Routes */}
                <Route path="view-food" element={<Dashboard />} />
                <Route path="place-order" element={<Dashboard />} />
                <Route path="order-list" element={<Dashboard />} />
                <Route path="payment-history" element={<Dashboard />} />
                
                {/* Admin Routes */}
                <Route path="all-orders" element={<Dashboard />} />
                <Route path="customer-details" element={<Dashboard />} />
                <Route path="view-payment-status" element={<Dashboard />} />
                <Route path="manage-food" element={<Dashboard />} />
                <Route path="add-food" element={<Dashboard />} />
             
                <Route path="*" element={<Navigate to="/dashboard/view-food" replace />} />
            </Route>

            {/* ===== Auth Routes ===== */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
};

export default Router;