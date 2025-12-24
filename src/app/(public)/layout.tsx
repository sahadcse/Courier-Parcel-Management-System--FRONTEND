import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import Image from "next/image";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-inter">
            <Header />
            <main className="flex-grow pt-24 min-h-screen flex flex-col relative overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/login_register.jpg"
                        alt="Logistic Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 backdrop-blur-sm"></div>
                </div>
                <div className="relative z-10 flex-grow flex flex-col">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}
