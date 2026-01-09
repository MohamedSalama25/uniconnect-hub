import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { accommodations, services } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { Home, Briefcase } from "lucide-react";

interface GlobalSearchProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function GlobalSearch({ open, setOpen }: GlobalSearchProps) {
    const navigate = useNavigate();

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="ابحث عن سكن أو خدمة..." className="text-right" />
            <CommandList dir="rtl">
                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                    لا توجد نتائج.
                </CommandEmpty>
                <CommandGroup heading="سكن">
                    {accommodations.map((item) => (
                        <CommandItem
                            key={item.id}
                            value={item.title}
                            onSelect={() => runCommand(() => navigate(`/accommodation/${item.id}`))}
                            className="flex items-center gap-2 cursor-pointer text-right"
                        >
                            <Home className="ml-2 h-4 w-4 text-blue-500" />
                            <span className="flex-1">{item.title}</span>
                            <span className="text-xs text-muted-foreground">{item.location}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="خدمات">
                    {services.map((item) => (
                        <CommandItem
                            key={item.id}
                            value={item.name}
                            onSelect={() => runCommand(() => navigate(`/service/${item.id}`))}
                            className="flex items-center gap-2 cursor-pointer text-right"
                        >
                            <Briefcase className="ml-2 h-4 w-4 text-purple-500" />
                            <span className="flex-1">{item.name}</span>
                            <span className="text-xs text-muted-foreground">{item.category}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
