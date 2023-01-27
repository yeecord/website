import { animate, useMotionValue } from "framer-motion";

export const useAnimatedCounter = (
  maxValue: number,
  initialValue = 0,
  duration = 1
) => {
  const count = useMotionValue(initialValue);

  return {
    count,
    start() {
      const animation = animate(count, maxValue, { duration });

      return animation.stop;
    },
  };
};
