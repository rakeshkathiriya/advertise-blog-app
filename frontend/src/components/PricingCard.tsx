export default function PricingCard() {
  return (
    <div className="relative flex w-screen flex-col items-center justify-center py-38">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <div className="bg-bgPrimary/25 text-bgPrimaryDark border-borderMedium w-72 rounded-lg border p-6 pb-16 text-center">
          <p className="font-semibold">Basic</p>
          <h1 className="text-3xl font-semibold">
            $29<span className="text-bgPrimaryDark/80 text-sm font-semibold">/month</span>
          </h1>
          <ul className="text-bgPrimaryDark/80 mt-6 list-none space-y-1 text-sm font-semibold">
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#044241" />
              </svg>
              <p>Access to all basic courses</p>
            </li>
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#044241" />
              </svg>
              <p>Community support</p>
            </li>
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#044241" />
              </svg>
              <p>10 practice projects</p>
            </li>
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#044241" />
              </svg>
              <p>Course completion certificate</p>
            </li>
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#044241" />
              </svg>
              <p>Basic code review</p>
            </li>
          </ul>
          <button
            type="button"
            className="bg-bgPrimary hover:bg-bgPrimaryDark mt-7 w-full rounded py-2 text-sm font-medium text-white transition-all"
          >
            Get Started
          </button>
        </div>

        <div className="bg-bgPrimary relative w-72 rounded-lg border border-gray-500/30 p-6 pb-14 text-center text-white">
          <p className="bg-bgPrimary absolute -top-3.5 left-3.5 rounded-full border border-white px-3 py-1 text-sm font-semibold">
            Most Popular
          </p>
          <p className="pt-2 font-semibold">Pro</p>
          <h1 className="text-3xl font-semibold">
            $79<span className="text-sm font-semibold">/month</span>
          </h1>
          <ul className="mt-6 list-none space-y-1 text-sm font-semibold text-white">
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="currentColor" />
              </svg>
              <p>Access to all Pro courses</p>
            </li>
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="currentColor" />
              </svg>
              <p>Priority community support</p>
            </li>
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="currentColor" />
              </svg>
              <p>30 practice projects</p>
            </li>
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="currentColor" />
              </svg>
              <p>Course completion certificate</p>
            </li>
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="currentColor" />
              </svg>
              <p>Advance code review</p>
            </li>
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="currentColor" />
              </svg>
              <p>1-on-1 mentoring sessions</p>
            </li>
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="currentColor" />
              </svg>
              <p>Job assistance</p>
            </li>
          </ul>
          <button
            type="button"
            className="mt-7 w-full rounded bg-white py-2 text-sm font-medium text-indigo-500 transition-all hover:bg-gray-200"
          >
            Get Started
          </button>
        </div>

        <div className="bg-bgPrimary/25 text-bgPrimaryDark border-borderMedium w-72 rounded-lg border p-6 pb-16 text-center">
          <p className="font-semibold">Enterprise</p>
          <h1 className="text-3xl font-semibold">
            $199<span className="text-bgPrimaryDark/80 text-sm font-semibold">/month</span>
          </h1>
          <ul className="text-bgPrimaryDark/80 mt-6 list-none space-y-1 text-sm font-semibold">
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#044241" />
              </svg>
              <p>Access to all courses</p>
            </li>
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#044241" />
              </svg>
              <p>Dedicated support</p>
            </li>
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#044241" />
              </svg>
              <p>Unlimited projects</p>
            </li>
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#044241" />
              </svg>
              <p>Course completion certificate</p>
            </li>
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#044241" />
              </svg>
              <p>Premium code review</p>
            </li>
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#044241" />
              </svg>
              <p>Weekly 1-on-1 mentoring</p>
            </li>
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#044241" />
              </svg>
              <p>Job guarantee</p>
            </li>
          </ul>
          <button
            type="button"
            className="bg-bgPrimary hover:bg-bgPrimaryDark mt-7 w-full rounded py-2 text-sm font-medium text-white transition-all"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
