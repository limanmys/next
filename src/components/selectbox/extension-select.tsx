import * as React from "react"
import { http } from "@/services"
import { Check, ChevronsUpDown, ToyBrick } from "lucide-react"

import { IExtension } from "@/types/extension"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Icons } from "../ui/icons"
import { ScrollArea } from "../ui/scroll-area"

export function SelectExtension({
  defaultValue,
  onValueChange,
  endpoint,
}: {
  defaultValue?: string
  onValueChange: (value: string) => void
  endpoint?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const [extensions, setExtensions] = React.useState<IExtension[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    http
      .get(endpoint || "/extensions")
      .then((res) => {
        if (res.data.selected) {
          setExtensions(res.data.selected)
          if (!defaultValue)
            setValue(
              res.data.selected &&
              res.data.selected.length &&
              res.data.selected[0].id
            )
          return
        }
        setExtensions(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  React.useEffect(() => {
    if (!defaultValue) return
    setValue(defaultValue)
  }, [defaultValue])

  React.useEffect(() => {
    onValueChange(value)
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-3 font-normal"
          disabled={loading}
        >
          <div className="flex items-center gap-2">
            <ToyBrick className="size-4 shrink-0" />
            {value ? (
              extensions.find((extension) => extension.id === value)
                ?.display_name ||
              extensions.find((extension) => extension.id === value)?.name
            ) : (
              <>
                <span className="text-muted-foreground">
                  Eklenti seçiniz...
                </span>
              </>
            )}
          </div>

          {!loading && (
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          )}
          {loading && (
            <Icons.spinner className="ml-2 size-4 shrink-0 animate-spin opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Eklenti ara..." />
          <CommandEmpty>Eklenti bulunamadı.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <ScrollArea className="h-[350px]">
                {extensions.map((extension) => (
                  <CommandItem
                    key={extension.id}
                    onSelect={() => {
                      setValue(extension.id === value ? "" : extension.id)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        value === extension.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {extension.display_name || extension.name}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
