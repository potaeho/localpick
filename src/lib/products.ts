import type { Creator, Product, Region } from "./types";

/**
 * ⚠️ 목업 데이터입니다.
 *
 * 여기 등장하는 생산자는 실존 인물이 아니며, 상품 정보 또한 UI 검증을 위한
 * 가상의 값입니다. 실제 광고 집행 전에는 기획서 10장의 "실행 전 확정 사항"에
 * 따라 확정된 상품·가격·배송비와, 사용 권한을 받은 실제 로컬 크리에이터
 * 정보로 이 파일을 교체해야 합니다.
 *
 * 조작된 후기·인증·재고 수량·할인 마감 시간은 기획서 9장(허위 광고로 인한
 * 신뢰 훼손 대응)에 따라 의도적으로 포함하지 않았습니다.
 */

export const regions: Region[] = [
  {
    id: "gokseong",
    name: "곡성",
    province: "전라남도",
    description:
      "섬진강과 보성강이 만나는 곡성은 밤낮의 기온 차가 큰 분지 지형입니다. 이 일교차가 낟알을 단단하게 여물게 해, 예로부터 좋은 쌀이 나는 고장으로 알려져 왔습니다.",
    visitInfo: [
      "섬진강 기차마을 — 옛 곡성역에서 증기기관차를 타고 섬진강을 따라 달립니다",
      "가을 곡성 시장 — 수확기에는 햅쌀과 잡곡을 직접 고를 수 있습니다",
      "농가 방문 — 모내기와 수확 시기에 맞춰 논 일손 체험을 운영하는 농가가 있습니다",
    ],
  },
  {
    id: "wando",
    name: "완도",
    province: "전라남도",
    description:
      "완도 앞바다는 조류가 빠르고 수온이 낮아 해조류가 더디게 자랍니다. 천천히 자란 만큼 잎이 두껍고 국물 맛이 깊게 우러납니다.",
    visitInfo: [
      "청산도 슬로길 — 국내 첫 슬로시티로 지정된 섬을 걸어서 돌아봅니다",
      "완도 해조류 축제 — 봄철 다시마·미역 수확 현장을 볼 수 있습니다",
      "양식장 견학 — 배를 타고 나가 해조류가 자라는 바다를 직접 봅니다",
    ],
  },
  {
    id: "jeju",
    name: "서귀포",
    province: "제주특별자치도",
    description:
      "한라산 남쪽 서귀포는 겨울에도 따뜻해 감귤이 노지에서 자랍니다. 비닐하우스 없이 바닷바람과 햇볕만으로 키운 노지 감귤은 껍질이 얇고 신맛이 또렷합니다.",
    visitInfo: [
      "감귤 따기 체험 — 11월부터 1월까지 과수원에서 직접 수확해볼 수 있습니다",
      "서귀포 매일올레시장 — 제철 감귤과 가공품을 한자리에서 봅니다",
      "올레 7코스 — 과수원과 바다를 함께 지나는 구간입니다",
    ],
  },
  {
    id: "yeongwol",
    name: "영월",
    province: "강원특별자치도",
    description:
      "해발 600미터 이상 고랭지에서 나는 영월 곤드레는 잎이 넓고 향이 진합니다. 서늘한 기후 덕에 줄기가 질겨지지 않아 밥에 넣었을 때 부드럽게 씹힙니다.",
    visitInfo: [
      "동강 래프팅 — 봄부터 가을까지 동강 물길을 따라 내려갑니다",
      "곤드레 수확 체험 — 5월 어린잎 수확기에 산나물 채취를 함께 합니다",
      "청령포 — 강으로 둘러싸인 솔숲을 배로 건너 들어갑니다",
    ],
  },
  {
    id: "sancheong",
    name: "산청",
    province: "경상남도",
    description:
      "지리산 자락 산청은 가을 안개가 잦고 바람이 잘 통합니다. 곶감을 말리기에 좋은 조건이라, 이 지역에서는 감을 깎아 처마에 거는 풍경이 가을의 일상입니다.",
    visitInfo: [
      "곶감 건조장 — 10월 말부터 감을 깎아 거는 과정을 볼 수 있습니다",
      "지리산 둘레길 — 산청을 지나는 구간이 여럿 있습니다",
      "동의보감촌 — 약초를 주제로 한 마을을 둘러봅니다",
    ],
  },
  {
    id: "yeongdeok",
    name: "영덕",
    province: "경상북도",
    description:
      "영덕 앞바다의 갯바위에서 자연적으로 자란 돌미역은 양식 미역보다 잎이 얇고 단단합니다. 해녀가 물속에서 직접 채취해 물량이 많지 않습니다.",
    visitInfo: [
      "블루로드 — 해안을 따라 걷는 도보길입니다",
      "해녀 물질 견학 — 채취 시기에 맞춰 마을에서 안내합니다",
      "영덕 어시장 — 제철 해산물을 직접 고를 수 있습니다",
    ],
  },
  {
    id: "gochang",
    name: "고창",
    province: "전라북도",
    description:
      "고창은 황토 땅에 복분자가 잘 자라기로 알려진 곳입니다. 배수가 잘 되는 흙에서 자란 열매는 알이 굵고 향이 진해, 예로부터 술과 식초로 담가왔습니다.",
    visitInfo: [
      "복분자 수확 체험 — 6월 중순에서 7월 초까지 열립니다",
      "고창 청보리밭 — 봄에는 보리밭, 가을에는 메밀꽃이 핍니다",
      "선운사 — 가을 꽃무릇으로 알려진 절입니다",
    ],
  },
  {
    id: "hongcheon",
    name: "홍천",
    province: "강원특별자치도",
    description:
      "홍천은 산림 비율이 높아 아까시나무 군락이 넓게 퍼져 있습니다. 5월 말 짧은 개화기 동안에만 채밀할 수 있어, 한 해에 거둘 수 있는 양이 정해져 있습니다.",
    visitInfo: [
      "양봉장 견학 — 5월 채밀기에 벌통을 여는 과정을 볼 수 있습니다",
      "홍천강 — 여름에는 강가에서 야영하는 사람이 많습니다",
      "은행나무 숲 — 가을 한 달 남짓만 개방합니다",
    ],
  },
];

