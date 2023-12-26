// Inspired by react-hot-toast library
import * as React from "react"
import { useTranslation } from "react-i18next"
import { ExternalToast, toast as SonnerToast } from "sonner"

function useToast() {
  const { t } = useTranslation("common")

  const sonnerMigrator = ({
    title,
    description,
    variant,
  }: {
    title?: React.ReactNode
    description?: React.ReactNode
    variant?: any
  }) => {
    const settings: ExternalToast = {
      description,
      duration: 6000,
      dismissible: true,
    }

    let variant_from_title = ""
    if (title == t("information")) {
      variant_from_title = "info"
    } else if (title == t("success")) {
      variant_from_title = "success"
    } else if (title == t("error")) {
      variant_from_title = "error"
    } else if (title == t("warning")) {
      variant_from_title = "warning"
    }

    if (variant) {
      variant_from_title = variant
    }

    switch (variant_from_title) {
      case "success":
        return SonnerToast.success(title, settings)
      case "error":
      case "destructive":
        return SonnerToast.error(title, settings)
      case "warning":
        return SonnerToast.warning(title, settings)
      case "info":
        return SonnerToast.info(title, settings)
      default:
        return SonnerToast(title, settings)
    }
  }

  return {
    toast: sonnerMigrator,
  }
}

export { useToast }
