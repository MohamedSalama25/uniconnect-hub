import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { Home, Briefcase, Loader2, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { houseService } from "@/features/accommodation-list/services/house.service";
import { serviceService } from "@/features/services/services/service.service";
import { House } from "@/features/accommodation-list/types/house.types";
import { Service } from "@/features/services/types/service.types";

interface GlobalSearchProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function GlobalSearch({ open, setOpen }: GlobalSearchProps) {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 500);
    const [houses, setHouses] = useState<House[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<{ houses: House[], services: Service[] }>({ houses: [], services: [] });

    useEffect(() => {
        const fetchSuggestions = async () => {
            setIsSuggestionsLoading(true);
            try {
                const [housesRes, servicesRes] = await Promise.all([
                    houseService.getAllHouses({ pageSize: 4 }),
                    serviceService.getDashboardServices({ PageSize: 4 })
                ]);
                setSuggestions({
                    houses: housesRes.data || [],
                    services: servicesRes.data || []
                });
            } catch (error) {
                console.error("Suggestions fetch error:", error);
            } finally {
                setIsSuggestionsLoading(false);
            }
        };

        if (open) {
            fetchSuggestions();
            setQuery("");
        }
    }, [open]);

    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setHouses([]);
            setServices([]);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [housesRes, servicesRes] = await Promise.all([
                    houseService.getAllHouses({ Search: debouncedQuery, pageSize: 5 }),
                    serviceService.getDashboardServices({ Search: debouncedQuery, PageSize: 5 })
                ]);
                setHouses(housesRes.data || []);
                setServices(servicesRes.data || []);
            } catch (error) {
                console.error("Search fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [debouncedQuery]);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <div className="relative">
                <CommandInput
                    placeholder="ابحث عن سكن أو خدمة..."
                    value={query}
                    onValueChange={setQuery}
                    className="text-right"
                />
                {isLoading && (
                    <div className="absolute left-10 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>
            <CommandList dir="rtl">
                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                    {isLoading || isSuggestionsLoading ? "جاري التحميل..." : "لا توجد نتائج."}
                </CommandEmpty>

                {/* Suggestions Loading State */}
                {!debouncedQuery.trim() && isSuggestionsLoading && (
                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground font-medium">جاري تحميل الاقتراحات...</span>
                    </div>
                )}

                {/* Suggestions Section (when query is empty) */}
                {!debouncedQuery.trim() && !isSuggestionsLoading && (
                    <>
                        {suggestions.houses.length > 0 && (
                            <CommandGroup heading="اقتراحات السكن">
                                {suggestions.houses.map((item) => (
                                    <CommandItem
                                        key={`sug-h-${item.id}`}
                                        value={item.name}
                                        onSelect={() => runCommand(() => navigate(`/accommodation/${item.id}`))}
                                        className="flex items-center gap-2 cursor-pointer text-right"
                                    >
                                        <Home className="ml-2 h-4 w-4 text-primary" />
                                        <span className="flex-1 font-medium">{item.name}</span>
                                        <span className="text-xs text-muted-foreground">{item.address}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        {suggestions.houses.length > 0 && suggestions.services.length > 0 && <CommandSeparator />}

                        {suggestions.services.length > 0 && (
                            <CommandGroup heading="اقتراحات الخدمات">
                                {suggestions.services.map((item) => (
                                    <CommandItem
                                        key={`sug-s-${item.id}`}
                                        value={item.name}
                                        onSelect={() => runCommand(() => navigate(`/service/${item.id}`))}
                                        className="flex items-center gap-2 cursor-pointer text-right"
                                    >
                                        <Briefcase className="ml-2 h-4 w-4 text-accent" />
                                        <span className="flex-1 font-medium">{item.name}</span>
                                        <span className="text-xs text-muted-foreground">{item.serviceCategoryName}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </>
                )}

                {/* Search Results (when query is NOT empty) */}
                {debouncedQuery.trim() && (
                    <>
                        {houses.length > 0 && (
                            <CommandGroup heading="نتائج السكن">
                                {houses.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        value={item.name}
                                        onSelect={() => runCommand(() => navigate(`/accommodation/${item.id}`))}
                                        className="flex items-center gap-2 cursor-pointer text-right"
                                    >
                                        <Home className="ml-2 h-4 w-4 text-primary" />
                                        <span className="flex-1 font-medium">{item.name}</span>
                                        <span className="text-xs text-muted-foreground">{item.address}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        {houses.length > 0 && services.length > 0 && <CommandSeparator />}

                        {services.length > 0 && (
                            <CommandGroup heading="نتائج الخدمات">
                                {services.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        value={item.name}
                                        onSelect={() => runCommand(() => navigate(`/service/${item.id}`))}
                                        className="flex items-center gap-2 cursor-pointer text-right"
                                    >
                                        <Briefcase className="ml-2 h-4 w-4 text-accent" />
                                        <span className="flex-1 font-medium">{item.name}</span>
                                        <span className="text-xs text-muted-foreground">{item.serviceCategoryName}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </>
                )}
            </CommandList>
        </CommandDialog>
    );
}
