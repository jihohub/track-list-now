# Tracklistnow

![Tracklistnow Logo](public/logo.png)  
나의 최애 아티스트와 곡을 소개하고, 다른 사람들이 선택한 아티스트와 곡을 통해 새로운 음악들을 탐색할 수 있는 서비스

## 소개

**Tracklistnow**는 사용자가 직접 선택한 '평생 최애 아티스트', '평생 최애 곡', '요즘 최애 아티스트', '요즘 최애 곡'을 기반으로 인기 순위를 집계하여, 다른 사용자들이 새로운 음악을 발견할 수 있도록 돕는 서비스입니다. 트렌드를 반영하는 각종 차트와 달리, **개인화된 음악 취향**을 반영한 랭킹을 제공합니다.

### 주요 기능

- **개인화 선택 기능**: '평생 최애 아티스트', '평생 최애 곡', '요즘 최애 아티스트', '요즘 최애 곡'을 각각 3항목씩 선택
- **랭킹 제공**: 선택된 항목들을 기반으로 한 인기 랭킹 페이지 제공
- **정보 검색 기능**: 랭킹 페이지 및 검색 페이지를 통해 아티스트, 앨범, 곡 정보 조회
- **좋아요 기능**: 새로 발견한 아티스트, 앨범, 곡을 좋아요 리스트에 저장 및 조회
- **미리듣기 기능**: 30초 가량의 미리듣기를 통해 새로운 음악 경험 제공

## 데모

[실제 배포 웹페이지](https://tracklistnow.com)

## 설치 및 사용 방법

### 요구사항

- Node.js v14 이상
- Git

### 설치

1. 레포지토리 클론
   ```bash
   git clone https://github.com/jihohub/track-list-now.git
   ```
2. 의존성 설치
   ```bash
   npm install
   ```

### 사용

```bash
npm run build
npm start

or

npm run dev
```

## 기술 스택

- **프론트엔드**: TypeScript, React, Next.js, Tailwind CSS
- **백엔드 및 배포**: Next.js, Vercel
- **데이터베이스**: NeonDB
- **에러 모니터링 및 로깅**: Sentry
- **기타**: GitHub, ESLint

## 도전과제

프로젝트를 진행하면서 다양한 기술적 도전과제를 만났습니다. 아래는 주요 도전과제와 이를 해결하기 위한 접근 방식입니다.

1. API 호출 속도 문제

- 문제점: 최애 아티스트와 트랙(user-favorite)를 PATCH API를 통해 업데이트할 때, API 호출 속도가 느려 성능 저하를 겪었습니다.
- 해결 방법:
  - 배치 처리: 수행해야 할 작업들을 배치화하여 한 번에 처리하도록 구현
  - 병렬 처리: Promise.all을 사용하여 비동기적으로 API 호출을 병렬 처리하여 속도 개선

2. Audio Player 컴포넌트의 잦은 리렌더링

- 문제점: Audio Player 컴포넌트가 초당 약 4회의 리렌더링을 유발하여 성능 저하와 SeekBar의 부정확한 업데이트가 발생했습니다.
- 해결 방법:
  - 상태 관리 최적화: Math.floor를 사용하여 currentSeconds와 durationSeconds를 정수 단위로 관리하여 상태 업데이트를 초당 1회로 제한
  - 컴포넌트 최적화: React.memo와 useCallback을 활용하여 자식 컴포넌트들의 불필요한 리렌더링을 방지

3. DB 캐싱 및 데이터 동기화

- 문제점: 초기 설계에서는 아티스트와 트랙의 ID만 저장하고, 상세 정보는 실시간으로 스포티파이 API를 통해 요청했으나, API 호출 제한과 성능 저하 문제가 발생했습니다.
- 해결 방법:

  - 캐싱 전략 도입: DB에 아티스트와 트랙의 기본 메타데이터(예: 이름, 앨범 정보 등)를 저장하여 API 호출 빈도를 줄이고 응답 속도 향상
  - 스케줄러 활용: Cron Jobs와 GitHub Actions를 사용하여 DB 내 아티스트 팔로워 수, 트랙 인기 지수, 미리듣기 URL 등을 주기적으로 업데이트하여 데이터 무결성 유지

## 고민했던 사항

프로젝트를 진행하며 다음과 같은 기술적 및 설계적 고민을 했습니다:

1. DB 없는 URL 기반 상태 관리  
   초기에는 사용자가 선택한 아티스트와 트랙을 DB에 저장하지 않고, URL의 쿼리 파라미터를 통해 페이지를 '발급'하는 방식을 고려했습니다.

   ```
   예시: https://tracklistnow.com/favorite?artistId=5151,6314,4535&trackId=6442,4247,1153
   ```

   그러나 랭킹 기능 등의 확장성을 고려하여, 데이터베이스를 사용하여 보다 안정적이고 효율적인 데이터 관리를 구현하기로 결정했습니다.

2. DB 캐싱 및 데이터 동기화  
   초기 설계에서는 DB에 아티스트와 트랙의 ID만 저장하고, 상세 정보는 스포티파이 API를 통해 실시간으로 요청하는 방식으로 구현하였습니다. 그러나 API 호출 제한과 성능 저하 문제가 발생하여, DB에 아티스트와 트랙의 기본 메타데이터(예: 이름, 앨범 정보 등)도 함께 저장하는 캐싱 전략을 도입하였습니다.  
   이를 통해 API 호출 빈도를 줄이고, 응답 속도를 향상시키며, 데이터의 가용성을 높일 수 있었습니다. 또한, Cron Jobs와 GitHub Actions 등을 활용한 스케줄러를 통해 DB 내 아티스트의 팔로워 수, 트랙의 인기 지수, 미리듣기 URL 등 데이터를 주기적으로 최신 상태로 유지하여 데이터 무결성을 보장하고 있습니다.

## 연락처

- **이름**: 박지호
- **이메일**: diorpark@gmail.com

![Website](https://img.shields.io/website?url=https%3A%2F%2Ftracklistnow.com)  
![License](https://img.shields.io/badge/license-MIT-blue.svg)  
![GitHub commit activity](https://img.shields.io/github/commit-activity/t/jihohub/track-list-now)  
![GitHub package.json version](https://img.shields.io/github/package-json/v/jihohub/track-list-now)
