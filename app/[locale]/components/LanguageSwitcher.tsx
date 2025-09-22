// components/LanguageSwitcher.tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/[locale]/components/ui/select";

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleSelectChange = (newLocale: string) => {
    // Split the pathname to replace the locale segment
    const segments = pathname.split("/");
    const basePath =
      segments.length > 2 ? `/${segments.slice(2).join("/")}` : "/";

    // Navigate to the new URL with the updated locale
    router.push(`/${newLocale}${basePath}`);
  };

  return (
    <Select value={locale} onValueChange={handleSelectChange}>
      <SelectTrigger className="md:w-[30vh] w-[15vh]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="fa">فارسی</SelectItem>
        <SelectItem value="en">English</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
