import React from 'react';
import InteractiveFlipBook from '../components/FlipBookArticals/InteractiveFlipBook';

const ArticlePage: React.FC = () => {
  return (
    <div className="article-page main container flex h-[750px] w-full items-center justify-center overflow-hidden p-3 md:h-[900px]">
      <InteractiveFlipBook />
    </div>
  );
};

export default ArticlePage;
