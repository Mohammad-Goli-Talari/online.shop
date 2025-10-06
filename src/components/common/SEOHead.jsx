import { useEffect } from 'react';

const SEOHead = ({ title, description, ogTitle, ogDescription, ogImage, structuredData }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

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

    if (description) {
      updateMetaTag('description', description);
    }

    if (ogTitle) {
      updateMetaTag('og:title', ogTitle);
    }
    if (ogDescription) {
      updateMetaTag('og:description', ogDescription);
    }
    if (ogImage) {
      updateMetaTag('og:image', ogImage);
    }

    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    return () => {
      document.title = 'Goli Store';
    };
  }, [title, description, ogTitle, ogDescription, ogImage, structuredData]);

  return null;
};

export default SEOHead;