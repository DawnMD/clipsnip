import { type PropsWithChildren } from "react";
import { Moon, Sun, Loader2, PanelLeftOpen } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Link from "next/link";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  ClerkLoading,
} from "@clerk/nextjs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { dark } from "@clerk/themes";

export const Layout = ({ children }: PropsWithChildren) => {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <header className="supports-backdrop-blur:bg-background/60 fixed top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex items-center gap-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <PanelLeftOpen className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>ClipSnip</SheetTitle>
                  </SheetHeader>
                  <SheetDescription></SheetDescription>
                </SheetContent>
              </Sheet>

              <Link href="/" className="hidden font-bold md:inline-block">
                ClipSnip
              </Link>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-2">
              <nav className="flex items-center gap-6">
                {/* <div className="hidden items-center gap-2 md:flex">
                  <Button asChild variant="link" size="default">
                    <Link href="/tils">All Tils</Link>
                  </Button>
                  <SignedIn>
                    <Button asChild variant="link" size="default">
                      <Link href="/my-tils">My Tils</Link>
                    </Button>
                    <Button asChild variant="link" size="default">
                      <Link href="/create-til">Create Til</Link>
                    </Button>
                  </SignedIn>
                </div> */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <ClerkLoading>
                  <Button variant="outline" size="icon">
                    <Loader2 className="h-[1.2rem] w-[1.2rem] animate-spin" />
                    <span className="sr-only">User Loading</span>
                  </Button>
                </ClerkLoading>
                <SignedOut>
                  <Button variant="default" size="sm" asChild>
                    <SignInButton
                      afterSignInUrl="/dashboard"
                      afterSignUpUrl="/dashboard"
                    />
                  </Button>
                </SignedOut>
                <SignedIn>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      baseTheme: resolvedTheme === "dark" ? dark : undefined,
                      userProfile: {
                        baseTheme: resolvedTheme === "dark" ? dark : undefined,
                      },
                    }}
                  />
                </SignedIn>
              </nav>
            </div>
          </div>
        </header>
        <div className="relative mt-14 flex-1 p-8">{children}</div>
      </div>
    </>
  );
};
