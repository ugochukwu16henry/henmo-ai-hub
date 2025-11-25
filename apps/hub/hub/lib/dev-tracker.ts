// Development tracking utility with performance optimization
export const trackDevelopment = (
  title: string, 
  description: string, 
  files: string[], 
  type: 'feature' | 'file' | 'folder' | 'code' | 'update' = 'code'
) => {
  if (typeof window !== 'undefined' && (window as any).autoSaveDevEntry) {
    // Use requestIdleCallback to avoid blocking main thread
    const track = () => (window as any).autoSaveDevEntry(title, description, files, type);
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(track);
    } else {
      setTimeout(track, 0);
    }
  }
};

// Auto-track when this module is imported (optimized)
if (typeof window !== 'undefined') {
  // Use requestIdleCallback for non-critical tracking
  const initTracker = () => {
    trackDevelopment(
      'Development Auto-Tracker',
      'Created utility for automatic development tracking across the application',
      ['apps/hub/hub/lib/dev-tracker.ts'],
      'code'
    );
  };
  
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initTracker, { timeout: 5000 });
  } else {
    setTimeout(initTracker, 2000);
  }
}