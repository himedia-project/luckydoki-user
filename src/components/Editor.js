import React from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TinyMCEEditor({ content, setContent }) {
  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  return (
    <Editor
      apiKey="svz1f43wct6cxgc5t71nrtx8asz10z1k9hm6t8z70iork014"
      value={content}
      onEditorChange={handleEditorChange}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          "lists",
          "link",
          "charmap",
          "preview",
          "searchreplace",
          "fullscreen",
          "media",
          "code",
          "help",
          "emoticons",
          "codesample",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "lists charmap searchreplace | " +
          "emoticons fullscreen preview | " +
          "removeformat | help ",
        forced_root_block: "div",
        content_style: "body { font-family:Arial,sans-serif; font-size:14px }",
      }}
    />
  );
}
