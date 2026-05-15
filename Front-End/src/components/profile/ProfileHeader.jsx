import { useRef } from "react";
import { User, Settings, Camera } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../store/slices/authSlice";
import api from "../../services/api";
import { getImageUrl } from "../../utils/imageUrl";

export default function ProfileHeader({ profile, isMyProfile, isFollowing, onFollow, onUnfollow, onEdit }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const fileRef = useRef();

    const handleAvatarClick = () => {
        if (isMyProfile) fileRef.current.click();
    };

    const handlePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const formData = new FormData();
            formData.append("profilePicture", file);
            const res = await api.put("/users/me/profile", formData, { 
                headers: { "Content-Type": "multipart/form-data" }
            });
            dispatch(setUser({ ...user, profilePicture: res.data.data.profilePicture }));
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
        {/* Cover */}
        <div
            className="h-40 w-full relative"
            style={{ background: "linear-gradient(135deg, #4c3bcf 0%, #0f9b72 100%)" }}
        >
            <div className="absolute right-20 top-8 w-16 h-16 rounded-full border-4 border-white/20" />
            <div className="absolute right-32 top-16 w-8 h-8 rounded-full border-4 border-white/20" />
            <div className="absolute right-14 top-20 w-6 h-6 rounded-full border-4 border-white/20" />
        </div>

        <div className="px-8 pb-6">
            <div className="flex items-end justify-between -mt-16 mb-4">

            {/* Avatar */}
            <div className="relative group">
                {/* Hidden file input */}
                <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePictureChange}
                />

                {profile?.profilePicture ? (
                <img src={getImageUrl(profile?.profilePicture)} 
                    className={`w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-lg ${isMyProfile ? "cursor-pointer" : ""}`}
                    onClick={handleAvatarClick}
                    alt=""
                />
                ) : (
                <div
                    className={`w-32 h-32 rounded-full bg-gradient-to-br from-[#4c3bcf] to-[#0f9b72] flex items-center justify-center ring-4 ring-white shadow-lg ${isMyProfile ? "cursor-pointer" : ""}`}
                    onClick={handleAvatarClick}
                >
                    <User size={48} className="text-white" />
                </div>
                )}

                {/* Camera overlay - only for my profile */}
                {isMyProfile && (
                <div
                    onClick={handleAvatarClick}
                    className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                    <Camera size={28} className="text-white" />
                </div>
                )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mb-2">
                {isMyProfile ? (
                <button
                    onClick={onEdit}
                    className="flex items-center gap-2 bg-[#4c3bcf] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#3a2db0] transition-colors"
                >
                    <Settings size={16} />
                    Edit Profile
                </button>
                ) : (
                <>
                    <button
                    onClick={onFollow}
                    className={`text-sm font-semibold px-6 py-2.5 rounded-full transition-colors ${
                        isFollowing
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : "bg-[#4c3bcf] text-white hover:bg-[#3a2db0]"
                    }`}
                    >
                    {isFollowing ? "Following" : "Follow"}
                    </button>
                    {isFollowing && (
                    <button
                        onClick={onUnfollow}
                        className="text-sm font-semibold px-6 py-2.5 rounded-full border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Unfollow
                    </button>
                    )}
                </>
                )}
            </div>
            </div>

            {/* Name & Bio */}
            <div>
            <h1 className="text-2xl font-bold text-gray-900">
                {profile?.firstname} {profile?.lastname}
            </h1>
            <p className="text-[#4c3bcf] font-medium mt-0.5">@{profile?.username}</p>
            {profile?.bio && (
                <p className="text-gray-600 text-sm mt-3 max-w-xl leading-relaxed">
                {profile.bio}
                </p>
            )}
            </div>
        </div>
        </div>
    );
}