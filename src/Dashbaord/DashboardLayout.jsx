
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    return (
        <div className=" bg-gray-50">
          
            <div className="">
                <Outlet />  
            </div>
        </div>
    );
};

export default DashboardLayout;