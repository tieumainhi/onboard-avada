import { logError } from './logger.js';

export async function fetchJson(url, label) {

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Fetch error ${label || url}: ${res.status} ${res.statusText}`);
        }
        return await res.json();
    } catch (err) {
        throw new Error(`JSON parse error ${label || url}: ${err && err.message ? err.message : String(err)}`);
    }
}

export default fetchJson;
