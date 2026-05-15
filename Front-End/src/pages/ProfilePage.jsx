import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import Navbar from "../components/layout/Navbar";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import ProfilePosts from "../components/profile/ProfilePosts";
import EditProfileModal from "../components/profile/EditProfileModal";
import useProfile from "../hooks/useProfile";

export default function ProfilePage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { user: currentUser } = useSelector((state) => state.auth);
    const [showEdit, setShowEdit] = useState(false);
    const {
    profile, followers, following,  
    isFollowing, loading,
    isMyProfile, handleFollow, handleUpdateProfile,
    } = useProfile(id);

    const handleSave = async (data) => {
        await handleUpdateProfile(data);
        dispatch(setUser({ ...currentUser, ...data }));
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16 max-w-4xl mx-auto px-4 py-8">
            {/* Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6 animate-pulse">
            <div className="h-40 bg-gray-200" />
            <div className="px-8 pb-6 pt-4">
                <div className="flex justify-between items-end">
                <div className="w-32 h-32 rounded-full bg-gray-200 -mt-16" />
                <div className="w-32 h-10 bg-gray-200 rounded-full" />
                </div>
                <div className="mt-4 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48" />
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-4 bg-gray-200 rounded w-96" />
                </div>
            </div>
            </div>
        </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="pt-16 max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <ProfileHeader
            profile={profile}
            isMyProfile={isMyProfile}
            isFollowing={isFollowing}
            onFollow={handleFollow}
            onUnfollow={handleFollow}
            onEdit={() => setShowEdit(true)}
            />

            {/* Stats */}
            <ProfileStats
            profile={profile}
            followers={followers}   
            following={following}   
            />

            {/* Posts */}
            <ProfilePosts userId={id || currentUser?.id} />
        </div>

        {/* Edit Modal */}
        {showEdit && (
            <EditProfileModal
            profile={profile}
            onClose={() => setShowEdit(false)}
            onSave={handleSave}
            />
        )}
        </div>
    );
}
