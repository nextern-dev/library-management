// lib/book.ts
import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  isbn: z.string().optional(),
  cover: z.string().url("Invalid image URL").optional(),
  published: z.string().optional(),
  author: z.string().min(1, "Author is required"),
});

export const editBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  isbn: z.string().optional(),
  cover: z.string().url("Invalid image URL").optional(),
  published: z.string().optional(),
  author: z.string().min(1, "Author is required"),
});
