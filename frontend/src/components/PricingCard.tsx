import { motion } from 'framer-motion';
import { plans } from '../utils/staticData/staticData';

export default function PricingCard() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center py-32">
      <div className="flex flex-wrap items-center justify-center gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 180, damping: 12 }}
            className={`${plan.color} relative w-72 rounded-xl border p-6 pb-16 text-center shadow-sm`}
          >
            {plan.highlight && (
              <p className="bg-bgPrimary absolute -top-3 left-3 rounded-full border border-white px-3 py-1 text-sm font-semibold">
                {plan.badge}
              </p>
            )}

            <p className="mt-2 font-semibold">{plan.name}</p>

            <h1 className="mt-2 text-3xl font-bold">
              ${plan.price}
              <span className="text-sm font-semibold opacity-80">/month</span>
            </h1>

            <ul className="mt-6 list-none space-y-2 text-sm font-semibold">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z"
                      fill={plan.highlight ? 'white' : '#044241'}
                    />
                  </svg>
                  <p>{f}</p>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className={`${plan.button} mt-8 w-full rounded py-2 text-sm font-semibold transition-all`}
            >
              Get Started
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
