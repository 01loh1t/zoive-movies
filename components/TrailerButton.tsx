"use client";

import { useRef, useState } from "react";
import { PlayIcon, XIcon } from "@/components/icons";

/** Opens the YouTube trailer in an accessible dialog (Esc closes it, focus is trapped). */
export function TrailerButton({ videoKey, title }: { videoKey: string; title: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const close = () => {
    ref.current?.close();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          ref.current?.showModal();
        }}
        className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-bold uppercase tracking-[0.1em] text-on-accent transition-colors hover:bg-accent-hover"
      >
        <PlayIcon size={18} /> Play trailer
      </button>
      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === ref.current && close()}
        aria-label={`${title} trailer`}
        className="m-auto w-[min(64rem,calc(100vw-2rem))] overflow-visible bg-transparent p-0"
      >
        <div className="relative">
          <button
            type="button"
            onClick={close}
            aria-label="Close trailer"
            className="absolute -top-12 right-0 grid size-10 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
          >
            <XIcon />
          </button>
          <div className="aspect-video overflow-hidden rounded-xl bg-black shadow-pop">
            {open && (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`}
                title={`${title} trailer`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="size-full"
              />
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
