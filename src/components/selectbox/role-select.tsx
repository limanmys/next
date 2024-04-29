import * as React from "react"
import { apiService } from "@/services"
import { Check, ChevronsUpDown, FileInput } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IRole } from "@/types/role"
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

export function SelectRole({
  defaultValue,
  onValueChange,
}: {
  defaultValue: string
  onValueChange: (value: string) => void
}) {
  const { t } = useTranslation("components")

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const [roles, setRoles] = React.useState<IRole[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    apiService
      .getInstance()
      .get("/settings/roles")
      .then((res) => {
        setRoles(res.data)
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
          className="ml-auto h-8 w-full justify-between lg:flex"
          disabled={loading}
        >
          <div className="flex items-center">
            <FileInput className="mr-2 size-4 shrink-0" />
            {value ? (
              roles.find((role) => role.id === value)?.name
            ) : (
              <span className="text-muted-foreground">
                {t("select.role.select_placeholder")}
              </span>
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
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[300px] p-0">
        <Command>
          <CommandInput placeholder={t("select.role.search_placeholder")} />
          <CommandEmpty>{t("select.role.not_found")}</CommandEmpty>
          <CommandList>
            <ScrollArea className="h-[300px]">
              <CommandGroup>
                {roles.map((role) => (
                  <CommandItem
                    key={role.id}
                    onSelect={() => {
                      setValue(role.id === value ? "" : role.id)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        value === role.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {role.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
