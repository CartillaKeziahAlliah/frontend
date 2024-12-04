import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import axios from "axios";

// const apiUrl = "http://localhost:5000";
const apiUrl = "https://server-production-dd7a.up.railway.app";
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A569BD",
  "#D9D9D9",
]; // Added extra color for default values

const UserStatistics = () => {
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    // Fetch statistics from backend
    axios
      .get(`${apiUrl}/api/users/statistics`)
      .then((response) => {
        setStatistics(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching statistics:", error);
      });
  }, []);

  if (!statistics) return <div>Loading...</div>;

  // Prepare the roles and statuses data
  const rolesData = Object.entries(statistics.roles).map(([key, value]) => ({
    name: key,
    value,
  }));

  const statusesData = Object.entries(statistics.statuses).map(
    ([key, value]) => ({
      name: key,
      value,
    })
  );

  // Ensure all roles and statuses are displayed even if the count is zero
  const allRoles = ["student", "admin", "teacher", "masterAdmin"];
  const allStatuses = ["blocked", "Dropped", "Active"];

  // Capitalize names and translate masterAdmin to Master Admin
  const capitalizeName = (name) => {
    if (name === "masterAdmin") return "Master Admin";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Fill missing roles or statuses with count 0 and update display names
  const fillMissingData = (data, allCategories) => {
    return allCategories.map((category) => {
      const existing = data.find((item) => item.name === category);
      const updatedName = capitalizeName(category);
      return existing
        ? { ...existing, name: updatedName }
        : { name: updatedName, value: 0 };
    });
  };

  const updatedRolesData = fillMissingData(rolesData, allRoles);
  const updatedStatusesData = fillMissingData(statusesData, allStatuses);

  return (
    <div className="flex justify-center flex-1 shadow-2xl">
      <div className="flex justify-around flex-row flex-wrap">
        {/* Pie Chart for Roles */}
        <div>
          <PieChart width={500} height={500}>
            <Pie
              data={updatedRolesData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {updatedRolesData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Pie Chart for Statuses */}
        <div>
          <PieChart width={500} height={500}>
            <Pie
              data={updatedStatusesData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {updatedStatusesData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default UserStatistics;
