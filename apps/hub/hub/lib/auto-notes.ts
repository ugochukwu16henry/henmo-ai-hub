import { notesTracker } from './notes-tracker'

export const autoTrackNotes = (content: string) => {
  // Track upgrades
  const upgradePatterns = [
    /upgrade to (.*?)(?:\.|,|$)/gi,
    /consider upgrading (.*?)(?:\.|,|$)/gi,
    /need to upgrade (.*?)(?:\.|,|$)/gi
  ]

  // Track todos
  const todoPatterns = [
    /need to (.*?)(?:\.|,|$)/gi,
    /should (.*?)(?:\.|,|$)/gi,
    /todo:? (.*?)(?:\.|,|$)/gi
  ]

  // Track issues
  const issuePatterns = [
    /error:? (.*?)(?:\.|,|$)/gi,
    /fix (.*?)(?:\.|,|$)/gi,
    /issue:? (.*?)(?:\.|,|$)/gi
  ]

  // Track recommendations
  const recommendationPatterns = [
    /recommend (.*?)(?:\.|,|$)/gi,
    /suggest (.*?)(?:\.|,|$)/gi,
    /consider (.*?)(?:\.|,|$)/gi
  ]

  upgradePatterns.forEach(pattern => {
    const matches = content.matchAll(pattern)
    for (const match of matches) {
      notesTracker.addNote({
        title: `Upgrade: ${match[1].trim()}`,
        content: match[0].trim(),
        category: 'upgrade',
        priority: 'medium',
        tags: ['auto-detected', 'upgrade']
      })
    }
  })

  todoPatterns.forEach(pattern => {
    const matches = content.matchAll(pattern)
    for (const match of matches) {
      notesTracker.addNote({
        title: `Todo: ${match[1].trim()}`,
        content: match[0].trim(),
        category: 'todo',
        priority: 'medium',
        tags: ['auto-detected', 'todo']
      })
    }
  })

  issuePatterns.forEach(pattern => {
    const matches = content.matchAll(pattern)
    for (const match of matches) {
      notesTracker.addNote({
        title: `Issue: ${match[1].trim()}`,
        content: match[0].trim(),
        category: 'issue',
        priority: 'high',
        tags: ['auto-detected', 'issue']
      })
    }
  })

  recommendationPatterns.forEach(pattern => {
    const matches = content.matchAll(pattern)
    for (const match of matches) {
      notesTracker.addNote({
        title: `Recommendation: ${match[1].trim()}`,
        content: match[0].trim(),
        category: 'recommendation',
        priority: 'low',
        tags: ['auto-detected', 'recommendation']
      })
    }
  })
}

// Auto-track current conversation notes
if (typeof window !== 'undefined') {
  const currentNotes = `
    WebSocket for Real-time Features - Real-time typing indicators, live message updates, presence system, and collaborative features.
    Install WebSocket dependencies (ws, jsonwebtoken) for backend real-time communication.
    Create WebSocket service with authentication, room management, and message broadcasting.
    Implement typing indicators and presence system for online/offline status.
    Add WebSocket client and React hooks for frontend integration.
  `
  
  autoTrackNotes(currentNotes)
}