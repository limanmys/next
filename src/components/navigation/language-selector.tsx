import { apiService } from "@/services"
import { Globe2 } from "lucide-react"
import { useTranslation } from "react-i18next"

import { buttonVariants } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

const changeLanguage = (i18n: any, language: any) => {
  window.localStorage.setItem("LANGUAGE", language)
  i18n.changeLanguage(language)

  apiService
    .getInstance()
    .post("/locale", { locale: language })
    .catch(() => {
      // Do nothing
    })
}

const languages = [
  { code: "tr", name: "Türkçe" },
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
]

export default function LanguageSelector() {
  const { t, i18n } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={buttonVariants({
            size: "sm",
            variant: "ghost",
          })}
        >
          <Globe2 className="h-5 w-5" />
          <span className="sr-only">Localization</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Dil Seçimi</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((language) => (
          <DropdownMenuCheckboxItem
            checked={i18n.language === language.code}
            onClick={() => changeLanguage(i18n, language.code)}
            key={language.code}
          >
            {language.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
