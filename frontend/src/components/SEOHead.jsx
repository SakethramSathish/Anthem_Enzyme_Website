import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Enterokinase by Anthem Biosciences';
const BASE_URL = 'https://enterokinase.in';
const DEFAULT_OG_IMAGE = `${BASE_URL}/assets/enterokinease-vial.jpeg`;

/**
 * SEOHead — Reusable component for per-page SEO meta tags.
 *
 * @param {string} title - Page title (auto-suffixed with site name)
 * @param {string} description - Meta description (120-160 chars recommended)
 * @param {string} canonicalPath - Path for canonical URL (e.g., "/about")
 * @param {string} [ogImage] - Open Graph image URL
 * @param {string} [ogType="website"] - Open Graph type
 * @param {object} [jsonLd] - JSON-LD structured data object
 * @param {boolean} [noIndex=false] - If true, adds noindex/nofollow
 */
export default function SEOHead({
  title,
  description,
  canonicalPath,
  ogImage,
  ogType = 'website',
  jsonLd,
  noIndex = false,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = canonicalPath ? `${BASE_URL}${canonicalPath}` : BASE_URL;
  const image = ogImage || DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      {/* Primary Meta */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {canonicalPath !== undefined && <link rel="canonical" href={canonicalUrl} />}

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
