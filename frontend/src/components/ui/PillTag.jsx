const PillTag = ({ label, active, onClick }) => {
  return (
    <button
      type="button"
      className={`pill-tag ${active ? "pill-tag-active" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default PillTag;
