import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-bgPrimary/30 flex min-h-screen flex-col items-center justify-center py-20 text-sm"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="from-bgPrimaryDark to-bgPrimary bg-linear-to-r bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
      >
        404 Not Found
      </motion.h1>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="to-bgPrimaryDark from-bgPrimary my-5 h-px w-80 origin-left rounded bg-linear-to-r"
      ></motion.div>
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-bgPrimary max-w-lg text-center font-semibold"
      >
        The page you are looking for does not exist or has been moved.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Link
          to="/"
          className="group bg-bgPrimary hover:bg-bgPrimaryDark mt-10 flex cursor-pointer gap-2 rounded-lg px-8 py-3 font-semibold text-white shadow-lg transition-colors"
        >
          Back to Home
          <svg
            className="transition group-hover:translate-x-0.5"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.583 11h12.833m0 0L11 4.584M17.416 11 11 17.417"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </motion.div>
    </motion.div>
  );
}
