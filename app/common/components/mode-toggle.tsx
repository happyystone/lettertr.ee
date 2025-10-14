import { motion } from 'framer-motion';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Theme, useTheme } from 'remix-themes';

import { Button } from '@/common/components/ui/button';

export function ModeToggle() {
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative size-10 overflow-hidden rounded-full"
      onClick={toggleTheme}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === Theme.DARK ? 180 : 0,
          scale: theme === Theme.DARK ? 0 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
        className="absolute"
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem]" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          rotate: theme === Theme.DARK ? 0 : -180,
          scale: theme === Theme.DARK ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
        className="absolute"
      >
        <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
