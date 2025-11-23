
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Check, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';

interface ConnectDeviceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ConnectDeviceModal({ isOpen, onClose }: ConnectDeviceModalProps) {
    const { user } = useAuth();
    const [partnerCode, setPartnerCode] = useState('');
    const [myCode, setMyCode] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setMyCode(user.id.substring(0, 6).toUpperCase());
        }

        const savedPartner = localStorage.getItem('us-time-partner');
        if (savedPartner) setIsConnected(true);
    }, [user]);

    const handleConnect = async () => {
        if (!partnerCode || !user) return;

        setIsLoading(true);
        try {
            const result = await api.connectPartner(partnerCode, user.id);
            if (result.success && result.partnerId) {
                localStorage.setItem('us-time-partner', 'connected');
                localStorage.setItem('us-time-partner-id', result.partnerId);
                setIsConnected(true);
            }
        } catch (e) {
            console.error("Failed to connect", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisconnect = () => {
        localStorage.removeItem('us-time-partner');
        setIsConnected(false);
        setPartnerCode('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-50 m-4"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                                    <Smartphone size={20} />
                                </div>
                                <h2 className="text-xl font-bold">Connect Partner</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* My Code Section */}
                            <div className="bg-stone-50 p-4 rounded-2xl border-2 border-stone-100">
                                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1 block">
                                    Your Device Code
                                </label>
                                <div className="text-3xl font-black tracking-widest text-center py-2 font-mono">
                                    {myCode || '...'}
                                </div>
                            </div>

                            {/* Connection Status */}
                            {isConnected ? (
                                <div className="bg-green-50 text-green-600 p-4 rounded-2xl border-2 border-green-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <Check size={16} strokeWidth={3} />
                                        </div>
                                        <span className="font-bold">Connected to Partner</span>
                                    </div>
                                    <button
                                        onClick={handleDisconnect}
                                        className="text-xs font-bold underline hover:text-green-700"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-stone-600">
                                        Enter Partner's Code
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={partnerCode}
                                            onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                                            placeholder="XXXXXX"
                                            maxLength={6}
                                            className="flex-1 bg-white border-2 border-stone-200 rounded-xl px-4 py-3 font-mono text-lg font-bold uppercase focus:outline-none focus:border-black transition-colors"
                                        />
                                        <Button
                                            onClick={handleConnect}
                                            disabled={!partnerCode || isLoading}
                                            className="px-6"
                                        >
                                            {isLoading ? <Loader2 className="animate-spin" /> : 'Connect'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
