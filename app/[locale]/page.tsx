// app/[locale]/page.tsx
import { auth } from "@/auth";
import BookList from "./components/BookList";

export default async function Home() {
  return (
    <div className="p-10">
      <BookList />
    </div>
  );
}
