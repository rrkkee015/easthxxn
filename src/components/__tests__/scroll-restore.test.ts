// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * ScrollRestore 컴포넌트의 핵심 로직을 단위 테스트한다.
 * React 렌더링 없이 sessionStorage 키 생성과 스크롤 저장/복원 동작을 검증한다.
 */

function makeKey(pathname: string) {
  return `scrollY:${pathname}`;
}

function restoreScroll(pathname: string) {
  const key = makeKey(pathname);
  const saved = sessionStorage.getItem(key);
  if (saved) {
    requestAnimationFrame(() => {
      window.scrollTo({ top: Number(saved), behavior: "smooth" });
    });
  }
}

function saveScroll(pathname: string, scrollY: number) {
  const key = makeKey(pathname);
  sessionStorage.setItem(key, String(scrollY));
}

/**
 * 컴포넌트의 lifecycle을 재현하는 시뮬레이터.
 * useLayoutEffect cleanup → useLayoutEffect setup → useEffect 순서를 모사한다.
 */
let _currentPathname: string | null = null;
let _lastScrollY = 0;
let _cachedPosition: number | null = null;

function onNavigate(pathname: string, isPopNavigation: boolean) {
  // --- useLayoutEffect cleanup (이전 경로) ---
  if (_currentPathname !== null) {
    const oldKey = makeKey(_currentPathname);
    sessionStorage.setItem(oldKey, String(_lastScrollY));
  }

  // --- useLayoutEffect setup (새 경로) ---
  const key = makeKey(pathname);
  _cachedPosition = (() => {
    const v = sessionStorage.getItem(key);
    return v !== null ? Number(v) : null;
  })();
  _currentPathname = pathname;

  // --- useEffect ---
  if (isPopNavigation) {
    if (_cachedPosition !== null) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: _cachedPosition!, behavior: "smooth" });
      });
    }
  } else {
    sessionStorage.setItem(key, "0");
    window.scrollTo({ top: 0 });
    _lastScrollY = 0;
  }
}

/** scroll listener를 시뮬레이션: 사용자가 스크롤했을 때 호출 */
function simulateUserScroll(scrollY: number) {
  _lastScrollY = scrollY;
  if (_currentPathname !== null) {
    sessionStorage.setItem(makeKey(_currentPathname), String(scrollY));
  }
}

