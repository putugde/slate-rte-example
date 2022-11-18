import {
  Editor,
  Text,
  Range as SlateRange,
  Node as SlateNode,
  Point,
  Element as SlateElement,
  Transforms,
  Path,
} from "slate";

import { LIST_TYPES, TEXT_ALIGN_TYPES } from "./Element/constant";

export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isBlockActive = (props) => {
  const { editor, format, blockType = "type" } = props;

  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  );

  return !!match;
};

export const increaseListDepth = (editor) => {
  if (editor.selection) {
    const [list] = Array.from(
      Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          LIST_TYPES.includes(n.type),
      })
    );

    if (list) {
      const format = list[0].type;

      const currentPath = editor.selection.anchor.path;
      const pathToWrap = currentPath.slice(0, currentPath.length - 2);
      const targetLiNumber = pathToWrap[pathToWrap.length - 1] - 1;

      if (targetLiNumber < 0) {
        return;
      }

      Transforms.wrapNodes(
        editor,
        {
          type: format,
          children: [],
        },
        {
          at: pathToWrap,
        }
      );

      const targetChildCount = Array.from(
        SlateNode.children(list[0], [
          ...pathToWrap.slice(1, pathToWrap.length - 1),
          targetLiNumber,
        ])
      ).length;

      const targetPath = [
        ...pathToWrap.slice(0, pathToWrap.length - 1),
        targetLiNumber,
        targetChildCount,
      ];
      Transforms.moveNodes(editor, {
        at: pathToWrap,
        to: targetPath,
      });
    }
  }
};

export const decreaseListDepth = (editor) => {
  if (editor.selection) {
    const [list] = Array.from(
      Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          LIST_TYPES.includes(n.type),
      })
    );

    if (list) {
      const format = list[0].type;

      Transforms.unwrapNodes(editor, {
        match: (n, path) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === format &&
          path.length > 1,
        split: true,
      });

      Transforms.liftNodes(editor, {
        match: (n, path) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === "list-item" &&
          path.length > 2,
      });
    }
  }
};

export const insertTable = (props) => {
  const { editor, row, col } = props;

  console.log("masuk gan");

  if (editor.selection) {
    console.log("masuk 2");
    const [table] = Array.from(
      Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === "table",
      })
    );

    if (table) {
      return;
    }

    const colNode = [];
    const rowNode = [];
    for (let i = 0; i < col; i++) {
      colNode.push({
        type: "table-cell",
        children: [
          {
            type: "unstyled",
            children: [
              {
                text: "",
              },
            ],
          },
        ],
      });
    }

    for (let i = 0; i < row; i++) {
      rowNode.push({
        type: "table-row",
        children: JSON.parse(JSON.stringify(colNode)), // Deep Copy
      });
    }

    const tableNode = {
      type: "table",
      children: rowNode,
    };

    console.log(tableNode);

    Transforms.insertNodes(editor, tableNode, {
      match: (n, path) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n.type !== "table" &&
        path.length === 1,
    });

    Transforms.insertNodes(
      editor,
      {
        type: "paragraph",
        children: [
          {
            text: "",
          },
        ],
      },
      {
        at: [editor.selection.anchor.path[0] + 1],
      }
    );
  }
};

export const modifyTable = (editor, format) => {
  if (editor.selection && SlateRange.isCollapsed(editor.selection)) {
    const [table] = Array.from(
      Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === "table",
      })
    );

    if (table) {
      const selectionPath = editor.selection.anchor.path;
      const rowNode = table[0].children[0];

      // Getting Table Size
      const rowNodeCount = table[0].children.length;
      const cellNodeCount = rowNode.children.length;

      // Assumption: Table row is always on 2nd level depth (no table inside table)
      switch (format) {
        case "table-insert-row": {
          const rowTarget = selectionPath[1];
          const newCellNodes = [];

          for (let i = 0; i < cellNodeCount; i++) {
            newCellNodes.push({
              type: "table-cell",
              children: [{ type: "unstyled", children: [{ text: "" }] }],
            });
          }

          Transforms.insertNodes(
            editor,
            {
              type: "table-row",
              children: newCellNodes,
            },
            {
              at: [selectionPath[0], rowTarget + 1],
            }
          );

          Transforms.select(editor, [
            selectionPath[0],
            rowTarget + 1,
            selectionPath[2],
          ]);
          Transforms.collapse(editor);
          return;
        }
        case "table-insert-col": {
          const tablePos = selectionPath[0];
          const colPos = selectionPath[2];

          for (let i = 0; i < rowNodeCount; i++) {
            Transforms.insertNodes(
              editor,
              {
                type: "table-cell",
                children: [
                  {
                    type: "unstyled",
                    children: [{ text: "" }],
                  },
                ],
              },
              {
                at: [tablePos, i, colPos + 1],
              }
            );
          }

          Transforms.select(editor, [...selectionPath.slice(0, 2), colPos + 1]);
          Transforms.collapse(editor);

          return;
        }
        case "table-remove-row": {
          if (rowNodeCount > 1) {
            Transforms.removeNodes(editor, {
              match: (n) =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type === "table-row",
            });
          }

          return;
        }
        case "table-remove-col": {
          if (cellNodeCount > 1) {
            const tablePos = selectionPath[0];
            const cellPos = selectionPath[2];

            Transforms.removeNodes(editor, {
              at: [tablePos],
              match: (n, path) => {
                return (
                  !Editor.isEditor(n) &&
                  SlateElement.isElement(n) &&
                  n.type === "table-cell" &&
                  path.length === 3 &&
                  path[2] === cellPos
                );
              },
            });
          }
          return;
        }
        default:
          return;
      }
    }
  }
};

