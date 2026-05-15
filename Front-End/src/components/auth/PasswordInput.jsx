import { Eye, EyeOff } from "lucide-react";
import { inputClass } from "../../constants/authStyles";

export default function PasswordInput({ value, onChange, placeholder, show, onToggle }) {
    return (
        <div className="relative w-full">
        <input
            type={show ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={inputClass}
            required
        />
        <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        </div>
    );
}
