// auth/SignOut.tsx
"use client";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export function SignOut() {
  const t = useTranslations("navbar");

  return (
    <Button
      className="p-2 cursor-pointer  w-full"
      variant={"destructive"}
      onClick={() => signOut({ redirectTo: "/" })}
    >
      {t("signOut")}
    </Button>
  );
}
