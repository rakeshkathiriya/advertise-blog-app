const HeaderSection = ({ title, subTitle }: { title: string; subTitle: string }) => {
  return (
    <div className="mb:mt-0 mx-auto mt-8 mb-6">
      <h2 className="text-textSecondary mb:text-2xl mb-2 text-center text-xl font-bold italic underline underline-offset-8">
        {title}
      </h2>
      <p className="text-textPrimary mb:text-sm mx-auto max-w-3xl text-center text-xs font-semibold">{subTitle}</p>
    </div>
  );
};

export default HeaderSection;
