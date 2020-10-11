import { SvgWebSocketService } from "./svg.service";

export const svgWebSocketService = new SvgWebSocketService(
  "localhost",
  9000,
  "ws"
);

export * from "./svg.service";
