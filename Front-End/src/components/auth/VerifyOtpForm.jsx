import { inputClass, btnPrimary } from "../../constants/authStyles";

export default function VerifyOtpForm({ otpData, setOtpData, handleVerifyOtp, handleResendOtp, loading, error, success }) {
    return (
        <>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Verify Email</h2>
        <p className="text-sm text-gray-500 text-center mb-4">
            We sent an OTP to{" "}
            <span className="font-semibold text-[#0f9b72]">{otpData.email}</span>
        </p>

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-3 text-center">{success}</p>}

        <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-3">
            <input
            type="text"
            placeholder="Enter OTP"
            value={otpData.otp}
            onChange={(e) => setOtpData({ ...otpData, otp: e.target.value })}
            className={`${inputClass} text-center text-xl tracking-widest`}
            maxLength={6}
            required
            />
            <button type="submit" disabled={loading} className={btnPrimary}>
            {loading ? "Verifying..." : "VERIFY"}
            </button>
            <div className="text-center">
            <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-sm text-gray-500 hover:text-[#0f9b72] transition-colors"
            >
                Didn't receive it?{" "}
                <span className="font-semibold underline">Resend OTP</span>
            </button>
            </div>
        </form>
        </>
    );
}