export const creators: Creator[] = [
  {
    id: "gokseong-rice",
    name: "정한샘",
    title: "흑미 농부",
    regionId: "gokseong",
    since: "2011년",
    story:
      "도시에서 회사를 다니다 아버지가 짓던 논을 물려받아 곡성으로 내려왔습니다. 처음 3년은 수확량이 절반으로 떨어졌지만, 제초제를 쓰지 않는 방식을 고집했습니다. 지금은 우렁이를 풀어 잡초를 잡고, 논둑에 자란 풀은 손으로 뽑습니다.",
    philosophy:
      "쌀은 밥이 되기까지 손이 얼마나 갔는지가 맛으로 드러난다고 믿습니다. 그래서 수확량을 늘리는 대신 논을 늘리지 않았습니다.",
  },
  {
    id: "wando-sea",
    name: "오미르",
    title: "해조류 양식",
    regionId: "wando",
    since: "2005년",
    story:
      "3대째 완도 바다에서 다시마를 키웁니다. 할아버지 때는 자연산만 채취했지만, 지금은 조류가 빠른 자리를 골라 줄을 내립니다. 자리를 잘못 잡으면 한 해 농사를 통째로 잃기 때문에, 매년 물때와 수온을 기록해 둡니다.",
    philosophy:
      "바다는 서두른다고 빨리 자라지 않습니다. 수확 시기를 2주 늦추면 잎이 그만큼 두꺼워집니다.",
  },
  {
    id: "jeju-citrus",
    name: "고윤슬",
    title: "감귤 과수원",
    regionId: "jeju",
    since: "2016년",
    story:
      "할머니가 40년간 가꾼 노지 과수원을 이어받았습니다. 상품성이 떨어진다는 이유로 버려지던 못난이 감귤이 아까워 청을 담그기 시작했습니다. 껍질까지 쓰기 때문에 농약을 치지 않는 쪽을 택했습니다.",
    philosophy:
      "모양이 고르지 않다고 맛이 다르지는 않습니다. 버려질 것을 남기지 않는 것이 과수원을 오래 하는 방법이라고 생각합니다.",
  },
  {
    id: "yeongwol-namul",
    name: "배도훈",
    title: "산나물 재배",
    regionId: "yeongwol",
    since: "2013년",
    story:
      "귀농 후 고랭지 밭에서 곤드레를 키웁니다. 5월 어린잎만 골라 따고, 딴 날 바로 데쳐 건조기에 넣습니다. 하루만 지나도 향이 옅어지기 때문에 수확기에는 새벽부터 움직입니다.",
    philosophy:
      "산나물은 말리는 과정에서 절반이 결정됩니다. 급하게 높은 온도로 말리면 색은 남아도 향이 날아갑니다.",
  },
  {
    id: "sancheong-gotgam",
    name: "류가온",
    title: "곶감 건조",
    regionId: "sancheong",
    since: "2008년",
    story:
      "집안에서 대대로 감을 깎아 걸었습니다. 기계 건조로 바꾸자는 이야기가 많았지만, 지리산에서 내려오는 바람에 자연 건조하는 방식을 유지하고 있습니다. 그해 날씨에 따라 완성 시기가 2주씩 달라집니다.",
    philosophy:
      "곶감은 날씨가 만듭니다. 사람은 감을 깎고 기다리는 일까지만 합니다.",
  },
  {
    id: "yeongdeok-miyeok",
    name: "한여울",
    title: "해녀",
    regionId: "yeongdeok",
    since: "1998년",
    story:
      "스무 해 넘게 물질을 하며 갯바위 미역을 채취합니다. 자연산은 자라는 자리가 정해져 있어, 한 번 훑은 바위는 다음 해까지 두어야 합니다. 그래서 채취량을 미리 정해두고 그 이상은 캐지 않습니다.",
    philosophy:
      "바다에서 다 가져오면 다음 해에 들어갈 자리가 없습니다. 남겨두는 것이 일의 일부입니다.",
  },
  {
    id: "gochang-bokbunja",
    name: "신도경",
    title: "발효식품 제조",
    regionId: "gochang",
    since: "2014년",
    story:
      "복분자 농사를 짓다가 수확기에 몰리는 물량을 감당하지 못해 식초를 담그기 시작했습니다. 설탕을 넣어 빨리 발효시키는 대신, 열매의 당만으로 2년간 항아리에서 익힙니다.",
    philosophy:
      "발효는 시간을 사는 일입니다. 2년을 기다리면 2년만큼의 맛이 나옵니다.",
  },
  {
    id: "hongcheon-honey",
    name: "임세아",
    title: "양봉",
    regionId: "hongcheon",
    since: "2010년",
    story:
      "아까시 꽃이 피는 2주 남짓 동안 벌통을 옮겨 다니며 채밀합니다. 꿀을 뜰 때 벌이 먹을 양을 남겨두기 때문에, 벌통 하나에서 거두는 양이 많지는 않습니다. 설탕물을 먹이지 않는 대신 겨울을 나기 어려운 해도 있습니다.",
    philosophy:
      "벌이 겨울을 잘 나야 다음 해에 꿀이 납니다. 당장의 수확량보다 벌통 수를 지키는 쪽을 택합니다.",
  },
];

