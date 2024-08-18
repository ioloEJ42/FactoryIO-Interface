import React from "react";
import { Github } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 px-6 bg-background border-t border-border">
      <div className="flex justify-between items-center">
        <a
          href="https://github.com/ioloEJ42"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
        >
          <Github size={20} />
          <span>GitHub</span>
        </a>

        <p className="text-center text-muted-foreground mt-2">
          © {new Date().getFullYear()} Iolo Evans Jones. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
