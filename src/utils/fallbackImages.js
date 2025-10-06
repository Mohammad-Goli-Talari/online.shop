const PROFESSIONAL_FALLBACK_IMAGES = {
  electronics: [
    'https://placehold.co/600x400/3B82F6/FFFFFF?text=Electronics',
    'https://dummyimage.com/600x400/1E40AF/FFFFFF&text=Technology',
    'https://placehold.co/600x400/1D4ED8/FFFFFF?text=Gadgets',
  ],
  
  fashion: [
    'https://placehold.co/600x400/EC4899/FFFFFF?text=Fashion',
    'https://dummyimage.com/600x400/BE185D/FFFFFF&text=Clothing',
    'https://placehold.co/600x400/DB2777/FFFFFF?text=Style',
  ],

  home: [
    'https://placehold.co/600x400/10B981/FFFFFF?text=Home',
    'https://dummyimage.com/600x400/059669/FFFFFF&text=Furniture',
    'https://placehold.co/600x400/047857/FFFFFF?text=Decor',
  ],

  books: [
    'https://placehold.co/600x400/7C3AED/FFFFFF?text=Books',
    'https://dummyimage.com/600x400/6D28D9/FFFFFF&text=Education',
    'https://placehold.co/600x400/5B21B6/FFFFFF?text=Learning',
  ],

  sports: [
    'https://placehold.co/600x400/F59E0B/FFFFFF?text=Sports',
    'https://dummyimage.com/600x400/D97706/FFFFFF&text=Fitness',
    'https://placehold.co/600x400/B45309/FFFFFF?text=Exercise',
  ],

  beauty: [
    'https://placehold.co/600x400/EF4444/FFFFFF?text=Beauty',
    'https://dummyimage.com/600x400/DC2626/FFFFFF&text=Health',
    'https://placehold.co/600x400/B91C1C/FFFFFF?text=Cosmetics',
  ],

  food: [
    'https://placehold.co/600x400/84CC16/FFFFFF?text=Food',
    'https://dummyimage.com/600x400/65A30D/FFFFFF&text=Beverage',
    'https://placehold.co/600x400/4D7C0F/FFFFFF?text=Grocery',
  ],

  generic: [
    'https://placehold.co/600x400/4F46E5/FFFFFF?text=Product',
    'https://dummyimage.com/600x400/7C3AED/FFFFFF&text=Item',
    'https://placehold.co/600x400/DC2626/FFFFFF?text=Store',
    'https://dummyimage.com/600x400/059669/FFFFFF&text=Shop',
    'https://placehold.co/600x400/D97706/FFFFFF?text=Sale',
  ],
};

const CATEGORY_MAPPING = {
  electronics: 'electronics',
  technology: 'electronics',
  computers: 'electronics',
  phones: 'electronics',
  gadgets: 'electronics',
  
  fashion: 'fashion',
  clothing: 'fashion',
  apparel: 'fashion',
  shoes: 'fashion',
  accessories: 'fashion',
  
  home: 'home',
  furniture: 'home',
  decor: 'home',
  kitchen: 'home',
  garden: 'home',
  
  books: 'books',
  education: 'books',
  stationery: 'books',
  
  sports: 'sports',
  fitness: 'sports',
  outdoor: 'sports',
  
  beauty: 'beauty',
  health: 'beauty',
  cosmetics: 'beauty',
  
  food: 'food',
  beverage: 'food',
  grocery: 'food',
};

export const getProfessionalFallbackImage = (category, productId = '', width = 600, height = 400) => {
  try {
    const categoryName = typeof category === 'string' 
      ? category.toLowerCase().trim()
      : category?.name?.toLowerCase().trim() || '';

    const mappedCategory = CATEGORY_MAPPING[categoryName] || 'generic';
    
    const categoryImages = PROFESSIONAL_FALLBACK_IMAGES[mappedCategory] || PROFESSIONAL_FALLBACK_IMAGES.generic;
    
    const imageIndex = productId 
      ? Math.abs(productId.toString().split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % categoryImages.length
      : Math.floor(Math.random() * categoryImages.length);
    
    let selectedImage = categoryImages[imageIndex];
    
    if (selectedImage.includes('placehold.co')) {
      selectedImage = selectedImage.replace('600x400', `${width}x${height}`);
    } else if (selectedImage.includes('dummyimage.com')) {
      selectedImage = selectedImage.replace('600x400', `${width}x${height}`);
    }
    
    return selectedImage;
  } catch (error) {
    console.warn('Error getting professional fallback image:', error);
    return `https://placehold.co/${width}x${height}/4F46E5/FFFFFF?text=Product`;
  }
};

export const getRandomProfessionalImage = (width = 600, height = 400) => {
  const allImages = Object.values(PROFESSIONAL_FALLBACK_IMAGES).flat();
  let randomImage = allImages[Math.floor(Math.random() * allImages.length)];
  
  if (randomImage.includes('placehold.co')) {
    randomImage = randomImage.replace('600x400', `${width}x${height}`);
  } else if (randomImage.includes('dummyimage.com')) {
    randomImage = randomImage.replace('600x400', `${width}x${height}`);
  }
  
  return randomImage;
};

export const getProductImage = (originalImage, category, productId, width = 600, height = 400) => {
  if (originalImage && typeof originalImage === 'string' && originalImage.trim() !== '') {
    return originalImage;
  }
  
  const fallbackImage = getProfessionalFallbackImage(category, productId, width, height);
  
  if (!fallbackImage || fallbackImage.includes('error')) {
    const categoryText = typeof category === 'string' ? category : category?.name || 'Product';
    return `https://placehold.co/${width}x${height}/4F46E5/FFFFFF?text=${encodeURIComponent(categoryText)}`;
  }
  
  return fallbackImage;
};

export const preloadCriticalFallbackImages = () => {
  const criticalImages = [
    'https://placehold.co/600x400/4F46E5/FFFFFF?text=Product',
    'https://dummyimage.com/600x400/7C3AED/FFFFFF&text=Product',
    'https://placehold.co/600x400/DC2626/FFFFFF?text=Store',
    'https://dummyimage.com/600x400/059669/FFFFFF&text=Shop',
  ];
  
  criticalImages.forEach(url => {
    const img = new Image();
    img.src = url;
    img.onerror = () => {
      console.warn('Failed to preload fallback image:', url);
    };
  });
};

export const getFallbackImageUrl = (category = 'generic', index = 0) => {
  const categoryImages = PROFESSIONAL_FALLBACK_IMAGES[category] || PROFESSIONAL_FALLBACK_IMAGES.generic;
  const safeIndex = Math.max(0, Math.min(index, categoryImages.length - 1));
  return categoryImages[safeIndex];
};

export default {
  getProfessionalFallbackImage,
  getRandomProfessionalImage,
  getProductImage,
  getFallbackImageUrl,
  preloadCriticalFallbackImages,
};