// lib/renderRichText.js
export function renderRichText(nodes) {
  if (!Array.isArray(nodes)) return null;

  return nodes.map((node, i) => {
    switch (node.type) {
      case 'paragraph':
        return <p key={i}>{renderRichText(node.children)}</p>;
      case 'bold':
        return <strong key={i}>{renderRichText(node.children)}</strong>;
      case 'italic':
        return <em key={i}>{renderRichText(node.children)}</em>;
      case 'text':
        return node.text;
      // Add other node types as needed (e.g. heading, list, link, etc.)
      default:
        return renderRichText(node.children);
    }
  });
}
