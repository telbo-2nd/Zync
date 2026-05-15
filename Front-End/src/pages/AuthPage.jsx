import useAuth from "../hooks/useAuth";
import WelcomePanel from "../components/auth/WelcomePanel";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import VerifyOtpForm from "../components/auth/VerifyOtpForm";
import ForgotForm from "../components/auth/ForgotForm";
import ResetForm from "../components/auth/ResetForm";
import { bgGradient } from "../constants/authStyles";

export default function AuthPage() {
    const auth = useAuth();
    const { step, goTo } = auth;

    const isLoginSide = step === "login" || step === "forgot" || step === "reset";

    const renderForm = () => {
        if (step === "login") return <LoginForm {...auth} />;
        if (step === "register") return <RegisterForm {...auth} />;
        if (step === "verify-otp") return <VerifyOtpForm {...auth} />;
        if (step === "forgot") return <ForgotForm {...auth} />;
        if (step === "reset") return <ResetForm {...auth} />;
        return null;
    };

    return (
        <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: bgGradient }}
        >
        {/* ── MOBILE ── */}
        <div className="flex md:hidden w-full max-w-sm flex-col">
            <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white">Zync</h1>
            <p className="text-white/70 text-sm mt-1">Sync with your people</p>
            </div>

            {(step === "login" || step === "register") && (
            <div className="flex mb-4 bg-white/20 rounded-xl p-1">
                <button
                onClick={() => goTo("login")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    step === "login" ? "bg-white text-[#4c3bcf] shadow" : "text-white"
                }`}
                >
                Sign In
                </button>
                <button
                onClick={() => goTo("register")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    step === "register" ? "bg-white text-[#4c3bcf] shadow" : "text-white"
                }`}
                >
                Sign Up
                </button>
            </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-xl">
            {renderForm()}
            </div>
        </div>

        {/* ── DESKTOP ── */}
        <div className="hidden md:flex relative w-[900px] h-[580px] bg-white rounded-2xl shadow-xl overflow-hidden">
            <WelcomePanel isLoginSide={isLoginSide} goTo={goTo} />

            <div
            className={`absolute top-0 h-full w-1/2 flex flex-col items-center justify-center px-10 transition-all duration-700 ease-in-out ${
                isLoginSide ? "left-1/2" : "left-0"
            }`}
            >
            {renderForm()}
            </div>
        </div>
        </div>
    );
}
