interface AutoNote {
  id: string;
  type: 'upgrade' | 'todo' | 'issue' | 'recommendation';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  timestamp: Date;
  completed: boolean;
}

class AutoNotesTracker {
  private notes: AutoNote[] = [];

  addNote(note: Omit<AutoNote, 'id' | 'timestamp' | 'completed'>) {
    const newNote: AutoNote = {
      ...note,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      completed: false
    };
    
    this.notes.push(newNote);
    this.saveToStorage();
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('henmo-auto-notes', JSON.stringify(this.notes));
    }
  }

  loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('henmo-auto-notes');
      if (stored) {
        this.notes = JSON.parse(stored);
      }
    }
  }

  getNotes() {
    return this.notes;
  }

  markCompleted(id: string) {
    const note = this.notes.find(n => n.id === id);
    if (note) {
      note.completed = true;
      this.saveToStorage();
    }
  }
}

export const autoNotesTracker = new AutoNotesTracker();

// Auto-run production detection
if (typeof window !== 'undefined') {
  detectProductionTasks();
}

// Auto-detect CI/CD related tasks
export function detectCICDTasks() {
  autoNotesTracker.addNote({
    type: 'upgrade',
    title: 'CI/CD Pipeline Setup Complete',
    description: 'GitHub Actions workflows created for automated testing, deployment, and security scanning',
    priority: 'high',
    category: 'DevOps'
  });

  autoNotesTracker.addNote({
    type: 'todo',
    title: 'Configure GitHub Secrets',
    description: 'Add RAILWAY_TOKEN, VERCEL_TOKEN, DOCKER_USERNAME, DOCKER_PASSWORD to repository secrets',
    priority: 'high',
    category: 'Configuration'
  });

  autoNotesTracker.addNote({
    type: 'recommendation',
    title: 'Enable Branch Protection',
    description: 'Configure branch protection rules to require PR reviews and status checks',
    priority: 'medium',
    category: 'Security'
  });
}

// Auto-detect production deployment tasks
export function detectProductionTasks() {
  autoNotesTracker.addNote({
    type: 'upgrade',
    title: 'Production Deployment Setup Complete',
    description: 'Multi-platform deployment configurations created for Railway, Vercel, AWS, and monitoring',
    priority: 'high',
    category: 'Deployment'
  });

  autoNotesTracker.addNote({
    type: 'todo',
    title: 'Configure Production Environment Variables',
    description: 'Set up all required environment variables in Railway, Vercel, and AWS',
    priority: 'high',
    category: 'Configuration'
  });

  autoNotesTracker.addNote({
    type: 'todo',
    title: 'Setup Custom Domain',
    description: 'Configure DNS records, SSL certificates, and CDN for henmo-ai.com',
    priority: 'high',
    category: 'Infrastructure'
  });

  autoNotesTracker.addNote({
    type: 'recommendation',
    title: 'Enable Production Monitoring',
    description: 'Deploy monitoring stack with Grafana, Prometheus, and uptime monitoring',
    priority: 'medium',
    category: 'Monitoring'
  });
}