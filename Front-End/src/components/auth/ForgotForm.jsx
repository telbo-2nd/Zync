import { inputClass, btnPrimary } from "../../constants/authStyles";

export default function ForgotForm({ forgotEmail, setForgotEmail, handleForgot, loading, error, success, goTo }) {
    return (
        <>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Forgot Password</h2>
        <p className="text-sm text-gray-500 text-center mb-4">
            Enter your email and we'll send you an OTP
        </p>

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-3 text-center">{success}</p>}

        <form onSubmit={handleForgot} className="w-full flex flex-col gap-3">
            <input
            type="email"
            placeholder="Email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            className={inputClass}
            required
            />
            <button type="submit" disabled={loading} className={btnPrimary}>
            {loading ? "Sending..." : "SEND OTP"}
            </button>
            <div className="text-center">
            <button
                type="button"
                onClick={() => goTo("login")}
                className="text-sm text-gray-500 hover:text-[#0f9b72] transition-colors"
            >
                ← Back to Login
            </button>
            </div>
        </form>
        </>
    );
}
