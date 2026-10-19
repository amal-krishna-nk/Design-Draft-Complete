import Head from "next/head";
import { companyInfo } from "@/data/mock";

const SITE_URL = "https://designdraft.co.in";

const BASE_LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
  name: "Design Draft",
  description:
    "Leading builders, architects, and interior designers in Thrissur, Kerala with 25+ years of experience.",
  url: SITE_URL,
  telephone: "+917736885666",
  email: "info@designdraft.co.in",
  foundingDate: "1998",
  priceRange: "INR",
  image: `${SITE_URL}/favicon.png`,
  logo: `${SITE_URL}/favicon.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Design Draft Designers & Developers, Irinjalakuda",
    addressLocality: "Thrissur",
    addressRegion: "Kerala",
    postalCode: "680121",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 10.3432705,
    longitude: 76.2149378,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "16:00",
    },
  ],
  areaServed: [
    { "@type": "City", name: "Thrissur" },
    { "@type": "City", name: "Irinjalakuda" },
    { "@type": "City", name: "Chalakudy" },
    { "@type": "City", name: "Kodungallur" },
    { "@type": "State", name: "Kerala" },
  ],
  hasMap: "https://www.google.com/maps/place/Design+Draft/@10.3432705,76.2149378,17z",
  sameAs: [
    "https://www.google.com/maps/place/Design+Draft/@10.3432705,76.2149378,17z",
    "https://www.facebook.com/Designdraft13",
    "https://www.instagram.com/_design_draft/",
  ],
};

export default function Seo({
  title,
  description,
  path = "/",
  keywords = [],
  image = "https://images.unsplash.com/photo-1544984243-ec57ea16fe25",
  schema = null,
  type = "website",
}) {
  const canonical = `${SITE_URL}${path}`;
  const computedKeywords =
    keywords.length > 0
      ? keywords.join(", ")
      : `${companyInfo.name}, Thrissur builders, Kerala architects`;

  const schemas = [
    BASE_LOCAL_BUSINESS_SCHEMA,
    ...(schema ? (Array.isArray(schema) ? schema : [schema]) : []),
  ];

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={computedKeywords} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={companyInfo.name} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@_design_draft_" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </Head>
  );
}
