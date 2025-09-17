export const converttoformData = (
  data: Record<string, any>,
  jsonKeys: string[] = []
): FormData => {
  const formData = new FormData();
  
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      
      if (jsonKeys.includes(key)) {
        // Convert the specified keys to JSON strings before appending
        formData.append(key, JSON.stringify(value));
      } else if (value instanceof File) {
        // Handle long filenames by truncating
        const truncatedName = value.name.length > 100 
          ? value.name.slice(0, 97) + '...' 
          : value.name;
        formData.append(key, value, truncatedName);
      } else {
        // Handle null or other values, convert to string
        const stringValue = value === null || value === undefined 
          ? "" 
          : String(value);
        formData.append(key, stringValue);
      }
    }
  }
  
  return formData;
};
