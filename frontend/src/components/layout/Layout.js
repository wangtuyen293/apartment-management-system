import { Outlet } from "react-router-dom";
import AppNavbar from "../AppNavbar";
import AppFooter from "../AppFooter";

const Layout = () => {
    return (
        <>
            <AppNavbar />
            <Outlet />
            <AppFooter />
        </>
    );
};

export default Layout;
