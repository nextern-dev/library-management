// app/api/books/route.ts
import { auth } from "@/auth";
import { createBookSchema } from "@/lib/bookSchema";
import { prisma } from "@/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const userId = req.auth.user?.id;
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    let books;

    if (query) {
      books = await prisma.book.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { category: { contains: query, mode: "insensitive" } },
            { isbn: { contains: query, mode: "insensitive" } },
            { author: { name: { contains: query, mode: "insensitive" } } },
          ],
        },
        include: { author: true },
        orderBy: { createdAt: "desc" },
      });
    } else {
      books = await prisma.book.findMany({
        where: { userId },
        include: { author: true },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
});

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const validation = createBookSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.message, { status: 400 });
    }
    const validatedData = validation.data;
    let author = await prisma.author.findUnique({
      where: { name: validatedData.author },
    });
    const userId = req.auth.user?.id;

    if (!author) {
      author = await prisma.author.create({
        data: { name: validatedData.author },
      });
    }
    const books = await prisma.book.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        isbn: validatedData.isbn!,
        cover: validatedData.cover,
        published: new Date(validatedData.published!),
        author: { connect: { id: author.id } },
        user: { connect: { id: userId } },
      },
    });
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
});
