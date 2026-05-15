// src/components/common/Avatar.jsx
import { User } from "lucide-react";
import { getImageUrl } from "../../utils/imageUrl";

export default function Avatar({ src, size = 10, className = "" }) {
    const sizeClass = `w-${size} h-${size}`;

    if (!src) return (
        <div className={`${sizeClass} rounded-full bg-gradient-to-br from-[#4c3bcf] to-[#0f9b72] flex items-center justify-center flex-shrink-0 ${className}`}>
        <User size={size * 2} className="text-white" />
        </div>
    );

    return (
        <img
        src={getImageUrl(src)}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0 ${className}`}
        alt=""
        />
    );
}