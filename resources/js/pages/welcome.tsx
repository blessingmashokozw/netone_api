import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import { register } from '@/routes';
import { useState, useEffect } from 'react';

export default function Welcome() {
    const { auth } = usePage().props;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen flex-col items-center bg-cover bg-center bg-no-repeat p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:text-[#EDEDEC] relative overflow-hidden" style={{ backgroundImage: "url('/bg.jpg')" }}>
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 animate-gradient-shift"></div>
                
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${5 + Math.random() * 10}s`,
                            }}
                        />
                    ))}
                </div>

                <header className={`relative z-10 mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-full border border-[#19140035] px-6 py-2 text-sm leading-normal text-[#1b1b18] hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-full border border-transparent px-6 py-2 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] hover:bg-white/80 transition-all duration-300 dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A] dark:hover:bg-slate-800/80"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-block rounded-full border border-[#19140035] px-6 py-2 text-sm leading-normal text-[#1b1b18] hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                
                <div className="relative z-10 flex w-full items-center justify-center lg:grow">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-6xl lg:flex-row gap-8">
                        <div className={`flex-1 rounded-3xl bg-white/95 backdrop-blur-sm p-8 pb-12 text-[13px] leading-[20px] shadow-2xl lg:p-12 dark:bg-slate-900/95 dark:text-[#EDEDEC] transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                            <div className="mb-8">
                                <h1 className="mb-4 text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
                                    Welcome to NetOne
                                </h1>
                                <p className="mb-6 text-lg text-[#706f6c] dark:text-[#A1A09A]">
                                    Your comprehensive job card management system.
                                    <br />
                                    Track, manage, and report on all your job cards efficiently.
                                </p>
                            </div>
                            
                            <div className="grid gap-6 mb-8">
                                {[
                                    {
                                        icon: "📋",
                                        title: "comprehensive tracking",
                                        color: "blue",
                                        description: "Manage job cards with"
                                    },
                                    {
                                        icon: "🚗",
                                        title: "real-time updates",
                                        color: "emerald",
                                        description: "Track vehicles and movements with"
                                    },
                                    {
                                        icon: "📊",
                                        title: "detailed reports",
                                        color: "purple",
                                        description: "Monitor site status with"
                                    }
                                ].map((feature, index) => (
                                    <div
                                        key={index}
                                        className={`group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-${feature.color}-200 hover:shadow-lg hover:shadow-${feature.color}-100/50 transition-all duration-300 cursor-default dark:border-slate-800 dark:hover:border-${feature.color}-800 dark:hover:shadow-${feature.color}-900/20`}
                                        style={{ transitionDelay: `${index * 100}ms` }}
                                    >
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-600 text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                                            <p className={`font-semibold text-${feature.color}-600 dark:text-${feature.color}-400`}>{feature.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex gap-4">
                                <Link
                                    href={auth.user ? dashboard() : login()}
                                    className="flex-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 px-8 py-4 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 transform hover:-translate-y-1 transition-all duration-300 animate-pulse-slow"
                                >
                                    Get Started
                                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                        
                        <div className={`relative flex-1 flex items-center justify-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                            <div className="relative">
                                {/* Glow effect behind logo */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                                
                                {/* Logo container with floating animation */}
                                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl animate-float-slow dark:bg-slate-900/90">
                                    <img 
                                        src="/logo.png" 
                                        alt="NetOne Logo" 
                                        className="w-full max-w-md h-auto object-contain"
                                    />
                                </div>
                                
                                {/* Decorative elements */}
                                <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                                <div className="absolute top-1/2 -right-8 w-4 h-4 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                            </div>
                        </div>
                    </main>
                </div>
                
                <div className="relative z-10 hidden h-14.5 lg:block"></div>
                
                <style jsx global>{`
                    @keyframes gradient-shift {
                        0%, 100% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                    }
                    
                    @keyframes float {
                        0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
                        10% { opacity: 1; }
                        90% { opacity: 1; }
                        100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
                    }
                    
                    @keyframes float-slow {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }
                    
                    @keyframes gradient-x {
                        0%, 100% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                    }
                    
                    @keyframes pulse-slow {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.8; }
                    }
                    
                    .animate-gradient-shift {
                        background-size: 200% 200%;
                        animation: gradient-shift 15s ease infinite;
                    }
                    
                    .animate-float {
                        animation: float linear infinite;
                    }
                    
                    .animate-float-slow {
                        animation: float-slow 6s ease-in-out infinite;
                    }
                    
                    .animate-gradient-x {
                        background-size: 200% auto;
                        animation: gradient-x 3s linear infinite;
                    }
                    
                    .animate-pulse-slow {
                        animation: pulse-slow 3s ease-in-out infinite;
                    }
                `}</style>
            </div>
        </>
    );
}
