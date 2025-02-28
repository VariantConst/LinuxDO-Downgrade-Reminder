declare module "canvas-confetti" {
  export interface GlobalOptions {
    resize?: boolean;
    useWorker?: boolean;
  }

  export interface Options {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: Array<"square" | "circle" | unknown>;
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  export type CreateTypes = (options?: Options) => void;

  export interface ConfettiFunction {
    (options?: Options): void;
    reset: () => void;
    create: (canvas: HTMLCanvasElement, options?: GlobalOptions) => CreateTypes;
    shapeFromPath: (options: { path: string }) => unknown;
    shapeFromText: (options: { text: string; scalar?: number }) => unknown;
  }

  const confetti: ConfettiFunction;
  export default confetti;
}
