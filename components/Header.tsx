import Link from "next/link";

const Header = () => {
  return (
    <header className="header">
      <nav className="header-nav">
        <div className="header-links">
          <Link href="/" className="header-link">Home</Link>
          <Link href="/trending" className="header-link">Explore</Link>
        </div>
        <div className="relative flex-grow max-w-xs">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M11.742 10.742a5.5 5.5 0 1 0-1.104 1.104l4.63 4.63a1 1 0 0 0 1.415-1.415l-4.63-4.63zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
            />
          </svg>
        </div>
      </nav>
    </header>
  );
};

export default Header;
