const HeaderSection = ({ title, subTitle }: { title: string; subTitle: string }) => {
  return (
    <div className="mx-auto mb-6">
      <h2 className="text-textSecondary mb-2 text-center text-2xl font-bold italic underline underline-offset-8">
        {title}
      </h2>
      <p className="text-textPrimary mx-auto max-w-3xl text-center text-sm font-semibold">{subTitle}</p>
    </div>
  );
};

export default HeaderSection;
