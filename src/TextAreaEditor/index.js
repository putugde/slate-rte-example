import React, { useCallback, useState } from "react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { Slate, Editable, withReact } from "slate-react";

import {
  ACTION_BUTTON_TYPES,
  ButtonType,
  DEFAULT_ACTIONS,
  INITIAL_VALUE,
  TABLE_MAX,
} from "./constant";
import Element from "./Element";
import Leaf from "./Leaf";
import styles from "./rte.module.css";
import ToolbarButton from "./ToolbarButton";
import {
  decreaseListDepth,
  increaseListDepth,
  insertTable,
  isBlockActive,
  modifyTable,
  toggleBlock,
  toggleMark,
  unwrapLink,
  withUtils,
  wrapLink,
} from "./util";

const TextAreaEditor = (props) => {
  const { actions = DEFAULT_ACTIONS, id, onChange, value = INITIAL_VALUE } = props;

  const [editor] = useState(() =>
    withUtils(withReact(withHistory(createEditor())))
  );

  const handleOnChange = (editorValue) => {
    const isAstChange = editor.operations.some(
      (op) => "set_selection" !== op.type
    );
    if (isAstChange) {
      onChange(editorValue);
    }
  };

  const handleOnKeyDown = (event) => {
    if (event.key === "Tab") {
      // Handle Tab for Nested List
      event.preventDefault();

      if (event.shiftKey) {
        // Shift + Tab to decrease nested list depth
        decreaseListDepth(editor);
      } else {
        // Tab to increase nested list depth
        increaseListDepth(editor);
      }
      return;
    }

    // Keyboard Shortcut
    if (!event.ctrlKey) {
      return;
    }

    switch (event.key) {
      case "b": {
        event.preventDefault();
        toggleMark(editor, "bold");
        break;
      }
      case "i": {
        event.preventDefault();
        toggleMark(editor, "italic");
        break;
      }
      case "u": {
        event.preventDefault();
        toggleMark(editor, "underline");
        break;
      }
      default:
        break;
    }
  };

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const renderToolbarButton = () => {
    return actions.map((action) => {
      const actionType = ACTION_BUTTON_TYPES[action];

      if (actionType.format === "link") {
        const insertLinkFn = (event) => {
          event.preventDefault();
          if (isBlockActive({ editor, format: "link" })) {
            unwrapLink(editor);
          } else {
            const url = prompt("Please input the URL");
            if (url) {
              wrapLink(editor, url);
            }
          }
        };
        return (
          <ToolbarButton
            key={`toolbar-button__${actionType.format}`}
            actionType={actionType}
            onToggle={insertLinkFn}
          />
        );
      } else if (actionType.format === "table") {
        const insertTableFn = (event) => {
          event.preventDefault();
          const row = prompt("Input row count");

          if (!row) {
            return;
          }

          const col = prompt("Input column count");

          if (
            row &&
            col &&
            row > 0 &&
            col > 0 &&
            row <= TABLE_MAX.row &&
            col <= TABLE_MAX.col
          ) {
            insertTable({
              editor,
              row,
              col,
            });
          } else if (row > TABLE_MAX.row || col > TABLE_MAX.col) {
            alert(
              `Maximum row is ${TABLE_MAX.row} and maximum column is ${TABLE_MAX.col}`
            );
          }
        };
        return (
          <ToolbarButton
            key={`toolbar-button__${actionType.format}`}
            actionType={actionType}
            onToggle={insertTableFn}
          />
        );
      } else if (actionType.type === ButtonType.TABLE_ACTION) {
        const modifyTableFn = (event) => {
          event.preventDefault();
          modifyTable(editor, actionType.format);
        };
        return (
          <ToolbarButton
            key={`toolbar-button__${actionType.format}`}
            actionType={actionType}
            onToggle={modifyTableFn}
          />
        );
      } else if (actionType.type === ButtonType.BLOCK) {
        const toggleBlockFn = (event) => {
          event.preventDefault();
          toggleBlock(editor, actionType.format);
        };

        return (
          <ToolbarButton
            key={`toolbar-button__${actionType.format}`}
            actionType={actionType}
            onToggle={toggleBlockFn}
          />
        );
      } else if (actionType.type === ButtonType.LEAF) {
        const toggleMarkFn = (event) => {
          event.preventDefault();
          toggleMark(editor, actionType.format);
        };

        return (
          <ToolbarButton
            key={`toolbar-button__${actionType.format}`}
            actionType={actionType}
            onToggle={toggleMarkFn}
          />
        );
      } else {
        return <></>;
      }
    });
  };

  return (
    <div className={styles.main}>
      <Slate editor={editor} initialValue={value} onChange={handleOnChange}>
        <div className={styles.toolbar}>{renderToolbarButton()}</div>
        <Editable
          className={styles.editor}
          id={id}
          onKeyDown={handleOnKeyDown}
          renderLeaf={renderLeaf}
          renderElement={renderElement}
        />
      </Slate>
    </div>
  );
};

export default TextAreaEditor;
