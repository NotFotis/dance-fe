export async function getAllNewsIds() {
    // Fetch your list of news items from an API endpoint
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dance-new`);
    if (!res.ok) {
      throw new Error(`Failed to fetch news items: ${res.status}`);
    }
    /**
     * Assuming the API returns an array of news objects like:
     * [ { id: "a1", ... }, { id: "b2", ... } ]
     */
    const news = await res.json();     
    return news.data.map(item => String(item.slug));
  }