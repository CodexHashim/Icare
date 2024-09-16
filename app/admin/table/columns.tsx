import { ColumnDef } from "@tanstack/react-table";
import { Patient } from "@/types/appwrite.types"; // Adjust the import based on your types

export const columns: ColumnDef<Patient>[] = [
  {
    header: "#",
    cell: ({ row }) => (
      <p className="text-14-medium w-[50px] text-center">{row.index + 1}</p> // Adjust width for index column
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <p className="text-14-medium w-[150px]">{row.original.name}</p> // Set width for Name column
    ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => (
      <p className="text-14-medium w-[100px]">{row.original.gender}</p> // Set width for Gender column
    ),
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => (
      <p className="text-14-medium w-[120px]">{row.original.state}</p> // Set width for State column
    ),
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => (
      <p className="text-14-medium w-[120px]">{row.original.city}</p> // Set width for City column
    ),
  },
  {
    accessorKey: "someValue",
    header: "Value",
    cell: ({ row }) => (
      <p className="text-14-medium w-[100px]">{row.original.someValue}</p> // Set width for Value column
    ),
  },
  {
    accessorKey: "someValue",
    header: "Value",
    cell: ({ row }) => (
      <p className="text-14-medium w-[100px]">{row.original.someValue}</p> // Set width for Value column
    ),
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => (
      <div className="flex gap-1 w-[150px]">
        {" "}
        {/* Set width for Actions column */}
        {/* Add any action buttons or modals if needed */}
      </div>
    ),
  },
];
