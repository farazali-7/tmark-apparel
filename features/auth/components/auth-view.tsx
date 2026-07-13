"use client"

import { useId, useState, type FormEvent, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

export type AuthTab = "signin" | "signup"

const inputClasses =
  "w-full h-11 rounded-none border border-neutral-300 bg-transparent px-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none"

const labelClasses =
  "mb-1.5 block text-xs tracking-[0.14em] uppercase text-neutral-500"

function Field({
  label,
  children,
}: {
  label: string
  children: (id: string) => ReactNode
}) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      {children(id)}
    </div>
  )
}

/** The newsletter checkbox pattern, re-cut for a light background. */
function ConsentCheckbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  children: ReactNode
}) {
  const id = useId()
  return (
    <div className="flex items-start gap-2.5">
      <span className="relative mt-0.5 size-4 shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer absolute inset-0 size-4 cursor-pointer appearance-none border border-neutral-400 transition-colors checked:border-neutral-900 checked:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2"
        />
        <Check
          aria-hidden
          strokeWidth={3}
          className="pointer-events-none absolute inset-0 m-auto size-3 text-white opacity-0 peer-checked:opacity-100"
        />
      </span>
      <label
        htmlFor={id}
        className="cursor-pointer text-xs leading-relaxed text-neutral-500"
      >
        {children}
      </label>
    </div>
  )
}

function PasswordInput({ id, autoComplete }: { id: string; autoComplete: string }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <input
        id={id}
        name="password"
        type={visible ? "text" : "password"}
        required
        autoComplete={autoComplete}
        placeholder="••••••••"
        className={cn(inputClasses, "pr-11")}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-3.5 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800"
      >
        {visible ? (
          <EyeOff aria-hidden className="size-4" />
        ) : (
          <Eye aria-hidden className="size-4" />
        )}
      </button>
    </div>
  )
}

function SubmitButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="h-11 w-full bg-neutral-900 text-xs tracking-[0.2em] text-white uppercase transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2"
    >
      {children}
    </button>
  )
}

interface AuthViewProps {
  initialTab?: AuthTab
}

export function AuthView({ initialTab = "signin" }: AuthViewProps) {
  const router = useRouter()
  const [tab, setTab] = useState<AuthTab>(initialTab)
  const [remember, setRemember] = useState(false)
  const [newsletter, setNewsletter] = useState(true)

  // UI-only for now: any submission signs you in and lands on the admin.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    router.push("/admin")
  }

  return (
    <div className="grid min-h-screen bg-white font-sans lg:grid-cols-2">
      {/* Brand panel — the storefront's sage, framed like an invitation card. */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-sage p-12 text-white lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-6 border border-white/15"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.08),transparent_55%)]"
        />

        <Link
          href="/"
          className="relative font-serif text-2xl tracking-[0.15em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-sage"
        >
          T-Mark Apparel
        </Link>

        <div className="relative max-w-md space-y-5">
          <p className="font-serif text-4xl leading-[1.1] xl:text-5xl">
            Every measurement,
            <br />
            remembered.
          </p>
          <p className="text-sm leading-relaxed text-white/70">
            Your fittings, preferences and order history — kept with the same
            discretion you would expect of your tailor.
          </p>
        </div>

        <p className="relative text-xs tracking-[0.2em] text-white/60 uppercase">
          Luxury Menswear — Established 2003
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-10 block text-center font-serif text-2xl tracking-[0.15em] text-neutral-900 lg:hidden"
          >
            T-Mark Apparel
          </Link>

          {/* Tab switcher with a sliding hairline indicator */}
          <div className="relative flex border-b border-neutral-200">
            <button
              type="button"
              onClick={() => setTab("signin")}
              aria-pressed={tab === "signin"}
              className={cn(
                "flex-1 pb-3 text-xs tracking-[0.18em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800",
                tab === "signin"
                  ? "text-neutral-900"
                  : "text-neutral-400 hover:text-neutral-600"
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab("signup")}
              aria-pressed={tab === "signup"}
              className={cn(
                "flex-1 pb-3 text-xs tracking-[0.18em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800",
                tab === "signup"
                  ? "text-neutral-900"
                  : "text-neutral-400 hover:text-neutral-600"
              )}
            >
              Create Account
            </button>
            <span
              aria-hidden
              className={cn(
                "absolute bottom-0 left-0 h-0.5 w-1/2 bg-neutral-900 transition-transform duration-300 ease-out",
                tab === "signup" && "translate-x-full"
              )}
            />
          </div>

          {/* Keyed on tab so the switch replays the entrance animation */}
          <div
            key={tab}
            className="mt-8 animate-in duration-300 fade-in slide-in-from-bottom-2"
          >
            <h1 className="font-serif text-3xl text-neutral-900">
              {tab === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              {tab === "signin"
                ? "Sign in to your T-Mark Apparel account."
                : "Begin your made-to-measure journey with T-Mark Apparel."}
            </p>

            {tab === "signin" ? (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <Field label="Email">
                  {(id) => (
                    <input
                      id={id}
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={inputClasses}
                    />
                  )}
                </Field>
                <Field label="Password">
                  {(id) => <PasswordInput id={id} autoComplete="current-password" />}
                </Field>

                <div className="flex items-center justify-between gap-4">
                  <ConsentCheckbox checked={remember} onChange={setRemember}>
                    Remember me
                  </ConsentCheckbox>
                  <Link
                    href="#"
                    className="text-xs text-neutral-500 underline underline-offset-4 transition-colors hover:text-neutral-900"
                  >
                    Forgot password?
                  </Link>
                </div>

                <SubmitButton>Sign In</SubmitButton>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First name">
                    {(id) => (
                      <input
                        id={id}
                        name="firstName"
                        required
                        autoComplete="given-name"
                        placeholder="Faraz"
                        className={inputClasses}
                      />
                    )}
                  </Field>
                  <Field label="Last name">
                    {(id) => (
                      <input
                        id={id}
                        name="lastName"
                        required
                        autoComplete="family-name"
                        placeholder="Ali"
                        className={inputClasses}
                      />
                    )}
                  </Field>
                </div>
                <Field label="Email">
                  {(id) => (
                    <input
                      id={id}
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={inputClasses}
                    />
                  )}
                </Field>
                <Field label="Password">
                  {(id) => <PasswordInput id={id} autoComplete="new-password" />}
                </Field>

                <ConsentCheckbox checked={newsletter} onChange={setNewsletter}>
                  Send me updates on new collections and private appointments.
                </ConsentCheckbox>

                <SubmitButton>Create Account</SubmitButton>

                <p className="text-xs leading-relaxed text-neutral-500">
                  By creating an account you agree to our{" "}
                  <Link href="#" className="underline underline-offset-4">
                    Terms &amp; Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="underline underline-offset-4">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            )}
          </div>

          <p className="mt-10 text-center">
            <Link
              href="/"
              className="text-xs text-neutral-500 underline underline-offset-4 transition-colors hover:text-neutral-900"
            >
              Return to the store
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
