import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';

interface ToastProps {
    message: string | null;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: -50, x: '-50%' }}
                    className="fixed top-6 left-1/2 z-[60] flex items-center gap-3 bg-black text-white px-6 py-4 rounded-full shadow-lg whitespace-nowrap"
                >
                    <Bell size={18} className="text-[#FF5A5F]" />
                    <span className="font-bold text-sm">{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
