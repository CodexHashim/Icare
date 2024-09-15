"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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

type FilterComponentProps = {
  data: AppointmentType[];
  setFilteredData: React.Dispatch<React.SetStateAction<AppointmentType[]>>;
};

export default function FilterComponent({
  data,
  setFilteredData,
}: FilterComponentProps) {
  const [filters, setFilters] = useState({
    gender: "all",
    state: "",
    district: "",
    name: "",
  });

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    const filtered = data.filter((item) => {
      const matchGender =
        filters.gender === "all" ||
        item.gender.toLowerCase() === filters.gender.toLowerCase();
      const matchState =
        filters.state === "" ||
        item.state.toLowerCase().includes(filters.state.toLowerCase());
      const matchDistrict =
        filters.district === "" ||
        item.district.toLowerCase().includes(filters.district.toLowerCase());
      const matchName =
        filters.name === "" ||
        item.name.toLowerCase().includes(filters.name.toLowerCase());
      return matchGender && matchState && matchDistrict && matchName;
    });
    setFilteredData(filtered);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Filter Appointments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={filters.gender}
            onValueChange={(value) => handleFilterChange("gender", value)}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            type="text"
            value={filters.state}
            onChange={(e) => handleFilterChange("state", e.target.value)}
            placeholder="Enter state"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">District</Label>
          <Input
            id="district"
            type="text"
            value={filters.district}
            onChange={(e) => handleFilterChange("district", e.target.value)}
            placeholder="Enter district"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
            placeholder="Enter name"
          />
        </div>
      </div>

      <Button onClick={applyFilters} className="mt-4">
        Apply Filters
      </Button>
    </div>
  );
}
