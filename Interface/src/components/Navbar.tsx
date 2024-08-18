import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, ExternalLink } from "lucide-react";

const NavItem: React.FC<{
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  external?: boolean;
}> = ({ to, children, onClick, external }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <li>
      <Link
        to={to}
        className={`flex items-center p-2 rounded-md transition-colors
          ${
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        onClick={onClick}
        {...linkProps}
      >
        {children}
        {external && <ExternalLink size={16} className="ml-2" />}
      </Link>
    </li>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="md:hidden flex justify-between items-center p-4 bg-background border-b border-border">
        <h1 className="text-xl font-bold text-foreground">
          Factory I/O Web Interface
        </h1>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <button onClick={toggleMenu} className="text-foreground">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <nav
        className={`
        md:w-64 md:flex-shrink-0 md:block
        fixed md:static inset-y-0 left-0 
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition duration-200 ease-in-out
        z-30 bg-background border-r border-border h-full
      `}
      >
        <div className="flex flex-col h-full">
          <div className="hidden md:block p-4">
            <h1 className="text-xl font-bold text-foreground">
              Factory I/O Web Interface
            </h1>
          </div>
          <div className="flex-grow overflow-y-auto">
            <ul className="space-y-2 p-4">
              <NavItem to="/" onClick={toggleMenu}>
                Tag Management
              </NavItem>
              <NavItem to="/monitoring" onClick={toggleMenu}>
                Real-time Monitoring
              </NavItem>
              <NavItem to="/control" onClick={toggleMenu}>
                Process Control
              </NavItem>
              <NavItem to="/simulation" onClick={toggleMenu}>
                Failure Simulation
              </NavItem>
              <NavItem to="/grouping" onClick={toggleMenu}>
                Tag Grouping
              </NavItem>
              <NavItem
                to="https://docs.factoryio.com/manual/"
                onClick={toggleMenu}
                external
              >
                Factory I/O Manual
              </NavItem>
            </ul>
          </div>
          <div className="p-4 md:block hidden">
            <ThemeToggle />
          </div>
        </div>
      </nav>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
};

export default Navbar;
