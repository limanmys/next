import { useEffect } from "react"

interface IIframeProps {
  content: string
}

const Iframe = (props: IIframeProps) => {
  let iframe_ref: HTMLIFrameElement | null = null
  const writeHTML = (frame: HTMLIFrameElement) => {
    if (!frame) {
      return
    }
    iframe_ref = frame
    let doc = frame.contentDocument
    if (doc) {
      doc.open()
      doc.write(props.content)
      doc.close()
    }
    frame.style.width = "100%"
  }

  useEffect(() => {
    if (iframe_ref) {
      iframe_ref.onload = () => {
        if (iframe_ref && iframe_ref.contentWindow) {
          iframe_ref.contentWindow.window.location.hash =
            window.location.hash.split("#/")[1] || "#/"
        }
      }
    }

    const onHashChanged = () => {
      iframe_ref &&
        iframe_ref.contentWindow &&
        (iframe_ref.contentWindow.window.location.hash =
          window.location.hash.split("#/")[1] || "#/")
    }

    window.addEventListener("hashchange", onHashChanged)

    return () => {
      iframe_ref && (iframe_ref.onload = null)
      window.removeEventListener("hashchange", onHashChanged)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframe_ref])

  return (
    <>
      <iframe
        src="about:blank"
        ref={writeHTML}
        className="border-0"
        style={{
          height: "calc(100vh - 4rem - 1px)",
        }}
      />
    </>
  )
}
export default Iframe
