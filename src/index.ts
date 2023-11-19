export const downloadFile = (file: Blob, filename: string) => {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.setAttribute("download", filename);
  a.setAttribute("href", url);
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
