import * as React from "react";
import { useProgress } from "@react-three/drei";

const defaultDataInterpolation = p => `Loading ${p.toFixed(2)}%`;

function Loader({
  containerStyles,
  innerStyles,
  barStyles,
  dataStyles,
  dataInterpolation = defaultDataInterpolation,
  initialState = active => active,
}) {
  const { active, progress } = useProgress();
  const progressRef = React.useRef(0);
  const rafRef = React.useRef(0);
  const progressSpanRef = React.useRef(null);
  const [shown, setShown] = React.useState(initialState(active));
  React.useEffect(() => {
    let t;
    if (active !== shown) t = setTimeout(() => setShown(active), 300);
    return () => clearTimeout(t);
  }, [shown, active]);
  const updateProgress = React.useCallback(() => {
    if (!progressSpanRef.current) return;
    progressRef.current += (progress - progressRef.current) / 2;
    if (progressRef.current > 0.95 * progress || progress === 100) progressRef.current = progress;
    progressSpanRef.current.innerText = dataInterpolation(progressRef.current);
    if (progressRef.current < progress) rafRef.current = requestAnimationFrame(updateProgress);
  }, [dataInterpolation, progress]);
  React.useEffect(() => {
    updateProgress();
    return () => cancelAnimationFrame(rafRef.current);
  }, [updateProgress]);
  return React.createElement(
    "div",
    {
      style: { ...styles.container, opacity: active ? 1 : 0, ...containerStyles },
      className: "bg-spaceship-black",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      null,
      /*#__PURE__*/ React.createElement(
        "div",
        {
          style: { ...styles.inner, ...innerStyles },
          className: "bg-spaceship-black",
        },
        /*#__PURE__*/ React.createElement("div", {
          style: { ...styles.bar, transform: `scaleX(${progress / 100})`, ...barStyles },
          className: "bg-cloud-pink",
        }),
        /*#__PURE__*/ React.createElement("span", {
          ref: progressSpanRef,
          style: { ...styles.data, ...dataStyles },
        })
      )
    )
  );
}
const styles = {
  container: {
    pointerEvents: "none",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 1s ease",
    zIndex: 40,
  },
  inner: {
    width: 100,
    height: 3,
    textAlign: "center",
  },
  bar: {
    height: 3,
    width: "100%",
    transition: "transform 200ms",
    transformOrigin: "left center",
  },
  data: {
    display: "none",
  },
};

export { Loader };
