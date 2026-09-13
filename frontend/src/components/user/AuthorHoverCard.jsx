import { useState } from "react";
import AvatarZoomModal from "../ui/AvatarZoomModal";

const AuthorHoverCard = ({ author }) => {
  const [zoomOpen, setZoomOpen] = useState(false);
  if (!author) return null;

  return (
    <>
      <div className="author-hover-card">
        <div 
          className="author-hover-avatar cursor-zoom-in"
          title={author.profilePicUrl ? "Click to zoom profile picture" : ""}
          onClick={(e) => {
            if (author.profilePicUrl) {
              e.preventDefault();
              e.stopPropagation();
              setZoomOpen(true);
            }
          }}
        >
          {author.profilePicUrl ? (
            <img src={author.profilePicUrl} alt={author.name} />
          ) : (
            <div className="author-hover-avatar-placeholder">{author.name?.[0]}</div>
          )}
        </div>
        <div className="author-hover-info">
          <h4>{author.name}</h4>
          <p className="author-hover-username">@{author.username}</p>
          {author.profileBio && <p className="author-hover-bio">{author.profileBio}</p>}
        </div>
      </div>

      <AvatarZoomModal
        isOpen={zoomOpen}
        onClose={() => setZoomOpen(false)}
        imageUrl={author.profilePicUrl}
        name={author.name}
        username={author.username}
      />
    </>
  );
};

export default AuthorHoverCard;

