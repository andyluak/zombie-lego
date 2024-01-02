import React from "react"

import { cn } from "@/lib/utils"

type Props = {
  className?: string
}

function Navbar({ className }: Props) {
  return (
    <header
      className={cn(
        "flex items-center justify-center text-6xl py-16",
        className
      )}
    >
      Zombie Lego Yourself
    </header>
  )
}

export default Navbar
