import Link from 'next/link';
import { Twitter, Linkedin, Github, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">HenMo AI</h3>
            <p className="text-gray-400 mb-4">
              Your personal AI assistant for enhanced productivity and learning.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/henmoai" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/henmoai" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://github.com/henmoai" className="text-gray-400 hover:text-white">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://youtube.com/@henmoai" className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/henmoai" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/features" className="hover:text-white">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/documentation" className="hover:text-white">Documentation</Link></li>
              <li><Link href="/api" className="hover:text-white">API</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/security" className="hover:text-white">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center text-gray-400 mb-4">
            <p>&copy; 2024 HenMo AI. All rights reserved.</p>
          </div>
          <div className="text-center text-gray-500 text-sm">
            <p className="mb-2">
              Built with passion by <span className="font-semibold text-gray-300">Henry M. Ugochukwu</span>, Software Engineer
            </p>
            <p>
              8 months of research, development, and sleepless nights (July 2025 - March 2026) • Powered by <span className="font-semibold text-blue-400">HenMo AI</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}