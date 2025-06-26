
if (typeof config !== "undefined" && config) {
  applyJobConfig(config);
} 

const sortedDeps = sortDeps(deps); // Sort dependencies to ensure correct rendering order

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const canvasPadding = 50;

const defaultLineColor = "#546E7A"; // Default line color for dependencies
const defaultBoxColor = "#78909C"; // Default box color for jobs without a specific color
const highlightColor = "white"; // Color for highlighted jobs
const boxWidth = 150;
const boxHeight = 50;
const horizontalSpacing = 60;
const verticalSpacing = 30;
const fontSize = 16;
const lineWidth = 2;
const arrowSize = 10;
const maxJobNameLength = 17; // Maximum length of the job name to display

// Calculate positions for each job dynamically
const positions = {};
const levels = {};
let hoveredJob = null; // Variable to track the hovered job

// Assign levels to jobs based on dependencies
sortedDeps.forEach((job) => {
  if (job.dependencies.length === 0) {
    levels[job.name] = 0; // Root level
  } else {
    levels[job.name] = Math.max(...job.dependencies.map((dep) => levels[dep] || 0)) + 1;
  }
});
// Group jobs by levels and sort alphabetically within each level
const jobsByLevel = Object.entries(levels).reduce((acc, [job, level]) => {
  acc[level] = acc[level] || [];
  acc[level].push(job);
  acc[level].sort((a, b) => a.localeCompare(b)); // Sort jobs alphabetically by name
  return acc;
}, {});

// Calculate the required canvas size
const maxLevel = Math.max(...Object.values(levels));
const maxJobsInLevel = Math.max(...Object.values(jobsByLevel).map((jobs) => jobs.length));
const canvasWidth = maxJobsInLevel * (boxWidth + horizontalSpacing) + canvasPadding; // Add padding
const canvasHeight = (maxLevel + 1) * (boxHeight + verticalSpacing) + canvasPadding; // Add padding

// Set the canvas size dynamically
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Assign positions based on levels and order within levels
Object.entries(jobsByLevel).forEach(([level, jobs]) => {
  jobs.forEach((job, index) => {
    const x = canvasPadding + index * (boxWidth + horizontalSpacing); // Add padding
    const y = canvasPadding + level * (boxHeight + verticalSpacing); // Add padding
    positions[job] = { x, y };
  });
});

function applyJobConfig(config) {
  // override job properties based on the config
  deps.forEach((job) => {
    for (const key in config) {
      if (job.name.indexOf(key) >= 0) {
        job.color = config[key].color;
        job.strokeColor = config[key].strokeColor;
        job.dashed = config[key].dashed;
        job.fill = config[key].fill;
      }
    }
  });
}

// Function to sort dependencies in a topological order
function sortDeps(deps) {
  const sorted = [];
  const visited = new Set();

  // Helper function for depth-first traversal
  function visit(job) {
    if (visited.has(job.name)) return; // Skip already visited jobs
    visited.add(job.name);

    // Visit all dependencies first
    job.dependencies.forEach((depName) => {
      const dep = deps.find((j) => j.name === depName);
      if (dep) visit(dep);
    });

    // Add the job to the sorted list
    sorted.push(job);
  }

  // Visit all jobs in the deps array
  deps.forEach((job) => visit(job));

  return sorted;
}

// Function to find all dependencies recursively
function findDependencies(jobName, chain = []) {
  const job = sortedDeps.find((j) => j.name === jobName);
  if (!job || chain.includes(jobName)) return chain;
  chain.push(jobName);
  job.dependencies.forEach((dep) => findDependencies(dep, chain));
  return chain;
}

// Function to draw an arrowhead at the start of the line
function drawArrowhead(ctx, fromX, fromY, toX, toY, arrowSize, color) {
  const angle = Math.atan2(toY - fromY, toX - fromX); // Calculate the angle of the line

  // Coordinates for the two sides of the arrowhead
  const arrowX1 = fromX + arrowSize * Math.cos(angle - Math.PI / 6);
  const arrowY1 = fromY + arrowSize * Math.sin(angle - Math.PI / 6);
  const arrowX2 = fromX + arrowSize * Math.cos(angle + Math.PI / 6);
  const arrowY2 = fromY + arrowSize * Math.sin(angle + Math.PI / 6);

  // Draw the arrowhead
  ctx.beginPath();
  ctx.moveTo(fromX, fromY); // Tip of the arrow
  ctx.lineTo(arrowX1, arrowY1); // Left side of the arrowhead
  ctx.lineTo(arrowX2, arrowY2); // Right side of the arrowhead
  ctx.closePath();
  ctx.fillStyle = color; // Arrow color
  ctx.fill();
}

