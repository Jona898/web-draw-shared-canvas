<!--
<template>
  <div></div>
</template>
-->

<template>
  <div>
    <div><button @click="sendTest">Send Test</button></div>
    <div><button @click="sendUpdateSettings">Send Update Settings</button></div>
    <div>
      <button @click="sendUpdateLastLine">Send Update Last Line</button>
    </div>
    <div><button @click="sendError">Send Error</button></div>
  </div>
</template>

<script lang="ts">
import { ISvgSettings } from "web-draw-shared-canvas-shared";
import { defineComponent } from "vue";
import { svgWebSocketService } from "../services";

export default defineComponent({
  setup: () => {
    const svgWsService = svgWebSocketService;

    const sendTest = () => {
      console.log("Send Test");
      svgWsService.sendMsgTest("Test MessageSend");
    };

    const sendUpdateSettings = () => {
      console.log("Send Update Settings");
      svgWsService.sendMsgUpdateSettings({
        title: "SomeTestName",
        backgroundColor: "#086482",
      } as ISvgSettings);
    };

    const sendUpdateLastLine = () => {
      console.log("Send Update Last Line");
      svgWsService.sendMsgUpdateLastLine({
        id: 123,
        path: "M10,90 L90,10",
        strokeColor: "#751612",
        strokeWidth: 9,
        createdTime: new Date(Date.now()),
      });
    };

    const sendError = () => {
      console.log("Send Error");
      svgWsService.sendMsgError({
        title: "Some Test Error",
        message: "With Additional Data",
      });
    };

    return {
      sendTest,
      sendUpdateSettings,
      sendUpdateLastLine,
      sendError,
    };
  },
});
</script>
