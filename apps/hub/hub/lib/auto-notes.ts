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
    Production Deployment - Docker setup with Dockerfile for API and Hub, docker-compose.yml for local development, production docker-compose with PostgreSQL and Redis.
    Configure Docker containers with multi-stage builds for optimization.
    Set up nginx reverse proxy with SSL termination.
    Create deployment and backup scripts for production.
    Add standalone Next.js output for Docker deployment.
    Configure environment variables for production deployment.
  `
  
  autoTrackNotes(currentNotes)
}