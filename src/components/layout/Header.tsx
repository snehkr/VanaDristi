import { Link, NavLink, type NavLinkProps } from "react-router-dom";
import {
  Leaf,
  LayoutDashboard,
  ListTree,
  ScanSearch,
  History,
} from "lucide-react";

const Header = (): React.ReactElement => {
  const navLinkClasses: NavLinkProps["className"] = ({ isActive }) =>
    `transition-colors p-2 rounded-lg ${
      isActive
        ? "bg-green-100/80 text-green-900"
        : "text-stone-600 hover:bg-green-100/50 hover:text-green-800"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/60 backdrop-blur-lg">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="w-8 h-8 text-green-700" />
          <span className="hidden sm:inline text-2xl font-bold text-green-900">
            VanaDristi
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Dashboard Icon Link with Tooltip */}
          <NavLink to="/" className={navLinkClasses} title="Dashboard">
            <LayoutDashboard className="h-5 w-5" />
          </NavLink>

          {/* Manage Plants Icon Link with Tooltip */}
          <NavLink
            to="/manage-plants"
            className={navLinkClasses}
            title="Manage Plants"
          >
            <ListTree className="h-5 w-5" />
          </NavLink>

          {/* Identify Plant Icon Link with Tooltip */}
          <NavLink
            to="/identify"
            className={navLinkClasses}
            title="Identify Plant"
          >
            <ScanSearch className="h-5 w-5" />
          </NavLink>
          {/* NavLink for Identification History */}
          <NavLink
            to="/identifications"
            className={navLinkClasses}
            title="Identification History"
          >
            <History className="h-5 w-5" />
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Header;
