// components/BookCreateForm.tsx
"use client";
import { Button } from "@/app/[locale]/components/ui/button";
import { Input } from "@/app/[locale]/components/ui/input";
import { Textarea } from "@/app/[locale]/components/ui/textarea";
import { createBookSchema } from "@/lib/bookSchema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const BookCreateForm = () => {
  const t = useTranslations("book");
  const tErrors = useTranslations("Validations");

  const [createdBook, setCreatedBook] = useState({
    author: "",
    title: "",
    description: "",
    category: "",
    isbn: "",
    cover: "",
    published: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const router = useRouter();

  const handleCreate = async () => {
    const bookData = {
      title: createdBook.title,
      description: createdBook.description,
      category: createdBook.category,
      isbn: createdBook.isbn,
      cover: createdBook.cover,
      published: createdBook.published,
      author: createdBook.author,
    };
    const validation = createBookSchema.safeParse(bookData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      toast.error(tErrors("pleaseCorrectErrors"));
      return;
    }

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      if (response.ok) {
        toast.success(t("bookCreatedSuccess"));
        router.push("/");
      } else {
        const errorData = await response.json();
        if (response.status === 400 && errorData.error) {
          setErrors(errorData.error);
          toast.error(tErrors("pleaseCorrectErrors"));
        } else {
          toast.error(t("bookCreationFailed"));
        }
      }
    } catch (error) {
      toast.error(t("somethingWentWrong"));
      console.error("Failed to create book", error);
    }
  };
  return (
    <div className="container max-w-xl mx-auto p-10 text-center">
      <h2 className="text-2xl font-bold mb-10 text-center">
        {t("createBook")}
      </h2>
      <div className="flex flex-col gap-4">
        <div>
          <Input
            type="text"
            placeholder={t("author")}
            id="author"
            value={createdBook.author}
            onChange={(e) =>
              setCreatedBook({ ...createdBook, author: e.target.value })
            }
          />
          {errors.author && (
            <p className="text-red-500 text-sm mt-1">
              {tErrors(errors.author[0])}
            </p>
          )}
        </div>
        <div>
          <Input
            type="text"
            placeholder={t("title")}
            id="title"
            value={createdBook.title}
            onChange={(e) =>
              setCreatedBook({ ...createdBook, title: e.target.value })
            }
          />
          {errors.title_en && (
            <p className="text-red-500 text-sm mt-1">
              {tErrors(errors.title_en[0])}
            </p>
          )}
        </div>

        <div>
          <Textarea
            placeholder={t("description")}
            id="description"
            value={createdBook.description}
            onChange={(e) =>
              setCreatedBook({ ...createdBook, description: e.target.value })
            }
          />
          {errors.description_fa && (
            <p className="text-red-500 text-sm mt-1">
              {tErrors(errors.description_fa[0])}
            </p>
          )}
        </div>

        <div>
          <Input
            type="text"
            placeholder={t("category")}
            id="category"
            value={createdBook.category}
            onChange={(e) =>
              setCreatedBook({ ...createdBook, category: e.target.value })
            }
          />
          {errors.category_en && (
            <p className="text-red-500 text-sm mt-1">
              {tErrors(errors.category_en[0])}
            </p>
          )}
        </div>

        <div>
          <Input
            type="text"
            placeholder={t("isbn")}
            id="isbn"
            value={createdBook.isbn}
            onChange={(e) =>
              setCreatedBook({ ...createdBook, isbn: e.target.value })
            }
          />
          {errors.isbn && (
            <p className="text-red-500 text-sm mt-1">
              {tErrors(errors.isbn[0])}
            </p>
          )}
        </div>
        <div>
          <Input
            type="text"
            placeholder={t("cover")}
            id="cover"
            value={createdBook.cover}
            onChange={(e) =>
              setCreatedBook({ ...createdBook, cover: e.target.value })
            }
          />
          {errors.cover && (
            <p className="text-red-500 text-sm mt-1">
              {tErrors(errors.cover[0])}
            </p>
          )}
        </div>
        <div>
          <Input
            type="date"
            placeholder={t("published")}
            id="published"
            value={createdBook.published}
            onChange={(e) =>
              setCreatedBook({ ...createdBook, published: e.target.value })
            }
          />
          {errors.published && (
            <p className="text-red-500 text-sm mt-1">
              {tErrors(errors.published[0])}
            </p>
          )}
        </div>

        <Button onClick={() => handleCreate()} type="button">
          {t("submit")}
        </Button>
      </div>
    </div>
  );
};

export default BookCreateForm;
