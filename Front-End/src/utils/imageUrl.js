const BASE_URL = "http://localhost:3000";

export const getImageUrl = (path) => {
    if (!path) return  null;
    if (path.startsWith("http")) return path; 
    return `${BASE_URL}/${path}`;
};