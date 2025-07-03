import { cropJobNameText, findDependencies } from "./utils.js";

export function drawDependencies(canvasManager, deps, positions, canvasConfig, clickedJob) {
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
      job.fill ? job.fill : "rgba(0,0,0,0.2)",
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
        : job.fill
        ? "black"
        : job.color
        ? job.color
        : canvasConfig.defaultBoxColor,
      `${canvasConfig.fontSize}px Arial`
    );

    const { x: startX, y: startY } = positions[job.name];

    job.dependencies.forEach((dep) => {
      if (!positions[dep]) {
        // quit if the dependend job is not found
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
