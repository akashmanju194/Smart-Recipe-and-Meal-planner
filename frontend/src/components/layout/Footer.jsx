const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container" style={{ textAlign: 'center' }}>
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} SmartRecipe. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
