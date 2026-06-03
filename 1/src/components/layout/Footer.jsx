import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>
          Made with <Heart size={14} className="footer-heart" /> by SmartRecipe Team &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
