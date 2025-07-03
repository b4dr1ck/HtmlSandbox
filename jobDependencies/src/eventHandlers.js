import { drawDependencies } from "./rendering.js";

function getMouseCoordinates(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  return { mouseX, mouseY };
}

// right click on a job in the canvas and get the clicked jobname
function getJobNameByClick(event, canvas, canvasConfig, deps, positions, offset) {
  event.preventDefault();

  const {mouseX:mouseX,mouseY: mouseY} = getMouseCoordinates(event, canvas);

  for (const job of deps) {
    const { x, y } = positions[job.name];

    offset.x = mouseX - x;
    offset.y = mouseY - y;

    if (mouseX >= x && mouseX <= x + canvasConfig.boxWidth && mouseY >= y && mouseY <= y + canvasConfig.boxHeight) {
      return job.name;
    }
  }
}

// mouse is moving over the canvas and update the position of the dragged job
function updateJobPosOnMouseMove(event, canvas, positions, draggedJob, offset) {
  const {mouseX:mouseX,mouseY: mouseY} = getMouseCoordinates(event, canvas);

  if (draggedJob) {
    positions[draggedJob].x = mouseX - offset.x;
    positions[draggedJob].y = mouseY - offset.y;
  }
}

// Set up event listeners for the canvas
export function setupEventListeners(canvas, canvasManager, canvasConfig, deps, positions) {
  const job = { dragged: null, clicked: null };
  const offset = { x: 0, y: 0 };

  // Right click on job box
  canvas.addEventListener("contextmenu", (event) => {
    job.clicked = getJobNameByClick(event, canvas, canvasConfig, deps, positions, offset);
    drawDependencies(canvasManager, deps, positions, canvasConfig, job.clicked);
  });

  // mouse move over the job box
  canvas.addEventListener("mousemove", (event) => {
    updateJobPosOnMouseMove(event, canvas, positions, job.dragged, offset);
    drawDependencies(canvasManager, deps, positions, canvasConfig, job.clicked);
  });

  // mouse down over the job box
  canvas.addEventListener("mousedown", (event) => {
    job.dragged = getJobNameByClick(event, canvas, canvasConfig, deps, positions, offset);
  });

  // mouse up over the job box
  canvas.addEventListener("mouseup", () => (job.dragged = null));
}
