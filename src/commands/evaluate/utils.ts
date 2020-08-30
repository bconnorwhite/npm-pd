import { findLastIndex } from "lodash";

const { POSITIVE_INFINITY, isNaN } = Number;
const { abs } = Math;

export function normalizeValue(value: number, steps: {value: number, norm: number }[]) {
  const index = findLastIndex(steps, (step) => step.value <= value);
  if(index === -1) {
    return steps[0].norm;
  }
  if(index >= steps.length - 1) {
    return steps[steps.length - 1].norm;
  }
  const stepLow = steps[index];
  const stepHigh = steps[index + 1];
  const normalized = stepLow.norm + (stepHigh.norm - stepLow.norm) * (value - stepLow.value) / (stepHigh.value - stepLow.value);
  if(isNaN(normalized) || abs(normalized) === POSITIVE_INFINITY) {
    throw new Error('Invalid value or steps');
  }
  return normalized;
}
