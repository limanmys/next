import { http } from "@/services"
import { CommandLoading } from "cmdk"
import { Search } from "lucide-react"
import { useRouter } from "next/router"
import { Dispatch, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useDebounce } from "@/lib/debounce"

import { Input } from "../ui/input"
import Loading from "../ui/loading"

const search = (
  query: string,
  setLoading: Dispatch<any>,
  setResults: Dispatch<any>
) => {
  setResults({})
  setLoading(true)
  http
    .post("/search", {
      query: query,
    })
    .then((res) => {
      setLoading(false)
      setResults(res.data)
    })
}

export default function CommandMenu() {
  const router = useRouter()
  const { t } = useTranslation("common")

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({} as any)

  useEffect(() => {
    search("", setLoading, setResults)

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
    search(text, setLoading, setResults)
  }, 500)

  useEffect(() => {
    setLoading(true)
    setResults({})
  }, [value])

  return (
    <>
      <div
        className="relative hidden px-2 md:block lg:w-[500px]"
        onClick={() => setOpen(true)}
      >
        <Input type="text" placeholder={t("command_menu.search")} />
        <kbd className="pointer-events-none absolute right-11 top-[0.5rem] inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
        <Search className="absolute right-5 top-[0.6rem] size-4 text-muted-foreground" />
      </div>
      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          placeholder={t("command_menu.search_placeholder")}
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

          {Object.keys(results).length === 0 && !loading && (
            <CommandEmpty>{t("command_menu.no_results")}</CommandEmpty>
          )}

          {Object.keys(results).map((key: any, i: number) => {
            return (
              <CommandGroup heading={key} key={key + 1}>
                {results[key].map((item: any) => {
                  return (
                    <CommandItem
                      key={item.name}
                      value={item.name + i}
                      onSelect={() => {
                        router.push(item.url)
                        window.dispatchEvent(new CustomEvent("liman:extension-reload"))
                        setValue("")
                        changeText("")
                        setOpen(false)
                      }}
                    >
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
