import React from "react";
import { Knob } from "../../../../components/Component";
import { overviewKnob1, overviewKnob2, overviewKnob3, overviewKnob4 } from "./ChartData";

export const Knob1 = () => {
  return (
    <div className="pt-1">
      <Knob data={overviewKnob1} type="full" centerText="80%" />
    </div>
  );
};

export const Knob2 = () => {
  return (
    <div className="pt-1">
      <Knob data={overviewKnob2} type="full" centerText="55%" />
    </div>
  );
};

export const Knob3 = () => {
  return (
    <div className="pt-1">
      <Knob data={overviewKnob3} type="full" centerText="68%" />
    </div>
  );
};

export const Knob4 = () => {
  return (
    <div className="p-1">
      <Knob data={overviewKnob4} type="full" centerText="70%" />
    </div>
  );
};
