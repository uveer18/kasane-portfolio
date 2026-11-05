"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowUpRight, ImagePlus, LockKeyhole } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function PhotoUploadLogin() {
  const [key, setKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dimensions, setDimensions] = useState({ width: "", height: "" });

  useEffect(() => { fetch("/api/photography/admin").then((response) => response.json()).then((result: { authenticated?: boolean }) => { const valid = Boolean(result.authenticated); setAuthenticated(valid); if (valid) setOpen(true); }).catch(() => undefined); }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setStatus("");
    try {
      const response = await fetch("/api/photography/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not sign in.");
      setAuthenticated(true); setKey(""); setStatus("Signed in. Add the photograph details below.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Could not sign in."); }
    finally { setBusy(false); }
  }

  function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); setBusy(true); setProgress(0); setStatus("Preparing upload…");
    const request = new XMLHttpRequest(); request.open("POST", "/api/photography/upload"); request.withCredentials = true;
    request.upload.onprogress = (progressEvent) => { if (progressEvent.lengthComputable) { const value = Math.round((progressEvent.loaded / progressEvent.total) * 100); setProgress(value); setStatus(`Uploading photograph · ${value}%`); } };
    request.onerror = () => { setBusy(false); setStatus("Upload failed. Check your connection and try again."); };
    request.onload = () => {
      let result: { error?: string; photo?: unknown } = {};
      try { result = JSON.parse(request.responseText); } catch { /* keep the generic failure below */ }
      if (request.status < 200 || request.status >= 300) { setStatus(result.error ?? "Upload failed. Try again."); setBusy(false); return; }
      setStatus("Photograph added to the journal."); form.reset(); setDimensions({ width: "", height: "" }); setProgress(100);
      window.dispatchEvent(new CustomEvent("photograph-added", { detail: result.photo })); setBusy(false);
    };
    request.send(data);
  }

  async function signOut() { await fetch("/api/photography/admin", { method: "DELETE" }); setAuthenticated(false); setStatus("Signed out."); }

  return <section id="photo-admin" className="mt-24 border-t border-border pt-6">
    <div className="flex justify-end"><button type="button" aria-expanded={open} aria-controls="photo-upload-panel" onClick={() => { setOpen((value) => !value); setStatus(""); }} className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs text-muted-foreground transition hover:border-seiji-ink hover:text-seiji-ink"><LockKeyhole size={14}/><span>{open ? "Close photo access" : "Add Photos"}</span><ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/></button></div>
    <AnimatePresence initial={false}><motion.div id="photo-upload-panel" initial={{ height: 0, opacity: 0 }} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .28, ease: [.22, 1, .36, 1] }} className="overflow-hidden">
      {open && <div className="ml-auto mt-6 w-full max-w-2xl border-t border-border pt-6">
        {!authenticated ? <form onSubmit={login} className="surface-glass rounded-xl p-5 sm:p-6"><label htmlFor="photo-key" className="meta-label mb-3 flex items-center gap-2 text-muted-foreground"><LockKeyhole size={14}/>Photo journal access</label><div className="flex gap-2"><input id="photo-key" type="password" autoComplete="current-password" required value={key} onChange={(event) => setKey(event.target.value)} placeholder="Enter access key" className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-seiji-ink"/><button disabled={busy} className="rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground transition hover:bg-accent disabled:opacity-50">{busy ? "Checking…" : "Continue"}</button></div><p className="mt-3 min-h-5 text-xs text-muted-foreground" role="status">{status}</p></form> : <div>
          <div className="mb-3 flex items-center justify-between"><p className="meta-label text-seiji-ink">Private photo session</p><button type="button" onClick={signOut} className="text-xs text-muted-foreground underline underline-offset-4">Sign out</button></div>
          <form onSubmit={upload} className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-surface p-5 sm:grid-cols-2 sm:p-6">
            <label className="sm:col-span-2"><span className="meta-label mb-2 block text-muted-foreground">Photograph file</span><input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required onChange={(event) => { const file = event.currentTarget.files?.[0]; if (!file) { setDimensions({ width: "", height: "" }); return; } const image = new Image(); const objectUrl = URL.createObjectURL(file); image.onload = () => { setDimensions({ width: String(image.naturalWidth), height: String(image.naturalHeight) }); URL.revokeObjectURL(objectUrl); }; image.onerror = () => { setDimensions({ width: "", height: "" }); URL.revokeObjectURL(objectUrl); }; image.src = objectUrl; }} className="w-full rounded-xl border border-border bg-background p-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-foreground"/></label>
            <input type="hidden" name="width" value={dimensions.width}/><input type="hidden" name="height" value={dimensions.height}/>
            <Field name="title" label="Title" placeholder="[ADD PHOTO TITLE]" required/><Field name="collection" label="Collection" placeholder="[ADD COLLECTION]"/><Field name="captureDate" label="Capture date" placeholder="[ADD CAPTURE DATE]"/><Field name="location" label="Location" placeholder="[ADD LOCATION]"/><Field name="camera" label="Camera" placeholder="[ADD CAMERA]"/><Field name="lens" label="Lens" placeholder="[ADD LENS]"/><Field name="focalLength" label="Focal length" placeholder="[ADD FOCAL LENGTH]"/><Field name="aperture" label="Aperture" placeholder="[ADD APERTURE]"/><Field name="shutterSpeed" label="Shutter speed" placeholder="[ADD SHUTTER SPEED]"/><Field name="iso" label="ISO" placeholder="[ADD ISO]"/>
            <label className="sm:col-span-2"><span className="meta-label mb-2 block text-muted-foreground">Description / notes</span><textarea name="description" rows={3} placeholder="[ADD PHOTO DESCRIPTION]" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-seiji-ink"/></label>
            <div className="sm:col-span-2"><div role="progressbar" aria-label="Photo upload progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="h-1 overflow-hidden rounded bg-page-alt"><div className="h-full bg-seiji transition-[width] duration-200" style={{ width: `${progress}%` }}/></div><div className="mt-3 flex items-center justify-between gap-3"><p role="status" className="min-h-5 text-xs text-muted-foreground">{status}</p><button disabled={busy || !dimensions.width} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground transition hover:bg-accent disabled:opacity-50"><ImagePlus size={16}/>{busy ? `Uploading ${progress}%` : "Add photograph"}<ArrowUpRight size={14}/></button></div></div>
          </form>
        </div>}
      </div>}
    </motion.div></AnimatePresence>
  </section>;
}

function Field({ name, label, placeholder, required = false }: { name: string; label: string; placeholder: string; required?: boolean }) { return <label><span className="meta-label mb-2 block text-muted-foreground">{label}</span><input name={name} required={required} placeholder={placeholder} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-seiji-ink"/></label>; }
