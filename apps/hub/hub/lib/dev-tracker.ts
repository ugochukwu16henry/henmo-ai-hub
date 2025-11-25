// Development tracking utility
export const trackDevelopment = (
  title: string, 
  description: string, 
  files: string[], 
  type: 'feature' | 'file' | 'folder' | 'code' | 'update' = 'code'
) => {
  if (typeof window !== 'undefined' && (window as any).autoSaveDevEntry) {
    (window as any).autoSaveDevEntry(title, description, files, type);
  }
};

// Auto-track when this module is imported
if (typeof window !== 'undefined') {
  // Track this utility creation
  setTimeout(() => {
    trackDevelopment(
      'Development Auto-Tracker',
      'Created utility for automatic development tracking across the application',
      ['apps/hub/hub/lib/dev-tracker.ts'],
      'code'
    );
  }, 1000);
}