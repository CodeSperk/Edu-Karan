import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { GraduationCap } from "lucide-react";
import { GlobalSearch } from "./GlobalSearch";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center gap-4 lg:gap-8 justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg lg:text-xl text-primary shrink-0 transition-transform hover:scale-105">
          <div className="bg-primary/10 p-1.5 rounded-lg text-primary"><GraduationCap className="h-5 w-5 md:h-6 md:w-6" /></div>
          <span className="hidden sm:inline font-heading tracking-tight">MR EduKaron</span>
        </Link>
        
        <div className="flex-1 flex justify-center max-w-xl mx-auto w-full">
           <GlobalSearch />
        </div>

        <div className="flex items-center justify-end space-x-2 md:space-x-4 shrink-0">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
