"use client";

import React, { useState } from "react";
import { PatientDataTable } from "@/components/table/PatientDataTable"; // Import the new PatientDataTable component
import { patientColumns } from "@/components/table/patientColumns"; // Patient-specific columns

const PatientDataFetcher = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/patientfetch");
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={fetchPatients}
        className="btn-primary"
        disabled={loading}
      >
        {loading ? "Loading..." : "Load Patient Data"}
      </button>

      {patients.length > 0 && (
        <PatientDataTable columns={patientColumns} data={patients} />
      )}
    </div>
  );
};

export default PatientDataFetcher;