export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive({
    editor,
    format,
    blockType: TEXT_ALIGN_TYPES.includes(format) ? "align" : "type",
  });
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (LIST_TYPES.includes(n.type) || n.type === "list-item") &&
      !TEXT_ALIGN_TYPES.includes(format),
    mode: "all",
    split: true,
  });

  const [table] = Array.from(
    Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "table",
    })
  );

  let newElement;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    // Text Align
    newElement = {
      align: isActive ? "left" : format,
    };
  } else {
    // Other block
    newElement = {
      type: isActive
        ? table
          ? "unstyled"
          : "paragraph"
        : isList
        ? "unstyled"
        : format,
    };
  }
  Transforms.setNodes(editor, newElement);

  if (!isActive && isList) {
    Transforms.wrapNodes(editor, {
      type: format,
      children: [],
    });
    Transforms.wrapNodes(editor, {
      type: "list-item",
      children: [],
    });
  }
};

export const wrapLink = (editor, url) => {
  if (isBlockActive({ editor, format: "link" })) {
    unwrapLink(editor);
    return;
  }
  const { selection } = editor;
  const isCollapsed = selection && SlateRange.isCollapsed(selection);
  const linkElement = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, linkElement);
  } else {
    Transforms.wrapNodes(editor, linkElement, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

export const unwrapLink = (editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  });
};

export const withUtils = (editor) => {
  const {
    deleteBackward,
    deleteForward,
    insertBreak,
    insertSoftBreak,
    isInline,
  } = editor;

  editor.isInline = (element) => element.type === "link" || isInline(element);

  editor.deleteBackward = (unit) => {
    const { selection } = editor;

    if (selection && SlateRange.isCollapsed(selection)) {
      const [list] = Array.from(
        Editor.nodes(editor, {
          match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes(n.type),
        })
      );

      // Decrease depth when press backspace on 1st character
      if (list && selection.anchor.offset === 0) {
        decreaseListDepth(editor);
        return;
      }

      // Handle table
      const [cell] = Array.from(
        Editor.nodes(editor, {
          match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n.type === "table-cell",
        })
      );

      if (cell) {
        const [, cellPath] = cell;
        const start = Editor.start(editor, cellPath);

        if (Point.equals(selection.anchor, start)) {
          return;
        }
      }
    }

    deleteBackward(unit);
  };

  // Handle table
  editor.deleteForward = (unit) => {
    const { selection } = editor;

    if (selection && SlateRange.isCollapsed(selection)) {
      const [cell] = Array.from(
        Editor.nodes(editor, {
          match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n.type === "table-cell",
        })
      );

      if (cell) {
        const [, cellPath] = cell;
        const end = Editor.end(editor, cellPath);

        if (Point.equals(selection.anchor, end)) {
          return;
        }
      }
    }

    deleteForward(unit);
  };

  // Handle table
  editor.insertBreak = () => {
    const { selection } = editor;

    if (selection) {
      const [table] = Array.from(
        Editor.nodes(editor, {
          match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n.type === "table",
        })
      );

      const [list] = Array.from(
        Editor.nodes(editor, {
          match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes(n.type),
        })
      );

      // Handle Table
      if (table && !list) {
        // Insert softbreak if Enter pressed instead of creating new block
        insertSoftBreak();
        return;
      }

      // Handle List

      if (list) {
        insertBreak();

        // WRAP NODE
        Transforms.wrapNodes(editor, {
          type: "list-item",
          children: [],
        });

        // LIFT NODE
        const pathAncestor = Path.ancestors(editor.selection?.focus.path ?? []);

        const liftPath = pathAncestor[pathAncestor.length - 2];

        Transforms.liftNodes(editor, { at: liftPath });
        return;
      }
    }

    insertBreak();
  };

  return editor;
};

export const serializeToHTML = (node) => {
  if (Text.isText(node)) {
    let string = node.text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    if (node.italic) {
      string = `<em>${string}</em>`;
    }
    if (node.underline) {
      string = `<u>${string}</u>`;
    }
    if (node.code) {
      string = `<code>${string}</code>`;
    }
    return string;
  }

  const children = node.children.map((n) => serializeToHTML(n)).join("");

  // Inline Style is not actually recommended, usually blocked by CSP
  const alignStyle = `"text-align: ${node.align ? node.align : "left"};"`;
  const tableStyle = `"border-collapse:collapse;width:100%"`;
  const tdStyle = `"border:1px solid black;padding:4px;"`;

  switch (node.type) {
    case "heading-one":
      return `<h1 style=${alignStyle}>${children}</h1>`;
    case "heading-two":
      return `<h2 style=${alignStyle}>${children}</h2>`;
    case "heading-three":
      return `<h3 style=${alignStyle}>${children}</h3>`;
    case "heading-four":
      return `<h4 style=${alignStyle}>${children}</h4>`;
    case "heading-five":
      return `<h5 style=${alignStyle}>${children}</h5>`;
    case "heading-six":
      return `<h6 style=${alignStyle}>${children}</h6>`;
    case "ordered-list-item":
      return `<ol>${children}</ol>`;
    case "unordered-list-item":
      return `<ul>${children}</ul>`;
    case "list-item":
      return `<li>${children}</li>`;
    case "table":
      return `<table style=${tableStyle}><tbody>${children}</tbody></table>`;
    case "table-row":
      return `<tr>${children}</tr>`;
    case "table-cell":
      return `<td style=${tdStyle}>${children}</td>`;
    case "paragraph":
      return `<p style=${alignStyle}>${children}</p>`;
    case "unstyled":
      return `<div style=${alignStyle}>${children}</div>`;
    case "link":
      return `<a target="_blank" rel="noreferrer noopener" href="${node.url}">${children}</a>`;
    default:
      return children;
  }
};
