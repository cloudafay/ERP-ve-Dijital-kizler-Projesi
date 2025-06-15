import React from 'react';
import { Button } from './ui/button';
import { Home, ArrowLeft } from 'lucide-react';

interface BackToHomeButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showIcon?: boolean;
  text?: string;
}

const BackToHomeButton: React.FC<BackToHomeButtonProps> = ({
  className = '',
  variant = 'outline',
  size = 'default',
  showIcon = true,
  text = 'Ana Sayfaya Dön'
}) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <Button 
      onClick={handleGoHome}
      variant={variant}
      size={size}
      className={`
        flex items-center gap-2 
        bg-white/90 backdrop-blur-sm border-gray-300 
        hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700
        transition-all duration-200 shadow-sm hover:shadow-md
        ${className}
      `}
    >
      {showIcon && <ArrowLeft className="w-4 h-4" />}
      <Home className="w-4 h-4" />
      {text}
    </Button>
  );
};

export default BackToHomeButton; 