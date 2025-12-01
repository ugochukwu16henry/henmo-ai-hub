import { Bot, Database, Globe, Zap, Lock, BarChart } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Bot,
      title: 'Multi-AI Provider',
      description: 'Switch between Claude, GPT-4, and more AI models seamlessly'
    },
    {
      icon: Database,
      title: 'Personal Memory',
      description: 'Store and retrieve your knowledge with intelligent search'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Use anywhere, anytime with cloud synchronization'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance for instant responses'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and privacy protection'
    },
    {
      icon: BarChart,
      title: 'Usage Analytics',
      description: 'Track your productivity and AI usage patterns'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Developers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to supercharge your productivity with AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}