import { useEffect, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Save,
  Search,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "./button"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Checkbox } from "./checkbox"
import { Input } from "./input"
import { Label } from "./label"
import { ScrollArea } from "./scroll-area"
import { Separator } from "./separator"
import { Skeleton } from "./skeleton"

interface ITransferListItem {
  id: string
  name: string
}

interface ITransferListProps<T extends ITransferListItem> {
  items: T[]
  selected?: T[]
  leftTitle: string
  rightTitle: string
  loading: boolean
  onSave?: (items: T[]) => void
  renderName?: keyof T
}

const TransferList = <T extends ITransferListItem>(
  props: ITransferListProps<T>
) => {
  const { t } = useTranslation("components")

  const [checked, setChecked] = useState<T[]>([])
  const [left, setLeft] = useState<T[]>([])
  const [right, setRight] = useState<T[]>([])
  const [leftSearch, setLeftSearch] = useState<string>("")
  const [rightSearch, setRightSearch] = useState<string>("")

  const handleSelectedProp = () => {
    if (!props.selected) return

    // Remove selected items from left side
    setLeft((prev) =>
      prev.filter(
        (object1) =>
          !props.selected?.some((object2) => object1.id === object2.id)
      )
    )
    setRight(props.selected)
  }

  useEffect(() => {
    setLeft(props.items)
    handleSelectedProp()
  }, [props.items, props.selected])

  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

  function not(a: T[], b: T[]) {
    return a.filter((value) => b.indexOf(value) === -1)
  }

  function intersection(a: T[], b: T[]) {
    return a.filter((value) => b.indexOf(value) !== -1)
  }

  function union(a: T[], b: T[]) {
    return [...a, ...not(b, a)]
  }

  const numberOfChecked = (items: T[]) => intersection(checked, items).length

  const handleToggle = (value: T) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const handleToggleAll = (items: T[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items))
    } else {
      setChecked(union(checked, items))
    }
  }

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked))
    setLeft(not(left, leftChecked))
    setChecked(not(checked, leftChecked))
  }

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked))
    setRight(not(right, rightChecked))
    setChecked(not(checked, rightChecked))
  }

  const customList = (
    items: T[],
    title: string,
    search: string,
    setSearch: (e: string) => void
  ) => {
    return (
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`select_all_${title}`}
              onClick={handleToggleAll(items)}
              checked={
                numberOfChecked(items) === items.length && items.length !== 0
              }
              disabled={items.length === 0}
            />
            <Label
              htmlFor={`select_all_${title}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("transfer.select_all")}{" "}
              {items.length > 0 &&
                t("transfer.selected", {
                  selected: numberOfChecked(items),
                  total: items.length,
                })}
            </Label>
          </div>

          <Separator className="my-6" />
          <div className="search relative">
            <Input
              placeholder={t("transfer.search")}
              className="mb-6 h-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute right-2 top-2 size-4 text-foreground/70" />
          </div>

          <ScrollArea className="h-72">
            <div className="flex flex-col gap-4">
              {props.loading && (
                <>
                  {[...Array(10)].map((_, index) => (
                    <div className="flex gap-2" key={index}>
                      <Skeleton className="size-4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </>
              )}
              {!props.loading &&
                items.filter((item) => item.name.toLowerCase().includes(search))
                  .length === 0 && (
                  <div className="flex flex-col items-center justify-center gap-3">
                    <FolderOpen className="size-8 text-foreground/70" />
                    <span className="text-sm font-medium leading-none text-foreground/70">
                      {t("transfer.no_records")}
                    </span>
                  </div>
                )}
              {items
                .filter((item) => item.name.toLowerCase().includes(search))
                .map((value) => {
                  return (
                    <div className="flex items-center space-x-2" key={value.id}>
                      <Checkbox
                        id={value.id}
                        onClick={handleToggle(value)}
                        checked={checked.indexOf(value) !== -1}
                      />
                      <Label
                        htmlFor={value.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {
                          (props.renderName
                            ? value[props.renderName]
                            : value.name) as any
                        }
                      </Label>
                    </div>
                  )
                })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="flex gap-5">
        {customList(left, props.leftTitle, leftSearch, setLeftSearch)}
        <div className="buttons flex flex-col items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleCheckedLeft()}
            disabled={rightChecked.length === 0}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => handleCheckedRight()}
            disabled={leftChecked.length === 0}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
        {customList(right, props.rightTitle, rightSearch, setRightSearch)}
      </div>

      {props.onSave && (
        <div className="mt-5 flex justify-end">
          <Button onClick={() => props.onSave && props.onSave(right)}>
            <Save className="mr-2 size-4" /> {t("transfer.save")}
          </Button>
        </div>
      )}
    </div>
  )
}

export default TransferList
