// components/Navbar.tsx
"use client";
import { HomeIcon, PlusCircleIcon, SquareLibraryIcon } from "lucide-react";
import { SignOut } from "./auth/SignOut";
import { SignIn } from "./auth/SignIn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/[locale]/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import { AnimatedThemeToggler } from "@/app/[locale]/components/ui/animated-theme-toggler";

const Navbar = () => {
  const t = useTranslations("navbar");
  const { data: session } = useSession();
  const pathName = usePathname();

  return (
    <div className="flex justify-between items-center bg-background min-w-100 py-4 px-8 border-b">
      <Link href={"/"}>
        <div className="inline-flex items-center gap-1">
          <SquareLibraryIcon size={35} />
          <p className="font-bold ">{t("library")}</p>
        </div>
      </Link>
      <div>
        {session ? (
          <div className="inline-flex items-center gap-5">
            {pathName === "/create-book" ? (
              <Link
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
                href="/"
              >
                <HomeIcon size={30} />
              </Link>
            ) : (
              <Link
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
                href="/create-book"
              >
                <PlusCircleIcon />
                <p>{t("createBook")}</p>
              </Link>
            )}

            <LanguageSwitcher />

            <AnimatedThemeToggler />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {session?.user?.image && (
                  <Image
                    src={session?.user?.image}
                    alt={session?.user?.name || "User profile picture"}
                    className="rounded-full w-8 h-8"
                    width={30}
                    height={30}
                  />
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent align="center">
                <DropdownMenuLabel>
                  <p className="font-semibold">{session?.user?.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {session?.user?.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <SignOut />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <SignIn />
        )}
      </div>
    </div>
  );
};

export default Navbar;
