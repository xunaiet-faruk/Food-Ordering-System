import { Routes, Route } from "react-router-dom";
import Home from "../Pages/HomePage/Home";
import Navbar from "../Shared/Navbar";
import Food from "../Pages/Fooditem/Food";
import FoodDetails from "../Pages/Fooditem/Fooddetails";
import Footer from "../Shared/Footer";
import DashboardLayout from "../Dashbaord/DashboardLayout";
import Dashboard from "../Dashbaord/Dashboard";
import Login from "../Authentication/Login/Login";
import Register from "../Authentication/Register/Register";

const Router = () => {
    return (
        <Routes>
            {/* ===== Dashboard ===== */}
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="*" element={<Dashboard />} />
            </Route>

       
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
            <Route path="/foods" element={<><Navbar /><Food /><Footer /></>} />
            <Route path="/food/:id" element={<><Navbar /><FoodDetails /><Footer /></>} />
        </Routes>
    );
};

export default Router;