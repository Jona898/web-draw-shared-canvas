import { ISvgPath } from "./SvgPath.data";
import { ISvgSettings } from "./SvgSettings.data";

export interface ISvgCombined {
  svgSettings: ISvgSettings;
  svgPaths: ISvgPath[];
}
