"use client";

import { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import { machinesAPI } from "@/lib/api";
import Navbar from "@/components/Navbar";
import MachineTable from "@/components/MachineTable";
import { io } from "socket.io-client";

export default function DashboardPage() {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [autoRefreshNotification, setAutoRefreshNotification] = useState(false);
    const isFirstLoad = useRef(true);
    const router = useRouter();

    // Manual refresh with loader
    const fetchMachinesWithLoader = async () => {
        setLoading(true);
        try {
            const data = await machinesAPI.getAll();
            setMachines(data);
            setError("");
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                router.push("/login");
            } else {
                setError("Failed to fetch machines");
            }
        } finally {
            setLoading(false);
            isFirstLoad.current = false;
        }
    };

    // Auto-refresh without loader, with notification
    const fetchMachinesAutoRefresh = async () => {
        // Step 1: Show notification first and force synchronous update
        flushSync(() => {
            setAutoRefreshNotification(true);
        });

        // Step 2: Wait for notification to render and be visible
        await new Promise((resolve) => setTimeout(resolve, 150));

        // Step 3: Clear data - this should happen after notification is visible
        flushSync(() => {
            setMachines([]);
        });

        // Step 4: Wait to show the cleared state before fetching
        await new Promise((resolve) => setTimeout(resolve, 400));

        // Step 5: Now fetch and populate data
        try {
            const data = await machinesAPI.getAll();
            // Ensure notification is still visible when data arrives
            setMachines(data);
            setError("");
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                router.push("/login");
            } else {
                // Don't show error on auto-refresh to avoid disrupting user
                console.error("Auto-refresh failed:", err);
            }
        } finally {
            // Hide notification after data is loaded and visible
            setTimeout(() => {
                setAutoRefreshNotification(false);
            }, 1500);
        }
    };

    const handleManualRefresh = () => {
        fetchMachinesWithLoader();
    };

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        // Fetch machines on first load (with loader)
        fetchMachinesWithLoader();

        // Set up auto-refresh every 10 seconds (without loader, with notification)
        const refreshInterval = setInterval(() => {
            fetchMachinesAutoRefresh();
        }, 10000);

        // Set up WebSocket connection for real-time updates
        const socket = io("http://localhost:3001", {
            transports: ["websocket"],
        });

        socket.on("machineUpdate", (updatedMachine) => {
            setMachines((prevMachines) => prevMachines.map((machine) => (machine.id === updatedMachine.id ? updatedMachine : machine)));
        });

        socket.on("allMachines", (allMachines) => {
            setMachines(allMachines);
        });

        socket.on("connect", () => {
            console.log("WebSocket connected");
        });

        socket.on("disconnect", () => {
            console.log("WebSocket disconnected");
        });

        return () => {
            clearInterval(refreshInterval);
            socket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    if (loading && isFirstLoad.current) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading machines...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Auto-refresh notification */}
                {autoRefreshNotification && (
                    <div className="fixed top-20 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-slide-in">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <span>Auto-refreshing...</span>
                    </div>
                )}

                <div className="mb-6 flex items-center justify-between machine-dashboard-table-main-header">
                    <h2 className="text-2xl font-bold text-gray-800">Machine Dashboard Table</h2>
                    <button
                        onClick={handleManualRefresh}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors machine-dashboard-table-main-header-button"
                        title="Refresh data"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                <span>Refreshing...</span>
                            </>
                        ) : (
                            <>
                                <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                <span>Refresh</span>
                            </>
                        )}
                    </button>
                </div>

                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

                {loading && !isFirstLoad.current ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Refreshing...</p>
                        </div>
                    </div>
                ) : machines.length > 0 ? (
                    <MachineTable machines={machines} />
                ) : (
                    <div className="bg-white p-8 rounded-lg shadow text-center">
                        <p className="text-gray-600">No machines found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
