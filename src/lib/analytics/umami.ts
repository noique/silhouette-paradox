// Minimal, safe wrapper around the Umami tracker (loaded via next/script in
// layout.tsx). No-ops gracefully when Umami isn't present — local dev, other
// environments, or any build without NEXT_PUBLIC_UMAMI_WEBSITE_ID.

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void
    }
  }
}

/**
 * Fire a Umami custom event. If the tracker script hasn't finished loading yet
 * (afterInteractive), retry briefly so early events (e.g. the hero on first
 * paint) aren't dropped. Silently gives up if Umami never appears.
 */
export function trackEvent(name: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  let tries = 0
  const fire = () => {
    if (window.umami) {
      window.umami.track(name, data)
      return
    }
    if (tries++ < 20) window.setTimeout(fire, 200) // wait up to ~4s for the script
  }
  fire()
}

export {}
