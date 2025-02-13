import { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";
import { FaThermometerHalf, FaRegNewspaper, FaChartBar } from "react-icons/fa";
import "../styles/statscharts.css";

// Function to format UTC time only
const formatDateToUTC = (date) => {
    const utcDate = new Date(date);
    return (
        utcDate.toLocaleString("en-GB", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }) + " UTC"
    );
};

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [trends, setTrends] = useState([]);
    const [incidentsByType, setIncidentsByType] = useState([]);

    useEffect(() => {
        axios
            .get("https://localhost:7259/api/incidents/stats")
            .then((response) => setStats(response.data))
            .catch((error) => console.error("Error fetching stats:", error));

        axios
            .get("https://localhost:7259/api/incidents/trends")
            .then((response) => setTrends(response.data))
            .catch((error) => console.error("Error fetching trends:", error));

        axios
            .get("https://localhost:7259/api/incidents/by-type")
            .then((response) => setIncidentsByType(response.data))
            .catch((error) =>
                console.error("Error fetching incidents by type:", error)
            );
    }, []);

    const COLORS = ["#FF5733", "#FFB833", "#28A745", "#007BFF", "#6F42C1"];

    return (
        <div className="bg-gray-900 min-h-screen p-8 text-white font-sans">
            <h1 className="text-5xl font-extrabold text-center text-black mb-10">
                🚨 Crisis Trends & Impact Dashboard
            </h1>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Total Incidents */}
                <div className="card bg-gray-800 p-6 rounded-lg shadow-lg text-center transition-transform hover:scale-105">
                    <FaThermometerHalf className="text-6xl mb-4 mx-auto text-white" />
                    <h2 className="text-3xl font-semibold mb-2">
                        Total Incidents
                    </h2>
                    <p className="text-5xl font-bold">
                        {stats?.totalIncidents || 0}
                    </p>
                </div>

                {/* Most Affected Regions */}
                <div className="card bg-gray-800 p-6 rounded-lg shadow-lg transition-transform hover:scale-105">
                    <FaRegNewspaper className="text-6xl mb-4 mx-auto text-white" />
                    <h2 className="text-3xl font-semibold mb-2 text-center">
                        Most Affected Regions
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-left text-gray-200">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-2">Region</th>
                                    <th className="p-2">Reports</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.mostAffectedRegions?.map(
                                    (region, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="p-2">
                                                {region.region}
                                            </td>
                                            <td className="p-2">
                                                {region.count}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Incident Trends Chart */}
                <div className="chart-container bg-gray-800 p-6 rounded-lg shadow-lg transition-transform hover:scale-105">
                    <h2 className="text-3xl font-semibold mb-6 text-center text-gray-100">
                        <FaChartBar className="inline-block mr-2 text-blue-500" />
                        Incident Trends Over Time
                    </h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={trends}>
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDateToUTC}
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={150}
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Incidents by Type Chart */}
                <div className="chart-container bg-gray-800 p-6 rounded-lg shadow-lg transition-transform hover:scale-105">
                    <h2 className="text-3xl font-semibold mb-6 text-center text-gray-100">
                        <FaChartBar className="inline-block mr-2 text-green-500" />
                        Incidents by Type
                    </h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={incidentsByType}
                                dataKey="count"
                                nameKey="disasterType"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                fill="#82ca9d"
                                label
                            >
                                {incidentsByType.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center mt-12 text-gray-400">
                <p>
                    &copy; 2025 Disaster Management, Inc. All Rights Reserved.
                </p>
            </footer>
        </div>
    );
};

export default Dashboard;