function cropJobNameText(jobname) {
  if (jobname.length > maxJobNameLength) {
    return jobname.substring(0, maxJobNameLength - 3) + "..."; // Crop and add ellipsis
  }
  return jobname; // Return original name if within limit
}

// Draw the jobs and dependencies
function drawDependencies() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw boxes for jobs first
  sortedDeps.forEach((job) => {
    const { x, y } = positions[job.name];
    const isHighlighted = hoveredJob && findDependencies(hoveredJob).includes(job.name);

    // box
    ctx.lineWidth = isHighlighted ? lineWidth * 2 : lineWidth;
    ctx.strokeStyle = isHighlighted ? highlightColor : job.color ? job.color : defaultBoxColor;
    if (job.fill) {
      ctx.fillStyle = job.fill;
      ctx.fillRect(x, y, boxWidth, boxHeight);
      ctx.strokeRect(x, y, boxWidth, boxHeight);
      ctx.fillStyle = "black"; // Reset fill color for text
    } else {
      ctx.strokeRect(x, y, boxWidth, boxHeight);
      ctx.fillStyle = isHighlighted ? highlightColor : job.color ? job.color : defaultBoxColor;
    }
    // Text
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(cropJobNameText(job.name), x + boxWidth / 2, y + boxHeight / 2);
  });

  // Draw lines for dependencies after the boxes
  sortedDeps.forEach((job) => {
    const { x: startX, y: startY } = positions[job.name];

    job.dependencies.forEach((dep, index) => {
      // external (or unknown) dependencies
      if (!positions[dep]) {
        ctx.fillStyle = "#ccc";
        ctx.textAlign = "left";
        ctx.font = `bold ${fontSize + 2}px Arial`;
        ctx.fillText("X", startX + 4, startY + 4 + 10);
        return;
      }

      const { x: endX, y: endY } = positions[dep];

      // Offset the line slightly based on the index of the dependency
      const offset = (index - job.dependencies.length / 2) * 10; // Adjust offset dynamically
      const isHighlighted = hoveredJob && findDependencies(hoveredJob).includes(job.name);

      // Draw the line
      ctx.beginPath();
      if (job.dashed) {
        ctx.setLineDash([5, 10]);
      }
      ctx.moveTo(startX + boxWidth / 2 + offset, startY); // Start with an offset
      ctx.lineTo(endX + boxWidth / 2 + offset, endY + boxHeight); // End with the same offset
      ctx.strokeStyle = isHighlighted
        ? highlightColor // Highlighted lines are white
        : job.strokeColor || defaultLineColor; // Use job stroke color or default
      ctx.lineWidth = isHighlighted ? lineWidth * 2 : lineWidth;
      ctx.stroke();
      ctx.setLineDash([]); // reset the line dash style

      // Draw the arrowhead at the start of the line
      drawArrowhead(
        ctx,
        startX + boxWidth / 2 + offset,
        startY,
        endX + boxWidth / 2 + offset,
        endY + boxHeight,
        arrowSize,
        isHighlighted
          ? highlightColor // Highlighted lines are white
          : job.strokeColor || defaultLineColor
      );
    });
  });
}

function drawJobInformation(jobName, x, y) {
  if (jobName.length > maxJobNameLength) {
    ctx.fillStyle = "white";
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`Jobname: ${jobName}`, x + 10, y + 10);
  }

  const job = sortedDeps.find((j) => j.name === jobName);
  if (!job) return; // If the job is not found, exit
  const dependencies = job.dependencies.filter((dep) => !sortedDeps.some((j) => j.name === dep));
  if (dependencies.length > 0) {
    ctx.fillStyle = "white";
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`External Dependencies: ${dependencies.join(", ")}`, x + 10, y + 30);
  }
}

// Function to handle mouse movement
function handleMouseMove(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Check if the mouse is over any box
  hoveredJob = null;
  for (const job of deps) {
    const { x, y } = positions[job.name];

    if (mouseX >= x && mouseX <= x + boxWidth && mouseY >= y && mouseY <= y + boxHeight) {
      hoveredJob = job.name;
      break;
    }
  }

  drawDependencies();

  if (hoveredJob) {
    drawJobInformation(hoveredJob, mouseX + 10, mouseY + 10); // Draw job information near the mouse cursor
  }
}
// Attach the mousemove event listener
canvas.addEventListener("mousemove", handleMouseMove);

drawDependencies();
