// AdminDashboard.tsx
"use client";

import { useState } from "react";
import { DataTable } from "./table/DataTable"; // Adjust based on your file structure
import { columns } from "./table/columns"; // Adjust based on your file structure
import { Patient } from "@/types/appwrite.types"; // Adjust based on your types

interface AdminDashboardProps {
  appointments: Patient[]; // Define the prop type here
}

const AdminDashboard = ({ appointments }: AdminDashboardProps) => {
  // Use the prop
  const [patients, setPatients] = useState<Patient[]>(appointments); // Initialize with props or fetch data
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoadData = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/fetchPatients");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleLoadData}
        disabled={loading}
        className="btn px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Loading..." : "Load Data"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {patients.length > 0 && (
        <div className="mt-4">
          <h2 className="text-2xl font-semibold mb-4">Patients Data</h2>
          <DataTable columns={columns} data={patients} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
