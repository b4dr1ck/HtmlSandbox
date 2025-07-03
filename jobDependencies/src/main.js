import {
  getQueryParameters,
  sortDeps,
  assignLevels,
  groupJobsByLevel,
  assignPositions,
  applyJobConfig,
} from "./utils.js";
import { fetchDependencies } from "./dataHandler.js";
import { CanvasManager } from "./canvasManager.js";
import { drawDependencies } from "./rendering.js";
import { setupEventListeners } from "./eventHandlers.js";

async function main() {
  // fetch the data from the json file given by the query parameter (?data=file.json)
  const queryParameter = getQueryParameters();
  const responseData = await fetchDependencies(`data/${queryParameter.data}`);
  const data = responseData.data;
  const config = responseData.config;

  // canvas
  const canvas = document.getElementsByTagName("canvas")[0];
  const canvasManager = new CanvasManager(canvas);

  // default config for the canvas
  const canvasConfig = {
    align: "LEFT",
    canvasPadding: 50,
    defaultLineColor: "#cccccc66",
    defaultBoxColor: "#78909C",
    highlightColor: "white",
    boxWidth: 150,
    boxHeight: 50,
    horizontalSpacing: 60,
    verticalSpacing: 30,
    fontSize: 16,
    lineWidth: 2,
    arrowSize: 10,
    maxJobNameLength: 17,
  };

  // Calculate the levels and group the jobs by their levels
  const sortedDeps = applyJobConfig(config, sortDeps(data));
  const levels = assignLevels(sortedDeps);
  const jobsByLevel = groupJobsByLevel(levels);
  const positions = assignPositions(jobsByLevel, canvas, canvasConfig);

  // Set up event listeners for the canvas
  setupEventListeners(canvas,  canvasManager, canvasConfig, sortedDeps, positions,jobsByLevel);

  // Calculate the required canvas size
  const maxLevel = Math.max(...Object.values(levels));
  const maxJobsInLevel = Math.max(...Object.values(jobsByLevel).map((jobs) => jobs.length));
  const canvasWidth =
    maxJobsInLevel * (canvasConfig.boxWidth + canvasConfig.horizontalSpacing) + canvasConfig.canvasPadding; // Add padding
  const canvasHeight =
    (maxLevel + 1) * (canvasConfig.boxHeight + canvasConfig.verticalSpacing) + canvasConfig.canvasPadding; // Add padding

  // Set the canvas size
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // rendering the dependencies
  drawDependencies(canvasManager, sortedDeps, positions, canvasConfig);
}

main();
