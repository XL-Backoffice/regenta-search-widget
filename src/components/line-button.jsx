export default function FillButton({ text, to, className = "", onClick = () => { } }) {
  
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={`rounded-full px-4 text-sm sm:text-base shadow-sm ${className}`}
      >
        {text}
      </button>
    </>
  )
}