import {
  getQueryParameters,
  sortDeps,
  assignLevels,
  groupJobsByLevel,
  assignPositions,
  applyJobConfig,
  extracSubJobs,
} from "./utils.js";
import { fetchDependencies } from "./dataHandler.js";
import { CanvasManager } from "./canvasManager.js";
import { drawDependencies } from "./rendering.js";
import { setupEventListeners } from "./eventHandlers.js";

// default config for the canvas
const canvasConfig = {
  align: "LEFT",
  canvasPadding: 50,
  defaultLineColor: "#cccccc66",
  defaultBoxColor: "#78909C",
  highlightColor: "white",
  foundJobColor: "yellow",
  boxWidth: 150,
  boxHeight: 50,
  horizontalSpacing: 60,
  verticalSpacing: 30,
  fontSize: 16,
  lineWidth: 2,
  arrowSize: 10,
  maxJobNameLength: 17,
};

async function main(canvasConfig) {
  // fetch the data from the json file given by the query parameter (?data=file.json)
  const queryParameter = getQueryParameters();
  const startJob = queryParameter.startJob || null;
  const endJob = queryParameter.endJob || null;
  const responseData = await fetchDependencies(`data/${queryParameter.data}`);
  const data = startJob && endJob ? extracSubJobs(responseData.data, endJob, startJob) : responseData.data;
  const config = responseData.config;

  // canvas
  const canvas = document.getElementsByTagName("canvas")[0];
  const canvasManager = new CanvasManager(canvas);

  // Buttons / Input
  const btnSearch = document.getElementById("btnSearch");
  const btnScreenshot = document.getElementById("btnSreenShot");
  const inputSearch = document.getElementById("inputSearch");

  // override the default config with the config from the json file
  const sortedDeps = applyJobConfig(config, sortDeps(data));

  // Assign levels/groups of the jobs and dependencies
  const levels = assignLevels(sortedDeps);
  const jobsByLevel = groupJobsByLevel(levels);

  // Calculate the required canvas size
  const maxLevel = Math.max(...Object.values(levels));
  const maxJobsInLevel = Math.max(...Object.values(jobsByLevel).map((jobs) => jobs.length));
  const canvasWidth =
    maxJobsInLevel * (canvasConfig.boxWidth + canvasConfig.horizontalSpacing) + canvasConfig.canvasPadding;
  const canvasHeight =
    (maxLevel + 1) * (canvasConfig.boxHeight + canvasConfig.verticalSpacing) + canvasConfig.canvasPadding;

  // Set the canvas size
  const minWidth = 800;
  canvas.width = canvasWidth < minWidth ? minWidth : canvasWidth;
  canvas.height = canvasHeight;

  // set the positions of the jobs based on their levels and order
  const positions = assignPositions(jobsByLevel, canvas, canvasConfig);

  // Set up event listeners for the canvas
  setupEventListeners(
    canvas,
    canvasManager,
    canvasConfig,
    sortedDeps,
    positions,
    btnSearch,
    inputSearch,
    btnScreenshot
  );

  // rendering the dependencies
  drawDependencies(canvasManager, sortedDeps, positions, canvasConfig);
}

main(canvasConfig);
