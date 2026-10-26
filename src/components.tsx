import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, X, Image as ImageIcon } from "lucide-react";
import { artworkNotice, statusLabels, type Draft } from "./workspace";

export function Status({ draft, testId }: { draft: Draft; testId?: string }) {
  return (
    <span data-testid={testId} className={"status status-" + draft.status}>
      <span aria-hidden="true" />
      {statusLabels[draft.status]}
    </span>
  );
}
export function Artwork({
  draft,
  large = false,
  eager = false,
}: {
  draft: Draft;
  large?: boolean;
  eager?: boolean;
}) {
  return (
    <figure className={"artwork " + (large ? "artwork-large" : "")}>
      <img
        data-artwork
        src={"/assets/" + draft.image + "-864.webp"}
        srcSet={
          "/assets/" +
          draft.image +
          "-432.webp 432w, /assets/" +
          draft.image +
          "-864.webp 864w"
        }
        sizes="(max-width: 767px) 88vw, (max-width: 1100px) 42vw, 360px"
        width={864}
        height={1080}
        alt={draft.alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
      <figcaption>
        <ImageIcon size={13} aria-hidden="true" />
        {artworkNotice}
      </figcaption>
    </figure>
  );
}
export function RealLinks() {
  return (
    <div className="real-links">
      <a href="https://krelyvo.com/work/ember-oak#campaign">
        View the Ember &amp; Oak campaign{" "}
        <ArrowUpRight size={14} aria-hidden="true" />
      </a>
      <a href="https://krelyvo.com/work">
        Back to Krelyvo Work <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </div>
  );
}
export function Modal({
  open,
  title,
  description,
  children,
  close,
  returnFocus,
  note = false,
}: {
  open: boolean;
  title: string;
  description: string;
  children: ReactNode;
  close: () => void;
  returnFocus: () => void;
  note?: boolean;
}) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        if (!value) close();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content
          className="dialog-content"
          onOpenAutoFocus={(event) => {
            if (note) {
              event.preventDefault();
              document.getElementById("review-note")?.focus();
            }
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocus();
          }}
        >
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
          {children}
          <Dialog.Close className="dialog-close" aria-label="Close dialog">
            <X size={18} aria-hidden="true" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
