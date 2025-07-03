import { drawDependencies } from "./rendering.js";

// right click on a job in the canvas and get the clicked jobname
function getJobNameByClick(event, canvas, canvasConfig, deps, positions,offset) {
  event.preventDefault();

  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  for (const job of deps) {
    const { x, y } = positions[job.name];

    offset.x = mouseX - x
    offset.y = mouseY - y
  
    if (mouseX >= x && mouseX <= x + canvasConfig.boxWidth && mouseY >= y && mouseY <= y + canvasConfig.boxHeight) {
      return job.name
    }
  }
}

// mouse is moving over the canvas and update the position of the dragged job
function updateJobPosOnMouseMove(event, canvas, positions,draggedJob,offset) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  if (draggedJob) {
    positions[draggedJob].x = mouseX - offset.x;
    positions[draggedJob].y = mouseY - offset.y;
  }
}

// Set up event listeners for the canvas
export function setupEventListeners(canvas, canvasManager, canvasConfig, deps, positions) {
  let draggedJob = null;
  let clickedJob = null;
  const offset ={x:0,y:0}

  // Right click on job box 
  canvas.addEventListener("contextmenu", (event) => {
    clickedJob = getJobNameByClick(event, canvas, canvasConfig, deps, positions,offset);
    drawDependencies(canvasManager, deps, positions, canvasConfig, clickedJob);
  });

  // mouse move over the job box
  canvas.addEventListener("mousemove", (event) => {
    updateJobPosOnMouseMove(event, canvas, positions,draggedJob,offset);
    drawDependencies(canvasManager, deps, positions, canvasConfig, clickedJob);
  });

  // mouse down over the job box
  canvas.addEventListener("mousedown", (event) => {
    draggedJob = getJobNameByClick(event, canvas, canvasConfig, deps, positions,offset);
  });

  // mouse up over the job box
  canvas.addEventListener("mouseup", () => draggedJob = null);
}

