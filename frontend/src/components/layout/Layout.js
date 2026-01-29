import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
const Layout = ({ children }) => {
    return (_jsxs("div", { className: "flex", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex-1 min-h-screen bg-gray-100 ml-64", children: [_jsx(Navbar, {}), _jsx("div", { className: "p-6", children: children })] })] }));
};
export default Layout;
