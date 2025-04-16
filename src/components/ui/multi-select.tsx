'use client';
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem as BaseCommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface MultiSelectOption {
    value: string;
    label: string;
}

const MAX_VISIBLE_BADGES = 3;

interface MultiSelectProps {
    options: MultiSelectOption[];
    selected: MultiSelectOption[];
    onChangeAction: (selected: MultiSelectOption[]) => void; // Переименование onChange
    placeholder?: string;
}

interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    onSelect: () => void;
}

function CommandItem({ value, onSelect, isSelected, ...props }: CommandItemProps & { isSelected: boolean }) {
    return (
        <BaseCommandItem
            {...props}
            onClick={onSelect}
            className={cn(
                "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none",
                "hover:bg-accent hover:text-white focus:bg-accent focus:text-white",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
        >
            <Check
                className={cn(
                    "absolute left-2 h-4 w-4 transition-opacity",
                    isSelected ? "opacity-100 text-black" : "opacity-0",
                    "group-hover:text-white"
                )}
            />
            {value}
        </BaseCommandItem>
    );
}


export function MultiSelect({
                                options,
                                selected,
                                onChangeAction,
                                placeholder = "Select items...",
                            }: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option: MultiSelectOption) => {
        if (selected.some(item => item.value === option.value)) {
            onChangeAction(selected.filter(item => item.value !== option.value));
        } else {
            onChangeAction([...selected, option]);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between focus:ring-0 hover:bg-transparent"
                >
                    <div className="flex items-center gap-1 overflow-hidden">
                        {selected.length > 0 ? (
                            <>
                                {selected.slice(0, MAX_VISIBLE_BADGES).map(item => (
                                    <Badge
                                        key={item.value}
                                        variant="secondary"
                                        className="px-2 py-0.5 text-xs truncate"
                                    >
                                        {item.label}
                                    </Badge>
                                ))}
                                {selected.length > MAX_VISIBLE_BADGES && (
                                    <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                                        +{selected.length - MAX_VISIBLE_BADGES} more
                                    </Badge>
                                )}
                            </>
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        placeholder="Search items..."
                        onChange={(e) => setSearchTerm(e.target.value)} // Исправлено использование onChange
                    />
                    <CommandEmpty>No items found.</CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-y-auto">
                        {filteredOptions.map(option => (
                            <CommandItem
                                key={option.value}
                                value={option.label}
                                isSelected={selected.some(item => item.value === option.value)}
                                onSelect={() => {
                                    handleSelect(option);
                                    setSearchTerm("");
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        selected.some(item => item.value === option.value)
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
