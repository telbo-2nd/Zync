import PasswordInput from "./PasswordInput";
import { inputClass, btnPrimary } from "../../constants/authStyles";

export default function LoginForm({ loginData, setLoginData, showLoginPass, setShowLoginPass, handleLogin, loading, error, success, goTo }) {
    return (
        <>
        <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center">Sign In</h2>

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-3 text-center">{success}</p>}

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
            <input
            type="email"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            className={inputClass}
            required
            />
            <PasswordInput
            value={loginData.password}
            placeholder="Password"
            show={showLoginPass}
            onToggle={() => setShowLoginPass(!showLoginPass)}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <div className="text-center">
            <button
                type="button"
                onClick={() => goTo("forgot")}
                className="text-sm text-gray-500 hover:text-[#0f9b72] transition-colors"
            >
                Forgot Your Password?
            </button>
            </div>
            <button type="submit" disabled={loading} className={btnPrimary}>
            {loading ? "Signing in..." : "SIGN IN"}
            </button>
        </form>
        </>
    );
}
