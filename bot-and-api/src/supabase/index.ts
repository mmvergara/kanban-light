import type { Database } from "./supabase-types";
import { createClient } from "@supabase/supabase-js";
import config from "../config";

export const supabase = createClient<Database>(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_KEY
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
