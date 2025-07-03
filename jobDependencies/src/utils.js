
// Parse the url and get the query-parameters as an object
export function getQueryParameters() {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const queryParams = {};

  for (const [key, value] of params.entries()) {
    queryParams[key] = value;
  }

  return queryParams;
}

// Sort dependencies in a topological order
export function sortDeps(deps) {
  const sorted = [];
  const visited = new Set();

  function visit(job) {
    if (visited.has(job.name)) return;
    visited.add(job.name);
    job.dependencies.forEach((depName) => {
      const dep = deps.find((j) => j.name === depName);
      if (dep) visit(dep);
    });
    sorted.push(job);
  }
  deps.forEach((job) => visit(job));

  return sorted;
}

// Assign levels to jobs based on dependencies
export function assignLevels(deps) {
  const levels = {};
  deps.forEach((job) => {
    if (job.dependencies.length === 0) {
      levels[job.name] = 0; // Root level
    } else {
      levels[job.name] = Math.max(...job.dependencies.map((dep) => levels[dep] || 0)) + 1;
    }
  });
  return levels;
}

// Group jobs by levels and sort alphabetically within each level
export function groupJobsByLevel(levels) {
  return Object.entries(levels).reduce((acc, [job, level]) => {
    acc[level] = acc[level] || [];
    acc[level].push(job);
    acc[level].sort((a, b) => a.localeCompare(b));
    return acc;
  }, {});
}

// Assign positions based on levels and order within levels
export function assignPositions(jobsByLevel, canvas, canvasConfig) {
  const positions = {};

  Object.entries(jobsByLevel).forEach(([level, jobs]) => {
    jobs.forEach((job, index) => {
      const x = canvasConfig.canvasPadding + index * (canvasConfig.boxWidth + canvasConfig.horizontalSpacing);
      const y = canvasConfig.canvasPadding + level * (canvasConfig.boxHeight + canvasConfig.verticalSpacing);
      positions[job] = { x, y };

      if (canvasConfig.align === "CENTER") {
        const totalWidth = jobs.length * canvasConfig.boxWidth + (jobs.length - 1) * canvasConfig.horizontalSpacing;
        const offsetX = (canvas.width - totalWidth) / 2;

        positions[job].x = offsetX + index * (canvasConfig.boxWidth + canvasConfig.horizontalSpacing);
      } else if (canvasConfig.align === "RIGHT") {
        const totalWidth = jobs.length * canvasConfig.boxWidth + (jobs.length - 1) * canvasConfig.horizontalSpacing;
        const offsetX = canvas.width - totalWidth - canvasConfig.canvasPadding;

        positions[job].x = offsetX + index * (canvasConfig.boxWidth + canvasConfig.horizontalSpacing);
      }
    });
  });

  return positions;
}

// Crop job name text if it exceeds the maximum length
export function cropJobNameText(jobname, maxJobNameLength) {
  if (jobname.length > maxJobNameLength) {
    return jobname.substring(0, maxJobNameLength - 3) + "...";
  }
  return jobname;
}

// override job properties based on the config
export function applyJobConfig(config, deps) {
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
  return deps;
}

// Function to find all dependencies recursively
export function findDependencies(jobName, deps, chain = []) {
  const job = deps.find((j) => j.name === jobName);
  if (!job || chain.includes(jobName)) return chain;
  chain.push(jobName);
  job.dependencies.forEach((dep) => findDependencies(dep, deps,chain));

  return chain;
}
