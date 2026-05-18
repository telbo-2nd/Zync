import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/slices/authSlice";


const API ="http://localhost:3000";

export default function useAuth() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [step, setStep] = useState(
    localStorage.getItem("pendingOtpEmail") ? "verify-otp" : "login"
    );
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const [showLoginPass, setShowLoginPass] = useState(false);
    const [showRegisterPass, setShowRegisterPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [showResetPass, setShowResetPass] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    

    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [registerData, setRegisterData] = useState({
        firstname: "", lastname: "", username: "", email: "", phone: "", password: "",
    });
    const [otpData, setOtpData] = useState({
        email: localStorage.getItem("pendingOtpEmail") || "",
        otp: ""
    });

    const [forgotEmail, setForgotEmail] = useState("");
    const [resetData, setResetData] = useState({ email: "", otp: "", newPassword: "" });

    const clearMessages = () => { setError(""); setSuccess(""); };

    const goTo = (s) => { setStep(s); clearMessages(); };

    // ─── Handlers ────────────────────────────────────────────

    const handleLogin = async (e) => {
        e.preventDefault();
        clearMessages();
        setLoading(true);
        try {
        const res = await axios.post(`${API}/auth/login`, loginData);
        dispatch(setCredentials({ token: res.data.token, user: res.data.user }));
        localStorage.setItem("token", res.data.token);
        navigate("/home");
        } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Login failed");
        } finally { setLoading(false); }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        clearMessages();
        if (registerData.password !== confirmPassword) {
        setError("Passwords do not match");
        return;
        }
        setLoading(true);
        try {
        await axios.post(`${API}/auth/register`, registerData);
        localStorage.setItem("pendingOtpEmail", registerData.email);
        setOtpData((prev) => ({ ...prev, email: registerData.email }));
        setStep("verify-otp");
        } catch (err) {
        setError(err.response?.data?.message || "Register failed");
        } finally { setLoading(false); }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        clearMessages();
        setLoading(true);
        try {
            await axios.post(`${API}/auth/verify-otp`, otpData);
            // ✅ امسح الـ email
            localStorage.removeItem("pendingOtpEmail");
            setSuccess("Email verified! Please login.");
            setTimeout(() => { goTo("login"); clearMessages(); }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };
    const handleResendOtp = async () => {
        clearMessages();
        setLoading(true);
        try {
        await axios.post(`${API}/auth/resend-otp`, { email: otpData.email });
        setSuccess("OTP resent successfully!");
        } catch (err) {
        setError(err.response?.data?.message || "Failed to resend OTP");
        } finally { setLoading(false); }
    };

    const handleForgot = async (e) => {
        e.preventDefault();
        clearMessages();
        setLoading(true);
        try {
        await axios.post(`${API}/auth/forgot-password`, { email: forgotEmail });
        setResetData((prev) => ({ ...prev, email: forgotEmail }));
        setSuccess("OTP sent to your email!");
        setTimeout(() => { goTo("reset"); }, 1500);
        } catch (err) {
        setError(err.response?.data?.message || "Failed to send OTP");
        } finally { setLoading(false); }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        clearMessages();
        setLoading(true);
        try {
        await axios.post(`${API}/auth/reset-password`, resetData);
        setSuccess("Password reset successfully!");
        setTimeout(() => { goTo("login"); }, 1500);
        } catch (err) {
        setError(err.response?.data?.message || "Reset failed");
        } finally { setLoading(false); }
    };

    return {
        // state
        step, error, success, loading,
        showLoginPass, showRegisterPass, showConfirmPass, showResetPass,
        confirmPassword,
        loginData, registerData, otpData, forgotEmail, resetData,

        // setters
        setShowLoginPass, setShowRegisterPass, setShowConfirmPass, setShowResetPass,
        setConfirmPassword,
        setLoginData, setRegisterData, setOtpData, setForgotEmail, setResetData,

        // handlers
        handleLogin, handleRegister, handleVerifyOtp,
        handleResendOtp, handleForgot, handleReset,

        // helpers
        goTo,
    };
}
