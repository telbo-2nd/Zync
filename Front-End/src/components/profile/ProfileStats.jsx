import { useState } from "react";
import FollowListModal from "./FollowListModal";

export default function ProfileStats({ profile, followers, following }) {
    const [modal, setModal] = useState(null); // "followers" | "following" | null

    return (
        <>
        <div className="bg-white rounded-2xl shadow-sm px-8 py-6 mb-6">
            <div className="flex items-center gap-12">
            <div>
                <p className="text-2xl font-bold text-gray-900">{profile?.postsCount || 0}</p>
                <p className="text-sm text-gray-400 uppercase tracking-wide mt-0.5">Posts</p>
            </div>

            {/* Followers - clickable */}
            <button
                onClick={() => setModal("followers")}
                className="text-left hover:opacity-70 transition-opacity"
            >
                <p className="text-2xl font-bold text-gray-900">{profile?.followersCount || 0}</p>
                <p className="text-sm text-gray-400 uppercase tracking-wide mt-0.5">Followers</p>
            </button>

            {/* Following - clickable */}
            <button
                onClick={() => setModal("following")}
                className="text-left hover:opacity-70 transition-opacity"
            >
                <p className="text-2xl font-bold text-gray-900">{profile?.followingCount || 0}</p>
                <p className="text-sm text-gray-400 uppercase tracking-wide mt-0.5">Following</p>
            </button>
            </div>
        </div>

        {/* Modal */}
        {modal === "followers" && (
            <FollowListModal
            title="Followers"
            list={followers}
            onClose={() => setModal(null)}
            />
        )}
        {modal === "following" && (
            <FollowListModal
            title="Following"
            list={following}
            onClose={() => setModal(null)}
            />
        )}
        </>
    );
}