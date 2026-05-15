import PasswordInput from "./PasswordInput";
import { inputClass, btnPrimary } from "../../constants/authStyles";

export default function ResetForm({ resetData, setResetData, showResetPass, setShowResetPass, handleReset, loading, error, success }) {
    return (
        <>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Reset Password</h2>
        <p className="text-sm text-gray-500 text-center mb-4">
            Enter the OTP sent to{" "}
            <span className="font-semibold text-[#0f9b72]">{resetData.email}</span>
        </p>

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-3 text-center">{success}</p>}

        <form onSubmit={handleReset} className="w-full flex flex-col gap-3">
            <input
            type="text"
            placeholder="Enter OTP"
            value={resetData.otp}
            onChange={(e) => setResetData({ ...resetData, otp: e.target.value })}
            className={`${inputClass} text-center text-xl tracking-widest`}
            maxLength={6}
            required
            />
            <PasswordInput
            value={resetData.password}
            placeholder="New Password"
            show={showResetPass}
            onToggle={() => setShowResetPass(!showResetPass)}
            onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
            />
            <button type="submit" disabled={loading} className={btnPrimary}>
            {loading ? "Resetting..." : "RESET PASSWORD"}
            </button>
        </form>
        </>
    );
}
