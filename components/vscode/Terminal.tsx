'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Terminal as TerminalIcon, X, Minimize2, Square } from 'lucide-react'
import { vscodeIntegration } from '@/lib/vscode-integration'

interface TerminalOutput {
  id: string
  command: string
  output: string
  timestamp: Date
  type: 'command' | 'output' | 'error'
}

export function Terminal() {
  const [output, setOutput] = useState<TerminalOutput[]>([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (vscodeIntegration.isRunningInVSCode()) {
      vscodeIntegration.onMessage((message) => {
        if (message.command === 'terminalOutput') {
          addOutput(message.data.output, 'output')
        }
      })
    }
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  const addOutput = (text: string, type: 'command' | 'output' | 'error' = 'output') => {
    const newOutput: TerminalOutput = {
      id: Date.now().toString(),
      command: type === 'command' ? text : '',
      output: type !== 'command' ? text : '',
      timestamp: new Date(),
      type
    }
    setOutput(prev => [...prev, newOutput])
  }

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentCommand.trim()) {
      addOutput(currentCommand, 'command')
      
      if (vscodeIntegration.isRunningInVSCode()) {
        vscodeIntegration.sendMessage('executeTerminalCommand', { command: currentCommand })
      } else {
        // Demo responses
        setTimeout(() => {
          if (currentCommand.includes('npm')) {
            addOutput('npm packages installed successfully', 'output')
          } else if (currentCommand.includes('git')) {
            addOutput('Git command executed', 'output')
          } else {
            addOutput(`Command executed: ${currentCommand}`, 'output')
          }
        }, 500)
      }
      
      setCurrentCommand('')
    }
  }

  const clearTerminal = () => {
    setOutput([])
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4">
        <Button onClick={() => setIsMinimized(false)}>
          <TerminalIcon className="w-4 h-4 mr-2" />
          Terminal
        </Button>
      </div>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-80 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <TerminalIcon className="w-4 h-4" />
            Terminal
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)}>
              <Minimize2 className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={clearTerminal}>
              <Square className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-2 flex flex-col h-full">
        <div 
          ref={terminalRef}
          className="flex-1 bg-black text-green-400 p-2 rounded text-xs font-mono overflow-y-auto"
        >
          {output.map((item) => (
            <div key={item.id} className="mb-1">
              {item.type === 'command' && (
                <div className="text-blue-400">$ {item.command}</div>
              )}
              {item.type === 'output' && (
                <div className="text-green-400">{item.output}</div>
              )}
              {item.type === 'error' && (
                <div className="text-red-400">{item.output}</div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <span className="text-blue-400 text-xs">$</span>
          <Input
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyPress={handleCommand}
            className="flex-1 bg-black text-green-400 border-gray-600 text-xs font-mono"
            placeholder="Enter command..."
          />
        </div>
      </CardContent>
    </Card>
  )
}