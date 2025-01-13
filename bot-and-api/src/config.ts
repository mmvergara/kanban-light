import process from "node:process";

if (!process.env.SUPABASE_URL) {
  throw new Error("Missing SUPABASE_URL");
}
if (!process.env.SUPABASE_SERVICE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_KEY");
}
if (!process.env.BOT_TOKEN) {
  throw new Error("Please provide a BOT_TOKEN environment variable");
}
if (!process.env.BOT_APPLICATION_ID) {
  throw new Error("Please provide a BOT_APPLICATION_ID environment variable");
}

export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
export const BOT_TOKEN = process.env.BOT_TOKEN;
export const BOT_APPLICATION_ID = process.env.BOT_APPLICATION_ID;
