interface Plugin {
  id: string
  name: string
  version: string
  author: string
  description: string
  category: string
  price: string
  installed: boolean
  enabled: boolean
  settings?: Record<string, any>
  permissions: string[]
  hooks: string[]
}

class PluginManager {
  private plugins: Map<string, Plugin> = new Map()
  private hooks: Map<string, Function[]> = new Map()

  install(plugin: Plugin) {
    this.plugins.set(plugin.id, { ...plugin, installed: true, enabled: false })
    localStorage.setItem('installed-plugins', JSON.stringify(Array.from(this.plugins.values())))
  }

  uninstall(pluginId: string) {
    this.plugins.delete(pluginId)
    localStorage.setItem('installed-plugins', JSON.stringify(Array.from(this.plugins.values())))
  }

  enable(pluginId: string) {
    const plugin = this.plugins.get(pluginId)
    if (plugin) {
      plugin.enabled = true
      this.loadPluginHooks(plugin)
    }
  }

  disable(pluginId: string) {
    const plugin = this.plugins.get(pluginId)
    if (plugin) {
      plugin.enabled = false
      this.unloadPluginHooks(plugin)
    }
  }

  private loadPluginHooks(plugin: Plugin) {
    plugin.hooks.forEach(hookName => {
      if (!this.hooks.has(hookName)) {
        this.hooks.set(hookName, [])
      }
    })
  }

  private unloadPluginHooks(plugin: Plugin) {
    plugin.hooks.forEach(hookName => {
      const hooks = this.hooks.get(hookName) || []
      this.hooks.set(hookName, hooks.filter(h => h.pluginId !== plugin.id))
    })
  }

  executeHook(hookName: string, data: any) {
    const hooks = this.hooks.get(hookName) || []
    return hooks.reduce((result, hook) => hook(result), data)
  }

  getInstalledPlugins() {
    return Array.from(this.plugins.values()).filter(p => p.installed)
  }

  getEnabledPlugins() {
    return Array.from(this.plugins.values()).filter(p => p.installed && p.enabled)
  }
}

export const pluginManager = new PluginManager()