import { ExpandIcon, ShrinkIcon } from "lucide-react"
import { useState } from "react"

import { buttonVariants } from "../ui/button"

const FullScreenToggle = () => {
  const [isFullScreen, setIsFullScreen] = useState(false)

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullScreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullScreen(false)
      }
    }
  }

  return (
    <div
      className={buttonVariants({
        variant: "ghost",
      })}
      onClick={toggleFullScreen}
    >
      {!isFullScreen ? (
        <ExpandIcon className="size-5" />
      ) : (
        <ShrinkIcon className="size-5" />
      )}
    </div>
  )
}

export default FullScreenToggle
