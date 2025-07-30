import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn(
      'bg-primary rounded-lg flex items-center justify-center',
      sizeClasses[size],
      className
    )}>
      {/* Logo placeholder - replace this with actual logo image */}
      <span className="text-primary-foreground font-bold text-sm">A</span>
      
      {/* To use a custom logo image, replace the span above with:
          <img 
            src="/logo.png" 
            alt="ALMASU Logo" 
            className="w-full h-full object-contain"
          />
      */}
    </div>
  );
}

/*
LOGO STORAGE LOCATION:
- Store your logo file in: public/logo.png
- Or use any CDN URL in the src attribute
- Recommended logo sizes: 32x32px, 64x64px, 128x128px
- Format: PNG with transparent background preferred
- The logo will be automatically sized based on the 'size' prop
*/
