import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import userService from "../services/userService";
import { jwtDecode } from "jwt-decode";

export default function useProfile(userId = null) {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.user);

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);

    const targetId = userId || currentUser?.id;
    const token = useSelector((state) => state.auth.token);
    const tokenUserId = token ? jwtDecode(token).id : null;
    const isMyProfile = !userId || userId === tokenUserId || userId === currentUser?.id;

    useEffect(() => {
        if (!targetId) return;
        fetchProfile();
    }, [targetId]);

    const fetchProfile = async () => {
    setLoading(true);
    try {
        const [profileRes, followersRes, followingRes] = await Promise.all([
        userService.getUserProfile(targetId),
        userService.getFollowers(targetId),
        userService.getFollowing(targetId),
        ]);
        setProfile(profileRes.data);
        setFollowers(followersRes.data);
        setFollowing(followingRes.data);

        // ✅ استخدم tokenUserId بدل currentUser?.id
        if (!isMyProfile) {
        const isFollow = followersRes.data.some((f) => f.id === tokenUserId);
        setIsFollowing(isFollow);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
};

    const handleFollow = async () => {
        try {
        if (isFollowing) {
            await userService.unfollowUser(targetId);
            setIsFollowing(false);
            setFollowers((prev) => prev.filter((f) => f.id !== currentUser.id));
        } else {
            await userService.followUser(targetId);
            setIsFollowing(true);
            setFollowers((prev) => [...prev, currentUser]);
        }
        } catch (err) {
        console.error(err);
        }
    };

    const handleUpdateProfile = async (data) => {
        try {
        const res = await userService.updateProfile(data);
        setProfile(res.data);
        dispatch(setUser(res.data));
        return true;
        } catch (err) {
        throw err;
        }
    };

    return {
        profile, posts, followers, following,
        isFollowing, loading, isMyProfile,
        fetchProfile, handleFollow, handleUpdateProfile,
    };
}