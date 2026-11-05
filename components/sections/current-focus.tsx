const focus = [
  { label: "Systems", value: "Agentic AI and multimodal LLM workflows" },
  { label: "Designing for", value: "Orchestration, retrieval, memory and performance" },
  { label: "Alongside", value: "Photography, visual detail and creative projects" },
];

export function CurrentFocus() {
  return <section className="px-[var(--page-gutter)] py-16"><div className="page-shell grid gap-8 md:grid-cols-[.7fr_1.3fr]"><div><p className="meta-label mb-3 text-accent">Currently · 04</p><h2 className="font-display text-4xl">What holds my attention.</h2></div><dl className="grid gap-0 sm:grid-cols-3">{focus.map((item) => <div key={item.label} className="border-t border-border py-4 sm:px-4"><dt className="meta-label text-muted-foreground">{item.label}</dt><dd className="mt-2 text-sm leading-relaxed">{item.value}</dd></div>)}</dl></div></section>;
}
