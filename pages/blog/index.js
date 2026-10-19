import Blog from "@/pages/Blog";
import Seo from "@/components/Seo";

export default function BlogPage() {
  return (
    <>
      <Seo
        title="Design and Construction Blog | Design Draft Thrissur"
        description="Read expert blog posts on house design, architecture, construction planning, and interior design trends in Thrissur and Kerala."
        path="/blog"
        keywords={[
          "construction guide Thrissur",
          "home construction tips Kerala",
          "house design ideas Thrissur",
          "construction cost Thrissur",
          "Kerala architecture blog",
          "turnkey house construction Thrissur",
          "monsoon proof house Kerala",
        ]}
      />
      <Blog />
    </>
  );
}
