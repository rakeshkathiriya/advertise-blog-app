import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Spinner } from '../../components/common/Spinner';
import { useGetLatestBlog, useGetParticularBlog } from '../../queries/blogPage/blog.query';

const FullBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetParticularBlog(id!);
  const { data: latestBlog } = useGetLatestBlog(id!);

  const extractImage = (html: string): string | null => {
    if (!html) return null;
    const match = html.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : null;
  };

  const blog = data?.items?.[0];

  if (isLoading) {
    return (
      <div className="article-page main container flex min-h-[850px] w-full items-center justify-center overflow-hidden">
        <Spinner className="bg-transparent! backdrop-blur-none!" />
      </div>
    );
  }

  if (!blog || isError) {
    return <div className="text-bgPrimary mt-16 text-center text-lg font-medium">Blog not found.</div>;
  }

  return (
    <div className="mt-12 min-h-screen px-3 py-10 sm:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-3">
        {/* ======================== LEFT SECTION ======================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl border border-gray-100 bg-white/90 shadow-lg backdrop-blur-md lg:col-span-2"
        >
          <div className="p-6 sm:p-10">
            <Link
              to="/blog"
              className="hover:text-bgPrimaryDark bg-bgPrimary/30 text-bgPrimary mb-6 inline-flex items-center rounded-4xl p-3 font-medium transition-colors duration-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
            </Link>

            <h1 className="text-bgPrimaryDark mb-4 text-3xl leading-snug font-extrabold sm:text-4xl">{blog.title}</h1>

            <p className="mb-6 text-sm text-gray-500">
              Published on{' '}
              <span className="font-medium text-gray-700">
                {new Date().toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </p>

            {/* Blog Body */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hover:[&_a]:text-bgPrimaryDark [&_h3]:text-bgPrimaryDark [&_h2]:text-bgPrimary [&_h1]:text-bgPrimary [&_a]:text-bgPrimary max-w-none leading-relaxed tracking-wide text-gray-800 [&_a]:underline [&_a]:underline-offset-2 [&_h1]:mb-6 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_hr]:my-8 [&_hr]:border-gray-200 [&_li]:mb-2 [&_ol]:my-4 [&_ol]:ml-6 [&_ol]:list-decimal [&_p]:mb-5 [&_p]:text-justify [&_p]:indent-4 [&_p]:leading-[1.85] [&_ul]:my-4 [&_ul]:ml-6 [&_ul]:list-disc"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </motion.div>

        {/* ======================== RIGHT SIDEBAR ======================== */}
        <motion.aside
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8"
        >
          {/* About Food N Processing */}
          <div className="rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-md backdrop-blur-md">
            <h3 className="text-bgPrimaryDark mb-3 text-xl font-bold">About Food N Processing</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              Food N Processing specializes in creating strategic, creative, data-driven marketing solutions for food
              brands, manufacturers, processors, and food start-ups. Our focus is on helping your food business grow
              through powerful advertising, brand awareness, and modern storytelling.
            </p>
          </div>

          {/* Latest Blogs Placeholder */}
          <div className="rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-md backdrop-blur-md">
            <h3 className="text-bgPrimaryDark mb-4 text-xl font-bold">Latest Blogs</h3>

            <ul className="space-y-4">
              {latestBlog?.items?.slice(0, 4).map((post) => {
                const image = extractImage(post.content);

                return (
                  <li
                    key={post.id}
                    className="flex items-center space-x-3 rounded-lg border-b border-gray-100 pb-3 transition hover:bg-(--color-secondary-500)"
                  >
                    {image && <img src={image} alt={post.title} className="h-14 w-14 rounded-md object-cover" />}

                    <div>
                      <Link to={`/blog/${post.id}`} className="text-bgPrimary line-clamp-2 text-sm font-semibold">
                        {post.title}

                        <p className="text-xs font-light! text-gray-500!">
                          {post.published ? new Date(post.published).toLocaleDateString('en-GB') : '—'}
                        </p>
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default FullBlog;
