<template>
  <div class="draw">
    <!-- <div class="toolbar" :style="{ right: toolBarRight }">
      <div class="allColors">
        <div class="panelUp mobile"></div>

        <transition-group class="lineColor" name="color-list" tag="ul" >
          <li v-for="(color, $index) in colors" :style='{ "background-color": color }' @click="changeLineColor(color, $index)" :key="color"></li>
        </transition-group>

        <transition-group class="bgColor" name="color-list" tag="ul" >
          <li v-for="(color, $index) in bgColors" :key="color" :style='{ "background-color": color }' @click="changeBg(color, $index)"></li>
        </transition-group>
      </div>
    </div> -->

    <!-- <ul class="toolbar" :style="{ 'background-color': bgColor }">
      <li
        v-for="color in colors"
        :key="color"
        :style="{ 'background-color': color }"
      ></li>
      @click="changeLineColor(color)"
      <li class="bgColor" :style="{ 'background-color': bgColor }"></li>
      @click="changeBg()"
    </ul> -->

    <div class="toolbar">
      <table class="color-settings">
        <tr>
          <td>
            <label for="backgroundColor">Background:</label>
          </td>
          <td>
            <input
              id="backgroundColor"
              v-model="bgColor"
              type="color"
              name="backgroundColor"
            />
          </td>
          <td>
            <ColorSelector
              v-model:current-color="bgColor"
              setting="backgroundColor"
            ></ColorSelector>
          </td>
        </tr>
        <tr>
          <td>
            <label for="lineColor">Line:</label>
          </td>
          <td>
            <input
              id="lineColor"
              v-model="lineColor"
              type="color"
              name="lineColor"
            />
          </td>
          <td>
            <ColorSelector
              v-model:current-color="lineColor"
              setting="lineColor"
            ></ColorSelector>
          </td>
        </tr>
      </table>

      <div class="buttons">
        <button class="btn submitBtn" @click="download()">
          <img src="../assets/download.svg" alt="Download" height="20" />
        </button>
        <button class="btn clearBtn" @click="clean()">
          <img src="../assets/clear.svg" alt="Clear Canvas" height="20" />
        </button>
        <button class="btn undoBtn" @click="undoLine()">
          <img src="../assets/undo.svg" alt="Undo" height="20" />
        </button>
      </div>
    </div>

    <div class="canvas">
      <!-- Canvas size is defined in CSS, search for ".canvas" -->

      <svg
        class="drawSvg"
        version="2.0"
        :width="canvasWidth"
        :height="canvasHeight"
        style="background-color:#ccc"
        @mousedown.prevent="lineStart($event)"
        @touchstart="lineStart($event)"
        @mousemove="lineMove($event)"
        @touchmove.prevent="lineMove($event)"
        @mouseup="lineEnd($event)"
        @touchend="lineEnd($event)"
      >
        <!-- :viewBox="`0 0 ${canvasWidth} ${canvasHeight}`" -->

        <!-- Background Color -->
        <rect id="bg" width="100%" height="100%" :fill="bgColor" />

        <!-- All lines except the current one -->
        <path
          v-for="line in lines"
          :key="line.path"
          :d="line.path"
          :stroke="line.strokeColor"
          :stroke-width="line.strokeWidth"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- the current line -->
        <path
          :d="currentLine"
          :stroke="lineColor"
          :stroke-width="strokeWidth"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { ISvgPath } from "shared";
import { computed, defineComponent, ref } from "vue";
import ColorSelector from "./ColorSelector.vue";

// import { compact } from "vue-color";

export default defineComponent({
  // name: "SvgDraw",

  components: {
    ColorSelector,
    // "compact-picker": compact,
  },

  setup() {
    const currentLine = ref("");
    const lines = ref<ISvgPath[]>([]);
    const isDrawing = ref(false);
    const traceRadius = ref(2.5);
    const strokeWidth = ref(8);
    const undo = ref(false);

    const title = ref("Freehand SVG Draw");

    const lineColorDefault = "#292929";
    const lineColor = ref(lineColorDefault);
    const bgColorDefault = "#EAEAEA";
    const bgColor = ref(bgColorDefault);

    const canvasWidth = computed(() => {
      return 1280;
      // return 1920;
    });
    const canvasHeight = computed(() => {
      return 720;
      // return 1080;
    });

    // Line Movements

    function lineStart(event: MouseEvent & { layerX: number; layerY: number }) {
      console.log("lineStart:", event);
      isDrawing.value = true;
      undo.value = true;

      currentLine.value += `M${event.layerX},${event.layerY} `;
    }

    function lineMove(event: MouseEvent & { layerX: number; layerY: number }) {
      // console.log("lineMove:", event);

      if (isDrawing.value) {
        currentLine.value += `L${event.layerX},${event.layerY} `;
      }
    }

    function lineEnd(event: MouseEvent & { layerX: number; layerY: number }) {
      console.log("lineEnd:", event);
      if (isDrawing.value) {
        currentLine.value += `L${event.layerX}, ${event.layerY} `;

        lines.value.push({
          id: -1,
          path: currentLine.value,
          strokeColor: lineColor.value,
          strokeWidth: strokeWidth.value,
          createdTime: new Date(Date.now()),
        });
      }

      isDrawing.value = false;
      currentLine.value = "";
    }

    // Image Changes

    function undoLine() {
      lines.value.pop();

      if (lines.value.length == 0) {
        undo.value = false;
      }
    }

    function clean() {
      lines.value = [];
      undo.value = false;

      // lineColor.value = lineColorDefault;
      // bgColor.value = bgColorDefault;
    }

    function download() {
      throw new Error("Not Implemented Exception");
    }

    return {
      title,
      lineColor,
      bgColor,

      undo,
      isDrawing,
      currentLine,
      lines,

      traceRadius,
      strokeWidth,

      canvasWidth,
      canvasHeight,

      lineStart,
      lineMove,
      lineEnd,

      download,
      clean,
      undoLine,
    };
  },
});
</script>

<style scoped>
.drawSvg {
  position: relative;
  cursor: crosshair;
}

.canvas {
  position: relative;
}

.toolbar {
  background-color: darkgrey;
  padding: 5px;
}

.drawSvg rect {
  transition: fill 0.2s;
}

.inline-box {
  display: inline-block;
}

.color-settings {
  text-align: left;
}

.picture-settings {
  float: right;
}

.btn {
  padding: 5px;
}

.btn img {
  height: 30px;
}
</style>
