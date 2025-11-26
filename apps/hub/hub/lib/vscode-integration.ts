interface VSCodeAPI {
  postMessage(message: any): void
  getState(): any
  setState(state: any): void
}

declare global {
  interface Window {
    acquireVsCodeApi?: () => VSCodeAPI
  }
}

class VSCodeIntegration {
  private vscode: VSCodeAPI | null = null
  private isVSCode = false

  constructor() {
    if (typeof window !== 'undefined' && window.acquireVsCodeApi) {
      this.vscode = window.acquireVsCodeApi()
      this.isVSCode = true
    }
  }

  sendMessage(command: string, data?: any) {
    if (this.vscode) {
      this.vscode.postMessage({ command, data })
    }
  }

  openFile(filePath: string, line?: number) {
    this.sendMessage('openFile', { filePath, line })
  }

  createFile(filePath: string, content: string) {
    this.sendMessage('createFile', { filePath, content })
  }

  executeCommand(command: string, args?: any[]) {
    this.sendMessage('executeCommand', { command, args })
  }

  showMessage(message: string, type: 'info' | 'warning' | 'error' = 'info') {
    this.sendMessage('showMessage', { message, type })
  }

  getWorkspaceFiles() {
    this.sendMessage('getWorkspaceFiles')
  }

  searchFiles(query: string) {
    this.sendMessage('searchFiles', { query })
  }

  isRunningInVSCode() {
    return this.isVSCode
  }

  onMessage(callback: (message: any) => void) {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', (event) => {
        callback(event.data)
      })
    }
  }
}

export const vscodeIntegration = new VSCodeIntegration()