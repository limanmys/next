interface IExtensionFrameOptions {
  container: HTMLDivElement
  html: string
  theme: string | undefined
  signal: AbortSignal
  onReady: () => void
  onReload: () => void
}

export function extensionSearchParamsUrl(
  pathname: string,
  currentSearch: string,
  nextSearch: string
): string | null {
  const current = new URLSearchParams(currentSearch).toString()
  const next = new URLSearchParams(nextSearch).toString()
  if (current === next) return null
  return pathname + (next ? `?${next}` : "")
}

export function mountExtensionFrame({
  container,
  html,
  theme,
  signal,
  onReady,
  onReload,
}: IExtensionFrameOptions): () => void {
  const iframe = document.createElement("iframe")
  let active = true
  const isActive = () => active && !signal.aborted
  const syncHash = () => {
    if (isActive() && iframe.contentWindow) {
      iframe.contentWindow.location.hash =
        window.location.hash.split("#/")[1] || "#/"
    }
  }
  const reload = () => {
    if (isActive()) onReload()
  }
  const onFrameHashChange = (event: Event) => {
    if (isActive()) {
      window.location.hash = (event as CustomEvent<string>).detail
    }
  }

  iframe.style.width = "0px"
  iframe.style.height = "0px"
  iframe.style.backgroundColor = "transparent"
  iframe.setAttribute("allowtransparency", "true")
  // Install before document.write/close, including synchronously completed loads.
  iframe.onload = () => {
    if (!isActive()) return
    syncHash()
    iframe.style.width = "100%"
    iframe.style.height = "var(--container-height)"
    onReady()
  }
  container.appendChild(iframe)
  const frameWindow = iframe.contentWindow
  const frameDocument = iframe.contentDocument
  if (!frameWindow || !frameDocument) {
    iframe.remove()
    throw new Error("Extension frame is unavailable")
  }

  frameDocument.open()
  frameDocument.write(html)
  frameDocument.close()
  for (const [name, content] of [
    ["color-scheme", theme || "light"],
    ["theme-color", theme === "dark" ? "#030711" : "#ffffff"],
  ]) {
    const meta = document.createElement("meta")
    meta.setAttribute("name", name)
    meta.setAttribute("content", content)
    frameDocument.head.appendChild(meta)
  }

  // Register navigation only after writing the initial document.
  frameWindow.addEventListener("beforeunload", reload)
  frameWindow.addEventListener("limanHashChange", onFrameHashChange)
  window.addEventListener("hashchange", syncHash)
  window.addEventListener("liman:extension-reload", reload)

  return () => {
    // Removing an iframe can dispatch beforeunload; it must not start a new load.
    active = false
    iframe.onload = null
    frameWindow.removeEventListener("beforeunload", reload)
    frameWindow.removeEventListener("limanHashChange", onFrameHashChange)
    window.removeEventListener("hashchange", syncHash)
    window.removeEventListener("liman:extension-reload", reload)
    iframe.remove()
  }
}
