fetch("./PKV.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load deps.json");
    }
    return response.json();
  })
  .then((data) => {
    deps = data.data;
    const jobsInBlock = [];
    getDependency("B029N00-ENDE", "B029N00-START", jobsInBlock);
    console.log(jobsInBlock);
  })
  .catch((error) => {
    console.error("Error loading dependencies:", error);
  });

function getDependency(jobname, end, jobsInBlock) {
  if (jobname === end) {
    return;
  }

  const findDeps = deps.find((dep) => dep.name === jobname);

  if (findDeps) {
    if (!jobsInBlock.includes(findDeps.name)) {
      jobsInBlock.push(findDeps.name);
    }
    findDeps.dependencies.forEach((dependency) => {
      getDependency(dependency, end,jobsInBlock);
    });
  }
}
