import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import { router } from "./router";
import { svgWebSocketService } from "./services";

createApp(App)
  .use(router)
  .mount("#app");

const _svgWebSocketService = svgWebSocketService;

setTimeout(() => svgWebSocketService.sendMsgTest("First Test Message"), 1000);
