import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";

export default function EditProfileModal({ profile, onClose, onSave }) {
    const [formData, setFormData] = useState({
        firstname: profile?.firstname || "",
        lastname: profile?.lastname || "",
        username: profile?.username || "",
        phone: profile?.phone || "",
        bio: profile?.bio || "",
        password: "",
    });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#4c3bcf]/30 focus:border-[#4c3bcf]";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
        // شيل الـ password لو فاضي
        const data = { ...formData };
        if (!data.password) delete data.password;
        await onSave(data);
        onClose();
        } catch (err) {
        setError(err.response?.data?.message || "Update failed");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Edit Profile</h2>
            <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
                <X size={20} className="text-gray-500" />
            </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div className="flex gap-3">
                <div className="flex-1">
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">First Name</label>
                <input
                    type="text"
                    value={formData.firstname}
                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                    className={inputClass}
                />
                </div>
                <div className="flex-1">
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Last Name</label>
                <input
                    type="text"
                    value={formData.lastname}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    className={inputClass}
                />
                </div>
            </div>

            <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Username</label>
                <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={inputClass}
                />
            </div>

            <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Phone</label>
                <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={inputClass}
                />
            </div>

            <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Bio</label>
                <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="Tell people about yourself..."
                />
            </div>

            <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                New Password <span className="text-gray-400">(leave empty to keep current)</span>
                </label>
                <div className="relative">
                <input
                    type={showPass ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={inputClass}
                    placeholder="••••••••"
                />
                <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-full border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors text-sm"
                >
                Cancel
                </button>
                <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-full bg-[#4c3bcf] text-white font-semibold hover:bg-[#3a2db0] transition-colors text-sm disabled:opacity-60"
                >
                {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}
