/**
 * Footer Component
 * Simple footer with copyright and app information
 */
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>
          &copy; {new Date().getFullYear()} Task Manager. All rights reserved.
        </p>
        <p>Built with React & Node.js</p>
      </div>
    </footer>
  );
};

export default Footer;
