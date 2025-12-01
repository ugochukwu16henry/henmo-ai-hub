import { Clock, Coffee, Code, Lightbulb } from 'lucide-react';

export default function Journey() {
  const milestones = [
    {
      icon: Lightbulb,
      title: 'Research & Ideation',
      description: 'Months of research into AI capabilities, user needs, and market gaps',
      duration: '2 months'
    },
    {
      icon: Code,
      title: 'Development Phase',
      description: 'Building the core AI platform, security systems, and user interface',
      duration: '4 months'
    },
    {
      icon: Coffee,
      title: 'Sleepless Nights',
      description: 'Countless hours perfecting features, fixing bugs, and optimizing performance',
      duration: 'Many nights'
    },
    {
      icon: Clock,
      title: 'Testing & Refinement',
      description: 'Rigorous testing, user feedback integration, and final polishing',
      duration: '2 months'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The Journey Behind HenMo AI
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            8 months of dedication, research, and countless sleepless nights from July 2025 to March 2026 
            to bring you the most advanced personal AI assistant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {milestones.map((milestone, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <milestone.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
              <p className="text-gray-600 mb-2">{milestone.description}</p>
              <span className="text-sm font-medium text-blue-600">{milestone.duration}</span>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Built with Passion & Purpose</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Every line of code, every feature, and every design decision was crafted with one goal in mind: 
              creating an AI assistant that truly understands and adapts to your needs. From the initial 
              concept to the final deployment, this journey represents months of research, development, 
              and refinement to deliver something truly exceptional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}