import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import "./styles.css";
import { useEffect } from "react";

type TEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export default function Editor({ value, onChange, placeholder }: TEditorProps) {
  const theme = "snow";

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],

      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],

      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["link"],
      [{ color: [] }],
    ],
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "list",
    "indent",
    "header",
    "link",
    "color",
  ];

  const { quill, quillRef } = useQuill({
    theme,
    modules,
    formats,
    placeholder,
  });

  useEffect(() => {
    if (quill) {
      // Set initial value using Quill's API
      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }

      // Listen for text changes
      quill.on("text-change", () => {
        onChange(quill.root.innerHTML);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quill]);

  return (
    <div style={{ width: "100%", height: "auto", backgroundColor: "#181818" }}>
      <div
        style={{ color: "white", backgroundColor: "#0F0F0F" }}
        ref={quillRef}
      />
    </div>
  );
}
