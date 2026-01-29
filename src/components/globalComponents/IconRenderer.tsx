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
        'hospitals': 'Hospital',
        'utensils': 'Utensils',
        'restaurant': 'Utensils',
        'restaurants': 'Utensils',
        'bus': 'Bus',
        'transportation': 'Bus',
        'shopping-cart': 'ShoppingCart',
        'market': 'ShoppingCart',
        'markets': 'ShoppingCart',
        'wrench': 'Wrench',
        'briefcase': 'Briefcase',
        'graduation-cap': 'GraduationCap',
        'school': 'School',
        'schools': 'School',
        'heart': 'Heart',
        'home': 'Home',
        'car': 'Car',
        'coffee': 'Coffee',
        'cafe': 'Coffee',
        'cafes': 'Coffee',
        'landmark': 'Landmark',
        'pill': 'Pill',
        'pharmacy': 'Pill',
        'pharmacies': 'Pill',
    };

    const normalizedName = name.toLowerCase().trim();
    let lucideName = iconMap[normalizedName];

    if (!lucideName) {
        // Try singular if plural (basic check)
        if (normalizedName.endsWith('s')) {
            const singular = normalizedName.slice(0, -1);
            lucideName = iconMap[singular];
        }
    }

    if (!lucideName) {
        lucideName = (normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1)) as keyof typeof LucideIcons;
    }

    const IconComponent = (LucideIcons[lucideName] as LucideIcon) || LucideIcons.HelpCircle;

    return <IconComponent className={className} size={size} />;
};
