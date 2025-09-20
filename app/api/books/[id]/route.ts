// app/api/books/[id]/route.ts
import { auth } from "@/auth";
import { editBookSchema } from "@/lib/bookSchema";
import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const bookId = Number((await context.params).id);
    const userId = session.user?.id;

    const myBook = await prisma.book.findFirst({
      where: { id: bookId, userId },
    });

    if (!myBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    await prisma.book.delete({ where: { id: bookId } });

    return NextResponse.json(
      { message: "Book successfully deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const bookId = Number((await context.params).id);
    const userId = session.user?.id;

    const validation = editBookSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    let author = await prisma.author.findUnique({
      where: { name: validatedData.author },
    });

    if (!author) {
      author = await prisma.author.create({
        data: { name: validatedData.author },
      });
    }

    const myBook = await prisma.book.findFirst({
      where: { id: bookId, userId },
    });

    if (!myBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        isbn: validatedData.isbn,
        cover: validatedData.cover,
        published: validatedData.published
          ? new Date(validatedData.published)
          : undefined,
        author: { connect: { id: author.id } },
        user: { connect: { id: userId } },
      },
    });

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Failed to edit" }, { status: 500 });
  }
}
