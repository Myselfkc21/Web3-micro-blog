import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-03-05",
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  useCdn: false,
});
