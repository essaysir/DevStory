# DevStory

💯이번 프로젝트를 통해서, 달성하고 싶은 목표.
1. Next.js 에 대해서 완벽히 이해하기
2. 테스트코드에 조금 더 친숙해지기
3. 반응형 웹을 자연스럽게 만들기
4. 원하는 기능을 계속해서 추가해나가면서, 계속해서 리팩토링 진행
5. 깃 컨벤션을 지켜나가면서 진행해보기 

## 💵만들어나갈 기능들 ( 우선적인 것들은 ** 표시 )
일주일 동안은 혼자서 만들어보려고 노력하기 


### 😝1. 메인 페이지 만들기
- [ ] 1-1. 현재 존재하는 POST, 블로글 글들 카드 로 보여주기 **
- [ ] 1-2. 사이드에 NavBar 만들기, 글의 종류마다 보여줄 수 있도록
- [ ] 1-3. 사이드 NavBar 를 토글을 이용하여, 보이다가 안 보일수록 있도록 설정

### ✍️2. 글(포스트) 보여주는 페이지 만들기
- [ ] 2-1. 글을 단순히 보여주는 페이지 만들기 **  
- [ ] 2-2. 글의 조회수 및 좋아요 만들기 
- [ ] 2-3. 글의 댓글 창 만들기 
- [ ] 2-4. 글을 내릴면 맨 위에, 프로그레스 바가 차는 UI 제작

### 💪3. Contact 페이지 만들기 
- [ ] 3-1. Contact 페이지를 어떻게 만들지 정하기

## 💭프로젝트를 진행하면서 생각해봐야 하는 부분  
1. React Markdown, React SyntaxHighLiter 을 통해, 글을 마크 다운을 이용해서 보여줄 것인가 ? 
    아니면, SupaBase 를 통해, 글을 정보를 저장하고, 진행할 것인가 ?

### ✍️Featured-Sliced Design 채택
[Featured-Sliced 공식 문서](https://feature-sliced.design/docs/get-started/overview)
<br/>[Featured-Sliced 한국 요약본](https://emewjin.github.io/feature-sliced-design/)
- 해당 아키텍쳐는 크게 레이어(Layer), 슬라이스(Slice) , 세그먼트(Segement)로 분리된다.
- Layer ( 'APP', 'ENTITIES' , 'FEATURES' , 'PAGES', 'SHARED'),
- Slices 
- Segments ( UI , API , MODEL )
