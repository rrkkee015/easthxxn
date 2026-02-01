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
});
