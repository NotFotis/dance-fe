export async function getAllArtistsIds() {
    // Fetch your list of artists from an API endpoint
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/artists`);
    if (!res.ok) {
      throw new Error(`Failed to fetch artists: ${res.status}`);
    }
    /**
     * Assuming the API returns an array of artists objects like:
     * [ { id: 1, ... }, { id: 2, ... } ]
     */
    const artists = await res.json();    
    return artists.data.map(artist => String(artist.slug));
  }

  // lib/artists.js
export async function fetchArtists() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/artists`,
    {
      next: { revalidate: 60 } 
    }
    // (App Router Server Components default to no-store;
  );
  if (!res.ok) {
    throw new Error('Failed to fetch artists');
  }
  const json = await res.json();
  // Strapi wraps payload in `data`
  return json.data;
}
