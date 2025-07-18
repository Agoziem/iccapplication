export const converttoformData = (data, jsonKeys = []) => {
  const formData = new FormData();
  
  for (let key in data) {
    if (jsonKeys.includes(key)) {
      // Convert the specified keys to JSON strings before appending
      formData.append(key, JSON.stringify(data[key]));
    } else if (data[key] instanceof File) {
      // Handle long filenames by truncating
      const file = data[key];
      const truncatedName = file.name.length > 100 
        ? file.name.slice(0, 97) + '...' 
        : file.name;
      formData.append(key, file, truncatedName);
    } else {
      // Handle null or other values
      formData.append(key, data[key] === null ? "" : data[key]);
    }
  }
  
  return formData;
};
