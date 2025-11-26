'use client'

import { FileExplorer } from '@/components/vscode/FileExplorer'
import { CodeEditor } from '@/components/vscode/CodeEditor'
import { Terminal } from '@/components/vscode/Terminal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Code, Zap, Settings, Download } from 'lucide-react'
import { vscodeIntegration } from '@/lib/vscode-integration'

export default function VSCodePage() {
  const isVSCode = vscodeIntegration.isRunningInVSCode()

  const handleInstallExtension = () => {
    if (isVSCode) {
      vscodeIntegration.executeCommand('workbench.extensions.installExtension', ['henmo-ai.henmo-extension'])
    } else {
      window.open('https://marketplace.visualstudio.com/items?itemName=henmo-ai.henmo-extension', '_blank')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">VS Code Integration</h1>
          <p className="text-gray-600">Seamless development environment integration</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isVSCode ? 'default' : 'secondary'}>
            {isVSCode ? 'Connected' : 'Web Mode'}
          </Badge>
          <Button onClick={handleInstallExtension}>
            <Download className="mr-2 h-4 w-4" />
            Install Extension
          </Button>
        </div>
      </div>

      {!isVSCode && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <Zap className="w-5 h-5" />
              <span className="font-medium">Enhanced Experience Available</span>
            </div>
            <p className="text-yellow-700 mt-2">
              Install the HenMo AI VS Code extension for full integration with your development environment.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <FileExplorer />
        </div>
        
        <div className="lg:col-span-2">
          <CodeEditor 
            filePath="example.ts"
            language="typescript"
            initialContent={`// HenMo AI Integration Example
import { vscodeIntegration } from './lib/vscode-integration'

// Open file in VS Code
vscodeIntegration.openFile('/path/to/file.ts', 42)

// Create new file
vscodeIntegration.createFile('/path/to/new-file.ts', 'console.log("Hello World")')

// Execute VS Code command
vscodeIntegration.executeCommand('workbench.action.quickOpen')

// Show notification
vscodeIntegration.showMessage('Task completed!', 'info')
`}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              File Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Open files at specific lines</li>
              <li>• Create and edit files</li>
              <li>• Search across workspace</li>
              <li>• File tree navigation</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Command Execution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Run VS Code commands</li>
              <li>• Execute terminal commands</li>
              <li>• Debug and run code</li>
              <li>• Extension management</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Workspace Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Workspace file access</li>
              <li>• Settings synchronization</li>
              <li>• Theme integration</li>
              <li>• Extension communication</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Terminal />
    </div>
  )
}