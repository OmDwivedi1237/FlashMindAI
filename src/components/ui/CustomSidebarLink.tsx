// components/ui/CustomSidebarLink.tsx
import React from 'react';
import { SidebarLink } from '@/components/ui/sidebar';

interface CustomSidebarLinkProps {
  link: {
    label: string;
    href: string;
    icon: React.ReactNode;
    onClick?: () => void; // Add onClick prop
  };
  className?: string;
}

const CustomSidebarLink: React.FC<CustomSidebarLinkProps> = ({ link, className }) => {
  return (
    <div
      className={`cursor-pointer ${className}`}
      onClick={link.onClick} // Handle click event
    >
      <SidebarLink link={link} />
    </div>
  );
};

export default CustomSidebarLink;
