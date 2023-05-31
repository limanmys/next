import Loading from "./ui/loading"

export default function IframeLoader() {
  return (
    <>
      <div
        id="iframe-loader"
        className="flex w-full items-center justify-center"
        style={{
          height: "calc(100vh - 4rem - 1px)",
        }}
      >
        <Loading />
      </div>
    </>
  )
}
