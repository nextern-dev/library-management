// components/BookDetails.tsx
"use client";
import { ArrowLeft, LibraryIcon } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/[locale]/components/ui/accordion";
import { useTranslations, useLocale } from "next-intl"; // اضافه کردن useTranslations و useLocale
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Book } from "@/types/book";
import { useSession } from "next-auth/react";

interface BookDetailsProps {
  book: Book | null;
}

const BookDetails = ({ book }: BookDetailsProps) => {
  const t = useTranslations("book");
  const locale = useLocale();
  const { data: session } = useSession();

  if (!book) {
    return (
      <div className="text-center text-2xl font-semibold">
        {t("bookNotFound")}
      </div>
    );
  }

  return (
    <div className="container max-w-5xl min-h-screen mx-auto p-8">
      <div className="flex flex-col items-center gap-6">
        <Avatar className="w-100">
          {session?.user?.image && session?.user?.name && (
            <AvatarImage
              className="object-fill border-2 border-primary rounded-xl"
              src={session.user.image}
              alt={session.user.name}
            />
          )}
          <AvatarFallback className="text-xl">
            <LibraryIcon size={50} />
          </AvatarFallback>
        </Avatar>

        <div className="text-center space-y-2">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            {book.title}
          </h1>
          <p className="text-muted-foreground text-lg italic">
            {book?.author.name}
          </p>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-lg lg:text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
          {book.description}
        </p>
      </div>

      <div className="w-full mt-12">
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem
            value="item-1"
            className="rounded-xl border border-border bg-card px-4"
          >
            <AccordionTrigger className="font-semibold text-lg">
              {t("category")}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {book.category}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            className="rounded-xl border border-border bg-card px-4"
          >
            <AccordionTrigger className="font-semibold text-lg">
              {t("isbn")}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {book.isbn}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            className="rounded-xl border border-border bg-card px-4"
          >
            <AccordionTrigger className="font-semibold text-lg">
              {t("published")}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {new Date(book.published).toLocaleDateString(locale)}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="flex justify-center mt-12">
        <Link
          className="flex items-center gap-2 text-muted-foreground hover:text-primary font-semibold transition-colors"
          href={`/`}
        >
          <ArrowLeft size={22} />
          {t("goBack")}
        </Link>
      </div>
    </div>
  );
};

export default BookDetails;
