import Link from "next/link";
import { buttonVariants } from "../ui/Button";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-500"></div>
            <span className="font-bold text-xl text-foreground">Postulate</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#about" className="hover:text-foreground transition-colors">About</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            Log in
          </Link>
          <Link href="/register" className={buttonVariants({ variant: "primary" })}>
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
