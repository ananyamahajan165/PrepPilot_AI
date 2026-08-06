/** Triggers a browser download of client-side-generated content — used for
 * "Export Feedback" / "Download Transcript" / "Download Report" style
 * buttons where there's no need for a server round-trip since the data is
 * already loaded on the page. */
export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
