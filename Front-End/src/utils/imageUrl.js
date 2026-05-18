const BASE_URL = import.meta.env.VITE_API_URL;

export const getImageUrl = (path) => {
    if (!path) return  null;
    if (path.startsWith("http")) return path; 
    return `${BASE_URL}/${path}`;
};