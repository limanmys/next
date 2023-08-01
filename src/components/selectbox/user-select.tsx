import * as React from "react"
import { apiService } from "@/services"
import { Check, ChevronsUpDown, User } from "lucide-react"

import { IUser } from "@/types/user"
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
import { ScrollArea } from "../ui/scroll-area"

export function SelectUser({
  defaultValue,
  onValueChange,
}: {
  defaultValue: string
  onValueChange: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const [users, setUsers] = React.useState<IUser[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    apiService
      .getInstance()
      .get("/settings/users")
      .then((res) => {
        setUsers(res.data)
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
          role="combobox"
          aria-expanded={open}
          variant="outline"
          size="sm"
          className="ml-auto h-8 lg:flex"
          disabled={loading}
        >
          <User className="mr-2 h-4 w-4 shrink-0" />
          {value ? (
            users.find((user) => user.id === value)?.name
          ) : (
            <>
              <span className="text-muted-foreground">
                Kullanıcı seçiniz...
              </span>
            </>
          )}
          {!loading && (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
          {loading && (
            <Icons.spinner className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Kullanıcı ara..." />
          <CommandEmpty>Kullanıcı bulunamadı.</CommandEmpty>
          <ScrollArea className="h-[300px]">
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => {
                    setValue(user.id === value ? "" : user.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
