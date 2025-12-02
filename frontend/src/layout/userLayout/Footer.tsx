import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="text-textWhite from-bgPrimaryDark to-bgPrimary flex w-full flex-col items-center justify-between bg-linear-to-r px-4 py-8 transition-all">
      <h1 className="text-textTitleSecondary cursor-pointer text-lg font-semibold tracking-wide">Logo</h1>
      <p className="mt-4 text-center">
        Copyright © 2025 <a href="/">Food N Processing</a>. All rights reserved.
      </p>
      <hr className="my-4 size-2 w-[50%] text-white" />
      <div className="flex items-center gap-4">
        <Link to="/" className="group font-medium text-white transition-all">
          Advertisement
          <div className={`bg-bgDefault h-0.5 w-0 transition-all duration-300 group-hover:w-full`} />
        </Link>
        <div className="h-4 w-px bg-white/70"></div>
        <Link to="/blog" className="group text-text-white font-medium transition-all">
          Blogs
          <div className={`bg-bgDefault h-0.5 w-0 transition-all duration-300 group-hover:w-full`} />
        </Link>
      </div>
    </footer>
  );
};
