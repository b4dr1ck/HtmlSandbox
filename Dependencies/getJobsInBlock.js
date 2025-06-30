fetch("./deps.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load deps.json");
    }
    return response.json();
  })
  .then((data) => {
    deps = data.data;
    getDependency("End", "Start");
  })
  .catch((error) => {
    console.error("Error loading dependencies:", error);
  });

function getDependency(jobname, end) {
  if (jobname === end) {
    return;
  }

  const findDeps = deps.find((dep) => dep.name === jobname);
  
  if (findDeps) {
    console.log(findDeps)
    findDeps.dependencies.forEach((dependency) => {
      getDependency(dependency, end);
    });
  }
}
