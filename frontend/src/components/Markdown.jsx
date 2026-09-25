// Tiny, safe renderer for model answers: paragraphs, "-"/"*"/"1." lists, **bold**, `code`.
// Builds React nodes (no innerHTML), so model output can never inject markup.
function inline(text, key) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={`${key}-${i}`}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('`') && p.endsWith('`')) return <code key={`${key}-${i}`}>{p.slice(1, -1)}</code>;
    return p;
  });
}

export default function Markdown({ text }) {
  const blocks = [];
  let list = null;
  text.replace(/\r/g, '').split('\n').forEach((raw, i) => {
    const line = raw.trim();
    const m = line.match(/^([-*•]|\d+[.)])\s+(.*)$/);
    if (m) {
      const ordered = /\d/.test(m[1]);
      if (!list || list.ordered !== ordered) { list = { ordered, items: [] }; blocks.push(list); }
      list.items.push(m[2]);
      return;
    }
    list = null;
    if (!line) return;
    blocks.push({ p: line.replace(/^#+\s*/, '') });
  });

  return blocks.map((b, i) =>
    b.items ? (
      b.ordered
        ? <ol key={i}>{b.items.map((t, j) => <li key={j}>{inline(t, `${i}-${j}`)}</li>)}</ol>
        : <ul key={i}>{b.items.map((t, j) => <li key={j}>{inline(t, `${i}-${j}`)}</li>)}</ul>
    ) : <p key={i}>{inline(b.p, i)}</p>
  );
}
