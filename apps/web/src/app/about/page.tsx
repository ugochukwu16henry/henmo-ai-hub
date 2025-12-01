import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import { User, Target, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About HenMo AI
            </h1>
            <p className="text-xl text-gray-600">
              The story behind your personal AI assistant
            </p>
          </div>

          <div className="prose prose-lg mx-auto mb-16">
            <h2>Our Mission</h2>
            <p>
              HenMo AI was born from a simple yet powerful vision: to create an AI assistant that truly 
              understands and adapts to individual needs. After months of research into existing AI 
              platforms, we identified a critical gap - the lack of personalized, memory-enabled AI 
              that grows with its users.
            </p>

            <h2>The Development Journey</h2>
            <p>
              What started as an idea in July 2025 evolved into an 8-month intensive development 
              process through March 2026. Countless sleepless nights were spent researching AI capabilities, 
              designing user experiences, and building a platform that prioritizes both functionality and security.
            </p>

            <h2>Built by Developers, for Developers</h2>
            <p>
              Created by <strong>Henry M. Ugochukwu</strong>, a passionate software engineer with a 
              vision for democratizing AI access. Every feature was carefully crafted based on real 
              developer needs and feedback from the programming community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">User-Centric Design</h3>
              <p className="text-gray-600">
                Every feature designed with user experience and productivity in mind
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Purpose-Built</h3>
              <p className="text-gray-600">
                Specifically designed for developers, creators, and knowledge workers
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Continuous Innovation</h3>
              <p className="text-gray-600">
                Constantly evolving with new features and AI model integrations
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">The Numbers</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-3xl font-bold text-blue-600">6-8</div>
                <div className="text-sm text-gray-600">Months of Development</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">100+</div>
                <div className="text-sm text-gray-600">Sleepless Nights</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">1000+</div>
                <div className="text-sm text-gray-600">Lines of Code</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">∞</div>
                <div className="text-sm text-gray-600">Passion & Dedication</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}