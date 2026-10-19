import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { blogPosts } from '../data/mock';

// Renders **bold** and [text](url) inside a line of post content
const renderInline = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      const className = 'text-orange-600 underline underline-offset-2 hover:text-orange-700';
      return href.startsWith('/') ? (
        <Link key={i} to={href} className={className}>{label}</Link>
      ) : (
        <a key={i} href={href} className={className} target="_blank" rel="noopener noreferrer">{label}</a>
      );
    }
    return part;
  });
};

const splitRow = (row) => row.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link to="/blog">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = blogPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-1.5 bg-orange-500 rounded-full mb-4">
            <span className="text-white text-sm font-semibold">{post.category}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-gray-200">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/blog')}
              className="text-orange-500 hover:text-orange-600 p-0 h-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-6">
              {post.content.split('\n\n').map((paragraph, index) => {
                // Keyword lines are for metadata only, not for readers
                if (paragraph.startsWith('### Keywords:')) {
                  return null;
                }
                // Handle headings
                if (paragraph.startsWith('# ')) {
                  return (
                    <h2 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">
                      {paragraph.replace('# ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('## ')) {
                  return (
                    <h3 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                      {paragraph.replace('## ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h4 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">
                      {paragraph.replace('### ', '')}
                    </h4>
                  );
                }
                if (paragraph.startsWith('#### ')) {
                  return (
                    <h5 key={index} className="text-lg font-bold text-gray-900 mt-6 mb-3">
                      {paragraph.replace('#### ', '')}
                    </h5>
                  );
                }
                // Handle lists
                if (paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n');
                  return (
                    <ul key={index} className="list-disc list-inside space-y-2 my-4">
                      {items.map((item, i) => (
                        <li key={i} className="text-gray-700">
                          {renderInline(item.replace('- ', ''))}
                        </li>
                      ))}
                    </ul>
                  );
                }
                // Handle numbered lists
                if (/^\d+\. /.test(paragraph)) {
                  const items = paragraph.split('\n');
                  return (
                    <ol key={index} className="list-decimal list-inside space-y-2 my-4">
                      {items.map((item, i) => (
                        <li key={i} className="text-gray-700">
                          {renderInline(item.replace(/^\d+\. /, ''))}
                        </li>
                      ))}
                    </ol>
                  );
                }
                // Handle tables (header row, separator row, body rows)
                if (paragraph.startsWith('|')) {
                  const [header, , ...rows] = paragraph.split('\n');
                  return (
                    <div key={index} className="overflow-x-auto my-6">
                      <table className="w-full text-left text-sm md:text-base border border-gray-200">
                        <thead className="bg-orange-50">
                          <tr>
                            {splitRow(header).map((cell, i) => (
                              <th key={i} className="px-4 py-3 font-semibold text-gray-900 border-b border-gray-200">
                                {renderInline(cell)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row, r) => (
                            <tr key={r} className="even:bg-gray-50">
                              {splitRow(row).map((cell, i) => (
                                <td
                                  key={i}
                                  className={`px-4 py-3 border-b border-gray-200 align-top ${i === 0 ? 'font-medium text-gray-900' : 'text-gray-700'}`}
                                >
                                  {renderInline(cell)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
                // Regular paragraphs
                return (
                  <p key={index} className="text-gray-700 leading-relaxed">
                    {renderInline(paragraph)}
                  </p>
                );
              })}
            </div>
          </div>

          {/* FAQs */}
          {post.faqs?.length > 0 && (
            <section className="mt-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {post.faqs.map((faq, i) => (
                  <div key={i} className="border-l-4 border-orange-500 pl-5">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Share & CTA */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-orange-50 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Start Your Construction Project?
              </h3>
              <p className="text-gray-600 mb-6">
                Let's discuss your vision and create something amazing together.
              </p>
              <Link to="/contact">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                  Get Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Card
                  key={relatedPost.id}
                  className="group overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <div className="text-sm text-orange-500 font-semibold">{relatedPost.category}</div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                    <Link to={`/blog/${relatedPost.slug}`}>
                      <Button
                        variant="ghost"
                        className="text-orange-500 hover:text-orange-600 p-0 h-auto font-semibold"
                      >
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPost;