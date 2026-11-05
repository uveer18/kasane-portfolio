"use client";

import Image from "next/image";
import { useState } from "react";

const palette = [
  { name: "Sumi", jp: "墨", hex: "#171B1C", role: "Dark foundation", inspiration: "Ink black, softened with a hint of green." },
  { name: "Tetsu", jp: "鉄", hex: "#252D2C", role: "Dark raised surface", inspiration: "Iron and mineral depth." },
  { name: "Shironeri", jp: "白練", hex: "#EAE5D9", role: "Light foundation", inspiration: "Warm off-white, less stark than pure white." },
  { name: "Seiji", jp: "青磁", hex: "#617C79", role: "Identity accent", inspiration: "A green-blue for focus and wayfinding." },
  { name: "Bengara", jp: "弁柄", hex: "#A94F43", role: "Warm emphasis", inspiration: "An earthy red for selected moments." },
  { name: "Kohaku", jp: "琥珀", hex: "#B49A69", role: "Highlights", inspiration: "Muted amber for small details." },
  { name: "Ruri", jp: "瑠璃", hex: "#344C64", role: "Technical blue", inspiration: "A deep blue for engineering fields." },
  { name: "Matcha", jp: "抹茶", hex: "#879477", role: "Botanical accent", inspiration: "A quiet natural green." },
  { name: "Usuzumi", jp: "薄墨", hex: "#C6B8A3", role: "Warm neutral", inspiration: "A stone-like neutral for softened edges." },
];
const themes = [
  { name: "Shironeri", background: "#EAE5D9", foreground: "#171B1C", set: "Light theme" },
  { name: "Sumi", background: "#171B1C", foreground: "#EAE5D9", set: "Dark theme" },
];
const fonts = [
  { name: "Newsreader", font: "font-display", usage: "Editorial headings and photography titles" },
  { name: "Geist", font: "font-sans", usage: "Engineering, body copy and interface" },
  { name: "IBM Plex Mono", font: "font-mono", usage: "Dates, camera settings and technical metadata" },
  { name: "Noto Serif JP", font: "font-japanese", usage: "Japanese typesetting and the closing mark" },
];

function rgb(hex: string) { return hex.match(/[a-f\d]{2}/gi)?.map((part) => Number.parseInt(part, 16)) ?? [0, 0, 0]; }
function hsl(hex: string) {
  const [r8, g8, b8] = rgb(hex); const r = r8 / 255; const g = g8 / 255; const b = b8 / 255;
  const max = Math.max(r, g, b); const min = Math.min(r, g, b); const delta = max - min; let h = 0; let s = 0; const l = (max + min) / 2;
  if (delta) { s = delta / (1 - Math.abs(2 * l - 1)); if (max === r) h = ((g - b) / delta) % 6; else if (max === g) h = (b - r) / delta + 2; else h = (r - g) / delta + 4; h = (h * 60 + 360) % 360; }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}
function luminance(hex: string) { return rgb(hex).map((byte) => { const c = byte / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }).reduce((sum, channel, i) => sum + channel * [0.2126, 0.7152, 0.0722][i], 0); }
function contrast(a: string, b: string) { const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x); return ((high + .05) / (low + .05)).toFixed(2); }
function contrastForeground(hex: string) { return Number(contrast(hex, "#171B1C")) > Number(contrast(hex, "#EAE5D9")) ? "#171B1C" : "#EAE5D9"; }

export function ColorLab() {
  const [selected, setSelected] = useState(palette[3]);
  const [mode, setMode] = useState<"editorial" | "interface" | "photography">("editorial");
  const [copied, setCopied] = useState("");
  const [h, s, l] = hsl(selected.hex);
  const relationships = [-30, 180, 30].map((offset, index) => ({ label: ["Analogous −30°", "Complement +180°", "Analogous +30°"][index], color: `hsl(${(h + offset + 360) % 360} ${s}% ${l}%)` }));
  const copy = async (value: string, label: string) => { try { await navigator.clipboard.writeText(value); setCopied(`${label} copied`); window.setTimeout(() => setCopied(""), 1800); } catch { setCopied("Clipboard unavailable"); } };
  return <div className="grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
    <div className="grid grid-cols-3 gap-2">{palette.map((color) => <button key={color.name} onClick={() => setSelected(color)} aria-label={`Select ${color.name} ${color.hex}`} aria-pressed={selected.name === color.name} className={`group text-left ${selected.name === color.name ? "ring-2 ring-kohaku" : ""}`}><span className="block aspect-[1.4] w-full border border-border transition-transform group-hover:-translate-y-1" style={{ backgroundColor: color.hex }}/><span className="mt-2 block text-xs">{color.name} <span className="font-japanese">{color.jp}</span></span><span className="meta-label text-[9px] text-muted-foreground">{color.hex}</span></button>)}</div>
    <div className="surface-glass rounded-xl p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="meta-label text-accent">{selected.jp} / {selected.name}</p><h3 className="mt-2 font-display text-3xl">{selected.hex}</h3><p className="mt-2 text-sm text-muted-foreground">{selected.role}. {selected.inspiration}</p></div><div className="flex gap-2"><button onClick={() => copy(selected.hex, "HEX")} className="rounded-full border border-border px-3 py-2 text-xs">Copy HEX</button><button onClick={() => copy(`--${selected.name.toLowerCase()}: ${selected.hex};`, "CSS variable")} className="rounded-full border border-border px-3 py-2 text-xs">Copy token</button></div></div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground"><span>RGB {rgb(selected.hex).join(", ")}</span><span>HSL {h}°, {s}%, {l}%</span><span>Contrast on Shironeri {contrast(selected.hex, "#EAE5D9")}:1</span><span>Contrast on Sumi {contrast(selected.hex, "#171B1C")}:1</span></div>
      <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[520px] text-left text-xs"><caption className="mb-2 text-left meta-label text-muted-foreground">Palette contrast / original token as text colour</caption><thead><tr className="border-b border-border text-muted-foreground"><th className="py-2 pr-3 font-normal">Colour</th><th className="py-2 pr-3 font-normal">RGB · HSL</th><th className="py-2 pr-3 font-normal">On Shironeri</th><th className="py-2 pr-3 font-normal">On Sumi</th><th className="py-2 font-normal">Role</th></tr></thead><tbody>{palette.map((color) => <tr key={color.name} className="border-b border-border/60"><td className="py-2 pr-3"><button className="inline-flex items-center gap-2 underline-offset-2 hover:underline" onClick={() => setSelected(color)}><span className="h-3 w-3" style={{ backgroundColor: color.hex }}/>{color.name}</button></td><td className="py-2 pr-3 text-muted-foreground">{rgb(color.hex).join("/")} · {hsl(color.hex).map((value, index) => `${value}${index === 0 ? "°" : "%"}`).join(" / ")}</td><td className="py-2 pr-3">{contrast(color.hex, "#EAE5D9")}:1</td><td className="py-2 pr-3">{contrast(color.hex, "#171B1C")}:1</td><td className="py-2 text-muted-foreground">{color.role}</td></tr>)}</tbody></table><p className="mt-2 text-[11px] text-muted-foreground">Ratios use the original palette hex values. Semantic text tokens in the interface use adjusted tints where needed to meet contrast requirements.</p></div>
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Color preview mode">{(["editorial", "interface", "photography"] as const).map((item) => <button key={item} onClick={() => setMode(item)} aria-pressed={mode === item} className={`rounded-full px-3 py-1.5 text-xs capitalize ${mode === item ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>{item}</button>)}</div>
      <div className="relative mt-3 min-h-52 overflow-hidden rounded-lg p-6 transition-colors" style={{ background: mode === "photography" ? "var(--page-alt)" : selected.hex, color: mode === "photography" ? "var(--ink)" : contrastForeground(selected.hex) }}>
        {mode === "photography" && <Image src="/images/gallery/photo-4.jpg" alt="Existing waterfall photograph used to preview the selected colour accent" width={3374} height={5998} sizes="(max-width: 1024px) 100vw, 50vw" className="absolute inset-0 h-full w-full object-contain opacity-55"/>}
        <div className="relative z-10 flex min-h-40 flex-col justify-between"><p className="meta-label">KASANE / COLOUR STUDY</p><div><h4 className="font-display text-3xl">{mode === "interface" ? "A useful contrast." : mode === "photography" ? "Light on water." : "Colour in context."}</h4><p className="mt-2 max-w-sm text-xs opacity-80">A live specimen uses the selected colour and the site&apos;s type. Colour relationships here are calculated digitally, not presented as historical Japanese colour theory.</p></div></div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3"><span className="meta-label text-muted-foreground">Calculated relationships</span>{relationships.map((relationship) => <span key={relationship.label} title={relationship.label} className="h-6 w-6 rounded-full border border-border" style={{ backgroundColor: relationship.color }}/ >)}<span className="text-[10px] text-muted-foreground">{relationships.map((item) => item.label).join(" · ")}</span><span role="status" className="ml-auto text-xs text-muted-foreground">{copied}</span></div>
    </div>
    <div className="lg:col-span-2 grid gap-2 sm:grid-cols-2"><div className="rounded-lg border border-border p-4"><p className="meta-label mb-3 text-muted-foreground">Light theme / recommended foreground pairs</p><div className="flex flex-wrap gap-2">{palette.map((color) => <span key={color.name} className="px-3 py-2 text-xs" style={{ background: color.hex, color: contrastForeground(color.hex) }}>{color.name}</span>)}</div></div><div className="rounded-lg border border-border p-4"><p className="meta-label mb-3 text-muted-foreground">Dark theme / recommended foreground pairs</p><div className="flex flex-wrap gap-2">{palette.map((color) => <span key={color.name} className="px-3 py-2 text-xs" style={{ background: color.hex, color: contrastForeground(color.hex) }}>{color.name}</span>)}</div></div><p className="text-[11px] text-muted-foreground sm:col-span-2">The swatches show original palette fields with the higher-contrast foundation colour. Actual UI accents may use derived tints and shades; see the theme token map in <code>app/globals.css</code>.</p></div>
    <p className="text-[11px] text-muted-foreground lg:col-span-2">{themes.map((theme) => `${theme.set}: ${theme.name} ${theme.background} · text ${theme.foreground}`).join(" / ")}</p>
  </div>;
}

export function TypographyLab() {
  const [selected, setSelected] = useState(fonts[0]);
  return <div className="grid gap-7 lg:grid-cols-[.65fr_1.35fr]"><div className="space-y-2">{fonts.map((font) => <button key={font.name} onClick={() => setSelected(font)} aria-pressed={selected.name === font.name} className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition ${selected.name === font.name ? "border-accent bg-highlight" : "border-border"}`}><span className="text-sm">{font.name}</span><span className="meta-label text-[9px] text-muted-foreground">{selected.name === font.name ? "Selected" : "Specimen"}</span></button>)}</div><div className="surface-glass rounded-xl p-6 sm:p-9"><p className="meta-label text-accent">{selected.name} / variable weights</p><p className={`mt-7 text-4xl leading-tight sm:text-6xl ${selected.font}`}>Building systems. Seeing things differently.</p><p className={`mt-6 break-words text-sm text-muted-foreground ${selected.font}`}>ABCDEFGHIJKLMNOPQRSTUVWXYZ · abcdefghijklmnopqrstuvwxyz · 0123456789</p><p className={`mt-3 text-2xl ${selected.font}`}>{"終　重ねる　色を見る"}</p><div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground"><span>{selected.usage}</span><span>Weights · 400 / 500 / 600</span></div></div></div>;
}
