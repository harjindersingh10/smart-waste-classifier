
export const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, data] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || file.type;
      
      if (!data || !mimeType) {
        reject(new Error("Failed to read file or determine MIME type."));
        return;
      }

      resolve({ base64: data, mimeType });
    };
    reader.onerror = error => reject(error);
  });
};
