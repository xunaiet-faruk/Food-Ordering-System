import { Routes, Route } from "react-router-dom";
import Home from "../Pages/HomePage/Home";
import Navbar from "../Shared/Navbar";

const Router = () => {
    return (
        <>
            <Navbar />
            
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/foods" element={<div>Foods Page</div>} />
                <Route path="/cart" element={<div>Cart Page</div>} />
            </Routes>
        </>
    );
};

export default Router;