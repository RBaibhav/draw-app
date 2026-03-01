import { MouseEventHandler, ReactNode } from "react"

interface IconButtonProps {
  icon: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  activated: boolean
}

export const IconButton = ({ icon, onClick, activated }: IconButtonProps) => {
  return (
    <button 
      onClick={onClick} 
      className={`cursor-pointer px-4 py-2 rounded-lg shadow-xs shadow-neutral-500  ${ activated 
          ? "bg-neutral-300 text-neutral-900 hover:bg-neutral-200" 
          : "bg-neutral-900 text-white hover:bg-neutral-800"} delay-50 ease-out active:text-neutral-300`}
    >
      {icon}
    </button>
  )
}