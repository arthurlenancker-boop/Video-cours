import { Composition } from "remotion";
import { z } from "zod";
import React from "react";
import { Explainer, explainerSchema, defaultProps } from "./Explainer";
import timing from "./timing.json";

const FPS = 30;
const durationInFrames = Math.round(timing.total * FPS);

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Explainer"
      component={Explainer}
      durationInFrames={durationInFrames}
      fps={FPS}
      width={1920}
      height={1080}
      schema={explainerSchema}
      defaultProps={defaultProps}
    />
  );
};
