import { http } from "@/services"
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

  http
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
  const { t, i18n } = useTranslation("common")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={buttonVariants({
            variant: "ghost",
          })}
        >
          <Globe2 className="size-5" />
          <span className="sr-only">Localization</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{t("language_selector.title")}</DropdownMenuLabel>
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
