'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface ContactMessage {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
}

export default function MessageList() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await api.get('/contact');
            // Assuming response structure: { success: true, count: number, data: [] }
            setMessages(res.data.data);
        } catch (error) {
            console.error('Failed to fetch messages', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary-500" /></div>;
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inbox Messages</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                            <th className="p-4 font-semibold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">Date</th>
                            <th className="p-4 font-semibold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">Sender</th>
                            <th className="p-4 font-semibold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">Subject</th>
                            <th className="p-4 font-semibold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">Message</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {messages.map((msg) => (
                            <tr key={msg._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                <td className="p-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap align-top">
                                    {new Date(msg.createdAt).toLocaleDateString()} <br />
                                    <span className="text-xs opacity-70">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                                </td>
                                <td className="p-4 text-slate-700 dark:text-slate-200 align-top">
                                    <div className="font-medium text-slate-900 dark:text-white">{msg.name}</div>
                                    <div className="text-sm text-slate-500">{msg.email}</div>
                                </td>
                                <td className="p-4 text-slate-700 dark:text-slate-200 font-medium align-top">
                                    {msg.subject}
                                </td>
                                <td className="p-4 text-slate-600 dark:text-slate-300 max-w-md min-w-[300px] align-top">
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.message}</p>
                                </td>
                            </tr>
                        ))}
                        {messages.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-slate-500">
                                    No messages found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
