import { ChevronRight, LucideIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"
import { http } from "@/services"

import { Button } from "../ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"

interface ISettingsItemChild {
  id: string
  title: string
  href: string
  icon: LucideIcon
  requiresLdap?: boolean
}

interface ISettingsItemProps {
  id?: string
  href: string
  exact?: boolean
  title: string
  icon: LucideIcon
  classNames?: string
  children?: ISettingsItemChild[]
}

export default function SettingsItem(props: ISettingsItemProps) {
  const router = useRouter()
  const { t } = useTranslation("common")
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [ldapEnabled, setLdapEnabled] = useState(false)

  // Check if this item or any of its children is active
  const isActive = () => {
    if (props.children) {
      return props.children.some(child => 
        router.asPath.includes(child.href)
      )
    }
    return props.exact
      ? router.asPath === props.href
      : router.asPath.includes(props.href)
  }

  // Load LDAP configuration if needed
  useEffect(() => {
    if (props.children?.some(child => child.requiresLdap)) {
      http
        .get("/settings/access/ldap/configuration")
        .then((res) => {
          if (res.data.active) {
            setLdapEnabled(true)
          }
        })
        .catch(() => {
          // Silently handle error
        })
    }
  }, [props.children])

  // Auto-expand if any child is active
  useEffect(() => {
    if (props.children) {
      const hasActiveChild = props.children.some(child => 
        router.asPath === child.href || router.asPath.includes(child.href)
      )
      setIsCollapsed(!hasActiveChild)
    }
  }, [props.children, router.asPath])

  // Toggle collapsed state
  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Filter enabled children
  const enabledChildren = props.children?.filter(child => 
    child.requiresLdap ? ldapEnabled : true
  ) || []

  // If no children, render as regular link
  if (!props.children || props.children.length === 0) {
    return (
      <Link href={props.href}>
        <Button
          variant={isActive() ? "secondary" : "ghost"}
          size="sm"
          className={cn("mb-1 w-full justify-start gap-2", props.classNames)}
        >
          <props.icon className="size-4" />
          {props.title}
        </Button>
      </Link>
    )
  }

  // Render as collapsible with children
  return (
    <div className="mb-1">
      <Collapsible
        open={!isCollapsed}
        onOpenChange={toggleCollapsed}
      >
        <CollapsibleTrigger className="w-full">
          <Button
            variant={isActive() && isCollapsed ? "secondary" : isCollapsed ? "ghost" : "secondary"}
            size="sm"
            className="relative flex w-full justify-between gap-2"
            as="div"
          >
            <div className="flex items-center gap-2">
              <props.icon className="size-4" />
              {props.title}
            </div>
            <ChevronRight
              className={cn(
                "size-4 transition-transform",
                !isCollapsed && "rotate-90"
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="animated-collapsible">
          <div className="my-1 flex flex-col gap-y-[3px] rounded-md border p-1">
            {enabledChildren.map((child) => (
              <Link href={child.href} key={child.href}>
                <Button
                  variant={router.asPath === child.href ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <child.icon className="size-4" />
                  {t(`sidebar.settings.${child.id}`, child.title)}
                </Button>
              </Link>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
