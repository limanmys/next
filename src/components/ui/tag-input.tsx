import { X } from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TagInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
    value?: string[]
    onChange: (value: string[]) => void
    placeholder?: string
    separator?: string
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
    ({ className, value = [], onChange, placeholder, separator = ",", ...props }, ref) => {
        const [inputValue, setInputValue] = React.useState("")

        // Ensure value is always an array
        const safeValue = Array.isArray(value) ? value : []

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value)
        }

        const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" || e.key === separator) {
                e.preventDefault()
                addTag()
            } else if (e.key === "Backspace" && inputValue === "" && safeValue.length > 0) {
                removeTag(safeValue.length - 1)
            }
        }

        const addTag = () => {
            const trimmedValue = inputValue.trim()
            if (trimmedValue && !safeValue.includes(trimmedValue)) {
                onChange([...safeValue, trimmedValue])
                setInputValue("")
            }
        }

        const removeTag = (index: number) => {
            const newValue = safeValue.filter((_, i) => i !== index)
            onChange(newValue)
        }

        const handleContainerClick = () => {
            const input = document.querySelector(`input[placeholder="${placeholder}"]`) as HTMLInputElement
            input?.focus()
        }

        return (
            <div
                className={cn(
                    "flex w-full flex-wrap items-center gap-1",
                    className
                )}
                onClick={handleContainerClick}
            >
                {safeValue.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                        <button
                            type="button"
                            className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onClick={(e) => {
                                e.stopPropagation()
                                removeTag(index)
                            }}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
                <Input
                    ref={ref}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    onBlur={addTag}
                    placeholder={safeValue.length === 0 ? placeholder : ""}
                    {...props}
                />
            </div>
        )
    }
)

TagInput.displayName = "TagInput"

export { TagInput }
