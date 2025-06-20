import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1338/api',
});

export const fetchEvents = async () => {
  const res = await api.get('/events');
  return res.data.data;
};

export const fetchNews = async () => {
  const res = await api.get('/dance-new');
  return res.data.data;
};

// lib/api.js
export async function fetchLegalPage(slug,apiLocale) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/legal-pages?filters[slug][$eq]=${slug}&locale=${apiLocale}`);
  const data = await res.json();
  
  return data.data[0] || null;
}
