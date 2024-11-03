"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const onDismiss = () => {
    router.back();
  };

  return (
    <Dialog
      open
      className="fixed inset-0 z-50 bg-black/50"
      onClose={onDismiss}
      role="dialog"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <DialogPanel
          transition
          className="w-[500px] h-[500px] bg-[--main-color] rounded-[10px] flex-col justify-center items-center gap-[15px] inline-block align-middle"
        >
          {children}
        </DialogPanel>
        <button onClick={onDismiss} className="close-button" />
      </DialogBackdrop>
    </Dialog>
  );
}
