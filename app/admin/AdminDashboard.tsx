"use client";

import { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import FilterComponent from "@/components/forms/FilterComponent";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dynamic from "next/dynamic";
import { SortAsc } from "lucide-react";

type AppointmentType = {
  name: string;
  gender: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
  userId: string;
  state: string;
  district: string;
  someValue: number;
};

type AppointmentsType = {
  documents: AppointmentType[];
};

const AdminDashboard = ({
  appointments,
}: {
  appointments: AppointmentsType;
}) => {
  const [filteredData, setFilteredData] = useState<AppointmentType[]>(
    appointments.documents
  );
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  );

  useEffect(() => {
    const data = filteredData.map((app) => ({
      name: app.name,
      value: app.someValue,
    }));
    setChartData(data);
  }, [filteredData]);

  const downloadChartsPDF = async () => {
    const jsPDF = (await import("jspdf")).default;
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();

    // Capture Bar Chart
    const barChartCanvas = document.querySelector(
      ".bar-chart canvas"
    ) as HTMLCanvasElement;
    if (barChartCanvas) {
      const barChartImg = barChartCanvas.toDataURL("image/png");
      doc.addImage(barChartImg, "PNG", 10, 10, 190, 100);
    }

    // Capture Pie Chart
    const pieChartCanvas = document.querySelector(
      ".pie-chart canvas"
    ) as HTMLCanvasElement;
    if (pieChartCanvas) {
      const pieChartImg = pieChartCanvas.toDataURL("image/png");
      doc.addImage(pieChartImg, "PNG", 10, 120, 190, 100);
    }

    doc.save("charts.pdf");
  };

  const downloadTablePDF = async () => {
    const jsPDF = (await import("jspdf")).default;
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    autoTable(doc, { html: "#appointmentsTable" });
    doc.save("appointments_data.pdf");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <SortAsc className="w-8 h-8 mr-2 text-primary" />
        <h1 className="text-3xl font-bold">Data Sorting</h1>
      </div>

      <FilterComponent
        data={appointments.documents}
        setFilteredData={setFilteredData}
      />

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Charts</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow bar-chart">
            <h3 className="text-lg font-medium mb-2">Bar Chart</h3>
            <BarChart
              series={[{ data: chartData.map((item) => item.value) }]}
              xAxis={[
                { data: chartData.map((item) => item.name), scaleType: "band" },
              ]}
              width={500}
              height={300}
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow pie-chart">
            <h3 className="text-lg font-medium mb-2">Pie Chart</h3>
            <PieChart
              series={[
                {
                  data: chartData.map((item) => ({
                    id: item.name,
                    value: item.value,
                  })),
                },
              ]}
              width={300}
              height={300}
            />
          </div>
        </div>
        <Button onClick={downloadChartsPDF} className="mt-4">
          Download Charts as PDF
        </Button>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Appointments Data</h2>
        <Table id="appointmentsTable">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>State</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((appointment, index) => (
              <TableRow key={index}>
                <TableCell>{appointment.name}</TableCell>
                <TableCell>{appointment.gender}</TableCell>
                <TableCell>{appointment.state}</TableCell>
                <TableCell>{appointment.district}</TableCell>
                <TableCell>{appointment.someValue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={downloadTablePDF} className="mt-4">
          Download Table as PDF
        </Button>
      </section>
    </div>
  );
};

export default AdminDashboard;
