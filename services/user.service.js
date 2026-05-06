import { BASE_URL } from '../const/index.js';
import { fetchJson } from '../utils/fetch.js';

export async function getUsers() {
    const url = `${BASE_URL}/users`;
    const data = await fetchJson(url, { timeout: 8000, fallback: [], label: 'getUsers' });
    return Array.isArray(data) ? data : [];
}