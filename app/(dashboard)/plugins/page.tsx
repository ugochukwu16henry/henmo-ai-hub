'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Download, Star, Users, Code, Zap, Shield, BarChart } from 'lucide-react'

const plugins = [
  {
    id: '1',
    name: 'Code Analyzer Pro',
    description: 'Advanced code analysis with security scanning and performance optimization',
    version: '2.1.0',
    author: 'DevTools Inc',
    downloads: 15420,
    rating: 4.8,
    category: 'Development',
    price: 'Free',
    installed: false,
    icon: Code
  },
  {
    id: '2',
    name: 'AI Assistant Plus',
    description: 'Enhanced AI capabilities with custom models and advanced prompting',
    version: '1.5.2',
    author: 'AI Labs',
    downloads: 8930,
    rating: 4.6,
    category: 'AI Tools',
    price: '$9.99/mo',
    installed: true,
    icon: Zap
  },
  {
    id: '3',
    name: 'Security Scanner',
    description: 'Comprehensive security vulnerability detection and remediation',
    version: '3.0.1',
    author: 'SecureCode',
    downloads: 12100,
    rating: 4.9,
    category: 'Security',
    price: '$19.99/mo',
    installed: false,
    icon: Shield
  },
  {
    id: '4',
    name: 'Analytics Dashboard',
    description: 'Advanced analytics and reporting for development metrics',
    version: '1.8.0',
    author: 'DataViz Pro',
    downloads: 6750,
    rating: 4.4,
    category: 'Analytics',
    price: 'Free',
    installed: false,
    icon: BarChart
  }
]

export default function PluginsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [installedPlugins, setInstalledPlugins] = useState(plugins.filter(p => p.installed))

  const categories = ['all', 'Development', 'AI Tools', 'Security', 'Analytics']
  
  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleInstall = (pluginId: string) => {
    const plugin = plugins.find(p => p.id === pluginId)
    if (plugin && !plugin.installed) {
      plugin.installed = true
      setInstalledPlugins([...installedPlugins, plugin])
    }
  }

  const handleUninstall = (pluginId: string) => {
    const plugin = plugins.find(p => p.id === pluginId)
    if (plugin && plugin.installed) {
      plugin.installed = false
      setInstalledPlugins(installedPlugins.filter(p => p.id !== pluginId))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Plugin Marketplace</h1>
          <p className="text-gray-600">Extend your workspace with powerful plugins</p>
        </div>
        <Button>
          <Code className="mr-2 h-4 w-4" />
          Developer Portal
        </Button>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="installed">Installed ({installedPlugins.length})</TabsTrigger>
          <TabsTrigger value="develop">Develop</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search plugins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlugins.map(plugin => (
              <PluginCard
                key={plugin.id}
                plugin={plugin}
                onInstall={() => handleInstall(plugin.id)}
                onUninstall={() => handleUninstall(plugin.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="installed" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {installedPlugins.map(plugin => (
              <PluginCard
                key={plugin.id}
                plugin={plugin}
                onInstall={() => handleInstall(plugin.id)}
                onUninstall={() => handleUninstall(plugin.id)}
                showSettings
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="develop" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Developer Portal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Create and publish your own plugins for the HenMo AI ecosystem.</p>
              <div className="flex gap-4">
                <Button>Create New Plugin</Button>
                <Button variant="outline">View Documentation</Button>
                <Button variant="outline">My Published Plugins</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PluginCard({ plugin, onInstall, onUninstall, showSettings = false }) {
  const Icon = plugin.icon

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{plugin.name}</CardTitle>
              <p className="text-sm text-gray-600">by {plugin.author}</p>
            </div>
          </div>
          <Badge variant="outline">{plugin.category}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{plugin.description}</p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{plugin.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4 text-gray-400" />
              <span>{plugin.downloads.toLocaleString()}</span>
            </div>
          </div>
          <Badge variant="secondary">v{plugin.version}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium text-lg">{plugin.price}</span>
          <div className="flex gap-2">
            {showSettings && (
              <Button variant="outline" size="sm">Settings</Button>
            )}
            {plugin.installed ? (
              <Button variant="destructive" size="sm" onClick={onUninstall}>
                Uninstall
              </Button>
            ) : (
              <Button size="sm" onClick={onInstall}>
                Install
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}