// Utility functions to handle JSON data operations

export const loadJsonData = async (jsonFile) => {
  try {
    const response = await fetch(jsonFile);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading JSON data:', error);
    return null;
  }
};

// Function to save data to localStorage since we can't write to JSON files directly in frontend
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

// Function to get data from localStorage
export const getFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
};

// Function to update data in localStorage
export const updateLocalStorage = (key, updateFn) => {
  try {
    const currentData = getFromLocalStorage(key);
    const updatedData = updateFn(currentData);
    saveToLocalStorage(key, updatedData);
    return true;
  } catch (error) {
    console.error('Error updating data:', error);
    return false;
  }
}; 