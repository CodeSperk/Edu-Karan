"use client";
import { Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-muted/30 mt-auto shrink-0">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground order-2 md:order-1 text-center md:text-left">
          &copy; {new Date().getFullYear()} MR EduKaron. All rights reserved. <br className="md:hidden" />
          <span className="font-semibold text-primary">Developed by Mahbubur Rahman</span>
        </div>
        
        <div className="flex items-center gap-6 order-1 md:order-2 text-sm text-muted-foreground">
           <a href="tel:+8801521251146" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="w-4 h-4" /> 01521251146
           </a>
           <a href="mailto:inbx.mahbub@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="w-4 h-4" /> inbx.mahbub@gmail.com
           </a>
        </div>
      </div>
    </footer>
  );
}
