'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  isCollapsed: boolean;
  toggle: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  isCollapsed: false,
  toggle: () => {},
  close: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const updateLayout = useCallback(() => {
    const width = window.innerWidth;
    if (width < 768) {
      // Mobile: sidebar hidden by default
      setIsCollapsed(false);
      setIsOpen(false);
    } else if (width < 1024) {
      // Tablet: sidebar collapsed (icon-only)
      setIsCollapsed(true);
      setIsOpen(false);
    } else {
      // Desktop: sidebar full
      setIsCollapsed(false);
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [updateLayout]);

  const toggle = () => {
    const width = window.innerWidth;
    if (width < 768) {
      setIsOpen((prev) => !prev);
    } else if (width < 1024) {
      setIsCollapsed((prev) => !prev);
    }
  };

  const close = () => setIsOpen(false);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <SidebarContext.Provider value={{ isOpen, isCollapsed, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
}
