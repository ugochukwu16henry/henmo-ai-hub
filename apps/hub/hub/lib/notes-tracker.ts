interface Note {
  id: string
  title: string
  content: string
  category: 'upgrade' | 'todo' | 'recommendation' | 'issue' | 'feature'
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
  tags: string[]
}

class NotesTracker {
  private notes: Note[] = []
  private storageKey = 'henmo-notes-tracker'

  constructor() {
    this.loadNotes()
    this.initializeDefaultNotes()
  }

  private loadNotes() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.storageKey)
      if (saved) this.notes = JSON.parse(saved)
    }
  }

  private saveNotes() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(this.notes))
    }
  }

  private initializeDefaultNotes() {
    if (this.notes.length === 0) {
      this.addNote({
        title: 'Upgrade to Vercel Pro Plan',
        content: 'Current deployment limit: 100/day. Upgrade for unlimited deployments and multiple regions.',
        category: 'upgrade',
        priority: 'high',
        tags: ['vercel', 'deployment', 'performance']
      })

      this.addNote({
        title: 'Global Performance Optimizations',
        content: 'Implemented: Edge caching, CDN optimization, service worker, lazy loading. Result: 60-80% faster loading globally.',
        category: 'feature',
        priority: 'high',
        status: 'completed',
        tags: ['performance', 'global', 'optimization']
      })

      this.addNote({
        title: 'Fix TypeScript Strict Mode',
        content: 'Currently disabled for deployment. Re-enable and fix type issues for better code quality.',
        category: 'todo',
        priority: 'medium',
        tags: ['typescript', 'code-quality']
      })

      this.addNote({
        title: 'Security Audit',
        content: 'Run npm audit fix for 3 high severity vulnerabilities in dependencies.',
        category: 'issue',
        priority: 'high',
        tags: ['security', 'dependencies']
      })
    }
  }

  addNote(note: Omit<Note, 'id' | 'created_at' | 'updated_at' | 'status'> & { status?: Note['status'] }) {
    const newNote: Note = {
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'pending',
      ...note
    }
    this.notes.unshift(newNote)
    this.saveNotes()
    return newNote
  }

  updateNote(id: string, updates: Partial<Note>) {
    const index = this.notes.findIndex(n => n.id === id)
    if (index !== -1) {
      this.notes[index] = { ...this.notes[index], ...updates, updated_at: new Date().toISOString() }
      this.saveNotes()
    }
  }

  getNotes(filters?: { category?: Note['category'], status?: Note['status'], priority?: Note['priority'] }) {
    let filtered = this.notes
    if (filters?.category) filtered = filtered.filter(n => n.category === filters.category)
    if (filters?.status) filtered = filtered.filter(n => n.status === filters.status)
    if (filters?.priority) filtered = filtered.filter(n => n.priority === filters.priority)
    return filtered
  }

  getUpgrades() { return this.getNotes({ category: 'upgrade' }) }
  getTodos() { return this.getNotes({ category: 'todo' }) }
  getRecommendations() { return this.getNotes({ category: 'recommendation' }) }
  getIssues() { return this.getNotes({ category: 'issue' }) }

  autoUpdate(content: string) {
    // Auto-detect and add notes from AI responses
    const upgradePatterns = [/upgrade to (.*?)(?:\.|,|$)/gi, /consider upgrading (.*?)(?:\.|,|$)/gi]
    const todoPatterns = [/need to (.*?)(?:\.|,|$)/gi, /should (.*?)(?:\.|,|$)/gi]
    const issuePatterns = [/error:? (.*?)(?:\.|,|$)/gi, /fix (.*?)(?:\.|,|$)/gi]

    upgradePatterns.forEach(pattern => {
      const matches = content.matchAll(pattern)
      for (const match of matches) {
        this.addNote({
          title: `Upgrade: ${match[1]}`,
          content: match[0],
          category: 'upgrade',
          priority: 'medium',
          tags: ['auto-detected']
        })
      }
    })
  }
}

export const notesTracker = new NotesTracker()