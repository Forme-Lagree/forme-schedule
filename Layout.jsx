import React from 'react';
import { Calendar, Users, Palette } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const navItems = [
    { name: 'ScheduleBuilder', label: 'Builder', icon: Calendar, path: '/' },
    { name: 'AdminDashboard', label: 'Instructors', icon: Users, path: '/AdminDashboard' },
    { name: 'Settings', label: 'Themes', icon: Palette, path: '/Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#111]">
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet" />
      
      {/* Navigation */}
      <nav 
        className="sticky top-0 z-50 border-b border-white/10"
        style={{
          background: 'rgba(17, 17, 17, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a 
              href="/"
              className="flex items-center gap-2 text-white"
            >
              <span 
                className="text-xl tracking-wider"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                FORME L'AGREE
              </span>
            </a>

            {/* Nav Items */}
            <div className="flex items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentPageName === item.name;
                
                return (
                  <a
                    key={item.name}
                    href={item.path}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-medium
                      ${isActive 
                        ? 'bg-white/15 text-white' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}
