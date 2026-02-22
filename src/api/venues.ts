import type { VenuesResponse } from '../types/venue'

type GetVenuesArgs = {
  destinationSlug: string
  liveOnly?: boolean
  category?: string
}

export async function getVenues({
  destinationSlug,
  liveOnly = true,
  category,
}: GetVenuesArgs): Promise<VenuesResponse> {
  const params = new URLSearchParams({
    destinationSlug,
    liveOnly: liveOnly ? 'true' : 'false',
  })
  if (category) params.set('category', category)

  const res = await fetch(`/.netlify/functions/get-venues?${params.toString()}`)
  const data = (await res.json()) as VenuesResponse

  if (!res.ok) {
    return { ok: false, error: `Request failed (${res.status})` }
  }

  return data
}
