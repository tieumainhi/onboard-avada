const url = 'https://jsonplaceholder.typicode.com/users/1';

export async function getUser() {
    const response = await fetch(url);
    return response.json();
}