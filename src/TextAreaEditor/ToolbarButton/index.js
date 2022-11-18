import React from "react";
import { Editor, Element as SlateElement } from "slate";
import { useSlate } from "slate-react";

import { TEXT_ALIGN_TYPES } from "../Element/constant";
import { isBlockActive, isMarkActive } from "../util";
import { ButtonType } from "../constant";
import styles from "./toolbar.module.css";

const ToolbarButton = (props) => {
  const { actionType, onToggle } = props;

  const editor = useSlate();

  const isActive = () => {
    if (actionType.type === ButtonType.BLOCK) {
      return isBlockActive({
        editor,
        format: actionType.format,
        blockType: TEXT_ALIGN_TYPES.includes(actionType.format)
          ? "align"
          : "type",
      });
    } else if (actionType.type === ButtonType.LEAF) {
      return isMarkActive(editor, actionType.format);
    }

    return false;
  };

  const [table] = Array.from(
    Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "table",
    })
  );

  if (
    (actionType.type === ButtonType.TABLE_ACTION && !!table) ||
    actionType.type !== ButtonType.TABLE_ACTION
  ) {
    return (
      <span
        aria-hidden="true"
        className={`${isActive() ? styles.active : ""} ${
          styles["toolbar-btn"]
        }`}
        onMouseDown={onToggle}
        title={actionType.label}
      >
        {actionType.icon ? actionType.icon : actionType.label}
      </span>
    );
  }

  return <></>;
};

export default ToolbarButton;
