import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserPlus, User } from "lucide-react";
import userService from "../../services/userService";
import { getImageUrl } from "../../utils/imageUrl";

export default function SuggestedPeople() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [suggested, setSuggested] = useState([]);
    const [loading, setLoading] = useState(true);
    const [followingIds, setFollowingIds] = useState([]);

    useEffect(() => {
    if (!user?.id) return;
    fetchSuggested();
}, [user?.id]); 

    const fetchSuggested = async () => {
        try {
        // جيب الـ following عشان نشيلهم من الـ suggested
        const followingRes = await userService.getFollowing(user?.id);
        const ids = followingRes.data.map((f) => f.id);
        setFollowingIds(ids);

        // جيب الـ followers عشان تقترح من بيفولوك بس مش بتفولوه
        const followersRes = await userService.getFollowers(user?.id);
        const notFollowing = followersRes.data
            .filter((f) => !ids.includes(f.id) && f.id !== user?.id)
            .slice(0, 3);

        setSuggested(notFollowing);
        } catch (err) {
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const handleFollow = async (userId) => {
        try {
        await userService.followUser(userId);
        setFollowingIds((prev) => [...prev, userId]);
        } catch (err) {
        console.error(err);
        }
    };

    if (loading) return (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100" />
                <div className="flex-1 space-y-1">
                <div className="h-3 bg-gray-100 rounded w-2/3" />
                <div className="h-2 bg-gray-100 rounded w-1/2" />
                </div>
            </div>
            ))}
        </div>
        </div>
    );

    if (suggested.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">People You May Know</h3>
        <div className="space-y-3">
            {suggested.map((person) => (
            <div key={person.id} className="flex items-center gap-3">
                {/* Avatar */}
                <button onClick={() => navigate(`/profile/${person.id}`)}>
                {person.profilePicture ? (
                    <img src={getImageUrl(person.profilePicture)} 
                    className="w-10 h-10 rounded-full object-cover"
                    alt=""
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4c3bcf] to-[#0f9b72] flex items-center justify-center">
                    <User size={16} className="text-white" />
                    </div>
                )}
                </button>

                {/* Info */}
                <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => navigate(`/profile/${person.id}`)}
                >
                <p className="text-sm font-semibold text-gray-800 truncate">
                    {person.firstname} {person.lastname}
                </p>
                <p className="text-xs text-gray-400 truncate">@{person.username}</p>
                </div>

                {/* Follow Button */}
                {!followingIds.includes(person.id) ? (
                <button
                    onClick={() => handleFollow(person.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#4c3bcf] hover:bg-[#4c3bcf]/10 px-3 py-1.5 rounded-full transition-colors"
                >
                    <UserPlus size={14} />
                    Follow
                </button>
                ) : (
                <span className="text-xs text-green-500 font-semibold px-3">
                    Following ✓
                </span>
                )}
            </div>
            ))}
        </div>
        </div>
    );
}