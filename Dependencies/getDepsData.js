let deps = [];
fetch("./deps.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load deps.json");
    }
    return response.json();
  })
  .then((data) => {
    deps = data;
    console.log("Dependencies loaded:", data);
  })
  .catch((error) => {
    console.error("Error loading dependencies:", error);
  });
