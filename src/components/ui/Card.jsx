export default function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`card-base p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
