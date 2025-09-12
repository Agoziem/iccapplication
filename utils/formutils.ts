// Type for form data conversion
export interface FormDataConvertible {
  [key: string]: any;
}

export const converttoformData = (
  data: FormDataConvertible,
  jsonKeys: string[] = []
): FormData => {
  const formData = new FormData();
  
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
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
      } else if (value instanceof FileList) {
        // Handle FileList objects
        for (let i = 0; i < value.length; i++) {
          const file = value[i];
          const truncatedName = file.name.length > 100 
            ? file.name.slice(0, 97) + '...' 
            : file.name;
          formData.append(key, file, truncatedName);
        }
      } else if (Array.isArray(value)) {
        // Handle arrays - append each item separately
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            formData.append(`${key}[${index}]`, JSON.stringify(item));
          } else {
            formData.append(`${key}[${index}]`, item?.toString() || "");
          }
        });
      } else {
        // Handle null, undefined, or other values
        const stringValue = value === null || value === undefined ? "" : value.toString();
        formData.append(key, stringValue);
      }
    }
  }
  
  return formData;
};
