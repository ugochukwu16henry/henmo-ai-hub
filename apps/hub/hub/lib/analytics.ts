import { trackEvent } from './monitoring';

// Chat Analytics
export const trackChatEvent = (action: string, data?: Record<string, any>) => {
  trackEvent(action, 'Chat', JSON.stringify(data));
};

export const trackMessageSent = (messageLength: number, hasAttachment: boolean) => {
  trackChatEvent('message_sent', { messageLength, hasAttachment });
};

export const trackAIResponse = (responseTime: number, tokenCount: number) => {
  trackChatEvent('ai_response', { responseTime, tokenCount });
};

// User Analytics
export const trackUserAction = (action: string, data?: Record<string, any>) => {
  trackEvent(action, 'User', JSON.stringify(data));
};

export const trackLogin = (method: string) => {
  trackUserAction('login', { method });
};

export const trackSignup = (method: string) => {
  trackUserAction('signup', { method });
};

// Feature Analytics
export const trackFeatureUsage = (feature: string, data?: Record<string, any>) => {
  trackEvent('feature_used', 'Features', feature, 1);
  trackEvent(feature, 'Feature Usage', JSON.stringify(data));
};

export const trackPageView = (page: string) => {
  trackEvent('page_view', 'Navigation', page);
};

// Performance Analytics
export const trackPerformance = (metric: string, value: number) => {
  trackEvent('performance', 'Metrics', metric, value);
};

export const trackError = (error: string, context?: string) => {
  trackEvent('error', 'Errors', error);
};