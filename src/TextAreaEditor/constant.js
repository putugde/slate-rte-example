import React from "react";

import toolbarStyles from "./ToolbarButton/toolbar.module.css";

export const ButtonType = {
  BLOCK: "block",
  LEAF: "leaf",
  TABLE_ACTION: "table-action",
};

export const ACTION_BUTTON_TYPES = {
  "heading-one": {
    label: "H1",
    format: "heading-one",
    icon: <span className="material-symbols-outlined">format_h1</span>,
    type: ButtonType.BLOCK,
  },
  "heading-two": {
    label: "H2",
    format: "heading-two",
    icon: <span className="material-symbols-outlined">format_h2</span>,
    type: ButtonType.BLOCK,
  },
  "heading-three": {
    label: "H3",
    format: "heading-three",
    icon: <span className="material-symbols-outlined">format_h3</span>,
    type: ButtonType.BLOCK,
  },
  "heading-four": {
    label: "H4",
    format: "heading-four",
    icon: <span className="material-symbols-outlined">format_h4</span>,
    type: ButtonType.BLOCK,
  },
  "heading-five": {
    label: "H5",
    format: "heading-five",
    icon: <span className="material-symbols-outlined">format_h5</span>,
    type: ButtonType.BLOCK,
  },
  "heading-six": {
    label: "H6",
    format: "heading-six",
    icon: <span className="material-symbols-outlined">format_h6</span>,
    type: ButtonType.BLOCK,
  },
  "block-quote": {
    label: "Blockquote",
    format: "block-quote",
    type: ButtonType.BLOCK,
  },
  "unordered-list-item": {
    label: "Unordered List",
    icon: (
      <span className="material-symbols-outlined">format_list_bulleted</span>
    ),
    format: "unordered-list-item",
    type: ButtonType.BLOCK,
  },
  "ordered-list-item": {
    label: "Ordered List",
    icon: (
      <span className="material-symbols-outlined">format_list_numbered</span>
    ),
    format: "ordered-list-item",
    type: ButtonType.BLOCK,
  },
  table: {
    label: "Insert Table",
    format: "table",
    type: ButtonType.BLOCK,
    icon: <span className="material-symbols-outlined">table</span>,
  },
  "table-insert-row": {
    label: "Insert Row",
    format: "table-insert-row",
    type: ButtonType.TABLE_ACTION,
    icon: (
      <div className={toolbarStyles["nested-icon-container"]}>
        <span className="material-symbols-outlined">table_rows</span>
        <div className={toolbarStyles["nested-icon-front"]}>
          <span className="material-symbols-outlined">add</span>
        </div>
      </div>
    ),
  },
  "table-remove-row": {
    label: "Remove Row",
    format: "table-remove-row",
    type: ButtonType.TABLE_ACTION,
    icon: (
      <div className={toolbarStyles["nested-icon-container"]}>
        <span className="material-symbols-outlined">table_rows</span>
        <div className={toolbarStyles["nested-icon-front"]}>
          <span className="material-symbols-outlined">remove</span>
        </div>
      </div>
    ),
  },
  "table-insert-col": {
    label: "Insert Column",
    format: "table-insert-col",
    type: ButtonType.TABLE_ACTION,
    icon: (
      <div className={toolbarStyles["nested-icon-container"]}>
        <span className="material-symbols-outlined">view_column</span>
        <div className={toolbarStyles["nested-icon-front"]}>
          <span className="material-symbols-outlined">add</span>
        </div>
      </div>
    ),
  },

  "table-remove-col": {
    label: "Remove Column",
    format: "table-remove-col",
    type: ButtonType.TABLE_ACTION,
    icon: (
      <div className={toolbarStyles["nested-icon-container"]}>
        <span className="material-symbols-outlined">view_column</span>
        <div className={toolbarStyles["nested-icon-front"]}>
          <span className="material-symbols-outlined">remove</span>
        </div>
      </div>
    ),
  },
  left: {
    label: "Left Align",
    format: "left",
    icon: <span className="material-symbols-outlined">format_align_left</span>,
    type: ButtonType.BLOCK,
  },
  center: {
    label: "Center Align",
    format: "center",
    icon: (
      <span className="material-symbols-outlined">format_align_center</span>
    ),
    type: ButtonType.BLOCK,
  },
  right: {
    label: "Right Align",
    format: "right",
    icon: <span className="material-symbols-outlined">format_align_right</span>,
    type: ButtonType.BLOCK,
  },
  justify: {
    label: "Justify Align",
    format: "justify",
    icon: (
      <span className="material-symbols-outlined">format_align_justify</span>
    ),
    type: ButtonType.BLOCK,
  },
  "code-block": {
    label: "Code Block",
    format: "code-block",
    type: ButtonType.BLOCK,
  },
  link: {
    label: "Link",
    format: "link",
    icon: <span className="material-symbols-outlined">link</span>,
    type: ButtonType.BLOCK,
  },
  bold: {
    label: "Bold",
    icon: <span className="material-symbols-outlined">format_bold</span>,
    format: "bold",
    type: ButtonType.LEAF,
  },
  italic: {
    label: "Italic",
    icon: <span className="material-symbols-outlined">format_italic</span>,
    format: "italic",
    type: ButtonType.LEAF,
  },
  underline: {
    label: "Underline",
    icon: <span className="material-symbols-outlined">format_underlined</span>,
    format: "underline",
    type: ButtonType.LEAF,
  },
  code: {
    label: "Code",
    format: "code",
    icon: <span className="material-symbols-outlined">code</span>,
    type: ButtonType.LEAF,
  },
};

export const DEFAULT_ACTIONS = [
  "bold",
  "italic",
  "underline",
  "code",
  "left",
  "center",
  "right",
  "justify",
  "heading-one",
  "heading-two",
  "heading-three",
  "heading-four",
  "heading-five",
  "heading-six",
  "ordered-list-item",
  "unordered-list-item",
  "link",
  "table",
  "table-insert-row",
  "table-remove-row",
  "table-insert-col",
  "table-remove-col",
];

export const INITIAL_VALUE = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export const TABLE_MAX = {
  row: 50,
  col: 10,
};
