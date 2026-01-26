import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface IconRendererProps {
    name: string;
    className?: string;
    size?: number;
}

/**
 * Renders a Lucide icon based on its kebab-case or camelCase name.
 * Maps common names used in the service categories icon picker.
 */
export const IconRenderer: React.FC<IconRendererProps> = ({ name, className, size = 20 }) => {
    // Map our predefined names to Lucide component names
    const iconMap: Record<string, keyof typeof LucideIcons> = {
        'hospital': 'Hospital',
        'utensils': 'Utensils',
        'bus': 'Bus',
        'shopping-cart': 'ShoppingCart',
        'wrench': 'Wrench',
        'briefcase': 'Briefcase',
        'graduation-cap': 'GraduationCap',
        'heart': 'Heart',
        'home': 'Home',
        'car': 'Car',
        'coffee': 'Coffee',
        'landmark': 'Landmark',
    };

    const lucideName = iconMap[name] || (name.charAt(0).toUpperCase() + name.slice(1)) as keyof typeof LucideIcons;

    const IconComponent = (LucideIcons[lucideName] as LucideIcon) || LucideIcons.HelpCircle;

    return <IconComponent className={className} size={size} />;
};
