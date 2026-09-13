import { X } from "lucide-react";
import { useEffect } from "react";

const AvatarZoomModal = ({ isOpen, onClose, imageUrl, name, username }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div 
      className="avatar-zoom-overlay"
      onClick={onClose}
    >
      <div 
        className="avatar-zoom-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="avatar-zoom-close"
          aria-label="Close zoomed view"
        >
          <X size={20} />
        </button>

        <div className="avatar-zoom-frame">
          <img 
            src={imageUrl} 
            alt={name || "Author Profile Picture"} 
          />
        </div>

        {name && <h3 className="avatar-zoom-name">{name}</h3>}
        {username && <p className="avatar-zoom-username">@{username}</p>}
        <p className="avatar-zoom-hint">Click outside or press ESC to close</p>
      </div>
    </div>
  );
};

export default AvatarZoomModal;

