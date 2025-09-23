import { animate, type MotionValue, useMotionValue } from "framer-motion";

type Result = {
  count: MotionValue<number>;
  start: () => () => void;
};

export const useAnimatedCounter = (
  maxValue: number,
  initialValue = 0,
  duration = 1,
): Result => {
  const count = useMotionValue(initialValue);

  return {
    count,
    start() {
      const animation = animate(count, maxValue, { duration });

      return animation.stop;
    },
  };
};
