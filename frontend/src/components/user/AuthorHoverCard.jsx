const AuthorHoverCard = ({ author }) => {
  if (!author) return null;

  return (
    <div className="author-hover-card">
      <div className="author-hover-avatar">
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
  );
};

export default AuthorHoverCard;
