import Header from "./Header";
import Footer from "./Footer";

/**
 * Main Layout Component
 * Wraps all pages with header and footer
 * Provides consistent layout across the application
 */
const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
