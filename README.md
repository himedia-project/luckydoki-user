# LuckyDoki - 현대적 쇼핑몰 프론트엔드

<img src="public/ailogo.png" alt="LuckyDoki 로고" width="200px" style="display: block; margin: 0 auto; padding: 20px 0;" />

## 프로젝트 소개

LuckyDoki는 React 기반의 현대적이고 사용자 친화적인 이커머스 플랫폼입니다. AI 이미지 검색, 실시간 채팅, 소셜 커뮤니티 등 다양한 혁신적 기능을 통합하여 사용자들에게 차별화된 쇼핑 경험을 제공합니다. 사용자 중심의 인터페이스와 최신 웹 기술을 활용하여 효율적이고 매력적인 쇼핑 환경을 구현했습니다.

## 주요 기능

### 🔍 AI 기반 이미지 검색

- 사용자가 이미지를 업로드하면 AI가 분석하여 관련 상품을 추천
- 텍스트 검색의 한계를 넘어 시각적 유사성 기반의 검색 경험 제공
- 최신 이미지 인식 기술을 활용한 정확한 검색 결과 제공

### 💬 실시간 채팅 시스템

- 사용자-판매자 간 직접 소통 가능한 채팅 인터페이스
- WebSocket 기반 실시간 메시지 전송 및 알림
- 채팅 내역 저장 및 관리 기능

### 🛒 최적화된 쇼핑 경험

- 직관적인 상품 검색 및 필터링 시스템
- 카테고리 기반 상품 탐색
- 반응형 디자인으로 모든 디바이스에서 최적화된 사용자 경험

### 👥 소셜 커뮤니티 통합

- 사용자 간 상품 리뷰 및 경험 공유
- 상품 관련 게시물 작성 및 소통
- 좋아요, 댓글 등 소셜 인터랙션 기능

### 🔐 안전한 결제 시스템

- 토스페이먼츠 API 연동을 통한 안전한 결제 처리
- 다양한 결제 수단 지원
- 주문 내역 및 배송 상태 실시간 확인

## 기술 스택

### 프론트엔드

- **React 19**: 최신 버전의 React를 사용한 컴포넌트 기반 UI 구현
- **React Router v7**: 클라이언트 사이드 라우팅 구현
- **Redux Toolkit & Redux Persist**: 전역 상태 관리 및 상태 지속성 유지
- **Axios**: RESTful API 통신
- **StompJS & SockJS**: 실시간 채팅 및 알림 구현
- **Swiper**: 모던한 슬라이더 및 캐러셀 구현
- **Emotion & Styled Components**: 컴포넌트 스타일링
- **Firebase**: 푸시 알림 및 사용자 인증

### UI/UX

- **Material UI**: 모던한 UI 컴포넌트 활용
- **React Icons**: 다양한 아이콘 라이브러리 활용
- **Sweetalert2**: 사용자 친화적 알림 구현
- **React Loading Skeleton**: 콘텐츠 로딩 시 스켈레톤 UI 구현

### API 통합

- **REST API**: 백엔드 서버와의 데이터 통신
- **토스페이먼츠 결제 API**: 안전한 결제 처리
- **카카오/Goolge 소셜 로그인 API**: 간편한 사용자 인증
- **AI 챗봇 API**: ai openai \* RAG 시스템 전용 백앤드 서버와 통신

## 설치 및 실행 방법

### 사전 요구사항

- Node.js 18.0 이상
- npm 또는 yarn 패키지 매니저

### 설치 단계

1. 저장소 클론

   ```bash
   git clone https://github.com/yourusername/luckydoki-user.git
   cd luckydoki-user
   ```

2. 의존성 설치

   ```bash
   npm install
   ```

3. 환경 변수 설정
   `.env.local` 파일을 생성하고 필요한 환경 변수 설정

   ```
   REACT_APP_API_URL=your_api_base_url
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   REACT_APP_KAKAO_REST_API_KEY=your_kakao_api_key
   REACT_APP_TOSS_PAYMENTS_CLIENT_KEY=your_toss_payments_client_key
   ```

