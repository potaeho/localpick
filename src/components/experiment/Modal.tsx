"use client";

import { Dialog as DialogPrimitive } from "radix-ui";

/**
 * 페이크도어 안내와 설문이 공유하는 모달 껍데기.
 *
 * 데스크탑에서는 화면 중앙 모달, 모바일에서는 바텀시트로 나타난다.
 * 포커스 트랩 · Esc 닫기 · 배경 스크롤 잠금은 Radix Dialog가 처리한다.
 */
export function Modal({
  open,
  onClose,
  labelledBy,
  /** false면 배경 클릭·Esc로 닫히지 않는다 (페이크도어 안내처럼 반드시 읽어야 하는 경우) */
  dismissible = true,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  dismissible?: boolean;
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Content
          aria-labelledby={labelledBy}
          onEscapeKeyDown={(event) => {
            if (!dismissible) event.preventDefault();
          }}
          onPointerDownOutside={(event) => {
            if (!dismissible) event.preventDefault();
          }}
          onInteractOutside={(event) => {
            if (!dismissible) event.preventDefault();
          }}
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90dvh] w-full flex-col overflow-y-auto rounded-t-lp-media bg-white shadow-xl outline-none data-open:animate-in data-open:slide-in-from-bottom data-closed:animate-out data-closed:slide-out-to-bottom sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lp-media sm:data-open:zoom-in-95 sm:data-closed:zoom-out-95 sm:data-open:slide-in-from-bottom-0 sm:data-closed:slide-out-to-bottom-0"
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
