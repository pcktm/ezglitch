/// <reference types="@emotion/react/types/css-prop" />

type FrameType = "video" | "audio" | "void"

declare interface Effect {
  readonly name: string;
  readonly displayName: string;
  readonly usesInterval: boolean;
  readonly usesCount: boolean;
  readonly backgroundVideo: string;
  apply(table: Frame[], options: GlitchFormData): Promise<Frame[]>;
}

declare type Frame = {
  type: FrameType;
  size: number;
  index: number;
}

declare type GlitchFormData = {
  effect: string;
  count?: number;
  interval?: number;
  keepFirstFrame: boolean;
  file: File;
}