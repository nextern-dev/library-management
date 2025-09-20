// book/[id]/page.tsx
import { prisma } from "@/prisma";
import BookDetails from "@/app/[locale]/components/BookDetails";

export default async function Book({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id: number = +(await params).id;

  const book = await prisma.book.findUnique({
    where: { id: id },
    include: { author: true },
  });
  return (
    <div>
      <BookDetails book={book} />
    </div>
  );
}
