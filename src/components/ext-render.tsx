"use client"

import { useEffect } from "react"

function setInnerHTML(elm: HTMLElement, html: string) {
  elm.innerHTML = html

  Array.from(elm.querySelectorAll("script")).forEach((oldScriptEl) => {
    const newScriptEl = document.createElement("script")

    Array.from(oldScriptEl.attributes).forEach((attr) => {
      newScriptEl.setAttribute(attr.name, attr.value)
    })

    const scriptText = document.createTextNode(oldScriptEl.innerHTML)
    newScriptEl.appendChild(scriptText)

    oldScriptEl.parentNode?.replaceChild(newScriptEl, oldScriptEl)
  })
}

interface IExtensionRenderProps {
  c: string
}

export default function ExtensionRender({ c }: IExtensionRenderProps) {
  useEffect(() => {
    const outside = document.getElementById("outside")
    
    if (outside) {
        const node = document.createElement("div")
        node.setAttribute("id", "liman-extension-container")
        outside.appendChild(node)
    }

    const container = document.getElementById("liman-extension-container")
    if (container) setInnerHTML(container, c)

    return () => {
      if (container) {
        container.querySelectorAll("script").forEach((e) => e.remove())
        container.querySelectorAll("style").forEach((e) => e.remove())

        setInnerHTML(container, "")
        container.remove()
      } 
    }
  }, [c])

  return <div id="outside">

  </div>
}
