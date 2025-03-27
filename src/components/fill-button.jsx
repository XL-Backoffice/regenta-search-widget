export default function FillButton({ text, to, className = "", onClick = () => { }, disabled, loading }) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className={`rounded-full px-4 sm:px-4 text-sm sm:text-base text-white shadow-sm outline-0 relative ${className}`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
            <span>{text}</span>
          </div>
        ) : (
          text
        )}
      </button>
    </>
  );
}