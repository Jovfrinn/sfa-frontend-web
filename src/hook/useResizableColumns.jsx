import { useCallback } from "react";

const useResizableColumns = () => {
  const handleMouseDown = useCallback((e, th) => {
    e.preventDefault();

    const startX = e.pageX;
    const startWidth = th.offsetWidth;

    const onMouseMove = (e) => {
      const newWidth = startWidth + (e.pageX - startX);
      th.style.width = `${newWidth}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "col-resize";
  }, []);

  const attachResizer = useCallback((th) => {
    if (!th || th.dataset.resizable === "true") return;

    th.style.position = "relative";
    th.dataset.resizable = "true";

    const resizer = document.createElement("div");
    resizer.className = "resizer";
    resizer.style.position = "absolute";
    resizer.style.top = 0;
    resizer.style.right = 0;
    resizer.style.width = "5px";
    resizer.style.height = "100%";
    resizer.style.cursor = "col-resize";
    resizer.style.userSelect = "none";
    resizer.style.zIndex = 1;

    resizer.addEventListener("mousedown", (e) => handleMouseDown(e, th));
    th.appendChild(resizer);
  }, [handleMouseDown]);

  return { attachResizer };
};

export default useResizableColumns;
