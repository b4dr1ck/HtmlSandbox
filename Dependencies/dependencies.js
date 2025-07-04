
// helper-function to parse the url and get the query-parameters as an object
function getQueryParameters() {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const queryParams = {};

  for (const [key, value] of params.entries()) {
    queryParams[key] = value;
  }

  return queryParams;
}

const requestData = getQueryParameters().data
// start the request...
fetch(requestData)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load deps.json");
    }
    return response.json();
  })
  .then((data) => {
    // data from json
    deps = data.data;
    config = data.config;

    if (typeof config !== "undefined" && config) {
      applyJobConfig(config);
    }

    document.querySelector("h2").textContent += ` (${requestData})`;

    const startJob = getQueryParameters().start;
    const endJob = getQueryParameters().end;

    if (startJob && endJob) {
      deps = extractSubgraph(deps, endJob, startJob);
    }

    const sortedDeps = sortDeps(deps); // Sort dependencies to ensure correct rendering order
      const canvas = document.querySelector("canvas");
    const align = "LEFT"; // LEFT, CENTER, RIGHT
    const ctx = canvas.getContext("2d");
    const canvasPadding = 50;
    const defaultLineColor = "#cccccc66"; // Default line color for dependencies
    const defaultBoxColor = "#78909C"; // Default box color for jobs without a specific color
    const highlightColor = "white"; // Color for highlighted jobs
    const boxWidth = 150; // Width of each job box
    const boxHeight = 50; // Height of each job box
    const horizontalSpacing = 60; // Horizontal spacing between job boxes
    const verticalSpacing = 30; // Vertical spacing between job levels
    const fontSize = 16; // Font size for job names
    const lineWidth = 2; // Width of the dependency lines
    const arrowSize = 10; // Size of the arrowhead at the start of the dependency lines
    const maxJobNameLength = 17; // Maximum length of the job name to display

    let draggedJob = null; // Track the job being dragged
    let offsetX = 0; // Offset between mouse and box position (x-axis)
    let offsetY = 0; // Offset between mouse and box position (y-axis)

    // Calculate positions for each job dynamically
    const positions = {};
    const levels = {};

    let clickedJob = null;
    let hoveredJob = null;
    let foundJob = null;

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

        if (align === "CENTER") {
          const totalWidth = jobs.length * boxWidth + (jobs.length - 1) * horizontalSpacing; // Total width of the level
          const offsetX = (canvas.width - totalWidth) / 2; // Calculate horizontal offset to center the level

          positions[job].x = offsetX + index * (boxWidth + horizontalSpacing);
        } else if (align === "RIGHT") {
          const totalWidth = jobs.length * boxWidth + (jobs.length - 1) * horizontalSpacing; // Total width of the level
          const offsetX = canvas.width - totalWidth - canvasPadding; // Calculate horizontal offset to right-align the level

          positions[job].x = offsetX + index * (boxWidth + horizontalSpacing);
        }
      });
    });

    function extractSubgraph(deps, startJob, endJob) {
      const visited = new Set();
      const subgraph = [];

      // Helper function to traverse the graph
      function traverse(jobName) {
        if (visited.has(jobName)) return;
        visited.add(jobName);

        const job = deps.find((j) => j.name === jobName);
        if (!job) return;

        subgraph.push(job);

        // Stop traversal if we reach the end job
        if (jobName === endJob) return;

        // Traverse dependencies
        job.dependencies.forEach((dep) => {
          traverse(dep);
        });
      }

      // Start traversal from the start job
      traverse(startJob);

      return subgraph;
    }

    // override job properties based on the config
    function applyJobConfig(config) {
      deps.forEach((job) => {
        for (const key in config) {
          const re = new RegExp(`^${key}$`, "i"); // Case-insensitive match
          if (re.test(job.name)) {
            job.color = config[key].color;
            job.strokeColor = config[key].strokeColor;
            job.dashed = config[key].dashed;
            job.fill = config[key].fill;
          }
        }
      });
    }

    // Function to download the canvas as an image
    function downloadCanvasAsImage() {
      // TODO: canvas-size is to big.

      const image = canvas.toDataURL("image/png"); // Convert canvas to a PNG image
      const link = document.createElement("a"); // Create a temporary <a> element
      link.href = image;
      link.download = "canvas-image.png"; // Set the default file name
      link.click(); // Trigger the download
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
      ctx.fillStyle = "black"; // Set background color to black
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill background with black

      // Draw boxes for jobs first
      sortedDeps.forEach((job) => {
        const { x, y } = positions[job.name];
        const isHighlighted = clickedJob && findDependencies(clickedJob).includes(job.name);

        // box
        ctx.lineWidth = isHighlighted ? lineWidth * 2 : lineWidth;
        ctx.strokeStyle = isHighlighted ? highlightColor : job.color ? job.color : defaultBoxColor;
        if (job.fill) {
          ctx.fillStyle = job.fill;
          ctx.fillRect(x, y, boxWidth, boxHeight);
          ctx.fillStyle = "black"; // Reset fill color for text
        } else {
          ctx.fillStyle = isHighlighted ? highlightColor : job.color ? job.color : defaultBoxColor;
        }

        if (foundJob && foundJob === job.name) {
          ctx.fillStyle = "yellow"; // Highlight found job with yellow
          ctx.fillRect(x, y, boxWidth, boxHeight);
          ctx.fillStyle = "black"; // Reset fill color for text
        }

        ctx.strokeRect(x, y, boxWidth, boxHeight);

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
            if (job.fill) {
              ctx.fillStyle = "black";
            }
            ctx.textAlign = "left";
            ctx.font = `bold ${fontSize + 2}px Arial`;
            ctx.fillText("X", startX + 4, startY + 4 + 10);
            return;
          }

          const { x: endX, y: endY } = positions[dep];

          // Offset the line slightly based on the index of the dependency
          const offset = (index - job.dependencies.length / 2) * 10; // Adjust offset dynamically
          const isHighlighted = clickedJob && findDependencies(clickedJob).includes(job.name);

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
            isHighlighted ? highlightColor : job.strokeColor || defaultLineColor
          );
        });
      });
    }

    // Function to draw job information when hovering
    function drawJobInformation(jobName, x, y) {
      const job = sortedDeps.find((j) => j.name === jobName);
      if (!job) return;

      const dependencies = job.dependencies.filter((dep) => !sortedDeps.some((j) => j.name === dep));

      if (jobName.length > maxJobNameLength) {
        ctx.fillStyle = "white";
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(`Jobname: ${jobName}`, x + 10, y + 10);
      }

      if (dependencies.length > 0) {
        ctx.fillStyle = "white";
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(`External Dependencies: ${dependencies.join(", ")}`, x + 10, y + 30);
      }
    }

    // Function to handle mouse click
    function handleMouseClick(event) {
      foundJob = null;
      event.preventDefault(); // Prevent default context menu from appearing
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Check if the mouse is over any box
      clickedJob = null;
      for (const job of deps) {
        const { x, y } = positions[job.name];

        if (mouseX >= x && mouseX <= x + boxWidth && mouseY >= y && mouseY <= y + boxHeight) {
          clickedJob = job.name;
          break;
        }
      }

      drawDependencies();
    }

    // Function to handle mouse move
    function handleMouseMove(event) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      if (draggedJob) {
        // Update the position of the dragged job
        positions[draggedJob].x = mouseX - offsetX;
        positions[draggedJob].y = mouseY - offsetY;
      }

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

    // Function to start dragging a job box
    function startDragging(event) {
      foundJob = null;
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Check if the mouse is over any box
      for (const job of deps) {
        const { x, y } = positions[job.name];

        if (mouseX >= x && mouseX <= x + boxWidth && mouseY >= y && mouseY <= y + boxHeight) {
          draggedJob = job.name; // Set the dragged job
          offsetX = mouseX - x; // Calculate offset
          offsetY = mouseY - y;
          break;
        }
      }
    }

    // Function to find a job an scroll to it's position
    function findJob(event) {
      const jobName = document.getElementById("searchInput").value;
      scrollTo(positions[jobName]["x"], positions[jobName]["y"]);
      foundJob = jobName;

      drawDependencies();
    }

    const searchBtn = document.getElementById("searchBtn");
    const screenshotBtn = document.getElementById("screenshotBtn");

    // Event Listener
    searchBtn.addEventListener("click", findJob);
    canvas.addEventListener("contextmenu", handleMouseClick);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", startDragging);
    canvas.addEventListener("mouseup", () => {
      draggedJob = null; // Clear the dragged job
    });

    // Event listener for keypress
    screenshotBtn.addEventListener("click", (event) => {
      downloadCanvasAsImage();
    });
    drawDependencies();
  })
  .catch((error) => {
    console.error("Error loading dependencies:", error);
    const canvas = document.querySelector("canvas");
    canvas.width = 800;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "red";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Error loading dependencies", 10, 50);
    ctx.fillText(error.message, 10, 80);
    ctx.fillText("Check the console for more details.", 10, 110);
    console.error(error);
  });
