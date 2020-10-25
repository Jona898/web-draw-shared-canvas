import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import { router } from "./router";
import { svgWebSocketService } from "./services";
import { useStore } from "./store";

createApp(App).use(useStore()).use(router).mount("#app");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _svgWebSocketService = svgWebSocketService;

// setTimeout(() => {
//   console.log("Send first Test Message");
//   svgWebSocketService.sendMsgTest("First Test Message");
// }, 1000);
