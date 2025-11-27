"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TemperatureChart({ temperatureHistory }) {
    const data = temperatureHistory.map((temp, index) => ({
        time: `T${index + 1}`,
        temperature: temp,
    }));

    return (
        <div className="w-full h-64 mt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Temperature Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis label={{ value: "Temperature (°C)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="temperature" stroke="#3b82f6" strokeWidth={2} name="Temperature (°C)" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
