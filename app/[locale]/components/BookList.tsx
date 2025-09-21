// components/BookList.tsx
"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/[locale]/components/ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/[locale]/components/ui/avatar";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/[locale]/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/[locale]/components/ui/dialog";
import { Input } from "@/app/[locale]/components/ui/input";
import { Label } from "@/app/[locale]/components/ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import Searchbar from "./Searchbar";
import { LibraryIcon, Pencil, Trash2 } from "lucide-react";
import { editBookSchema } from "@/lib/bookSchema";
import { useTranslations, useLocale } from "next-intl";
import { Book } from "@/types/book";

const BookList = () => {
  const t = useTranslations("book");
  const tErrors = useTranslations("Validations");
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState({
    title: "",
    description: "",
    category: "",
    isbn: "",
    cover: "",
    published: "",
    author: "",
  });

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books");
      const data = await response.json();

      if (response.ok) {
        setBooks(data);
      } else {
        if (session?.user) {
          toast.error("Failed to fetch books");
        }
      }
    } catch (error) {
      toast.error("Something went wrong while fetching books!");
      console.error("Failed to fetch books", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <p className="text-center text-2xl font-semibold">{t("pleaseSignIn")}</p>
    );
  }

  if (books.length === 0) {
    return (
      <p className="text-center text-2xl font-semibold">{t("noBookFound")}</p>
    );
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.success(t("bookDeletedSuccess"));
        await fetchBooks();
      } else {
        toast.error(t("bookDeletedFailed"));
      }
    } catch (error) {
      toast.error(t("somethingWentWrong"));
      console.error("Failed to delete books", error);
    }
  };

  const handleEdit = async (id: number) => {
    const bookData = {
      title: editingBook.title,
      description: editingBook.description,
      category: editingBook.category,
      isbn: editingBook.isbn,
      cover: editingBook.cover,
      published: editingBook.published,
      author: editingBook.author,
    };

    const validation = editBookSchema.safeParse(bookData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      toast.error(tErrors("pleaseCorrectErrors"));
      return;
    }
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      if (response.ok) {
        toast.success(t("bookUpdatedSuccess"));
        await fetchBooks();
      } else {
        toast.error(t("bookUpdatedFailed"));
      }
    } catch (error) {
      toast.error(t("somethingWentWrong"));
      console.error("Failed to edit books", error);
    }
  };

  const openEditForm = (book: Book) => {
    setEditingBook({
      title: book.title,
      description: book.description!,
      category: book.category!,
      isbn: book.isbn,
      cover: book.cover!,
      published: book.published.toISOString().slice(0, 10),
      author: book.author.name,
    });
  };

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(
        `/api/books?query=${encodeURIComponent(query)}`
      );

      if (response.ok) {
        const data = await response.json();
        setBooks(data);
        if (data.length === 0) {
          toast.warning(t("noBooksFound"));
          await fetchBooks();
        }
      } else {
        toast.error(t("searchFailed"));
      }
    } catch (error) {
      toast.error(t("somethingWentWrong"));
      console.error("Failed to search books", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10 min-w-full">
      <Searchbar onSearch={handleSearch} />
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 min-w-full ">
        {books.map((book: Book) => (
          <li key={book.id}>
            <Card className="flex flex-col min-w-full transition-all duration-300 hover:shadow-xl">
              <CardHeader className="flex flex-col items-center text-center">
                <Avatar className="w-full h-fit border-2 border-primary rounded-xl overflow-hidden">
                  {book.cover ? (
                    <AvatarImage
                      className="object-cover w-full h-full"
                      src={book.cover}
                      alt={book.title}
                    />
                  ) : (
                    <AvatarFallback className="flex items-center justify-center w-full h-fit text-xl">
                      <LibraryIcon size={50} />
                    </AvatarFallback>
                  )}
                </Avatar>

                <CardTitle className="text-lg font-semibold line-clamp-1">
                  {book.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground line-clamp-1">
                  {book.author.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm line-clamp-2 text-justify ">
                  {book.description}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center gap-2">
                <Button asChild className="flex-1">
                  <Link href={`/book/${book.id}`}>{t("details")}</Link>
                </Button>
                <div className="flex items-center gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("deleteDescription")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(book.id)}
                        >
                          {t("delete")}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditForm(book)}
                      >
                        <Pencil className="h-5 w-5 text-blue-500" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className=" my-auto">
                      <DialogHeader>
                        <DialogTitle>{t("editBook")}</DialogTitle>
                        <DialogDescription>
                          {t("editBookDescription")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-3">
                          <Label htmlFor="author">{t("author")}</Label>
                          <Input
                            required
                            value={editingBook.author}
                            onChange={(e) =>
                              setEditingBook({
                                ...editingBook,
                                author: e.target.value,
                              })
                            }
                            type="text"
                            id="author"
                            name="author"
                          />
                          {errors.author && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.author[0]}
                            </p>
                          )}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="title_fa">{t("title")}</Label>
                          <Input
                            required
                            value={editingBook.title}
                            onChange={(e) =>
                              setEditingBook({
                                ...editingBook,
                                title: e.target.value,
                              })
                            }
                            type="text"
                            id="title_fa"
                            name="title_fa"
                          />
                          {errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.title[0]}
                            </p>
                          )}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="description">
                            {t("description")}
                          </Label>
                          <Textarea
                            className="overflow-auto h-[10vh]"
                            placeholder={t("description")}
                            value={editingBook.description}
                            onChange={(e) =>
                              setEditingBook({
                                ...editingBook,
                                description: e.target.value,
                              })
                            }
                          />
                          {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.description[0]}
                            </p>
                          )}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="category">{t("category")}</Label>
                          <Input
                            required
                            value={editingBook.category}
                            onChange={(e) =>
                              setEditingBook({
                                ...editingBook,
                                category: e.target.value,
                              })
                            }
                            type="text"
                            id="category"
                            name="category"
                          />
                          {errors.category && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.category[0]}
                            </p>
                          )}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="isbn">{t("isbn")}</Label>
                          <Input
                            required
                            value={editingBook.isbn}
                            onChange={(e) =>
                              setEditingBook({
                                ...editingBook,
                                isbn: e.target.value,
                              })
                            }
                            type="text"
                            id="isbn"
                            name="isbn"
                          />
                          {errors.isbn && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.isbn[0]}
                            </p>
                          )}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="cover">{t("cover")}</Label>
                          <Input
                            value={editingBook.cover}
                            onChange={(e) =>
                              setEditingBook({
                                ...editingBook,
                                cover: e.target.value,
                              })
                            }
                            type="text"
                            id="cover"
                            name="cover"
                          />
                          {errors.cover && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.cover[0]}
                            </p>
                          )}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="published">{t("published")}</Label>
                          <Input
                            required
                            value={editingBook.published}
                            onChange={(e) =>
                              setEditingBook({
                                ...editingBook,
                                published: e.target.value,
                              })
                            }
                            type="date"
                            id="published"
                            name="published"
                          />
                          {errors.published && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.published[0]}
                            </p>
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">{t("cancel")}</Button>
                        </DialogClose>
                        <Button
                          type="button"
                          onClick={() => handleEdit(book.id)}
                        >
                          {t("saveChanges")}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
