import { useState } from "react"
import { ChevronLeft } from "lucide-react"

import { Button } from "./button"
import { Card, CardContent } from "./card"
import { Checkbox } from "./checkbox"
import { Label } from "./label"
import { Separator } from "./separator"

function not(a: string[], b: string[]) {
  return a.filter((value) => b.indexOf(value) === -1)
}

function intersection(a: string[], b: string[]) {
  return a.filter((value) => b.indexOf(value) !== -1)
}

function union(a: string[], b: string[]) {
  return [...a, ...not(b, a)]
}

export default function TransferList() {
  const [checked, setChecked] = useState<string[]>([])
  const [left, setLeft] = useState<string[]>(["a", "b", "c", "d"])
  const [right, setRight] = useState<string[]>(["e", "f", "g", "h"])

  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

  const numberOfChecked = (items: string[]) =>
    intersection(checked, items).length

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const handleToggleAll = (items: string[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items))
    } else {
      setChecked(union(checked, items))
    }
  }
  const handleAllRight = () => {
    setRight(right.concat(left))
    setLeft([])
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

  const handleAllLeft = () => {
    setLeft(left.concat(right))
    setRight([])
  }

  const customList = (items: string[]) => (
    <Card>
      <CardContent className="mt-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select_all"
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            disabled={items.length === 0}
          />
          <Label
            htmlFor="select_all"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Tümünü seç
          </Label>
        </div>

        <Separator className="my-6" />
        <div className="flex flex-col gap-5">
          {items.map((value) => {
            return (
              <div className="flex items-center space-x-2" key={value}>
                <Checkbox
                  id={value}
                  onClick={handleToggle(value)}
                  checked={checked.indexOf(value) !== -1}
                />
                <Label
                  htmlFor={value}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {value}
                </Label>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <>
      <div className="grid grid-cols-2">
        {customList(left)}
        <div className="buttons">
          <Button>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        {customList(right)}
      </div>
    </>
  )
}
