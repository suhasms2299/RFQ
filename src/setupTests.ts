// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

class TestResizeObserver implements ResizeObserver {
	observe(_target: Element): void {}
	unobserve(_target: Element): void {}
	disconnect(): void {}
}

if (!globalThis.ResizeObserver) globalThis.ResizeObserver = TestResizeObserver;
