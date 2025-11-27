import React from 'react';
import InteractiveFlipBook from '../components/FlipBookArticals/InteractiveFlipBook';

const ArticlePage: React.FC = () => {
  return (
    <div className="article-page flex w-screen items-center justify-center overflow-hidden">
      <InteractiveFlipBook />
    </div>
  );
};

export default ArticlePage;
