import { z } from "zod";

export const projectNameValidate = z
  .string({ message: "Project name must be a string" })
  .min(3, "Project name must be at least 3 characters long")
  .max(50, "Project name must be at most 50 characters long");

export const columnNameValidate = z
  .string({ message: "Column name must be a string" })
  .min(3, "Column name must be at least 3 characters long")
  .max(50, "Column name must be at most 50 characters long");

export const taskNameValidate = z
  .string({ message: "Task name must be a string" })
  .max(255, "Task name must be at most 255 characters long");

export const columnOrderValidate = z
  .number({ message: "Column order must be a number" })
  .int("Column order must be an integer")
  .positive("Column order must be a positive number");

export const taskOrderValidate = z
  .number({ message: "Task order must be a number" })
  .int("Task order must be an integer")
  .positive("Task order must be a positive number");
