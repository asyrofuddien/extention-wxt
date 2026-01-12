import { Moon, Sun, Zap, Sparkles, Sunset, ScanLine } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from './theme-provider';

const themes = [
  {
    name: 'light',
    label: 'Light',
    icon: Sun,
    iconClass: 'text-yellow-500',
  },
  {
    name: 'dark',
    label: 'Dark',
    icon: Moon,
    iconClass: 'text-slate-400',
  },
  {
    name: 'neo-brutalism',
    label: 'Neo-Brutalism',
    icon: Zap,
    iconClass: 'text-black dark:text-yellow-400',
  },
  {
    name: 'purple',
    label: 'Purple',
    icon: Sparkles,
    iconClass: 'text-purple-500',
  },
  {
    name: 'sunset-horizon',
    label: 'Sunset Horizon',
    icon: Sunset,
    iconClass: 'text-orange-500',
  },
  {
    name: 'cyber-punk',
    label: 'Cyber Punk',
    icon: ScanLine,
    iconClass: 'text-pink-500',
  },
];

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  // Get current theme's icon
  const currentTheme = themes.find((t) => t.name === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <CurrentIcon className={`h-[1.2rem] w-[1.2rem] ${currentTheme.iconClass}`} />
          <span>{currentTheme.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map(({ name, label, icon: Icon, iconClass }) => (
          <DropdownMenuItem key={name} onClick={() => setTheme(name)} className={theme === name ? 'bg-accent' : ''}>
            <Icon className={`mr-2 h-4 w-4 ${iconClass}`} />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
