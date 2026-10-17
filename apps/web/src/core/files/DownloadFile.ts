/** Saves `data` as a file through a temporary object URL. */
export function downloadFile(data: Uint8Array, filename: string, type: string): void {
  const url = URL.createObjectURL(new Blob([data.slice()], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}
