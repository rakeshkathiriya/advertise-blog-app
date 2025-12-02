interface SidebarMenuItem {
  name: string;
  icon: string;
}

export const sidebarMenu: SidebarMenuItem[] = [
  { name: 'Advertisement', icon: '📄' },
  { name: 'My Clients', icon: '👥' },
  { name: 'Users', icon: '🧑' },
  { name: 'Logout', icon: '🔒' },
  { name: 'Go to Advertise', icon: '🏠' },
];

export const userSection = {
  title: 'User Management',
  subTitle:
    'Manage your user subscriptions and track expiration dates. Monitor active subscriptions, view remaining days. Double-click on any row to edit user details.',
};

export const plans = [
  {
    name: 'Basic',
    price: 29,
    color: 'bg-bgPrimary/25 text-bgPrimaryDark border-borderMedium',
    button: 'bg-bgPrimary hover:bg-bgPrimaryDark text-white',
    features: [
      'Access to all basic courses',
      'Community support',
      '10 practice projects',
      'Course completion certificate',
      'Basic code review',
    ],
  },
  {
    name: 'Pro',
    price: 79,
    highlight: true,
    color: 'bg-bgPrimary text-white border-gray-500/30',
    button: 'bg-white text-bgPrimary hover:bg-gray-200',
    badge: 'Most Popular',
    features: [
      'Access to all Pro courses',
      'Priority community support',
      '30 practice projects',
      'Course completion certificate',
      'Advance code review',
      '1-on-1 mentoring sessions',
      'Job assistance',
    ],
  },
  {
    name: 'Enterprise',
    price: 199,
    color: 'bg-bgPrimary/25 text-bgPrimaryDark border-borderMedium',
    button: 'bg-bgPrimary hover:bg-bgPrimaryDark text-white',
    features: [
      'Access to all courses',
      'Dedicated support',
      'Unlimited projects',
      'Course completion certificate',
      'Premium code review',
      'Weekly 1-on-1 mentoring',
      'Job guarantee',
    ],
  },
];
