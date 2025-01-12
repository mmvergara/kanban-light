import type { Database } from "./supabase-types";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_SERVICE_KEY, SUPABASE_URL } from "../config";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY
);

export const pingDb = async () => {
  const beforeQuery = Date.now();
  const { statusText } = await supabase.from("tasks").select("id").limit(1);
  if (statusText !== "OK") {
    throw new Error("Failed to ping database");
  }
  const afterQuery = Date.now();
  const latency = afterQuery - beforeQuery;
  console.info(`Database Latency: ${latency}ms`);
};
