'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, CheckCircle, Clock, AlertTriangle, Zap } from 'lucide-react'
import { notesTracker } from '@/lib/notes-tracker'

export default function NotesPage() {
  const [notes, setNotes] = useState([])
  const [filter, setFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [newNote, setNewNote] = useState({ title: '', content: '', category: 'todo', priority: 'medium' })

  useEffect(() => {
    setNotes(notesTracker.getNotes())
  }, [])

  const handleAdd = () => {
    notesTracker.addNote(newNote as any)
    setNotes(notesTracker.getNotes())
    setNewNote({ title: '', content: '', category: 'todo', priority: 'medium' })
    setShowAdd(false)
  }

  const handleStatusChange = (id: string, status: string) => {
    notesTracker.updateNote(id, { status: status as any })
    setNotes(notesTracker.getNotes())
  }

  const filteredNotes = filter === 'all' ? notes : notes.filter((n: any) => n.category === filter)

  const getIcon = (category: string) => {
    switch (category) {
      case 'upgrade': return <Zap className="w-4 h-4" />
      case 'issue': return <AlertTriangle className="w-4 h-4" />
      case 'todo': return <Clock className="w-4 h-4" />
      default: return <CheckCircle className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notes & Upgrades</h1>
          <p className="text-gray-600">Track recommendations, upgrades, and todos</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      <div className="flex gap-2">
        {['all', 'upgrade', 'todo', 'issue', 'recommendation'].map(cat => (
          <Button
            key={cat}
            variant={filter === cat ? 'default' : 'outline'}
            onClick={() => setFilter(cat)}
            className="capitalize"
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredNotes.map((note: any) => (
          <Card key={note.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(note.category)}
                  <CardTitle className="text-lg">{note.title}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(note.priority)}>{note.priority}</Badge>
                  <Badge variant="outline">{note.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">{note.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {note.tags?.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <Select value={note.status} onValueChange={(status) => handleStatusChange(note.id, status)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showAdd && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <Textarea
              placeholder="Content"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            />
            <div className="flex gap-4">
              <Select value={newNote.category} onValueChange={(cat) => setNewNote({ ...newNote, category: cat })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upgrade">Upgrade</SelectItem>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="issue">Issue</SelectItem>
                  <SelectItem value="recommendation">Recommendation</SelectItem>
                </SelectContent>
              </Select>
              <Select value={newNote.priority} onValueChange={(pri) => setNewNote({ ...newNote, priority: pri })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd}>Add Note</Button>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}