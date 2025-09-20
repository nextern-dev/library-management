// components/Searchbar.tsx
"use client";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

interface SearchbarProps {
  onSearch: (query: string) => Promise<void>;
}

const Searchbar = ({ onSearch }: SearchbarProps) => {
  const t = useTranslations("search");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [query]);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery]);

  const handleSearch = async () => {
    try {
      if (query.trim() === "") {
        toast.info(t("emptySearch"));
        return;
      }
      onSearch(query);
    } catch (error) {
      toast.error(t("somethingWentWrong"));
      console.error("Failed to search", error);
    }
  };

  return (
    <div className="w-full max-w-[100vh] relative">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-6 rounded-full shadow-xl border-2 border-gray-400"
        type="text"
        placeholder={t("placeholder")}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <div
        className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
        onClick={handleSearch}
      >
        <Search className="text-gray-500" />
      </div>
    </div>
  );
};

export default Searchbar;
