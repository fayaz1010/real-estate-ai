import { renderHook, act } from "@testing-library/react";

import { useDebounce } from "../useDebounce";

vi.useFakeTimers();

describe("useDebounce", () => {
  afterEach(() => {
    vi.clearAllTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 500));
    expect(result.current).toBe("hello");
  });

  it("does not update value before delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "hello", delay: 500 } },
    );

    rerender({ value: "world", delay: 500 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("hello");
  });

  it("updates value after delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "hello", delay: 500 } },
    );

    rerender({ value: "world", delay: 500 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe("world");
  });

  it("resets timer on rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 500 } },
    );

    rerender({ value: "b", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    rerender({ value: "c", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // 'b' should have been cancelled, still showing 'a'
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Now 'c' should have resolved
    expect(result.current).toBe("c");
  });

  it("uses default delay of 500ms", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "hello" },
    });

    rerender({ value: "world" });

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current).toBe("hello");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("world");
  });

  it("works with numeric values", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 0 } },
    );

    rerender({ value: 42 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(42);
  });
});
