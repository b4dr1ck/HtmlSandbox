import { cropJobNameText, findDependencies } from "./utils.js";

// Draw the info box for the job on the canvas
export function drawInfoBox(canvasManager, job, positions, canvasConfig) {
  if (!job) {
    return;
  }

  const { x, y } = positions[job.name];
  const unknownDependencies = job.dependencies.filter((dep) => !positions[dep]);
  const infoText = [];

  if (job.doc) {
    infoText.push(`Documentation:`);
    infoText.push(`   ${job.doc}`);
    infoText.push("");
  }

  if (unknownDependencies.length > 0) {
    infoText.push(`External Dependencies:`);
    infoText.push(`   ${unknownDependencies.join(", ")}`);
  }

  // hover box
  canvasManager.drawBox(
    x,
    y,
    canvasConfig.boxWidth ,
    canvasConfig.boxHeight ,
    "rgba(255,255,255,0.2)",
    "rgba(255,255,255,0.2)",
    canvasConfig.lineWidth
  );

  // draw job-info text
  if (infoText.length > 0) {
    infoText.forEach((text, index) => {;
      // shadow
      canvasManager.drawText(
        text,
        x + canvasConfig.boxWidth + 2,
        y + index * canvasConfig.fontSize + canvasConfig.fontSize - 1,
        "#333",
        `${canvasConfig.fontSize}px Arial`,
        "left"
      );
      // text
      canvasManager.drawText(
        text,
        x + canvasConfig.boxWidth + 3,
        y + index * canvasConfig.fontSize + canvasConfig.fontSize,
        "white",
        `${canvasConfig.fontSize}px Arial`,
        "left"
      );
    });
  }
}

// Draw the dependencies of the jobs on the canvas
export function drawDependencies(canvasManager, deps, positions, canvasConfig, clickedJob, foundJob = null) {
  canvasManager.clear();

  deps.forEach((job) => {
    const { x, y } = positions[job.name];
    const isHighlighted = clickedJob && findDependencies(clickedJob, deps).includes(job.name);

    // draw the box
    canvasManager.drawBox(
      x,
      y,
      canvasConfig.boxWidth,
      canvasConfig.boxHeight,
      foundJob === job.name ? canvasConfig.foundJobColor : job.fill ? job.fill : "rgba(0,0,0,0.2)",
      isHighlighted ? canvasConfig.highlightColor : job.color ? job.color : canvasConfig.defaultBoxColor,
      isHighlighted ? canvasConfig.lineWidth * 2 : canvasConfig.lineWidth
    );

    // draw the text
    canvasManager.drawText(
      cropJobNameText(job.name, canvasConfig.maxJobNameLength),
      x + canvasConfig.boxWidth / 2,
      y + canvasConfig.boxHeight / 2,
      isHighlighted
        ? canvasConfig.highlightColor
        : job.fill || foundJob === job.name
        ? "black"
        : job.color
        ? job.color
        : canvasConfig.defaultBoxColor,
      `${canvasConfig.fontSize}px Arial`
    );

    const { x: startX, y: startY } = positions[job.name];

    job.dependencies.forEach((dep) => {
      // external or unkonw dependency
      if (!positions[dep]) {
        canvasManager.drawText("X", startX, startY, "red", `${canvasConfig.fontSize * 2}px Arial`);
        return;
      }

      const { x: endX, y: endY } = positions[dep];
      const offset = 0;

      // lines
      canvasManager.drawLine(
        startX + canvasConfig.boxWidth / 2 + offset,
        startY,
        endX + canvasConfig.boxWidth / 2,
        endY + canvasConfig.boxHeight,
        isHighlighted ? canvasConfig.highlightColor : job.strokeColor ? job.strokeColor : canvasConfig.defaultLineColor,
        isHighlighted ? canvasConfig.lineWidth * 2 : canvasConfig.lineWidth,
        job.dashed ? true : false
      );

      // arrowhead
      canvasManager.drawArrowhead(
        startX + canvasConfig.boxWidth / 2 + offset,
        startY,
        endX + canvasConfig.boxWidth / 2 + offset,
        endY + canvasConfig.boxHeight,
        canvasConfig.arrowSize,
        isHighlighted ? canvasConfig.highlightColor : job.strokeColor ? job.strokeColor : canvasConfig.defaultLineColor
      );
    });
  });
}
