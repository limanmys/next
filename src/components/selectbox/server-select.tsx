import * as React from "react"
import { apiService } from "@/services"
import { Check, ChevronsUpDown, Server } from "lucide-react"

import { IServer } from "@/types/server"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Icons } from "../ui/icons"

export function SelectServer({
  defaultValue,
  onValueChange,
}: {
  defaultValue: string
  onValueChange: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const [servers, setServers] = React.useState<IServer[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    apiService
      .getInstance()
      .get("/servers")
      .then((res) => {
        setServers(res.data)
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
          <div className="flex gap-2 items-center">
            <Server className="h-4 w-4 shrink-0" />
            {value ? (
              servers.find((server) => server.id === value)?.name
            ) : (
              <>
                <span className="text-muted-foreground">Sunucu seçiniz...</span>
              </>
            )}
          </div>

          {!loading && (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
          {loading && (
            <Icons.spinner className="ml-2 h-4 w-4 shrink-0 opacity-50 animate-spin" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[550px] p-0">
        <Command>
          <CommandInput placeholder="Sunucu ara..." />
          <CommandEmpty>Sunucu bulunamadı.</CommandEmpty>
          {/* TODO: Implement scroll-area when fixed.
            https://github.com/radix-ui/primitives/issues/1159

            This issue persists on radix-ui right now so we are gonna wait.
          */}
          <CommandGroup>
            {servers.map((server) => (
              <CommandItem
                key={server.id}
                onSelect={() => {
                  setValue(server.id === value ? "" : server.id)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === server.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {server.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
