// function to fetch dependencies from a given URL
export async function fetchDependencies(requestData) {
  const response = await fetch(requestData);
  if (!response.ok) {
    throw new Error("Failed to load deps.json");
  }
  const data = await response.json();
  return data;
}