4. 애플리케이션 실행

   ```bash
   npm start
   # 또는
   yarn start
   ```

   애플리케이션은 기본적으로 http://localhost:3000 에서 실행됩니다.

5. 프로덕션 빌드
   ```bash
   npm run build
   ```

## 프로젝트 구조

```
luckydoki-user/
├── public/                 # 정적 파일
├── src/
│   ├── api/                # API 통신 로직
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── auth/           # 인증 관련 컴포넌트
│   │   ├── button/         # 버튼 컴포넌트
│   │   ├── card/           # 카드 컴포넌트
│   │   ├── chat/           # 채팅 관련 컴포넌트
│   │   ├── chatbot/        # 챗봇 컴포넌트
│   │   ├── common/         # 공통 컴포넌트
│   │   ├── dropdown/       # 드롭다운 메뉴 컴포넌트
│   │   ├── skeleton/       # 로딩 스켈레톤 컴포넌트
│   │   └── swiper/         # 스와이퍼 컴포넌트
│   ├── config/             # 설정 파일
│   ├── hooks/              # 커스텀 훅
│   ├── layouts/            # 레이아웃 컴포넌트
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── addpage/        # 상품 추가 페이지
│   │   ├── community/      # 커뮤니티 페이지
│   │   ├── mypage/         # 마이페이지
│   │   ├── payment/        # 결제 관련 페이지
│   │   └── product/        # 상품 관련 페이지
│   ├── styles/             # 스타일 관련 파일
│   ├── utils/              # 유틸리티 함수
│   ├── App.js              # 루트 앱 컴포넌트
│   └── index.js            # 진입점
└── package.json            # 프로젝트 메타데이터 및 의존성
```

## 개발 과정 및 문제 해결

### 실시간 데이터 동기화 문제 해결

- WebSocket을 활용한 실시간 채팅 구현 과정에서 연결 안정성 및 메시지 순서 보장 이슈 해결
- SockJS와 STOMP 프로토콜을 활용하여 안정적인 양방향 통신 구현
- 메시지 재전송 및 연결 복구 메커니즘 구현으로 사용자 경험 향상

### 성능 최적화

- React.lazy와 Suspense를 활용한 코드 스플리팅으로 초기 로딩 시간 단축
- useMemo, useCallback을 활용한 불필요한 렌더링 방지
- 이미지 최적화 및 지연 로딩으로 페이지 성능 개선

### 사용자 경험 개선

- 스켈레톤 UI를 통한 로딩 상태 관리로 사용자 대기 시간 체감 감소
- 무한 스크롤 구현으로 페이지네이션 없이 자연스러운 콘텐츠 탐색 경험 제공
- 반응형 디자인으로 모든 디바이스에서 일관된 사용자 경험 제공

## 배운 점 및 향후 개선 사항

### 배운 점

- 최신 React 생태계 활용 및 대규모 프론트엔드 애플리케이션 설계 경험
- 실시간 데이터 처리 및 상태 관리 패턴 숙달
- 사용자 중심 UI/UX 디자인 원칙 적용 경험
- 다양한 외부 API 통합 및 문제 해결 능력 향상

### 향후 개선 사항

- 테스트 커버리지 확대: Jest와 React Testing Library를 활용한 단위 및 통합 테스트 구현
- 성능 최적화: 번들 크기 감소 및 렌더링 성능 추가 개선
- 접근성 향상: 웹 접근성 표준 준수로 모든 사용자에게 포용적인 경험 제공
- PWA 구현: 서비스 워커를 활용한 오프라인 기능 및 모바일 앱 경험 제공

## 기여 방법

1. 이 저장소를 포크합니다.
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`).
3. 변경 사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`).
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`).
5. Pull Request를 생성합니다.