export const products: Product[] = [
  {
    slug: "gokseong-black-rice",
    name: "곡성 유기농 흑미 2kg",
    tagline: "우렁이 농법으로 지은 유기농 흑미",
    category: "곡물",
    regionId: "gokseong",
    creatorId: "gokseong-rice",
    origin: "국산 (전라남도 곡성군)",
    priceList: 24000,
    priceSale: 19800,
    shippingFee: 3000,
    freeShippingOver: 40000,
    deliveryMethod: "택배배송",
    deliveryEta: "결제 후 2~3일 이내 발송",
    seller: "LOCAL PICK",
    packaging: "상온 (종이 포장)",
    unit: "1봉",
    weight: "2kg",
    expiry: "도정일로부터 6개월 (도정일 별도 표기)",
    process: [
      "제초제를 쓰지 않고 우렁이를 풀어 잡초를 관리합니다",
      "수확 후 저온 창고에서 현미 상태로 보관합니다",
      "주문을 받은 뒤 도정해 발송합니다",
    ],
    notes:
      "도정 후 시간이 지날수록 향이 옅어집니다. 개봉 후에는 밀폐 용기에 담아 서늘한 곳에 보관해 주세요.",
    refundPolicy:
      "수령 후 7일 이내 교환·환불이 가능합니다. 단순 변심의 경우 왕복 배송비가 부과되며, 개봉 후에는 상품 특성상 교환·환불이 어렵습니다.",
    badges: ["유기농"],
  },
  {
    slug: "wando-dasima",
    name: "완도 다시마 200g",
    tagline: "조류 빠른 자리에서 천천히 키운 다시마",
    category: "해조류",
    regionId: "wando",
    creatorId: "wando-sea",
    origin: "국산 (전라남도 완도군)",
    priceList: 12000,
    priceSale: 9900,
    shippingFee: 3000,
    freeShippingOver: 40000,
    deliveryMethod: "택배배송",
    deliveryEta: "결제 후 2~3일 이내 발송",
    seller: "LOCAL PICK",
    packaging: "상온 (종이 포장)",
    unit: "1봉",
    weight: "200g",
    expiry: "제조일로부터 12개월",
    process: [
      "조류가 빠른 해역에 줄을 내려 양식합니다",
      "일반적인 수확 시기보다 2주 늦게 채취해 잎을 두껍게 키웁니다",
      "바닷바람에 자연 건조한 뒤 재단합니다",
    ],
    notes:
      "표면의 흰 가루는 다시마의 만니톨 성분으로, 곰팡이가 아닙니다. 물에 씻지 말고 마른 행주로 닦아 사용해 주세요.",
    refundPolicy:
      "수령 후 7일 이내 교환·환불이 가능합니다. 단순 변심의 경우 왕복 배송비가 부과되며, 개봉 후에는 상품 특성상 교환·환불이 어렵습니다.",
    badges: [],
  },
  {
    slug: "jeju-citrus-cheong",
    name: "제주 노지감귤청 500ml",
    tagline: "껍질째 담근 노지 감귤청",
    category: "청·잼",
    regionId: "jeju",
    creatorId: "jeju-citrus",
    origin: "국산 (제주특별자치도 서귀포시)",
    priceList: 18000,
    priceSale: 14900,
    shippingFee: 3000,
    freeShippingOver: 40000,
    deliveryMethod: "택배배송",
    deliveryEta: "결제 후 2~3일 이내 발송",
    seller: "LOCAL PICK",
    packaging: "상온 (유리병, 완충 포장)",
    unit: "1병",
    weight: "500ml",
    expiry: "제조일로부터 12개월 (개봉 후 냉장 보관 1개월)",
    process: [
      "노지에서 자란 감귤을 껍질째 사용하기 위해 농약을 치지 않고 재배합니다",
      "수확 당일 세척해 얇게 썰어 설탕에 재웁니다",
      "저온에서 2주간 숙성한 뒤 병입합니다",
    ],
    notes:
      "시간이 지나면 껍질이 위로 떠오를 수 있습니다. 드시기 전 가볍게 저어주세요. 개봉 후에는 반드시 냉장 보관해 주세요.",
    refundPolicy:
      "수령 후 7일 이내 교환·환불이 가능합니다. 단순 변심의 경우 왕복 배송비가 부과되며, 개봉 후에는 상품 특성상 교환·환불이 어렵습니다.",
    badges: ["무농약"],
  },
  {
    slug: "yeongwol-gondre",
    name: "영월 건조 곤드레 80g",
    tagline: "5월 어린잎만 골라 말린 고랭지 곤드레",
    category: "나물·채소",
    regionId: "yeongwol",
    creatorId: "yeongwol-namul",
    origin: "국산 (강원특별자치도 영월군)",
    priceList: 13000,
    priceSale: 10900,
    shippingFee: 3000,
    freeShippingOver: 40000,
    deliveryMethod: "택배배송",
    deliveryEta: "결제 후 2~3일 이내 발송",
    seller: "LOCAL PICK",
    packaging: "상온 (종이 포장)",
    unit: "1봉",
    weight: "80g",
    expiry: "제조일로부터 12개월",
    process: [
      "해발 600m 이상 고랭지 밭에서 재배합니다",
      "5월에 난 어린잎만 골라 손으로 땁니다",
      "수확 당일 데친 뒤 저온에서 천천히 건조합니다",
    ],
    notes:
      "찬물에 30분 이상 불린 뒤 삶아 사용하시면 부드럽습니다. 건조 상품이라 부피에 비해 중량이 가볍습니다.",
    refundPolicy:
      "수령 후 7일 이내 교환·환불이 가능합니다. 단순 변심의 경우 왕복 배송비가 부과되며, 개봉 후에는 상품 특성상 교환·환불이 어렵습니다.",
    badges: ["고랭지"],
  },
  {
    slug: "sancheong-gotgam",
    name: "산청 반건시 곶감 20입",
    tagline: "지리산 바람에 자연 건조한 반건시",
    category: "건과일",
    regionId: "sancheong",
    creatorId: "sancheong-gotgam",
    origin: "국산 (경상남도 산청군)",
    priceList: 42000,
    priceSale: 33900,
    shippingFee: 3000,
    freeShippingOver: 40000,
    deliveryMethod: "택배배송 (냉장)",
    deliveryEta: "결제 후 2~3일 이내 발송",
    seller: "LOCAL PICK",
    packaging: "냉장 (종이 트레이 + 아이스팩)",
    unit: "1박스 (20입)",
    weight: "약 1.2kg (개당 55~65g)",
    expiry: "수령 후 냉장 2개월 / 냉동 12개월",
    process: [
      "감을 손으로 깎아 처마에 걸어 건조합니다",
      "기계 건조 없이 지리산에서 내려오는 바람으로만 말립니다",
      "속이 말랑한 반건시 상태에서 수확해 냉장 보관합니다",
    ],
    notes:
      "표면의 흰 가루는 감의 당분이 배어 나온 것으로 정상입니다. 날씨에 따라 완성 시기가 달라져 발송이 지연될 수 있습니다.",
    refundPolicy:
      "수령 후 7일 이내 교환·환불이 가능합니다. 단순 변심의 경우 왕복 배송비가 부과되며, 신선식품 특성상 개봉 후에는 교환·환불이 어렵습니다.",
    badges: ["자연건조"],
  },
  {
    slug: "yeongdeok-dolmiyeok",
    name: "영덕 돌미역 150g",
    tagline: "해녀가 갯바위에서 직접 채취한 자연산",
    category: "해조류",
    regionId: "yeongdeok",
    creatorId: "yeongdeok-miyeok",
    origin: "국산 (경상북도 영덕군)",
    priceList: 16000,
    priceSale: 12900,
    shippingFee: 3000,
    freeShippingOver: 40000,
    deliveryMethod: "택배배송",
    deliveryEta: "결제 후 2~3일 이내 발송",
    seller: "LOCAL PICK",
    packaging: "상온 (종이 포장)",
    unit: "1봉",
    weight: "150g",
    expiry: "제조일로부터 12개월",
    process: [
      "해녀가 물질로 갯바위에 붙은 자연산 미역을 채취합니다",
      "채취 구역을 정해두고 그 이상은 캐지 않습니다",
      "바닷바람에 자연 건조합니다",
    ],
    notes:
      "자연산이라 잎의 크기와 두께가 고르지 않습니다. 양식 미역보다 잎이 단단해 끓이는 시간을 조금 더 두시면 좋습니다.",
    refundPolicy:
      "수령 후 7일 이내 교환·환불이 가능합니다. 단순 변심의 경우 왕복 배송비가 부과되며, 개봉 후에는 상품 특성상 교환·환불이 어렵습니다.",
    badges: ["자연산"],
  },
  {
    slug: "gochang-bokbunja-vinegar",
    name: "고창 복분자 발효식초 500ml",
    tagline: "설탕 없이 2년간 항아리에서 익힌 식초",
    category: "발효식품",
    regionId: "gochang",
    creatorId: "gochang-bokbunja",
    origin: "국산 (전라북도 고창군)",
    priceList: 22000,
    priceSale: 17900,
    shippingFee: 3000,
    freeShippingOver: 40000,
    deliveryMethod: "택배배송",
    deliveryEta: "결제 후 2~3일 이내 발송",
    seller: "LOCAL PICK",
    packaging: "상온 (유리병, 완충 포장)",
    unit: "1병",
    weight: "500ml",
    expiry: "제조일로부터 24개월",
    process: [
      "황토밭에서 재배한 복분자를 수확 당일 으깨 담습니다",
      "설탕을 넣지 않고 열매의 당만으로 발효합니다",
      "항아리에서 2년간 익힌 뒤 여과해 병입합니다",
    ],
    notes:
      "천연 발효 식초라 병 바닥에 침전물이 생길 수 있습니다. 물에 희석해 드시고, 원액을 그대로 드시지 않도록 주의해 주세요.",
    refundPolicy:
      "수령 후 7일 이내 교환·환불이 가능합니다. 단순 변심의 경우 왕복 배송비가 부과되며, 개봉 후에는 상품 특성상 교환·환불이 어렵습니다.",
    badges: ["2년 발효"],
  },
  {
    slug: "hongcheon-acacia-honey",
    name: "홍천 아까시 벌꿀 600g",
    tagline: "설탕물을 먹이지 않고 채밀한 아까시꿀",
    category: "벌꿀",
    regionId: "hongcheon",
    creatorId: "hongcheon-honey",
    origin: "국산 (강원특별자치도 홍천군)",
    priceList: 38000,
    priceSale: 29900,
    shippingFee: 3000,
    freeShippingOver: 40000,
    deliveryMethod: "택배배송",
    deliveryEta: "결제 후 2~3일 이내 발송",
    seller: "LOCAL PICK",
    packaging: "상온 (유리병, 완충 포장)",
    unit: "1병",
    weight: "600g",
    expiry: "제조일로부터 24개월",
    process: [
      "5월 말 아까시 개화기 2주 동안만 채밀합니다",
      "벌이 겨울을 날 양을 남겨두고 거둡니다",
      "가열이나 여과 없이 병입합니다",
    ],
    notes:
      "가열하지 않은 생꿀이라 온도가 낮아지면 결정이 생길 수 있습니다. 품질 이상이 아니며, 따뜻한 물에 병째 담가두면 다시 녹습니다. 돌 이전의 영아에게는 먹이지 마세요.",
    refundPolicy:
      "수령 후 7일 이내 교환·환불이 가능합니다. 단순 변심의 경우 왕복 배송비가 부과되며, 개봉 후에는 상품 특성상 교환·환불이 어렵습니다.",
    badges: ["비가열"],
  },
];

/* ------------------------------------------------------------------ */
/* 조회 헬퍼                                                            */
/* ------------------------------------------------------------------ */

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRegion(id: string): Region | undefined {
  return regions.find((r) => r.id === id);
}

export function getCreator(id: string): Creator | undefined {
  return creators.find((c) => c.id === id);
}

export function getProductsByRegion(regionId: string): Product[] {
  return products.filter((p) => p.regionId === regionId);
}

export function getProductsByCreator(creatorId: string): Product[] {
  return products.filter((p) => p.creatorId === creatorId);
}

/** 상품명·설명·지역·카테고리를 대상으로 하는 단순 검색 */
export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;

  return products.filter((p) => {
    const region = getRegion(p.regionId);
    const haystack = [
      p.name,
      p.tagline,
      p.category,
      p.origin,
      region?.name ?? "",
      region?.province ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

/** 할인율(%) — 소수점 버림 */
export function discountRate(product: Product): number {
  if (product.priceList <= product.priceSale) return 0;
  return Math.floor(
    ((product.priceList - product.priceSale) / product.priceList) * 100,
  );
}

export function formatPrice(won: number): string {
  return won.toLocaleString("ko-KR");
}
