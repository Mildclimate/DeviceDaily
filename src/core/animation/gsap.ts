/**
 * GSAP 与 React Native 的桥接：
 * GSAP 只补间普通 JS 对象，onUpdate 中写入 Animated.Value，避免依赖具体适配层
 */

import gsap from 'gsap';
import type { Animated } from 'react-native';

export interface TweenOptions extends gsap.TweenVars {
  duration?: number;
  ease?: string;
}

/** 把 Animated.Value 从 from 补间到 to */
export function tweenValue(
  value: Animated.Value,
  from: number,
  to: number,
  options: TweenOptions = {},
): gsap.core.Tween {
  const proxy = { v: from };
  const { onUpdate, ...vars } = options;
  return gsap.to(proxy, {
    duration: 0.5,
    ease: 'power2.out',
    ...vars,
    v: to,
    onUpdate: () => {
      value.setValue(proxy.v);
      onUpdate?.();
    },
  });
}

/** 数字滚动动画的格式化钩子：value 变化时通过 onUpdate 回调当前数值 */
export function tweenNumber(
  from: number,
  to: number,
  onUpdate: (current: number) => void,
  options: TweenOptions = {},
): gsap.core.Tween {
  const proxy = { v: from };
  return gsap.to(proxy, {
    duration: 0.8,
    ease: 'power2.out',
    snap: { v: 0.01 },
    ...options,
    v: to,
    onUpdate: () => onUpdate(proxy.v),
  });
}
