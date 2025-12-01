'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              HenMo AI
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            <Link href="http://localhost:3001/login" className="text-blue-600 hover:text-blue-700">Login</Link>
            <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Sign Up
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/features" className="block px-3 py-2 text-gray-600">Features</Link>
              <Link href="/pricing" className="block px-3 py-2 text-gray-600">Pricing</Link>
              <Link href="/about" className="block px-3 py-2 text-gray-600">About</Link>
              <Link href="/blog" className="block px-3 py-2 text-gray-600">Blog</Link>
              <Link href="/contact" className="block px-3 py-2 text-gray-600">Contact</Link>
              <Link href="http://localhost:3001/login" className="block px-3 py-2 text-blue-600">Login</Link>
              <Link href="/signup" className="block px-3 py-2 bg-blue-600 text-white rounded-lg">Sign Up</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}