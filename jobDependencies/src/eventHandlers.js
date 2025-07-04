import { drawDependencies, drawInfoBox } from "./rendering.js";

// get the mouse coordinates relative to the canvas
function getMouseCoordinates(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  return { mouseX, mouseY };
}

// right click on a job in the canvas and get the clicked jobname
function getJobNameByClick(event, canvas, canvasConfig, deps, positions, offset) {
  event.preventDefault();

  const { mouseX: mouseX, mouseY: mouseY } = getMouseCoordinates(event, canvas);

  for (const job of deps) {
    const { x, y } = positions[job.name];

    offset.x = mouseX - x;
    offset.y = mouseY - y;

    if (mouseX >= x && mouseX <= x + canvasConfig.boxWidth && mouseY >= y && mouseY <= y + canvasConfig.boxHeight) {
      return job;
    }
  }
  return null;
}

function getJobnameByHover(event, canvas, canvasConfig, deps, positions) {
  return getJobNameByClick(event, canvas, canvasConfig, deps, positions, { x: 0, y: 0 });
}

// mouse is moving over the canvas and update the position of the dragged job
function updateJobPosOnMouseMove(event, canvas, positions, draggedJob, offset) {
  const { mouseX: mouseX, mouseY: mouseY } = getMouseCoordinates(event, canvas);

  if (draggedJob) {
    positions[draggedJob].x = mouseX - offset.x;
    positions[draggedJob].y = mouseY - offset.y;
  }
}

// scroll to the job position
function findJobOnClickSearch(inputSearch, positions) {
  const jobName = inputSearch.value;
  if (!(jobName in positions)) {
    return;
  }
  scrollTo(positions[jobName]["x"], positions[jobName]["y"]);
  return jobName;
}

// download the canvas as an image
function downloadCanvasAsImage(canvas) {
  const image = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = image;
  link.download = "canvas-image.png";
  link.click();
}

// Set up event listeners for the canvas
export function setupEventListeners(
  canvas,
  canvasManager,
  canvasConfig,
  deps,
  positions,
  btnSearch,
  inputSearch,
  btnScreenshot
) {
  const jobEvent = { dragged: null, clicked: null, hover: null };
  const offset = { x: 0, y: 0 };

  // click on search button
  btnSearch.addEventListener("click", () => {
    const jobName = findJobOnClickSearch(inputSearch, positions);

    drawDependencies(canvasManager, deps, positions, canvasConfig, jobEvent.clicked, jobName);
  });

  // clck on screenshot button
  btnScreenshot.addEventListener("click", () => {
    downloadCanvasAsImage(canvas);
  });

  // mouse move over the job box
  canvas.addEventListener("mousemove", (event) => {
    updateJobPosOnMouseMove(event, canvas, positions, jobEvent.dragged, offset);
    const job = getJobnameByHover(event, canvas, canvasConfig, deps, positions, offset);

    drawDependencies(canvasManager, deps, positions, canvasConfig, jobEvent.clicked);

    drawInfoBox(canvasManager, job, positions, canvasConfig);
  });

  // mouse down over the job box
  canvas.addEventListener("mousedown", (event) => {
    const job = getJobNameByClick(event, canvas, canvasConfig, deps, positions, offset);
    if (job) {
      jobEvent.clicked = job.name;
      jobEvent.dragged = job.name;
    } else {
      jobEvent.clicked = null;
      jobEvent.dragged = null;
    }
    drawDependencies(canvasManager, deps, positions, canvasConfig, jobEvent.clicked);
  });

  // mouse up over the job box
  canvas.addEventListener("mouseup", () => (jobEvent.dragged = null));
}
