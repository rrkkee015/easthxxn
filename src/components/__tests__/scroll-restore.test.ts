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
    window.scrollTo({ top: Number(saved), behavior: "smooth" });
  }
}

function saveScroll(pathname: string, scrollY: number) {
  const key = makeKey(pathname);
  sessionStorage.setItem(key, String(scrollY));
}

/** 컴포넌트의 useEffect 진입 로직을 재현 */
function onNavigate(pathname: string, isPopNavigation: boolean, currentScrollY: number) {
  const key = makeKey(pathname);
  if (isPopNavigation) {
    const saved = sessionStorage.getItem(key);
    if (saved) {
      window.scrollTo({ top: Number(saved), behavior: "smooth" });
    }
  } else {
    sessionStorage.setItem(key, String(currentScrollY));
  }
}

describe("ScrollRestore", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
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
      let isPopNavigation = false;

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

  describe("일반 네비게이션 시 저장값 리셋", () => {
    it("클릭 네비게이션 시 이전 스크롤 값을 현재 위치(0)로 덮어쓴다", () => {
      // 1. A 방문, 스크롤 500 저장
      saveScroll("/posts/a", 500);
      expect(sessionStorage.getItem("scrollY:/posts/a")).toBe("500");

      // 2. 클릭으로 A 재방문 (스크롤 0에서 시작)
      onNavigate("/posts/a", false, 0);
      expect(sessionStorage.getItem("scrollY:/posts/a")).toBe("0");
    });

    it("홈→A(스크롤)→홈(뒤로)→A(클릭)→홈(뒤로)→A(앞으로) 시 0으로 복원", () => {
      const scrollTo = vi.fn();
      window.scrollTo = scrollTo;

      // 1. A 방문, 스크롤 500 저장
      onNavigate("/posts/a", false, 0);
      saveScroll("/posts/a", 500);

      // 2. 뒤로가기로 홈
      onNavigate("/", true, 0);

      // 3. 클릭으로 A 재방문 → 스크롤 0에서 시작, 저장값 리셋
      onNavigate("/posts/a", false, 0);
      expect(sessionStorage.getItem("scrollY:/posts/a")).toBe("0");

      // 4. 뒤로가기로 홈
      onNavigate("/", true, 0);

      // 5. 앞으로가기로 A → popstate, 저장값은 0
      scrollTo.mockClear();
      onNavigate("/posts/a", true, 0);
      expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });
  });
});
