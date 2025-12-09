const Tabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleTabOpen = (tabCategory: string) => {
    setActiveTab(tabCategory);
  };

  return (
    <>
      <div className="mb-4 border-b border-gray-200">
        <div role="tablist" className="flex gap-1">
          <button
            role="tab"
            aria-selected="true"
            className={`hover:text-blue cursor-pointer border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'subscribe_users' ? 'text-blue border-blue' : 'text-textSecondary border-transparent'
            }`}
            onClick={() => handleTabOpen('subscribe_users')}
          >
            SubscribeUsers
          </button>

          <button
            role="tab"
            aria-selected="true"
            className={`hover:text-blue cursor-pointer border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'forever_subscribe_users'
                ? 'border-blue text-blue'
                : 'text-textSecondary border-transparent'
            }`}
            onClick={() => handleTabOpen('forever_subscribe_users')}
          >
            ForEverUsers
          </button>
        </div>
      </div>
    </>
  );
};

export default Tabs;
