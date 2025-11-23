import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Check, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Activity } from '../types';
import { api } from '../lib/api';

interface PitchActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    activity: Activity | null;
}

export const PitchActivityModal: React.FC<PitchActivityModalProps> = ({ isOpen, onClose, activity }) => {
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);

    if (!activity) return null;

    const handlePitch = () => {
        if (!activity) return;

        setIsSending(true);

        const storedPartnerId = localStorage.getItem('us-time-partner-id');

        if (storedPartnerId) {
            api.sendPitch(storedPartnerId, activity);
        } else {
            console.warn("No partner connected");
        }

        setTimeout(() => {
            setIsSending(false);
            setIsSent(true);
            setTimeout(() => {
                setIsSent(false);
                onClose();
            }, 1500);
        }, 1000);
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
                            <h2 className="text-xl font-bold">Pitch Activity</h2>
                            <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="text-center space-y-6">
                            <div className="bg-stone-50 p-6 rounded-2xl border-2 border-stone-100">
                                <h3 className="text-2xl font-black mb-2">{activity.title}</h3>
                                <span className="inline-block px-3 py-1 bg-black text-white text-xs font-bold rounded-full uppercase tracking-wide">
                                    {activity.category}
                                </span>
                            </div>

                            <p className="text-stone-500 font-medium">
                                Send this activity to your partner? They'll get a notification instantly.
                            </p>

                            <Button
                                onClick={handlePitch}
                                disabled={isSending || isSent}
                                className="w-full py-4 text-lg"
                            >
                                {isSending ? (
                                    <Loader2 className="animate-spin" />
                                ) : isSent ? (
                                    <>
                                        <Check className="mr-2" /> Sent!
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2" size={20} /> Send It
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};


