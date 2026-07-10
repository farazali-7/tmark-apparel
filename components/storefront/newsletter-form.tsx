"use client"

import { useId, useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-sage"

export function NewsletterForm() {
  const emailId = useId()
  const consentId = useId()

  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Wire to the newsletter endpoint once it exists.
  }

  return (
    <div>
      <h3 className="font-serif uppercase text-xl tracking-wide mb-3">Newsletter</h3>
      <p className="text-sm text-white/80 mb-5 max-w-sm">
        Sign up to receive email updates on Canali&apos;s latest collections, campaigns and videos.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-3 border-b border-white/40 pb-1.5 max-w-sm"
      >
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email*"
          className="flex-1 bg-transparent text-sm placeholder:text-white/60 focus:outline-none"
        />
        <button type="submit" aria-label="Subscribe" className={`hover:opacity-70 ${focusRing}`}>
          <ArrowRight aria-hidden className="w-4 h-4" />
        </button>
      </form>

      {/*
        The box is a real checkbox with `appearance-none`, not a div with an
        onClick: that keeps it focusable, announced, and togglable from the
        label text. Per the HTML spec, clicking the nested privacy link does not
        forward activation to the control, so the link stays clickable.
      */}
      <div className="flex items-start gap-2.5 mt-5 max-w-sm">
        <span className="relative mt-0.5 w-4 h-4 shrink-0">
          <input
            id={consentId}
            name="consent"
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className={`peer appearance-none absolute inset-0 w-4 h-4 border border-white/70 checked:bg-white transition-colors cursor-pointer ${focusRing}`}
          />
          <Check
            aria-hidden
            strokeWidth={3}
            className="pointer-events-none absolute inset-0 m-auto w-3 h-3 text-brand-sage opacity-0 peer-checked:opacity-100"
          />
        </span>
        <label
          htmlFor={consentId}
          className="text-xs text-white/80 leading-relaxed cursor-pointer"
        >
          I consent to the processing of my data to receive newsletters, as per the{" "}
          <Link href="#" className="underline">
            Privacy policy
          </Link>
          *.
        </label>
      </div>

      <p className="text-xs text-white/60 mt-3">*Mandatory fields</p>
    </div>
  )
}
