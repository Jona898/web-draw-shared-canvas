<template>
  <div v-for="color in colors" :key="color" class="colorCircle">
    <input
      v-show="false"
      :id="setting + color"
      v-model="activeColor"
      type="radio"
      :name="setting"
      :value="color"
      :style="{ backgroundColor: color }"
    />
    <label :for="setting + color" :aria-label="`Select Color ${color}`">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 18 18"
        :height="size"
        :width="size"
      >
        <circle
          cx="9"
          cy="9"
          r="7"
          :stroke="color == currentColor ? 'black' : ''"
          stroke-width="2"
          :fill="color"
        />
      </svg>
    </label>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    setting: { type: String, required: true },
    currentColor: { type: String, required: true },
    size: { type: Number, default: 34 },
    colors: {
      type: Array as PropType<string[]>,
      default: [
        "#EAEAEA",
        "#292929",
        "#00A0FF",
        "#FF29AA",
        "#FFE500",
        "#FF3030",
        "#12EB0A",
      ],
    },
  },

  emits: ["update:currentColor"],

  setup(props, { emit }) {
    const activeColor = computed({
      get: () => props.currentColor,
      set: val => emit("update:currentColor", val),
    });

    return {
      activeColor,
    };
  },
});
</script>

<style scoped>
input {
  visibility: visible;
}

.colorCircle {
  display: inline;
}
</style>
