"use client"

import { useState } from "react"
import { Pause, Play } from "lucide-react"

/**
 * Play/pause affordance for the hero's background video. The media itself is
 * still a placeholder, so this currently only reflects intent — once a <video>
 * lands, hold the ref here and drive play()/pause() from `playing`.
 */
export function HeroMediaToggle() {
  const [playing, setPlaying] = useState(true)

  return (
    <button
      type="button"
      onClick={() => setPlaying((value) => !value)}
      aria-pressed={playing}
      aria-label={playing ? "Pause video" : "Play video"}
      className="absolute bottom-6 right-6 sm:right-10 w-9 h-9 border border-white/80 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      {playing ? (
        <Pause aria-hidden className="w-3.5 h-3.5" />
      ) : (
        <Play aria-hidden className="w-3.5 h-3.5" />
      )}
    </button>
  )
}
