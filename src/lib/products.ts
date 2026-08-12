import type { Category, Creator, Product, Region } from "./types";

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

/* ------------------------------------------------------------------ */
/* 카테고리 — 스토어를 훑는 1차 축                                       */
/* ------------------------------------------------------------------ */

export const categories: Category[] = [
  {
    id: "processed",
    name: "가공식품",
    description: "장, 절임, 간편식처럼 손이 한 번 더 간 것들",
  },
  {
    id: "cheong",
    name: "청·잼·꿀",
    description: "제철 재료를 오래 두고 먹을 수 있게 담근 것들",
  },
  {
    id: "snack",
    name: "과자·디저트",
    description: "지역에서 오래 만들어온 주전부리",
  },
  {
    id: "tea",
    name: "차·음료",
    description: "덖고 우려 마시는 것들",
  },
  {
    id: "grain",
    name: "곡물",
    description: "그 해 거둬 도정한 쌀과 잡곡",
  },
  {
    id: "produce",
    name: "농산물",
    description: "밭에서 난 나물과 말린 과일",
  },
  {
    id: "seafood",
    name: "수산·해조",
    description: "바다에서 건져 말린 것들",
  },
];

/* ------------------------------------------------------------------ */
/* 지역                                                                 */
/* ------------------------------------------------------------------ */

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
  {
    id: "sunchang",
    name: "순창",
    province: "전라북도",
    description:
      "순창은 안개가 잦고 습도가 높아 발효가 더디게 진행됩니다. 장이 급하게 익지 않고 천천히 자리를 잡아, 예로부터 장으로 이름난 고장이 되었습니다.",
    visitInfo: [
      "장류마을 — 마당 가득 항아리가 늘어선 풍경을 볼 수 있습니다",
      "고추장 담그기 체험 — 늦가을에 직접 담가 가져갈 수 있습니다",
      "강천산 — 가을 단풍으로 알려진 군립공원입니다",
    ],
  },
  {
    id: "chuncheon",
    name: "춘천",
    province: "강원특별자치도",
    description:
      "춘천은 닭갈비를 철판에 볶아 먹는 방식이 자리 잡은 곳입니다. 양념을 하루 재워 두는 집이 많아, 가게마다 맛이 조금씩 다릅니다.",
    visitInfo: [
      "명동 닭갈비 골목 — 원조 가게들이 모여 있습니다",
      "남이섬 — 배를 타고 들어가는 섬입니다",
      "의암호 자전거길 — 호수를 끼고 한 바퀴 돌 수 있습니다",
    ],
  },
  {
    id: "tongyeong",
    name: "통영",
    province: "경상남도",
    description:
      "통영 앞바다는 물살이 세고 플랑크톤이 풍부해 굴이 단단하게 자랍니다. 11월부터 이듬해 3월까지가 제철이라, 그 사이에 거둬 가공합니다.",
    visitInfo: [
      "굴 수확 견학 — 겨울철 굴 박신장에서 작업 과정을 봅니다",
      "동피랑 벽화마을 — 언덕 골목을 따라 걷습니다",
      "통영 중앙시장 — 제철 해산물을 바로 고를 수 있습니다",
    ],
  },
  {
    id: "uiseong",
    name: "의성",
    province: "경상북도",
    description:
      "의성은 일교차가 크고 강수량이 적어 마늘이 야무지게 여뭅니다. 알이 단단해 오래 두어도 무르지 않고, 숙성했을 때 단맛이 잘 올라옵니다.",
    visitInfo: [
      "마늘 수확기 — 6월에 밭에서 캐는 작업을 볼 수 있습니다",
      "의성 산수유마을 — 3월 말에 노란 꽃이 핍니다",
      "고운사 — 숲길을 따라 들어가는 절입니다",
    ],
  },
  {
    id: "gyeongju",
    name: "경주",
    province: "경상북도",
    description:
      "경주는 찰보리로 만든 빵이 오래 자리 잡은 곳입니다. 팥소를 얇은 반죽으로 감싸 구워, 식어도 겉이 쫀득하게 남습니다.",
    visitInfo: [
      "황리단길 — 한옥 사이로 가게들이 늘어선 길입니다",
      "불국사와 석굴암 — 걸어서 함께 돌아볼 수 있습니다",
      "동궁과 월지 — 해가 진 뒤 조명을 켠 연못을 봅니다",
    ],
  },
  {
    id: "hadong",
    name: "하동",
    province: "경상남도",
    description:
      "하동 화개골은 안개가 자주 끼고 일조량이 적당해 찻잎이 얇고 부드럽게 자랍니다. 야생차나무가 자란 비탈에서 손으로 따 덖습니다.",
    visitInfo: [
      "화개장터 — 섬진강가에 선 오래된 장입니다",
      "차 덖음 체험 — 4~5월 햇차 시기에 가마솥 덖음을 해볼 수 있습니다",
      "쌍계사 벚꽃길 — 4월 초에 십리길이 벚꽃으로 덮입니다",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* 생산자                                                               */
/* ------------------------------------------------------------------ */

export const creators: Creator[] = [
  {
    id: "gokseong-rice",
    name: "정재훈",
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
    name: "오성근",
    title: "다시마 양식",
    regionId: "wando",
    since: "2005년",
    story:
      "3대째 완도 바다에서 다시마를 키웁니다. 할아버지 때는 자연산만 채취했지만, 지금은 조류가 빠른 자리를 골라 줄을 내립니다. 자리를 잘못 잡으면 한 해 농사를 통째로 잃기 때문에, 매년 물때와 수온을 기록해 둡니다.",
    philosophy:
      "바다는 서두른다고 빨리 자라지 않습니다. 수확 시기를 2주 늦추면 잎이 그만큼 두꺼워집니다.",
  },
  {
    id: "jeju-citrus",
    name: "고은정",
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
    name: "배영수",
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
    name: "류정민",
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
    name: "한순덕",
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
    kind: "brand",
    name: "전북 고창",
    title: "복분자 발효식품",
    regionId: "gochang",
    story:
      "전북 고창은 유네스코 생물권보전지역으로 지정된 청정 자연의 고장입니다. 풍부한 일조량과 깨끗한 환경 속에서 자란 복분자를 엄선했습니다. 서두르지 않는 발효의 시간을 더해 깊고 부드러운 풍미를 완성했습니다.",
    philosophy:
      "자연이 빚고, 시간이 완성한 건강한 발효를 담습니다.",
  },
  {
    id: "hongcheon-honey",
    name: "임광호",
    title: "양봉",
    regionId: "hongcheon",
    since: "2010년",
    story:
      "아까시 꽃이 피는 2주 남짓 동안 벌통을 옮겨 다니며 채밀합니다. 꿀을 뜰 때 벌이 먹을 양을 남겨두기 때문에, 벌통 하나에서 거두는 양이 많지는 않습니다. 설탕물을 먹이지 않는 대신 겨울을 나기 어려운 해도 있습니다.",
    philosophy:
      "벌이 겨울을 잘 나야 다음 해에 꿀이 납니다. 당장의 수확량보다 벌통 수를 지키는 쪽을 택합니다.",
  },
  {
    id: "sunchang-jang",
    kind: "brand",
    name: "전북 순창",
    title: "전통장 · 장류",
    regionId: "sunchang",
    story:
      "장류의 본고장 순창의 전통을 담았습니다. 맑은 물과 큰 일교차, 풍부한 일조량이 어우러진 자연환경과 오랜 장 문화가 깊고 진한 맛을 만들어냅니다. 전통 옹기에서 천천히 발효·숙성시켜 깊으면서도 깔끔한 매운맛을 완성했습니다.",
    philosophy:
      "시간이 빚어낸 감칠맛이 한국인의 요리 맛을 한층 더 깊고 풍성하게 만들어 줍니다.",
  },
  {
    id: "chuncheon-dakgalbi",
    kind: "brand",
    name: "강원도 춘천",
    title: "정통 닭갈비 · 밀키트",
    regionId: "chuncheon",
    story:
      "호반의 도시 춘천의 대표 향토 음식인 닭갈비를 집에서도 간편하게 즐길 수 있도록 정성껏 준비했습니다. 국내산 닭다리살과 감칠맛 깊은 특제 양념이 어우러져 매콤달콤한 풍미를 완성합니다.",
    philosophy:
      "춘천의 정통 맛을 담았습니다. 손질된 원육과 양념으로 어디서나 간편하게, 정통 닭갈비의 풍성한 한 끼를 완성하세요.",
  },
  {
    id: "tongyeong-oyster",
    name: "정길수",
    title: "굴 가공",
    regionId: "tongyeong",
    since: "2012년",
    story:
      "겨울에만 나는 굴을 사철 먹을 수 있게 하려고 오일에 절이기 시작했습니다. 굴을 살짝 훈연한 뒤 올리브유에 담그는데, 훈연 시간을 1분만 넘겨도 굴이 질겨져 초를 재며 작업합니다.",
    philosophy:
      "제철에 거둔 것을 제철이 아닐 때도 먹게 하는 게 가공의 일이라고 봅니다. 대신 제철에 거둔 것만 씁니다.",
  },
  {
    id: "uiseong-garlic",
    name: "손영수",
    title: "마늘 재배·가공",
    regionId: "uiseong",
    since: "2009년",
    story:
      "직접 기른 마늘을 숙성실에서 한 달 가까이 두어 흑마늘로 만듭니다. 온도와 습도를 조금씩 바꿔가며 익히는데, 이 시간을 줄이면 색은 검어져도 특유의 단맛이 나오지 않습니다.",
    philosophy:
      "숙성은 눈에 보이지 않아서 속이기 쉬운 공정입니다. 그래서 더 정직하게 시간을 채웁니다.",
  },
  {
    id: "gyeongju-barley",
    name: "이정희",
    title: "제과",
    regionId: "gyeongju",
    since: "2006년",
    story:
      "찰보리 가루 비율을 여러 해 바꿔가며 지금의 반죽을 찾았습니다. 팥은 국산만 쓰고 당일 삶아 앙금을 냅니다. 보존료를 넣지 않아 소비기한이 짧은 대신, 주문을 받은 뒤 구워 보냅니다.",
    philosophy:
      "오래 두고 팔 수 있게 만들면 편하지만, 그러면 갓 구운 것과는 다른 물건이 됩니다.",
  },
  {
    id: "hadong-tea",
    name: "조태식",
    title: "차 덖음",
    regionId: "hadong",
    since: "2003년",
    story:
      "화개골 비탈의 야생차나무에서 4월 말 첫물을 손으로 땁니다. 가마솥에 아홉 번 덖고 아홉 번 비비는 방식을 지키는데, 하루에 만들 수 있는 양이 얼마 되지 않습니다.",
    philosophy:
      "기계로 덖으면 균일하게 나옵니다. 손으로 덖으면 그해 잎의 상태에 맞춰 불을 조절할 수 있습니다.",
  },
];

/* ------------------------------------------------------------------ */
/* 상품                                                                 */
/* ------------------------------------------------------------------ */

const COMMON_REFUND =
  "수령 후 7일 이내 교환·환불이 가능합니다. 단순 변심의 경우 왕복 배송비가 부과되며, 개봉 후에는 상품 특성상 교환·환불이 어렵습니다.";

const FRESH_REFUND =
  "수령 후 7일 이내 교환·환불이 가능합니다. 단순 변심의 경우 왕복 배송비가 부과되며, 신선식품 특성상 개봉 후에는 교환·환불이 어렵습니다.";

export const products: Product[] = [
  /* ---------------- 가공식품 ---------------- */
  {
    // 가격은 순창·해남 등 옹기발효 전통 고추장 1kg 시세(정가 24,000~39,900원,
    // 판매가 20,000~34,900원) 조사에 근거한 목업 값입니다. 실제 판매가 확정되면
    // 교체하세요.
    slug: "sunchang-gochujang",
    name: "순창 재래식 고추장 1kg",
    tagline: "전통 옹기에서 발효한 깊고 진한 감칠맛",
    categoryId: "processed",
    imageKind: "jar",
    regionId: "sunchang",
    creatorId: "sunchang-jang",
    origin: "국산 (전북 순창)",
    priceList: 32000,
    priceSale: 26900,
    shippingFee: 3000,
    freeShippingOver: 40000,
    deliveryMethod: "택배배송",
    deliveryEta: "결제 후 2~3일 이내 발송",
    seller: "LOCAL PICK",
    packaging: "상온 (밀폐 용기)",
    unit: "1개",
    weight: "1kg (2,200kcal)",
    expiry: "제조일로부터 12개월",
    process: [
      "전통 옹기에서 자연의 시간으로 발효·숙성합니다",
      "국내산 태양초 고춧가루로 깊은 색과 풍미를 살립니다",
      "찹쌀과 메주가루(대두)가 조화롭게 어우러져 감칠맛을 냅니다",
    ],
    notes:
      "원재료: 고춧가루(국내산), 찹쌀(국내산), 메주가루(대두: 국내산), 천일염, 조청. 직사광선을 피해 서늘한 곳에 보관하고, 개봉 후에는 냉장 보관해 주세요.",
    refundPolicy: COMMON_REFUND,
    badges: ["전통 옹기 발효"],
  },
  {
    // 가격·용량은 마들푸드·KF365·순우리 등 춘천식 닭갈비 밀키트(양념육, 2인분)
    // 시세 조사(정가 13,500~16,000원, 판매가 11,400~13,800원, 500~600g) 기준
    // 목업 값입니다. 실제 판매가·용량이 확정되면 교체하세요.
    slug: "chuncheon-dakgalbi-kit",
    name: "춘천 닭갈비 밀키트",
    tagline: "국내산 닭다리살과 특제 양념으로 완성한 정통 닭갈비",
    categoryId: "processed",
    imageKind: "mealkit",
    detailImages: [
      "/product-details/chuncheon-dakgalbi-kit/1.png",
      "/product-details/chuncheon-dakgalbi-kit/2.png",
      "/product-details/chuncheon-dakgalbi-kit/3.png",
      "/product-details/chuncheon-dakgalbi-kit/4.png",
      "/product-details/chuncheon-dakgalbi-kit/5.png",
    ],
    regionId: "chuncheon",
    creatorId: "chuncheon-dakgalbi",
    origin: "국내산 (닭고기: 국내산 닭다리살)",
    priceList: 15000,
    priceSale: 12800,
    shippingFee: 3000,
    freeShippingOver: 40000,
    deliveryMethod: "택배배송 (냉장)",
    deliveryEta: "결제 후 2~3일 이내 발송",
    seller: "LOCAL PICK",
    packaging: "냉장 (진공 포장 + 아이스팩)",
    unit: "1세트 (2인분)",
    weight: "600g",
    expiry: "수령 후 냉장 또는 냉동 보관, 개봉 후 빠른 섭취 권장",
    process: [
      "퍽퍽함 없이 촉촉하고 부드러운 국내산 닭다리살 정육만 사용합니다",
      "고춧가루·마늘·양파·간장으로 만든 춘천 정통 비법 양념에 재웁니다",
      "양배추·고구마·떡사리 등을 더해 취향대로 풍성하게 즐길 수 있습니다",
    ],
    notes:
      "원재료: 닭고기(국내산 닭다리살), 닭갈비 양념장(고춧가루, 마늘, 양파, 간장 등). 팬에 볶아 드시며, 사리를 더하면 더욱 푸짐합니다. 캠핑·홈파티용 간편식으로도 좋습니다.",
    refundPolicy: FRESH_REFUND,
    badges: ["국내산 닭다리살"],
  },
  {
    slug: "tongyeong-oyster-oil",
    name: "통영 굴 오일절임 200g",
    tagline: "살짝 훈연해 올리브유에 담근 제철 굴",
    categoryId: "processed",
    imageKind: "jar",
    detailImages: [
      "/product-details/tongyeong-oyster-oil/1.png",
      "/product-details/tongyeong-oyster-oil/2.png",
      "/product-details/tongyeong-oyster-oil/3.png",
      "/product-details/tongyeong-oyster-oil/4.png",
      "/product-details/tongyeong-oyster-oil/5.png",
    ],
    regionId: "tongyeong",
    creatorId: "tongyeong-oyster",
    origin: "국산 굴 (경상남도 통영시)",
    priceList: 24000,
    priceSale: 19900,
    shippingFee: 3000,
    freeShippingOver: 40000,
    deliveryMethod: "택배배송",
    deliveryEta: "결제 후 2~3일 이내 발송",
    seller: "LOCAL PICK",
    packaging: "상온 (유리병, 완충 포장)",
    unit: "1병",
    weight: "200g (건더기 120g)",
    expiry: "제조일로부터 12개월 (개봉 후 냉장 2주)",
    process: [
      "11월부터 3월 사이 제철에 거둔 굴만 씁니다",
      "1분 남짓 짧게 훈연해 굴이 질겨지지 않게 합니다",
      "올리브유에 담가 밀봉합니다",
    ],
    notes:
      "차가운 곳에 두면 기름이 하얗게 굳을 수 있으나 품질 이상이 아닙니다. 실온에 두면 다시 맑아집니다. 개봉 후에는 냉장 보관해 주세요.",
    refundPolicy: COMMON_REFUND,
    badges: ["훈연"],
  },
  {
    slug: "uiseong-black-garlic",
    name: "의성 흑마늘 진액 30포",
    tagline: "한 달 가까이 숙성한 흑마늘을 달인 진액",
    categoryId: "processed",
    imageKind: "garlic",
    detailImages: [
      "/product-details/uiseong-black-garlic/1.png",
      "/product-details/uiseong-black-garlic/2.png",
      "/product-details/uiseong-black-garlic/3.png",
      "/product-details/uiseong-black-garlic/4.png",
      "/product-details/uiseong-black-garlic/5.png",
    ],
    regionId: "uiseong",
    creatorId: "uiseong-garlic",
    origin: "국산 마늘 (경상북도 의성군)",
    priceList: 39000,
    priceSale: 31900,
    shippingFee: 3000,
    freeShippingOver: 40000,
    deliveryMethod: "택배배송",
    deliveryEta: "결제 후 2~3일 이내 발송",
    seller: "LOCAL PICK",
    packaging: "상온 (개별 파우치 30포)",
    unit: "1박스 (30포)",
    weight: "총 2.4kg (포당 80ml)",
    expiry: "제조일로부터 18개월",
    process: [
      "직접 기른 의성 마늘을 씁니다",
      "숙성실에서 온도와 습도를 바꿔가며 한 달 가까이 익힙니다",
      "물 외에 다른 첨가물을 넣지 않고 달입니다",
    ],
    notes:
      "흑마늘 특유의 신맛과 단맛이 함께 납니다. 처음 드시는 분은 하루 한 포로 시작해 보세요.",
    refundPolicy: COMMON_REFUND,
    badges: ["무첨가"],
  },
  {
    // ⚠️ priceList/priceSale은 아직 실제 판매가가 확정되지 않아 목업 값입니다.
    slug: "gochang-bokbunja-vinegar",
    name: "고창 복분자 식초 500ml",
    tagline: "자연이 빚고 시간이 완성한 건강한 발효 식초",
    categoryId: "processed",
    imageKind: "bottle",
    regionId: "gochang",
    creatorId: "gochang-bokbunja",
    origin: "국내산 (전북 고창)",
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
      "청정 고창에서 자란 복분자만 엄선해 담습니다",
      "인공 첨가물 없이 오랜 시간 자연 발효로 깊고 부드러운 산미를 완성합니다",
      "짙은 색감과 새콤달콤한 복분자 본연의 풍미를 그대로 담습니다",
    ],
    notes:
      "원재료: 복분자 추출액(고창산) 100% [발효 복분자원액]. 직사광선을 피해 서늘한 곳에 보관하고, 개봉 후에는 냉장 보관해 주세요. 물이나 탄산수에 희석하거나, 우유·요거트에 더하거나, 샐러드 드레싱·소스로도 활용할 수 있습니다.",
    refundPolicy: COMMON_REFUND,
    badges: ["100% 고창산 복분자", "자연 발효"],
  },

  /* ---------------- 청·잼·꿀 ---------------- */
  {
    slug: "jeju-citrus-cheong",
    name: "제주 노지감귤청 500ml",
    tagline: "껍질째 담근 노지 감귤청",
    categoryId: "cheong",
    imageKind: "citrus",
    detailImages: [
      "/product-details/jeju-citrus-cheong/1.png",
      "/product-details/jeju-citrus-cheong/2.png",
      "/product-details/jeju-citrus-cheong/3.png",
      "/product-details/jeju-citrus-cheong/4.png",
      "/product-details/jeju-citrus-cheong/5.png",
    ],
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
    refundPolicy: COMMON_REFUND,
    badges: ["무농약"],
  },
  {
    slug: "hongcheon-acacia-honey",
    name: "홍천 아까시 벌꿀 600g",
    tagline: "설탕물을 먹이지 않고 채밀한 아까시꿀",
    categoryId: "cheong",
    imageKind: "honey",
    detailImages: [
      "/product-details/hongcheon-acacia-honey/1.png",
      "/product-details/hongcheon-acacia-honey/2.png",
      "/product-details/hongcheon-acacia-honey/3.png",
      "/product-details/hongcheon-acacia-honey/4.png",
      "/product-details/hongcheon-acacia-honey/5.png",
    ],
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
    refundPolicy: COMMON_REFUND,
    badges: ["비가열"],
  },
  {
    slug: "gochang-bokbunja-jam",
    name: "고창 복분자잼 350g",
    tagline: "펙틴 없이 열매만 졸인 잼",
    categoryId: "cheong",
    imageKind: "jar",
    detailImages: [
      "/product-details/gochang-bokbunja-jam/1.png",
      "/product-details/gochang-bokbunja-jam/2.png",
      "/product-details/gochang-bokbunja-jam/3.png",
      "/product-details/gochang-bokbunja-jam/4.png",
      "/product-details/gochang-bokbunja-jam/5.png",
    ],
    regionId: "gochang",
    creatorId: "gochang-bokbunja",
    origin: "국산 (전라북도 고창군)",
    priceList: 16000,
    priceSale: 12900,
    shippingFee: 3000,
    freeShippingOver: 40000,
    deliveryMethod: "택배배송",
    deliveryEta: "결제 후 2~3일 이내 발송",
    seller: "LOCAL PICK",
    packaging: "상온 (유리병, 완충 포장)",
    unit: "1병",
    weight: "350g",
    expiry: "제조일로부터 12개월 (개봉 후 냉장 3주)",
    process: [
      "수확 당일 선별한 복분자만 씁니다",
      "펙틴이나 응고제를 넣지 않고 낮은 불에서 오래 졸입니다",
      "설탕 비율을 낮춰 열매 맛이 남게 합니다",
    ],
    notes:
      "응고제를 넣지 않아 시판 잼보다 묽습니다. 씨가 씹히는 것은 열매를 거르지 않았기 때문입니다. 개봉 후에는 냉장 보관해 주세요.",
    refundPolicy: COMMON_REFUND,
    badges: ["무펙틴"],
  },

  /* ---------------- 과자·디저트 ---------------- */
  {
    slug: "gyeongju-barley-bread",
    name: "경주 찰보리빵 12개입",
    tagline: "국산 팥소를 얇게 감싸 구운 찰보리빵",
    categoryId: "snack",
    imageKind: "bread",
    detailImages: [
      "/product-details/gyeongju-barley-bread/1.png",
      "/product-details/gyeongju-barley-bread/2.png",
      "/product-details/gyeongju-barley-bread/3.png",
      "/product-details/gyeongju-barley-bread/4.png",
      "/product-details/gyeongju-barley-bread/5.png",
    ],
    regionId: "gyeongju",
    creatorId: "gyeongju-barley",
    origin: "국산 찰보리·팥 (경상북도 경주시 가공)",
    priceList: 15000,
    priceSale: 12900,
    shippingFee: 3000,
    freeShippingOver: 40000,
    deliveryMethod: "택배배송",
    deliveryEta: "주문일 기준 1~2일 이내 구워 발송",
    seller: "LOCAL PICK",
    packaging: "상온 (개별 포장 12개)",
    unit: "1박스 (12개입)",
    weight: "약 480g (개당 40g)",
    expiry: "제조일로부터 7일",
    process: [
      "찰보리 가루를 섞은 반죽을 얇게 씁니다",
      "국산 팥을 당일 삶아 앙금을 냅니다",
      "보존료를 넣지 않고, 주문을 받은 뒤 구워 보냅니다",
    ],
    notes:
      "보존료를 넣지 않아 소비기한이 7일로 짧습니다. 바로 드시지 않을 경우 냉동 보관 후 자연 해동해 주세요.",
    refundPolicy: FRESH_REFUND,
    badges: ["주문 후 제조"],
  },
  {
    slug: "sancheong-gotgam-jeonggwa",
    name: "산청 곶감 정과 200g",
    tagline: "곶감을 한 번 더 조려 만든 정과",
    categoryId: "snack",
    imageKind: "persimmon",
    detailImages: [
      "/product-details/sancheong-gotgam-jeonggwa/1.png",
      "/product-details/sancheong-gotgam-jeonggwa/2.png",
      "/product-details/sancheong-gotgam-jeonggwa/3.png",
      "/product-details/sancheong-gotgam-jeonggwa/4.png",
      "/product-details/sancheong-gotgam-jeonggwa/5.png",
    ],
    regionId: "sancheong",
    creatorId: "sancheong-gotgam",
    origin: "국산 (경상남도 산청군)",
    priceList: 19000,
    priceSale: 15900,
    shippingFee: 3000,
    freeShippingOver: 40000,
    deliveryMethod: "택배배송",
    deliveryEta: "결제 후 2~3일 이내 발송",
    seller: "LOCAL PICK",
    packaging: "상온 (개별 포장)",
    unit: "1봉",
    weight: "200g",
    expiry: "제조일로부터 6개월",
    process: [
      "자연 건조한 곶감을 한 입 크기로 자릅니다",
      "감의 당만으로 낮은 불에서 조립니다",
      "겉이 마를 때까지 한 번 더 말립니다",
    ],
    notes:
      "표면의 흰 가루는 감의 당분이 배어 나온 것으로 정상입니다. 조각마다 크기가 고르지 않을 수 있습니다.",
    refundPolicy: COMMON_REFUND,
    badges: ["설탕 무첨가"],
  },

  /* ---------------- 차·음료 ---------------- */
  {
    slug: "hadong-woojeon-tea",
    name: "하동 우전 녹차 50g",
    tagline: "가마솥에 아홉 번 덖은 첫물 녹차",
    categoryId: "tea",
    imageKind: "tea",
    detailImages: [
      "/product-details/hadong-woojeon-tea/1.png",
      "/product-details/hadong-woojeon-tea/2.png",
      "/product-details/hadong-woojeon-tea/3.png",
      "/product-details/hadong-woojeon-tea/4.png",
      "/product-details/hadong-woojeon-tea/5.png",
    ],
    regionId: "hadong",
    creatorId: "hadong-tea",
    origin: "국산 (경상남도 하동군)",
    priceList: 45000,
    priceSale: 36900,
    shippingFee: 3000,
    freeShippingOver: 40000,
    deliveryMethod: "택배배송",
    deliveryEta: "결제 후 2~3일 이내 발송",
    seller: "LOCAL PICK",
    packaging: "상온 (밀봉 파우치 + 종이 케이스)",
    unit: "1통",
    weight: "50g",
    expiry: "제조일로부터 24개월",
    process: [
      "4월 말 화개골 비탈에서 첫물 잎만 손으로 땁니다",
      "가마솥에 아홉 번 덖고 아홉 번 비빕니다",
      "그해 잎 상태에 맞춰 불을 조절하기 때문에 하루 생산량이 적습니다",
    ],
    notes:
      "70도 정도로 식힌 물에 1분 안팎으로 우려주세요. 끓는 물에 바로 우리면 떫은맛이 강해집니다.",
    refundPolicy: COMMON_REFUND,
    badges: ["수제 덖음"],
  },

  /* ---------------- 곡물 ---------------- */
  {
    slug: "gokseong-black-rice",
    name: "곡성 유기농 흑미 2kg",
    tagline: "우렁이 농법으로 지은 유기농 흑미",
    categoryId: "grain",
    imageKind: "grain",
    detailImages: [
      "/product-details/gokseong-black-rice/1.png",
      "/product-details/gokseong-black-rice/2.png",
      "/product-details/gokseong-black-rice/3.png",
      "/product-details/gokseong-black-rice/4.png",
      "/product-details/gokseong-black-rice/5.png",
    ],
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
    refundPolicy: COMMON_REFUND,
    badges: ["유기농"],
  },

  /* ---------------- 농산물 ---------------- */
  {
    slug: "yeongwol-gondre",
    name: "영월 건조 곤드레 80g",
    tagline: "5월 어린잎만 골라 말린 고랭지 곤드레",
    categoryId: "produce",
    imageKind: "greens",
    detailImages: [
      "/product-details/yeongwol-gondre/1.png",
      "/product-details/yeongwol-gondre/2.png",
      "/product-details/yeongwol-gondre/3.png",
      "/product-details/yeongwol-gondre/4.png",
      "/product-details/yeongwol-gondre/5.png",
    ],
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
    refundPolicy: COMMON_REFUND,
    badges: ["고랭지"],
  },
  {
    slug: "sancheong-gotgam",
    name: "산청 반건시 곶감 20입",
    tagline: "지리산 바람에 자연 건조한 반건시",
    categoryId: "produce",
    imageKind: "persimmon",
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
    refundPolicy: FRESH_REFUND,
    badges: ["자연건조"],
  },

  /* ---------------- 수산·해조 ---------------- */
  {
    slug: "wando-dasima",
    name: "완도 다시마 200g",
    tagline: "조류 빠른 자리에서 천천히 키운 다시마",
    categoryId: "seafood",
    imageKind: "kelp",
    detailImages: [
      "/product-details/wando-dasima/1.png",
      "/product-details/wando-dasima/2.png",
      "/product-details/wando-dasima/3.png",
      "/product-details/wando-dasima/4.png",
      "/product-details/wando-dasima/5.png",
    ],
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
    refundPolicy: COMMON_REFUND,
    badges: [],
  },
  {
    slug: "yeongdeok-dolmiyeok",
    name: "영덕 돌미역 150g",
    tagline: "해녀가 갯바위에서 직접 채취한 자연산",
    categoryId: "seafood",
    imageKind: "kelp",
    detailImages: [
      "/product-details/yeongdeok-dolmiyeok/1.png",
      "/product-details/yeongdeok-dolmiyeok/2.png",
      "/product-details/yeongdeok-dolmiyeok/3.png",
      "/product-details/yeongdeok-dolmiyeok/4.png",
      "/product-details/yeongdeok-dolmiyeok/5.png",
    ],
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
    refundPolicy: COMMON_REFUND,
    badges: ["자연산"],
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

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId);
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
    const category = getCategory(p.categoryId);
    const creator = getCreator(p.creatorId);
    const haystack = [
      p.name,
      p.tagline,
      p.origin,
      category?.name ?? "",
      region?.name ?? "",
      region?.province ?? "",
      creator?.name ?? "",
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
