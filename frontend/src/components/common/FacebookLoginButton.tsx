import { motion } from 'framer-motion';

interface FacebookLoginButtonProps {
  text?: string;
}

export const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({ text = 'Login with Facebook' }) => {
  const handleFacebookLogin = () => {
    // Redirect to backend Facebook OAuth route
    globalThis.window.location.href = `${import.meta.env.VITE_BACKEND_URL}/aba/auth/facebook`;
  };

  return (
    <motion.button
      type="button"
      onClick={handleFacebookLogin}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      className="mt-2 flex w-full items-center justify-center gap-3 rounded-lg bg-[#1877F2] py-3 text-white shadow-md"
    >
      {/* Facebook Icon */}
      <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="white">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H8.08v-2.89h2.36V9.41c0-2.33 1.39-3.62 3.52-3.62.99 0 2.03.18 2.03.18v2.24h-1.14c-1.12 0-1.47.7-1.47 1.42v1.7h2.5l-.4 2.89h-2.1v6.99C18.34 21.13 22 17 22 12z" />
      </svg>

      {text}
    </motion.button>
  );
};
