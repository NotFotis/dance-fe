export async function getAllEventIds() {
    // Fetch your list of events from an API endpoint
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);
    if (!res.ok) {
      throw new Error(`Failed to fetch events: ${res.status}`);
    }
    /**
     * Assuming the API returns an array of event objects like:
     * [ { id: 1, ... }, { id: 2, ... } ]
     */
    const events = await res.json();    
    return events.data.map(event => String(event.documentId));
  }

  // lib/events.js
export async function fetchEvents() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events?populate=*`,
    {
      next: { revalidate: 60 } 
    }
    // (App Router Server Components default to no-store;
  );
  if (!res.ok) {
    throw new Error('Failed to fetch events');
  }
  const json = await res.json();
  // Strapi wraps payload in `data`
  return json.data;
}
