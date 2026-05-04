/**
 * PageSEO – sets document <title>, <meta name="description">, and Open Graph / Twitter tags.
 * Uses react-helmet-async under the hood (HelmetProvider must wrap the app).
 *
 * Usage:
 *   <PageSEO title="Page Title" description="Page description" url="/page" />
 *   <PageSEO ... jsonLd={{ '@context': 'https://schema.org', ... }} />
 */
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'vybe';
const BASE_URL = 'https://vybe.store';
const DEFAULT_IMAGE = `${BASE_URL}/image.png`;

/**
 * @param {object} props
 * @param {string} props.title        – Page-specific title (will be appended with " | vybe")
 * @param {string} [props.description]
 * @param {string} [props.url]        – Relative or absolute URL for canonical / OG url
 * @param {string} [props.image]      – Absolute URL for OG image
 * @param {string} [props.type]       – OG type, default "website"
 * @param {object} [props.jsonLd]     – Optional JSON-LD structured data object
 */
const PageSEO = ({ title, description, url = '/', image = DEFAULT_IMAGE, type = 'website', jsonLd }) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Luxury Perfumes & Fine Fragrances`;
  const canonicalUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default PageSEO;
