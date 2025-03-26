import { AutoAnimationPlugin } from "@formkit/auto-animate"

export const opacityAnimation: AutoAnimationPlugin = (
  currentElement,
  action
) => {
  let keyframes: Keyframe[] = []

  if (action === "add") {
    keyframes = [
      { transform: "scale(.98)", opacity: 0 },
      { transform: "scale(1)", opacity: 1 },
    ]
  }
  if (action === "remove") {
    keyframes = [
      { transform: "scale(1)", opacity: 1 },
      { transform: "scale(.98)", opacity: 0 },
    ]
  }
  if (action === "remain") {
    keyframes = [{ opacity: 0.98 }, { opacity: 1 }]
  }

  return new KeyframeEffect(currentElement, keyframes, {
    duration: 300,
    easing: "ease-in-out",
  })
}
