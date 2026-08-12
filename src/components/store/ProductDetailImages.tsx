/**
 * 스펙 테이블 아래 이어지는 이미지형 상세 설명.
 *
 * 네이버 스마트스토어 상품 상세페이지는 "상품정보" 표 아래로 판매자가 직접
 * 디자인한 세로로 긴 포스터 이미지들(브랜드 스토리, 제품 포인트, 이용 방법 등)
 * 이 이어진다. 이 컴포넌트는 그 구간을 재현한다 — 이미지를 이어붙이는 게
 * 전부이고, 텍스트 레이어는 이미지 안에 이미 들어 있다.
 *
 * 이미지가 없는 상품은 이 컴포넌트가 아무것도 렌더링하지 않는다. 아직 모든
 * 상품의 이미지가 준비되지 않았으므로, 있는 상품만 자연스럽게 보이게 한다.
 */
export function ProductDetailImages({
  images,
  productName,
}: {
  images: string[] | undefined;
  productName: string;
}) {
  if (!images || images.length === 0) return null;

  return (
    <section aria-label="상품 상세 설명" className="mt-4">
      <div className="overflow-hidden rounded-xl border border-lp-gray-300 bg-white">
        {images.map((src, index) => (
          // 포스터 이미지는 폭에 맞춰 이어붙이는 용도라 다음/이전 이미지와 틈이
          // 생기지 않아야 한다. 실제 사진 폭·비율이 제각각이라 next/image의
          // 고정 width/height 대신 원본 비율을 유지하는 일반 img를 쓴다.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={`${productName} 상세 설명 ${index + 1}/${images.length}`}
            loading={index === 0 ? "eager" : "lazy"}
            className="block w-full"
          />
        ))}
      </div>
    </section>
  );
}
