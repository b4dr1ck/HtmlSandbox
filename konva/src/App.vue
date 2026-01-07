<script>
export default {
  name: "App",
  data() {
    return {
      gridSize: 100,
      stageSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      objectsContainer: [],
      info: "Information",
      configs: {
        arcConfig: {
          type: "arc",
          x: 0,
          y: 0,
          innerRadius: 40,
          outerRadius: 70,
          angle: 90,
          fill: "red",
          stroke: "black",
          strokeWidth: 1,
          rotation: 0,
        },
        rectConfig: {
          type: "rect",
          x: 0,
          y: 0,
          width: 100,
          height: 50,
          fill: "green",
          stroke: "black",
          strokeWidth: 1,
          rotation: 0,
        },
        circleConfig: {
          type: "circle",
          x: 30,
          y: 30,
          radius: 30,
          fill: "blue",
          stroke: "black",
          strokeWidth: 1,
        },
        polygonConfig: {
          type: "regular-polygon",
          x: 80,
          y: 80,
          sides: 3,
          radius: 80,
          fill: "yellow",
          stroke: "black",
          strokeWidth: 1,
          rotation: 0,
        },
        lineConfig: {
          type: "line",
          y: 0,
          x: 0,
          points: [0, 0, 140, 140],
          stroke: "white",
          strokeWidth: 5,
        },
        star: {
          type: "star",
          x: 40,
          y: 40,
          numPoints: 5,
          innerRadius: 20,
          outerRadius: 40,
          fill: "purple",
          stroke: "black",
          strokeWidth: 1,
        },
      },
    };
  },
  methods: {
    remove(event) {
      const name = event.target.attrs.name;
      this.info = `${name} removed`;
      const layer = this.$refs.layerRef.getNode();
      const shapes = layer.find("." + name);
      shapes.forEach((shape) => shape.destroy());
      layer.draw();
    },
    writeInfo(event) {
      const name = event.target.attrs.name;
      this.info = "";
      const layer = this.$refs.layerRef.getNode();
      const shapes = layer.find("." + name);
      if (shapes.length === 0) {
        this.info = "No shapes found";
        return;
      }
      const foundShape = shapes[0]?.attrs;
      this.info = `${JSON.stringify(foundShape)}`;
    },
    addObject(_event, config) {
      if ("points" in this.configs[config]) {
        if (typeof this.configs[config].points === "string") {
          this.configs[config].points = this.configs[config].points.split(",").map(Number);
        }
      }
      this.info = `${this.configs[config].type} created`;
      this.objectsContainer.push({
        ...this.configs[config],
        draggable: true,
        shadowColor: "black",
        shadowBlur: 0,
        shadowOffset: { x: 10, y: 10 },
        shadowOpacity: 0.5,
        name: this.configs[config].type + this.objectsContainer.length,
      });
    },
  },
};
</script>

<template>
  <h1 class="text-h4">Create Shapes</h1>
  <h2 class="text-h5 mb-2">with konva.js</h2>

  <div class="d-flex" v-for="(configType, configKey) in configs" :key="configKey">
    <v-btn width="150" class="mx-2" @click="addObject($event, configKey)">{{ configKey.replace("Config", "") }}</v-btn>
    <template v-for="(value, key) in configType">
      <v-text-field
        v-if="key !== 'type'"
        class="mx-2"
        width="100%"
        density="compact"
        :label="key"
        v-model="configType[key]"></v-text-field>
    </template>

  </div>

  <v-list density="compact">
    <v-list-item><strong class="text-red">"Click"</strong> on a button (above) to create a shape</v-list-item>
    <v-list-item><strong class="text-red">"Click</strong>" on a shape for further infos</v-list-item>
    <v-list-item><strong class="text-red">"DoubleClick"</strong> to remove a shape</v-list-item>
    <v-list-item><strong class="text-red">"Drag And Drop"</strong> to move shapes</v-list-item>
  </v-list>

  <pre class="text-green my-2">{{ info }}</pre>

  <v-stage style="border: 1px solid white" :config="stageSize">
    <v-layer ref="backdrop">
      <template v-for="y in Math.ceil(stageSize.height / gridSize)">
        <v-rect
          v-for="x in Math.ceil(stageSize.width / gridSize)"
          :key="x"
          :config="{
            x: (x - 1) * gridSize,
            y: (y - 1) * gridSize,
            width: gridSize,
            height: gridSize,
            stroke: '#222',
          }" />
      </template>
    </v-layer>
    <v-layer ref="layerRef">
      <template v-for="(obj, index) in objectsContainer" :key="index">
        <component
          :is="'v-' + obj.type"
          :config="obj"
          @dblclick="remove($event)"
          @click="writeInfo($event)"></component>
      </template>
    </v-layer>
  </v-stage>
</template>

<style scoped>
pre {
  background-color: #000000;
  padding: 10px;
  border-radius: 5px;
  word-break: break-all;
  word-wrap: break-word;
  overflow-x: scroll;
}
</style>
