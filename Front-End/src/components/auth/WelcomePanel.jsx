import { btnOutline, panelGradient } from "../../constants/authStyles";

export default function WelcomePanel({ isLoginSide, goTo }) {
    return (
        <div
        className={`absolute top-0 h-full w-1/2 flex flex-col items-center justify-center text-white text-center px-10 z-10 transition-all duration-700 ease-in-out ${
            isLoginSide ? "left-0 rounded-r-[80px]" : "left-1/2 rounded-l-[80px]"
        }`}
        style={{ background: panelGradient }}
        >
        <h1 className="text-4xl font-bold mb-1">Zync</h1>
        <p className="text-sm opacity-70 mb-6">Sync with your people</p>

        {isLoginSide ? (
            <>
            <h2 className="text-2xl font-bold mb-3">Welcome Back!</h2>
            <p className="text-sm opacity-80 mb-8 leading-relaxed">
                To keep connected with us please login with your personal info
            </p>
            <button onClick={() => goTo("register")} className={btnOutline}>
                SIGN UP
            </button>
            </>
        ) : (
            <>
            <h2 className="text-2xl font-bold mb-3">Hello, Friend!</h2>
            <p className="text-sm opacity-80 mb-8 leading-relaxed">
                Enter your personal details and start your journey with us
            </p>
            <button onClick={() => goTo("login")} className={btnOutline}>
                SIGN IN
            </button>
            </>
        )}
        </div>
    );
}
