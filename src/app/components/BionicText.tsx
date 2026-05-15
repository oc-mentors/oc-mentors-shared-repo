import { Fragment, type CSSProperties } from "react";
import { useLearningComfort } from "../contexts/LearningComfortContext";

function splitWords(text: string): { type: "word" | "space"; value: string }[] {
  const out: { type: "word" | "space"; value: string }[] = [];
  const re = /(\s+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push({ type: "word", value: text.slice(last, m.index) });
    out.push({ type: "space", value: m[1] });
    last = m.index + m[1].length;
  }
  if (last < text.length) out.push({ type: "word", value: text.slice(last) });
  return out;
}

function emphasizeWord(word: string, keyBase: string) {
  const w = word;
  if (w.length <= 1) return <Fragment key={keyBase}>{w}</Fragment>;
  const n = w.length === 2 ? 1 : 2;
  const head = w.slice(0, n);
  const tail = w.slice(n);
  return (
    <Fragment key={keyBase}>
      <strong className="font-semibold oc-reading-assist-head">{head}</strong>
      {tail}
    </Fragment>
  );
}

/** When reading assist is on, bolds the first 1–2 characters of each word. Otherwise renders plain text. */
export function BionicText({ text, className, style }: { text: string; className?: string; style?: CSSProperties }) {
  const { readingAssistEnabled } = useLearningComfort();
  if (!readingAssistEnabled) {
    return (
      <span className={className} style={style}>
        {text}
      </span>
    );
  }
  const parts = splitWords(text);
  return (
    <span className={className} style={style}>
      {parts.map((p, i) =>
        p.type === "space" ? (
          <Fragment key={`s-${i}`}>{p.value}</Fragment>
        ) : (
          <Fragment key={`w-${i}`}>{emphasizeWord(p.value, `w-${i}`)}</Fragment>
        )
      )}
    </span>
  );
}
