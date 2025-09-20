// auth/SignIn.tsx
"use client";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export function SignIn() {
  const t = useTranslations("navbar");

  return (
    <Button onClick={() => signIn("google", { redirectTo: "/" })}>
      {t("signIn")}
    </Button>
  );
}
