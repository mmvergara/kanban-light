import type { Collection } from "discord.js";
import process from "node:process";
import { z } from "zod";

declare module "discord.js" {
  export interface Client {
    commands: Collection<
      string,
      {
        data: import("discord.js").SlashCommandBuilder;
        execute: (
          interaction: import("discord.js").ChatInputCommandInteraction
        ) => Promise<void>;
      }
    >;
  }
}

const envSchema = z.object({
  SUPABASE_URL: z.string().nonempty(),
  SUPABASE_SERVICE_KEY: z.string().nonempty(),
  BOT_TOKEN: z.string().nonempty(),
  BOT_APPLICATION_ID: z.string().nonempty(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  throw new Error(
    `Missing environment variables: ${env.error.errors
      .map(e => e.path.join("."))
      .join(", ")}`
  );
}

export default env.data;
