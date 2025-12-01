'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { File, Folder, Search, Plus, Edit, Trash2 } from 'lucide-react'
import { vscodeIntegration } from '@/lib/vscode-integration'

interface FileItem {
  name: string
  path: string
  type: 'file' | 'folder'
  size?: number
  modified?: string
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPath, setCurrentPath] = useState('/')

  useEffect(() => {
    if (vscodeIntegration.isRunningInVSCode()) {
      vscodeIntegration.getWorkspaceFiles()
      
      vscodeIntegration.onMessage((message) => {
        if (message.command === 'workspaceFiles') {
          setFiles(message.data)
        }
      })
    } else {
      // Demo data for web version
      setFiles([
        { name: 'src', path: '/src', type: 'folder' },
        { name: 'components', path: '/src/components', type: 'folder' },
        { name: 'lib', path: '/src/lib', type: 'folder' },
        { name: 'app.tsx', path: '/src/app.tsx', type: 'file', size: 2048 },
        { name: 'index.ts', path: '/src/index.ts', type: 'file', size: 512 },
        { name: 'package.json', path: '/package.json', type: 'file', size: 1024 }
      ])
    }
  }, [])

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'file') {
      vscodeIntegration.openFile(file.path)
    } else {
      setCurrentPath(file.path)
    }
  }

  const handleSearch = () => {
    if (searchTerm) {
      vscodeIntegration.searchFiles(searchTerm)
    }
  }

  const handleCreateFile = () => {
    const fileName = prompt('Enter file name:')
    if (fileName) {
      vscodeIntegration.createFile(`${currentPath}/${fileName}`, '')
    }
  }

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5" />
            File Explorer
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreateFile}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button size="sm" onClick={handleSearch}>
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-1">
          {filteredFiles.map((file) => (
            <div
              key={file.path}
              className="flex items-center justify-between p-2 hover:bg-accent rounded cursor-pointer"
              onClick={() => handleFileClick(file)}
            >
              <div className="flex items-center gap-2">
                {file.type === 'folder' ? (
                  <Folder className="w-4 h-4 text-primary" />
                ) : (
                  <File className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="text-sm">{file.name}</span>
                {file.type === 'file' && (
                  <Badge variant="outline" className="text-xs">
                    {file.size ? `${(file.size / 1024).toFixed(1)}KB` : ''}
                  </Badge>
                )}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm">
                  <Edit className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}