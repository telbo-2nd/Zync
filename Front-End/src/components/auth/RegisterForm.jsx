import PasswordInput from "./PasswordInput";
import { inputClass, btnPrimary } from "../../constants/authStyles";

export default function RegisterForm({ registerData, setRegisterData, showRegisterPass, setShowRegisterPass, showConfirmPass, setShowConfirmPass, confirmPassword, setConfirmPassword, handleRegister, loading, error, success }) {
    return (
        <>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Create Account</h2>

        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2 text-center">{success}</p>}

        <form onSubmit={handleRegister} className="w-full flex flex-col gap-2">
            <div className="flex gap-2">
            <input
                type="text"
                placeholder="First Name"
                value={registerData.firstname}
                onChange={(e) => setRegisterData({ ...registerData, firstname: e.target.value })}
                className="w-1/2 bg-[#f0f0f0] rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0f9b72]"
                required
            />
            <input
                type="text"
                placeholder="Last Name"
                value={registerData.lastname}
                onChange={(e) => setRegisterData({ ...registerData, lastname: e.target.value })}
                className="w-1/2 bg-[#f0f0f0] rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0f9b72]"
                required
            />
            </div>
            <input
            type="text"
            placeholder="Username"
            value={registerData.username}
            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
            className={inputClass}
            required
            />
            <input
            type="email"
            placeholder="Email"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            className={inputClass}
            required
            />
            <input
            type="text"
            placeholder="Phone (01xxxxxxxxx)"
            value={registerData.phone}
            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
            className={inputClass}
            required
            />
            <PasswordInput
            value={registerData.password}
            placeholder="Password"
            show={showRegisterPass}
            onToggle={() => setShowRegisterPass(!showRegisterPass)}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            />
            <PasswordInput
            value={confirmPassword}
            placeholder="Confirm Password"
            show={showConfirmPass}
            onToggle={() => setShowConfirmPass(!showConfirmPass)}
            onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit" disabled={loading} className={btnPrimary}>
            {loading ? "Creating account..." : "SIGN UP"}
            </button>
        </form>
        </>
    );
}
