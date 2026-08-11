"use client";

import { useEffect, useRef } from "react";

import {
  EDGE_START_MAX_PX,
  isEdgeBackGesture,
  isTopExitScroll,
  type TouchPoint,
} from "./exit-intent";

/**
 * 이탈 의도 감지.
 *
 * 데스크탑은 마우스가 뷰포트 위쪽으로 빠져나갈 때(주소창·탭으로 향하는 동작),
 * 모바일은 왼쪽 가장자리 뒤로가기 스와이프 시도 또는, 상품을 충분히 본 뒤
 * 페이지 최상단까지 되돌아오는 스크롤을 이탈 신호로 본다.
 *
 * history 항목을 추가·교체하거나 popstate를 가로채지 않으며, touch/scroll의
 * 자연스러운 동작도 막지 않는다.
 */
export function useExitIntent(enabled: boolean, onTrigger: () => void) {
  const firedRef = useRef(false);
  const handlerRef = useRef(onTrigger);

  useEffect(() => {
    handlerRef.current = onTrigger;
  }, [onTrigger]);

  useEffect(() => {
    if (!enabled) return;

    function fire() {
      if (firedRef.current) return;
      firedRef.current = true;
      handlerRef.current();
    }

    function onMouseOut(event: MouseEvent) {
      // 관련 대상이 없고 커서가 화면 위쪽을 벗어나면 창을 떠나려는 것으로 본다
      if (event.relatedTarget === null && event.clientY <= 0) fire();
    }

    const isTouch = window.matchMedia("(max-width: 767px)").matches;
    let edgeStart: TouchPoint | null = null;
    let previousScrollY = Math.max(0, window.scrollY);
    let maxScrollY = previousScrollY;

    function onTouchStart(event: TouchEvent) {
      if (event.touches.length !== 1) {
        edgeStart = null;
        return;
      }

      const touch = event.touches[0];
      edgeStart =
        touch.clientX <= EDGE_START_MAX_PX
          ? { x: touch.clientX, y: touch.clientY }
          : null;
    }

    function onTouchMove(event: TouchEvent) {
      if (!edgeStart || event.touches.length !== 1) return;

      const touch = event.touches[0];
      if (
        isEdgeBackGesture(edgeStart, {
          x: touch.clientX,
          y: touch.clientY,
        })
      ) {
        edgeStart = null;
        fire();
      }
    }

    function clearTouch() {
      edgeStart = null;
    }

    function onScroll() {
      const currentScrollY = Math.max(0, window.scrollY);
      maxScrollY = Math.max(maxScrollY, currentScrollY);

      if (isTopExitScroll(maxScrollY, previousScrollY, currentScrollY)) {
        fire();
      }

      previousScrollY = currentScrollY;
    }

    if (isTouch) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", clearTouch, { passive: true });
      window.addEventListener("touchcancel", clearTouch, { passive: true });
    } else {
      document.addEventListener("mouseout", onMouseOut);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", clearTouch);
      window.removeEventListener("touchcancel", clearTouch);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [enabled]);
}
