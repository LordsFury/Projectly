import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from "lucide-react";
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4", onClick: onClose, children: _jsxs("div", { onClick: (e) => e.stopPropagation(), className: "\r\n          w-full max-w-xl\r\n          bg-white/90 backdrop-blur-xl\r\n          rounded-2xl shadow-2xl border border-white/20\r\n          animate-[fadeIn_0.25s_ease-out,scaleIn_0.25s_ease-out]\r\n        ", children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-200", children: [_jsx("h2", { className: "text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: title }), _jsx("button", { onClick: onClose, className: "h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition", children: _jsx(X, { size: 18 }) })] }), _jsx("div", { className: "px-6 py-5 max-h-[70vh] overflow-y-auto text-gray-700", children: children }), _jsx("div", { className: "px-6 py-4 border-t border-gray-200 flex justify-end gap-2", children: _jsx("button", { onClick: onClose, className: "px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition", children: "Cancel" }) })] }) }));
};
export default Modal;
