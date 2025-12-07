import { useState } from "react";

import "./App.css";
import TextAreaEditor from "./TextAreaEditor";
import { serializeToHTML } from "./TextAreaEditor/util";
import { INITIAL_VALUE } from "./TextAreaEditor/constant";

const App = () => {
  const [editorState, setEditorState] = useState(INITIAL_VALUE);

  const handleOnChange = (value) => {
    setEditorState(value);
  };

  const htmlContent = editorState
    .map((val) => serializeToHTML(val))
    .reduce((total, current) => total + current);

  return (
    <div className="app">
      <h1 className="header">Slate RTE Example</h1>
      <TextAreaEditor value={editorState} onChange={handleOnChange} />

      <h3>Rendered Content</h3>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />

      <div className="state-container">
        <div className="state-content">
          <h3>Editor State</h3>
          <pre>
            <code>{JSON.stringify(editorState, null, 2)}</code>
          </pre>
        </div>
        <div className="state-content">
          <h3>HTML</h3>
          <pre>
            <code>{htmlContent}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default App;
