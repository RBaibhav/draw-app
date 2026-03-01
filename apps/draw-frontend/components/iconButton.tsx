import { MouseEventHandler, ReactNode } from "react"

// Define an interface for better type safety
interface IconButtonProps {
  icon: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const IconButton = ({ icon, onClick }: IconButtonProps) => {
  return (
    <button 
      onClick={onClick} 
      className="cursor-pointer bg-neutral-900 px-4 py-2 rounded-lg shadow-xs shadow-neutral-500 hover:bg-neutral-800 active:bg-neutral-700 active:text-neutral-300"
    >
      {icon}
    </button>
  )
}