declare module "framer-motion" {
  import * as React from "react";

  export const motion: any;
  export const AnimatePresence: React.ComponentType<any>;
  export function useReducedMotion(): boolean;
  export function useInView(ref: React.RefObject<Element> | null, options?: any): boolean;
  export type Variants = Record<string, any>;
}
