import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../../components/common/Spinner';
import { useGetAllBlogs } from '../../queries/blogPage/blog.query';

const BlogPage: React.FC = () => {
  const { data: blogResponse, isLoading, isError } = useGetAllBlogs();
  const posts = blogResponse?.items ?? [];
  const navigate = useNavigate();

  // Extract first image from HTML
  const extractImage = (html: string): string | null => {
    const match = html.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : null;
  };

  // Remove HTML tags
  const cleanHTMLText = (html: string): string => {
    return html
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Get first 15 words
  const extractShortDescription = (html: string): string => {
    const cleanText = cleanHTMLText(html);
    const words = cleanText.split(/\s+/).slice(0, 15);
    return words.join(' ') + (words.length >= 15 ? '...' : '');
  };

  if (isLoading) {
    return (
      <div className="article-page main container flex min-h-[850px] w-full items-center justify-center overflow-hidden">
        <Spinner className="bg-transparent! backdrop-blur-none!" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="mb-14 text-center">
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-700">
            Understand your brand flavor better — creative ad solutions to grow every food business, only at{' '}
            <span className="font-semibold">Food N Processing</span>
          </p>
        </motion.div>

        {/* Blog Cards Grid */}
        <motion.div layout className="2md:grid-cols-2 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {posts.map((post, index) => {
            const image = extractImage(post.content);
            const shortDesc = extractShortDescription(post.content);

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/blog/${post.id}`)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-md transition-all duration-500 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  {image ? (
                    <img
                      src={image}
                      alt={post.title}
                      className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-52 w-full items-center justify-center text-lg font-semibold">
                      Food N Processing
                    </div>
                  )}

                  <div className="from-bgPrimaryDark/60 absolute inset-0 bg-linear-to-t via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-80"></div>
                </div>

                {/* Card Content */}
                <div className="flex grow flex-col justify-between p-6">
                  <h2 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 transition-colors duration-300">
                    {post.title}
                  </h2>

                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">{shortDesc}</p>

                  <div className="flex items-center text-sm font-medium group-hover:underline">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Glow hover effect */}
                <div className="absolute inset-0 rounded-3xl opacity-0 blur-xl transition duration-700 group-hover:opacity-30"></div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {posts.length === 0 && <div className="mt-12 text-center text-gray-500">No blog posts found.</div>}
      </div>
    </div>
  );
};

export default BlogPage;
