import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * 기본 tailwind-merge는 이 프로젝트가 globals.css @theme에서 정의한
 * text-lp-*(hero/heading/button/...) 커스텀 폰트 크기 토큰을 모른다. 그래서
 * "text-lp-label" 같은 클래스를 텍스트 컬러 유틸리티로 오인해, 같이 쓰인
 * text-primary-foreground 같은 실제 색상 클래스를 지워버리는 문제가 있었다
 * (버튼/배지에 검정 텍스트가 검정 배경 위에 렌더링되는 버그로 나타났다).
 * lp-* 크기 토큰을 font-size 그룹에 등록해 이 오탐을 막는다.
 */
const twMergeConfig = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "lp-hero",
        "lp-heading",
        "lp-button",
        "lp-page-heading",
        "lp-card-title",
        "lp-body",
        "lp-label",
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMergeConfig(clsx(inputs))
}
