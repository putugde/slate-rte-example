import React from "react";
import { useSelected } from "slate-react";

import styles from "./element.module.css";

const Element = (props) => {
  const { attributes, children, element } = props;

  const selected = useSelected();

  // Put this at the start and end of an inline component to work around this Chromium bug:
  // https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
  const InlineChromiumBugfix = () => (
    <span contentEditable={false} style={{ fontSize: 0 }}>
      ${String.fromCodePoint(160) /* Non-breaking space */}
    </span>
  );

  const style = { textAlign: element.align };
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );

    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );

    case "heading-three":
      return (
        <h3 style={style} {...attributes}>
          {children}
        </h3>
      );
    case "heading-four":
      return (
        <h4 style={style} {...attributes}>
          {children}
        </h4>
      );
    case "heading-five":
      return (
        <h5 style={style} {...attributes}>
          {children}
        </h5>
      );
    case "heading-six":
      return (
        <h6 style={style} {...attributes}>
          {children}
        </h6>
      );
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "ordered-list-item":
      return <ol {...attributes}>{children}</ol>;
    case "unordered-list-item":
      return <ul {...attributes}>{children}</ul>;
    case "table":
      return (
        <table className={styles["rte__table"]}>
          <tbody {...attributes}>{children}</tbody>
        </table>
      );
    case "table-row":
      return <tr {...attributes}>{children}</tr>;
    case "table-cell":
      return (
        <td className={styles["rte__td"]} {...attributes}>
          {children}
        </td>
      );
    case "paragraph":
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
    case "unstyled":
      return (
        <div style={style} {...attributes}>
          {children}
        </div>
      );
    case "link":
      return (
        <a
          {...attributes}
          href={element.url}
          className={selected ? styles["rte-link-selected"] : ""}
          style={{ color: "blue", textDecoration: "underline" }}
        >
          <InlineChromiumBugfix />
          {children}
          <InlineChromiumBugfix />
        </a>
      );
    case "list-unstyled":
    default:
      return <>{children}</>;
  }
};

export default Element;
