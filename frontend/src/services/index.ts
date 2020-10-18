import { SvgWebSocketService } from "./svg.service";

const { protocol, hostname } = window.location;

export const svgWebSocketService = new SvgWebSocketService({
  isSecore: protocol.includes("https"),
  host: hostname,
  port: 9000,
  path: "ws",
});

export * from "./svg.service";
