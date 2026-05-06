import { BASE_URL } from '../const/index.js';
import { fetchJson } from '../utils/fetch.js';

export async function getPosts() {
    const url = `${BASE_URL}/posts`;
    const data = await fetchJson(url, { timeout: 8000, fallback: [], label: 'getPosts' });
    return Array.isArray(data) ? data : [];
}

export async function getPostById(postId) {
    const url = `${BASE_URL}/posts/${postId}`;
    const data = await fetchJson(url, { timeout: 8000, fallback: null, label: `getPostById-${postId}` });
    return data;
}

export async function getComments() {
    const url = `${BASE_URL}/comments`;
    const data = await fetchJson(url, { timeout: 8000, fallback: [], label: 'getComments' });
    return Array.isArray(data) ? data : [];
}

export async function getCommentsByPostId(postId) {
    const url = `${BASE_URL}/comments?postId=${postId}`;
    const data = await fetchJson(url, `getCommentsByPostId-${postId}`);
    return Array.isArray(data) ? data : [];
}
