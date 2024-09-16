// pages/api/patientfetch.ts
import { databases } from "@/lib/appwrite.config";
import type { NextApiRequest, NextApiResponse } from "next";

const fetchPatientsFromDatabase = async (): Promise<any[]> => {
  try {
    const response = await databases.listDocuments(
      process.env.DATABASE_ID!,
      process.env.PATIENT_COLLECTION_ID!
    );
    return response.documents; // Adjust this based on your response structure
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw new Error("Failed to fetch patients");
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const patients = await fetchPatientsFromDatabase();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
