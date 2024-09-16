// pages/api/fetchPatients.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Client, Databases } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_ENDPOINT || "";
const projectId = process.env.PROJECT_ID!;
const collectionId = process.env.PATIENT_COLLECTION_ID!;
const databaseId = process.env.DATABASE_ID!; // Ensure you are using DATABASE_ID

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(process.env.API_KEY!); // Set API key if needed

const databases = new Databases(client);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Ensure you're passing the correct database ID
    const response = await databases.listDocuments(databaseId, collectionId);
    res.status(200).json(response.documents);
  } catch (error) {
    console.error("Error fetching patients:", error); // Log detailed error
    res.status(500).json({
      error: "Failed to fetch data",
      details: (error as Error).message,
    });
  }
}
