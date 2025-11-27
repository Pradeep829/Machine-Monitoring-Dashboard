"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Select from "react-select";
import { machinesAPI } from "@/lib/api";
import Navbar from "@/components/Navbar";
import TemperatureChart from "@/components/TemperatureChart";
import { io } from "socket.io-client";

export default function MachineDetailsPage() {
    const params = useParams();
    const router = useRouter();
    // params.id now contains the slug/name
    const machineSlug = params.id;
    const [machine, setMachine] = useState(null);
    const [temperatureHistory, setTemperatureHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const isEditingRef = useRef(false);
    const [formData, setFormData] = useState({
        temperature: "",
        status: "",
        energyConsumption: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        fetchMachineDetails();

        // Set up WebSocket for real-time updates
        const socket = io("http://localhost:3001", {
            transports: ["websocket"],
        });

        socket.on("machineUpdate", (updatedMachine) => {
            // Check if this update is for the current machine
            // Compare by name (convert slug to name format for comparison)
            const updatedMachineSlug = updatedMachine.name
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");

            if (updatedMachineSlug === machineSlug || (machine && updatedMachine.name === machine.name)) {
                setMachine(updatedMachine);
                // Update form data only if not in edit mode
                if (!isEditingRef.current) {
                    setFormData({
                        temperature: updatedMachine.temperature.toString(),
                        status: updatedMachine.status,
                        energyConsumption: updatedMachine.energyConsumption.toString(),
                    });
                }
                // Add to temperature history
                setTemperatureHistory((prev) => {
                    const newHistory = [...prev, updatedMachine.temperature];
                    // Keep last 20 readings
                    return newHistory.slice(-20);
                });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [machineSlug, router]);

    const fetchMachineDetails = async () => {
        try {
            const data = await machinesAPI.getByName(machineSlug);
            setMachine(data);
            // Initialize temperature history with current temperature
            setTemperatureHistory([data.temperature]);
            // Initialize form data
            setFormData({
                temperature: data.temperature.toString(),
                status: data.status,
                energyConsumption: data.energyConsumption.toString(),
            });
            setError("");
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                router.push("/login");
            } else {
                setError("Failed to fetch machine details");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        isEditingRef.current = true;
        // Update form data from current machine state
        if (machine) {
            setFormData({
                temperature: machine.temperature.toString(),
                status: machine.status,
                energyConsumption: machine.energyConsumption.toString(),
            });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        isEditingRef.current = false;
        // Reset form data to current machine values
        if (machine) {
            setFormData({
                temperature: machine.temperature.toString(),
                status: machine.status,
                energyConsumption: machine.energyConsumption.toString(),
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleStatusChange = (selectedOption) => {
        setFormData((prev) => ({
            ...prev,
            status: selectedOption.value,
        }));
    };

    const statusOptions = [
        { value: "Running", label: "Running" },
        { value: "Idle", label: "Idle" },
        { value: "Stopped", label: "Stopped" },
    ];

    const getStatusOption = (status) => {
        return statusOptions.find((option) => option.value === status) || statusOptions[0];
    };

    const customSelectStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
            boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
            "&:hover": {
                borderColor: "#3b82f6",
            },
            borderRadius: "0.5rem",
            minHeight: "42px",
        }),
        menu: (base) => ({
            ...base,
            borderRadius: "0.5rem",
            zIndex: 9999,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#eff6ff" : "white",
            color: state.isSelected ? "white" : "#1f2937",
            "&:active": {
                backgroundColor: state.isSelected ? "#3b82f6" : "#dbeafe",
            },
        }),
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setError("");

        try {
            const updatePayload = {};
            if (formData.temperature) {
                updatePayload.temperature = parseFloat(formData.temperature);
            }
            if (formData.status) {
                updatePayload.status = formData.status;
            }
            if (formData.energyConsumption) {
                updatePayload.energyConsumption = parseFloat(formData.energyConsumption);
            }

            const updated = await machinesAPI.update(machineSlug, updatePayload);
            setMachine(updated);
            setIsEditing(false);
            isEditingRef.current = false;

            // Add to temperature history if temperature changed
            if (updatePayload.temperature !== undefined) {
                setTemperatureHistory((prev) => {
                    const newHistory = [...prev, updated.temperature];
                    return newHistory.slice(-20);
                });
            }
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                router.push("/login");
            } else {
                setError(err.response?.data?.message || "Failed to update machine");
            }
        } finally {
            setUpdateLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Running":
                return "bg-green-100 text-green-800";
            case "Idle":
                return "bg-yellow-100 text-yellow-800";
            case "Stopped":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading machine details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !machine) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error || "Machine not found"}</div>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button onClick={() => router.push("/dashboard")} className="mb-6 text-blue-600 hover:text-blue-800 font-medium">
                    ← Back
                </button>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">Machine Details</h1>

                    <div className="flex justify-between items-center mb-6 machine-details-header">
                        <h3 className="text-2xl font-bold text-gray-800">{machine.name}</h3>
                        {!isEditing && (
                            <button
                                onClick={handleEdit}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Edit Machine
                            </button>
                        )}
                    </div>

                    {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

                    <div>
                        {isEditing ? (
                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Machine ID</h3>
                                        <p className="text-2xl font-semibold text-gray-800">{machine.id}</p>
                                        <p className="text-xs text-gray-400 mt-1">(Cannot be changed)</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <div className="h-[42px]">
                                            <Select
                                                id="status"
                                                name="status"
                                                value={getStatusOption(formData.status)}
                                                onChange={handleStatusChange}
                                                options={statusOptions}
                                                styles={customSelectStyles}
                                                isSearchable={false}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                                        <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">
                                            Temperature (°C)
                                        </label>
                                        <input
                                            type="number"
                                            id="temperature"
                                            name="temperature"
                                            value={formData.temperature}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter temperature"
                                            step="0.1"
                                            required
                                        />
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                                        <label htmlFor="energyConsumption" className="block text-sm font-medium text-gray-700 mb-2">
                                            Energy Consumption (kWh)
                                        </label>
                                        <input
                                            type="number"
                                            id="energyConsumption"
                                            name="energyConsumption"
                                            value={formData.energyConsumption}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter energy consumption"
                                            step="0.1"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 h-[44px] machine-details-footer">
                                    <button
                                        type="submit"
                                        disabled={updateLoading}
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {updateLoading ? "Updating..." : "Save Changes"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={updateLoading}
                                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Machine ID</h3>
                                        <p className="text-2xl font-semibold text-gray-800">{machine.id}</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                                        <div className="h-[42px] flex items-center">
                                            <span
                                                className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(
                                                    machine.status
                                                )}`}
                                            >
                                                {machine.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Temperature</h3>
                                        <p className="text-2xl font-semibold text-gray-800">{machine.temperature}°C</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Energy Consumption</h3>
                                        <p className="text-2xl font-semibold text-gray-800">{machine.energyConsumption} kWh</p>
                                    </div>
                                </div>

                                <div className="h-[44px] mb-6"></div>

                                {temperatureHistory.length > 0 && <TemperatureChart temperatureHistory={temperatureHistory} />}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
