import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquare, Zap, Shield, Brain } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">HenMo AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your Personal AI Assistant
            <span className="text-primary"> Built for You</span>
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            ChatBoss AI helps you learn faster, build better, and achieve more with
            personalized AI conversations and intelligent memory.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register">
              <Button size="lg" className="text-lg">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">Why Choose HenMo AI?</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<Brain className="h-8 w-8 text-primary" />}
            title="Personal Memory"
            description="Store notes, code snippets, and knowledge. Your AI remembers everything."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-primary" />}
            title="Multi-Provider AI"
            description="Choose between Claude, GPT-4, and more. Switch anytime."
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-primary" />}
            title="Secure & Private"
            description="Your data is encrypted and never shared. Complete privacy guaranteed."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-gray-600">
          <p>&copy; 2025 HenMo AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}