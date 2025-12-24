import MessageList from "@/components/admin/MessageList";

export default function AdminMessagesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Messages</h1>
                    <p className="text-slate-500 dark:text-slate-400">View inquiries from the public contact form.</p>
                </div>
            </div>

            <MessageList />
        </div>
    );
}
