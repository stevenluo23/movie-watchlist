import { Logo } from "./Logo";

// NavBar section //
// Stateful component
export function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
