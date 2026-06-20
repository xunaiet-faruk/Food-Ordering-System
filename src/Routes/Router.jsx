import { Routes, Route, Outlet } from "react-router-dom";
import Home from "../Pages/HomePage/Home";
import Navbar from "../Shared/Navbar";
import Food from "../Pages/Fooditem/Food";
import FoodDetails from "../Pages/Fooditem/Fooddetails";
import Footer from "../Shared/Footer";
import DashboardLayout from "../Dashbaord/DashboardLayout";
import Dashboard from "../Dashbaord/Dashboard";


const MainLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />  
            <Footer />
        </>
    );
};

const Router = () => {
    return (
        <Routes>
        
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
            </Route>

            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/foods" element={<Food />} />
                <Route path="/food/:id" element={<FoodDetails />} />
            </Route>
        </Routes>
    );
};

export default Router;