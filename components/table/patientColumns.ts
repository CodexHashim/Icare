// components/table/patientColumns.ts
import { ColumnDef } from "@tanstack/react-table"; // or the appropriate type import

export const patientColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "userId",
    header: "User ID",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "occupation",
    header: "Occupation",
  },
];
