export const downloadBlob = ({
  blob,
  filename,
}: {
  blob: Blob;
  filename: string;
}) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("download", filename);
  a.setAttribute("href", url);
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export const downloadSvg = async ({
  node,
  format,
  name,
  size,
  onFinish,
}: {
  node: Element | null;
  format: "image/png" | "image/jpeg" | "image/svg";
  name: string;
  size: number;
  onFinish?: () => void;
}) => {
  if (node?.nodeName !== "svg") throw Error('"node" must be SVG item');

  const stringhtml = node.outerHTML;
  const blob = new Blob([stringhtml], { type: "image/svg+xml" });
  if (format === "image/svg") {
    downloadBlob({ filename: name, blob });
    onFinish?.();
    return;
  }

  const reader = new FileReader();
  reader.onload = (readerEvt) => {
    const data = readerEvt.target?.result as string;
    const imgNode = document.createElement("img");
    imgNode.src = data;
    const canvas = document.createElement("canvas");
    canvas.height = size;
    canvas.width = size;
    imgNode.onload = () => {
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(imgNode, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) downloadBlob({ blob, filename: name });
          imgNode.remove();
          canvas.remove();
          onFinish?.();
        },
        format,
        1
      );
    };
  };
  reader.readAsDataURL(blob);
};
