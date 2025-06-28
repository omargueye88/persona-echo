import React from 'react';
import { Eye, VenetianMask as Mask, Users } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'default' | 'minimal' | 'icon-only';
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: {
      container: 'h-8',
      icon: 'w-6 h-6',
      text: 'text-lg',
      spacing: 'space-x-2'
    },
    md: {
      container: 'h-10',
      icon: 'w-8 h-8',
      text: 'text-xl',
      spacing: 'space-x-3'
    },
    lg: {
      container: 'h-12',
      icon: 'w-10 h-10',
      text: 'text-2xl',
      spacing: 'space-x-3'
    },
    xl: {
      container: 'h-16',
      icon: 'w-12 h-12',
      text: 'text-4xl',
      spacing: 'space-x-4'
    }
  };

  const currentSize = sizeClasses[size];

  if (variant === 'icon-only') {
    return (
      <div className={`relative ${currentSize.container} ${className}`}>
        <div className="relative">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full blur-sm opacity-30 animate-pulse"></div>
          
          {/* Main icon container */}
          <div className="relative bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full p-2 shadow-lg">
            <Eye className={`${currentSize.icon} text-white`} />
          </div>
          
          {/* Small accent icons */}
          <div className="absolute -top-1 -right-1">
            <div className="bg-dark-bg rounded-full p-1">
              <Mask className="w-3 h-3 text-neon-cyan" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center ${currentSize.spacing} ${className}`}>
        <div className="relative">
          <Eye className={`${currentSize.icon} text-neon-purple`} />
          <Mask className="w-3 h-3 text-neon-cyan absolute -bottom-1 -right-1" />
        </div>
        {showText && (
          <span className={`font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent ${currentSize.text}`}>
            Persona Echo
          </span>
        )}
      </div>
    );
  }

  // Default variant - full featured logo
  return (
    <div className={`flex items-center ${currentSize.spacing} ${className}`}>
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple rounded-full blur-md opacity-40 animate-pulse scale-110"></div>
        
        {/* Main logo container */}
        <div className="relative bg-gradient-to-br from-dark-card to-dark-surface rounded-full p-3 border-2 border-gradient-to-r from-neon-purple to-neon-cyan shadow-2xl">
          {/* Central eye icon */}
          <div className="relative">
            <Eye className={`${currentSize.icon} text-transparent bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text`} 
                 style={{ 
                   filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.5))',
                   WebkitBackgroundClip: 'text',
                   backgroundClip: 'text'
                 }} />
            
            {/* Pupil effect */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
          </div>
          
          {/* Floating mask icons */}
          <div className="absolute -top-2 -right-1 animate-bounce" style={{ animationDelay: '0.5s' }}>
            <div className="bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full p-1 shadow-lg">
              <Mask className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <div className="absolute -bottom-1 -left-2 animate-bounce" style={{ animationDelay: '1s' }}>
            <div className="bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full p-1 shadow-lg">
              <Users className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
        
        {/* Orbiting particles */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
          <div className="absolute top-0 left-1/2 w-1 h-1 bg-neon-purple rounded-full transform -translate-x-1/2"></div>
          <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-neon-cyan rounded-full transform -translate-x-1/2"></div>
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
          <div className="absolute top-1/2 left-0 w-1 h-1 bg-neon-cyan rounded-full transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 right-0 w-1 h-1 bg-neon-purple rounded-full transform -translate-y-1/2"></div>
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple bg-clip-text text-transparent ${currentSize.text}`}>
            Persona Echo
          </span>
          <span className="text-xs text-gray-400 font-medium tracking-wider">
            SOCIAL DEDUCTION
          </span>
        </div>
      )}
    </div>
  );
};