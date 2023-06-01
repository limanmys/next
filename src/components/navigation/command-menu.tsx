import { useEffect, useState } from "react"
import { CommandLoading } from "cmdk"
import { Search } from "lucide-react"

import { useDebounce } from "@/lib/debounce"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import { Input } from "../ui/input"
import Loading from "../ui/loading"

export default function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({} as any)

  useEffect(() => {
    setResults({})
    setLoading(true)
    fetch(`https://liman.io/api/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "liman-token":
          "P53xvcLDByZeEf9Tb7Ksjfd2COrYTxK8JfCtct2UPOTSTMRKaTOIMoOlxJUceQYj",
      },
      body: JSON.stringify({
        query: "",
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setResults(res)
        setLoading(false)
      })

    const down = (e: KeyboardEvent) => {
      setTimeout(() => {
        if (e.key === "k" && e.metaKey) {
          setOpen((open) => !open)
        }
      }, 200)
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const changeText = useDebounce((text: string) => {
    setResults({})
    setLoading(true)
    fetch(`https://liman.io/api/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "liman-token":
          "P53xvcLDByZeEf9Tb7Ksjfd2COrYTxK8JfCtct2UPOTSTMRKaTOIMoOlxJUceQYj",
      },
      body: JSON.stringify({
        query: text,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setResults(res)
        setLoading(false)
      })
  }, 500)

  return (
    <>
      <div className="relative w-[500px] px-2" onClick={() => setOpen(true)}>
        <Input type="text" placeholder="Arama..." />
        <kbd className="pointer-events-none absolute right-11 top-[11px] inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
        <Search className="absolute right-5 top-3 h-4 w-4" />
      </div>
      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          placeholder="Arama yapın..."
          value={value}
          onValueChange={(text: string) => {
            changeText(text)
            setValue(text)
          }}
        />
        <CommandList>
          {loading && (
            <CommandLoading>
              <div className="flex h-[200px] w-full items-center justify-center">
                <Loading />
              </div>
            </CommandLoading>
          )}

          {Object.keys(results).map((key: any, i: number) => {
            return (
              <CommandGroup heading={key} key={key + 1}>
                {results[key].map((item: any) => {
                  return (
                    <CommandItem key={item.name} value={item.name + i}>
                      {item.name}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}
