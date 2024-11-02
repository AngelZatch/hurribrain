"use client";

import { type ElementRef, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<"dialog">>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss() {
    router.back();
  }

  return createPortal(
    <Dialog
      open
      ref={dialogRef}
      className="fixed inset-0 z-50 bg-black/50"
      onClose={onDismiss}
      role="dialog"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="w-[500px] h-[500px] bg-white/20 rounded-[10px] flex-col justify-center items-center gap-[15px] inline-flex">
        <DialogPanel transition>{children}</DialogPanel>
      </div>
      <button onClick={onDismiss} className="close-button" />
    </Dialog>,
    document.getElementById("modal-root")!
  );
}