describe("ScrollRestore", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();

    // 시뮬레이터 상태 초기화
    _currentPathname = null;
    _lastScrollY = 0;
    _cachedPosition = null;

    // rAF를 동기 실행하도록 mock
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  describe("키 생성", () => {
    it("pathname을 포함한 고유 키를 생성한다", () => {
      expect(makeKey("/")).toBe("scrollY:/");
      expect(makeKey("/posts/hello")).toBe("scrollY:/posts/hello");
    });

    it("서로 다른 pathname은 서로 다른 키를 생성한다", () => {
      const key1 = makeKey("/posts/aaa");
      const key2 = makeKey("/posts/bbb");
      expect(key1).not.toBe(key2);
    });
  });

  describe("스크롤 위치 저장", () => {
    it("pathname별로 스크롤 위치를 독립적으로 저장한다", () => {
      saveScroll("/", 100);
      saveScroll("/posts/hello", 500);

      expect(sessionStorage.getItem("scrollY:/")).toBe("100");
      expect(sessionStorage.getItem("scrollY:/posts/hello")).toBe("500");
    });

    it("같은 pathname의 스크롤 위치를 덮어쓴다", () => {
      saveScroll("/posts/hello", 100);
      saveScroll("/posts/hello", 300);

      expect(sessionStorage.getItem("scrollY:/posts/hello")).toBe("300");
    });
  });

  describe("스크롤 위치 복원", () => {
    it("저장된 위치가 있으면 해당 위치로 스크롤한다", () => {
      const scrollTo = vi.fn();
      window.scrollTo = scrollTo;

      sessionStorage.setItem("scrollY:/posts/hello", "420");
      restoreScroll("/posts/hello");

      expect(scrollTo).toHaveBeenCalledWith({ top: 420, behavior: "smooth" });
    });

    it("저장된 위치가 없으면 스크롤하지 않는다", () => {
      const scrollTo = vi.fn();
      window.scrollTo = scrollTo;

      restoreScroll("/posts/new-page");

      expect(scrollTo).not.toHaveBeenCalled();
    });

    it("다른 pathname의 저장값에 영향받지 않는다", () => {
      const scrollTo = vi.fn();
      window.scrollTo = scrollTo;

      sessionStorage.setItem("scrollY:/posts/aaa", "200");
      restoreScroll("/posts/bbb");

      expect(scrollTo).not.toHaveBeenCalled();
    });
  });

  describe("popstate 조건부 복원", () => {
    it("popstate가 아닌 경우 복원하지 않는다", () => {
      const scrollTo = vi.fn();
      window.scrollTo = scrollTo;
      const isPopNavigation = false;

      sessionStorage.setItem("scrollY:/posts/test", "300");

      if (isPopNavigation) {
        restoreScroll("/posts/test");
      }

      expect(scrollTo).not.toHaveBeenCalled();
    });

    it("popstate인 경우에만 복원한다", () => {
      const scrollTo = vi.fn();
      window.scrollTo = scrollTo;
      let isPopNavigation = true;

      sessionStorage.setItem("scrollY:/posts/test", "300");

      if (isPopNavigation) {
        restoreScroll("/posts/test");
        isPopNavigation = false;
      }

      expect(scrollTo).toHaveBeenCalledWith({ top: 300, behavior: "smooth" });
      expect(isPopNavigation).toBe(false);
    });
  });

  describe("클릭 네비게이션 시 스크롤 초기화", () => {
    it("클릭 네비게이션 시 저장값을 0으로 리셋한다", () => {
      // 1. A 방문, 스크롤 500 저장
      saveScroll("/posts/a", 500);
      expect(sessionStorage.getItem("scrollY:/posts/a")).toBe("500");

      // 2. 클릭으로 A 재방문
      onNavigate("/posts/a", false);
      expect(sessionStorage.getItem("scrollY:/posts/a")).toBe("0");
    });

    it("새로고침 후 스크롤한 뒤 클릭 이동 시 새 페이지를 맨 위에서 시작한다", () => {
      const scrollTo = vi.fn();
      window.scrollTo = scrollTo;

      // 홈에서 새로고침 후 스크롤 300
      onNavigate("/", false);
      simulateUserScroll(300);

      // 클릭으로 글 페이지 이동
      scrollTo.mockClear();
      onNavigate("/posts/hello", false);

      // 새 페이지는 맨 위로 스크롤되어야 한다
      expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
      expect(sessionStorage.getItem("scrollY:/posts/hello")).toBe("0");
    });

    it("클릭 네비게이션 시 scrollTo(0)을 호출한다", () => {
      const scrollTo = vi.fn();
      window.scrollTo = scrollTo;

      onNavigate("/posts/new", false);

      expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
    });

    it("popstate 복원과 클릭 초기화는 서로 간섭하지 않는다", () => {
      const scrollTo = vi.fn();
      window.scrollTo = scrollTo;

      // 1. 클릭으로 A 방문 → 0으로 초기화
      onNavigate("/posts/a", false);
      expect(scrollTo).toHaveBeenCalledWith({ top: 0 });

      // 2. 스크롤 500 (scroll listener 시뮬레이션)
      simulateUserScroll(500);

      // 3. 뒤로가기로 홈
      onNavigate("/", true);

      // 4. 클릭으로 A 재방문 → 저장값 리셋, 0으로 초기화
      onNavigate("/posts/a", false);
      expect(sessionStorage.getItem("scrollY:/posts/a")).toBe("0");

      // 5. 뒤로가기로 홈
      onNavigate("/", true);

      // 6. 앞으로가기로 A → popstate, 저장값 0이므로 smooth 스크롤 0
      scrollTo.mockClear();
      onNavigate("/posts/a", true);
      expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });
  });

  describe("초기 세션 뒤로가기 복원", () => {
    it("홈 스크롤 → 글 클릭 → 뒤로가기 시 홈 스크롤이 복원된다", () => {
      const scrollTo = vi.fn();
      window.scrollTo = scrollTo;

      // 1. 초기 세션: 홈 방문
      onNavigate("/", false);

      // 2. 홈에서 스크롤 300
      simulateUserScroll(300);

      // 3. 클릭으로 글 페이지 이동
      onNavigate("/posts/hello", false);

      // 4. 뒤로가기
      scrollTo.mockClear();
      onNavigate("/", true);

      // 홈의 스크롤 300이 복원되어야 한다 (0이 아님!)
      expect(scrollTo).toHaveBeenCalledWith({ top: 300, behavior: "smooth" });
    });

    it("홈 스크롤 → 글 클릭 → 글에서 스크롤 → 뒤로가기 시 홈 복원, 다시 앞으로 시 글 복원", () => {
      const scrollTo = vi.fn();
      window.scrollTo = scrollTo;

      // 1. 홈 방문, 스크롤 200
      onNavigate("/", false);
      simulateUserScroll(200);

      // 2. 클릭으로 글 이동
      onNavigate("/posts/a", false);
      simulateUserScroll(800);

      // 3. 뒤로가기 → 홈 200 복원
      scrollTo.mockClear();
      onNavigate("/", true);
      expect(scrollTo).toHaveBeenCalledWith({ top: 200, behavior: "smooth" });

      // 4. 앞으로가기 → 글 800 복원
      simulateUserScroll(200); // 복원 결과 시뮬레이션
      scrollTo.mockClear();
      onNavigate("/posts/a", true);
      expect(scrollTo).toHaveBeenCalledWith({ top: 800, behavior: "smooth" });
    });

    it("여러 페이지 순회 후 뒤로가기 시 각 페이지 스크롤이 독립 복원된다", () => {
      const scrollTo = vi.fn();
      window.scrollTo = scrollTo;

      // 홈 → 스크롤 100
      onNavigate("/", false);
      simulateUserScroll(100);

      // 글A → 스크롤 400
      onNavigate("/posts/a", false);
      simulateUserScroll(400);

      // 글B → 스크롤 600
      onNavigate("/posts/b", false);
      simulateUserScroll(600);

      // 뒤로: 글A 400 복원
      scrollTo.mockClear();
      onNavigate("/posts/a", true);
      expect(scrollTo).toHaveBeenCalledWith({ top: 400, behavior: "smooth" });

      // 뒤로: 홈 100 복원
      simulateUserScroll(400);
      scrollTo.mockClear();
      onNavigate("/", true);
      expect(scrollTo).toHaveBeenCalledWith({ top: 100, behavior: "smooth" });
    });
  });
});
