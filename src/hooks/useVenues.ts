import { useEffect, useState } from 'react'
import { getVenues } from '../api/venues'
import type { Venue } from '../types/venue'

type UseVenuesArgs = {
  destinationSlug: string
  liveOnly?: boolean
  category?: string
}

export function useVenues({ destinationSlug, liveOnly = true, category }: UseVenuesArgs) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getVenues({ destinationSlug, liveOnly, category })
        if (!data.ok) throw new Error(data.error)

        if (!cancelled) setVenues(data.venues)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Unknown error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [destinationSlug, liveOnly, category])

  return { venues, loading, error }
}
