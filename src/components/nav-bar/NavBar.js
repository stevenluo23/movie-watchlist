import Logo from "./Logo";

// NavBar section //
// Stateful component
export default function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
