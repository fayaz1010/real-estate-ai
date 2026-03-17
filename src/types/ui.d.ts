// Type declarations for UI components
declare module "@/components/ui/button" {
  import * as React from "react";

  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    size?: "default" | "sm" | "lg" | "icon";
    asChild?: boolean;
  }

  const Button: React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  >;

  export { Button, type ButtonProps };
}

declare module "@/components/ui/badge" {
  import * as React from "react";

  interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline";
  }

  const Badge: React.ForwardRefExoticComponent<
    BadgeProps & React.RefAttributes<HTMLDivElement>
  >;

  export { Badge, type BadgeProps };
}

declare module "@/components/ui/input" {
  import * as React from "react";

  interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

  const Input: React.ForwardRefExoticComponent<
    InputProps & React.RefAttributes<HTMLInputElement>
  >;

  export { Input, type InputProps };
}

declare module "@/components/ui/textarea" {
  import * as React from "react";

  interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

  const Textarea: React.ForwardRefExoticComponent<
    TextareaProps & React.RefAttributes<HTMLTextAreaElement>
  >;

  export { Textarea, type TextareaProps };
}

declare module "@/components/ui/skeleton" {
  import * as React from "react";

  interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
  }

  const Skeleton: React.FC<SkeletonProps>;

  export { Skeleton, type SkeletonProps };
}

declare module "@/components/theme-provider" {
  import * as React from "react";

  interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: string;
    storageKey?: string;
  }

  const ThemeProvider: React.FC<ThemeProviderProps>;

  export { ThemeProvider, type ThemeProviderProps };
}
