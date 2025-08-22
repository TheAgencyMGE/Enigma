import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlowCardProps {
  children?: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  glowColor?: 'primary' | 'secondary' | 'accent';
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const GlowCard = ({
  children,
  title,
  description,
  className,
  glowColor = 'primary',
  intensity = 'medium',
  animated = true,
  onClick,
  style
}: GlowCardProps) => {
  const glowStyles = {
    primary: {
      low: 'hover:shadow-[0_0_20px_hsl(262_100%_62%_/_0.3)]',
      medium: 'hover:shadow-[0_0_40px_hsl(262_100%_62%_/_0.4)]',
      high: 'hover:shadow-[0_0_60px_hsl(262_100%_62%_/_0.6)]'
    },
    secondary: {
      low: 'hover:shadow-[0_0_20px_hsl(217_91%_60%_/_0.3)]',
      medium: 'hover:shadow-[0_0_40px_hsl(217_91%_60%_/_0.4)]',
      high: 'hover:shadow-[0_0_60px_hsl(217_91%_60%_/_0.6)]'
    },
    accent: {
      low: 'hover:shadow-[0_0_20px_hsl(142_76%_55%_/_0.3)]',
      medium: 'hover:shadow-[0_0_40px_hsl(142_76%_55%_/_0.4)]',
      high: 'hover:shadow-[0_0_60px_hsl(142_76%_55%_/_0.6)]'
    }
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden gradient-surface border-border/50 backdrop-blur-sm",
        "transition-all duration-500 hover:scale-105",
        glowStyles[glowColor][intensity],
        animated && "hover:animate-pulse-glow",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      style={style}
    >
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="relative z-10">
        {(title || description) && (
          <CardHeader>
            {title && (
              <CardTitle className={cn(
                "text-xl font-bold",
                glowColor === 'primary' && "text-primary-neon",
                glowColor === 'secondary' && "text-secondary-bright",
                glowColor === 'accent' && "text-accent-bright"
              )}>
                {title}
              </CardTitle>
            )}
            {description && (
              <CardDescription className="text-muted-foreground">
                {description}
              </CardDescription>
            )}
          </CardHeader>
        )}
        {children && (
          <CardContent>
            {children}
          </CardContent>
        )}
      </div>
    </Card>
  );
};