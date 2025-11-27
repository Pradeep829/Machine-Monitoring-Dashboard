"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { nameToSlug } from "@/lib/utils";

export default function MachineTable({ machines }) {
    const router = useRouter();

    useEffect(() => {
        if (!machines?.length) return;

        machines.forEach((machine) => {
            const slug = nameToSlug(machine.name);
            router.prefetch(`/machines/${slug}`);
        });
    }, [machines, router]);

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

    const handleRowClick = (machine) => {
        const slug = nameToSlug(machine.name);
        router.push(`/machines/${slug}`);
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature (°C)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Energy Consumption (kWh)
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {machines.map((machine) => (
                        <tr
                            key={machine.id}
                            onClick={() => handleRowClick(machine)}
                            className="hover:bg-blue-50 cursor-pointer transition-colors"
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{machine.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                        machine.status
                                    )}`}
                                >
                                    {machine.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{machine.temperature}°C</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{machine.energyConsumption} kWh</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
