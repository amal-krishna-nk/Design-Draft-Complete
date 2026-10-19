import BlogPost from "@/pages/BlogPost";
import Seo from "@/components/Seo";
import { blogPosts } from "@/data/mock";

const SITE_URL = "https://designdraft.co.in";

const getKeywords = (post) =>
  post.keywords ||
  post.content
    .match(/### Keywords:[^\n]*/)?.[0]
    ?.replace("### Keywords:", "")
    .split(",")
    .map((k) => k.trim()) ||
  [];

export default function BlogSlugPage({ post }) {
  const fallbackTitle = "Blog Article | Design Draft";
  const fallbackDescription = "Construction and design insights from Design Draft.";

  const postUrl = post ? `${SITE_URL}/blog/${post.slug}` : `${SITE_URL}/blog`;
  const keywords = post ? getKeywords(post) : [];

  const blogPostingSchema = post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.metaDescription || post.excerpt,
        image: post.image,
        inLanguage: "en-IN",
        author: {
          "@type": "Organization",
          name: post.author,
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "Design Draft",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/favicon.png`,
          },
        },
        datePublished: post.date,
        dateModified: post.updated || post.date,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": postUrl,
        },
        articleSection: post.category,
        keywords: keywords.join(", "),
        about: { "@type": "Place", name: "Thrissur, Kerala" },
      }
    : null;

  const breadcrumbSchema = post
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
        ],
      }
    : null;

  const faqSchema = post?.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <>
      <Seo
        title={post?.metaTitle || post?.title || fallbackTitle}
        description={post?.metaDescription || post?.excerpt || fallbackDescription}
        path={post ? `/blog/${post.slug}` : "/blog"}
        image={post?.image}
        keywords={keywords}
        type={post ? "article" : "website"}
        schema={[blogPostingSchema, breadcrumbSchema, faqSchema].filter(Boolean)}
      />
      <BlogPost />
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: blogPosts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = blogPosts.find((item) => item.slug === params.slug) || null;
  return { props: { post } };
}
