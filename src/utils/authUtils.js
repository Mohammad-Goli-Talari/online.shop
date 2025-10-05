export const checkAuthenticationForAction = (isAuthenticated, action = 'perform this action') => {
  if (!isAuthenticated) {
    return {
      success: false,
      message: `Please login to ${action.replace('_', ' ')}`
    };
  }
  
  return {
    success: true,
    message: 'Authentication successful'
  };
};

export const AUTH_MESSAGES = {
  ADD_TO_CART: 'add items to your cart',
  CHECKOUT: 'complete your purchase',
  BUY_NOW: 'buy this item',
  SAVE_WISHLIST: 'save items to your wishlist',
  REVIEW: 'write a review',
  TRACK_ORDER: 'track your orders'
};

export const createLoginDialogConfig = (actionMessage = 'continue') => ({
  title: 'Login Required',
  message: `You need to be logged in to ${actionMessage}. Please sign in to your account or create a new one.`,
  benefits: [
    'Secure account management',
    'Order history and tracking', 
    'Faster checkout process',
    'Personalized recommendations',
    'Customer support access'
  ]
});

export default {
  checkAuthenticationForAction,
  AUTH_MESSAGES,
  createLoginDialogConfig
};