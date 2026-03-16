import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from "./ui/command";

interface props {
  options: Array<{
    id: string;
    value: string;
    children: ReactNode;
  }>;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
  value: string | undefined;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
}

const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "select an option",
  className,
}: props) => {
  const [open, setOpen] = useState(false);
  const selectOption = options.find((option) => option.value === value);
  return (
    <>
      <Button
        type="button"
        variant={"outline"}
        onClick={() => setOpen(true)}
        className={cn(
          "h-9 justify-between font-normal px-2",
          !selectOption && "text-muted-foreground",
          className,
        )}
      >
        <div>{selectOption?.children ?? placeholder}</div>
        <ChevronsUpDownIcon />
      </Button>
      <CommandResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        shouldFilter={!onSearch}
      >
        <CommandInput placeholder="Search..." onValueChange={onSearch} />
        <CommandList>
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">
              No options found
            </span>
          </CommandEmpty>
          {options.map((option) => (
            <CommandItem
              key={option.id}
              onSelect={() => {
                onSelect(option.value);
                setOpen(false);
              }}
            >
              {option.children}
            </CommandItem>
          ))}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  );
};

export default CommandSelect;
