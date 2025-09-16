import { useEffect } from 'react';

const SEOHead = ({ title, description, ogTitle, ogDescription, ogImage, structuredData }) => {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta tags
    const updateMetaTag = (property, content) => {
      if (!content) return;
      
      let meta = document.querySelector(`meta[property="${property}"]`) || 
                 document.querySelector(`meta[name="${property}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property.startsWith('og:')) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update description
    if (description) {
      updateMetaTag('description', description);
    }

    // Update Open Graph tags
    if (ogTitle) {
      updateMetaTag('og:title', ogTitle);
    }
    if (ogDescription) {
      updateMetaTag('og:description', ogDescription);
    }
    if (ogImage) {
      updateMetaTag('og:image', ogImage);
    }

    // Update structured data
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function
    return () => {
      // Reset title to default when component unmounts
      document.title = 'MyShop';
    };
  }, [title, description, ogTitle, ogDescription, ogImage, structuredData]);

  return null; // This component doesn't render anything
};

export default SEOHead;