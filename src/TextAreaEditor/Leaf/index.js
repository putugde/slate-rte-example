import React from "react";

const Leaf = (props) => {
  const { leaf, children, attributes } = props;

  let newChildren = children;

  if (leaf.bold) {
    newChildren = <strong>{newChildren}</strong>;
  }

  if (leaf.code) {
    newChildren = <code>{newChildren}</code>;
  }

  if (leaf.italic) {
    newChildren = <em>{newChildren}</em>;
  }

  if (leaf.underline) {
    newChildren = <u>{newChildren}</u>;
  }

  return (
    <span
      // The following is a workaround for a Chromium bug where,
      // if you have an inline at the end of a block,
      // clicking the end of a block puts the cursor inside the inline
      // instead of inside the final {text: ''} node
      // https://github.com/ianstormtaylor/slate/issues/4704#issuecomment-1006696364
      style={leaf.text !== "" ? { paddingLeft: "0.1px" } : undefined}
      {...attributes}
    >
      {newChildren}
    </span>
  );
};

export default Leaf;
