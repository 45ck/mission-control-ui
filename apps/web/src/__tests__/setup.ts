import '@testing-library/jest-dom/vitest';

// jsdom stubs: scrollIntoView is not implemented
Element.prototype.scrollIntoView = function noop() {
  // intentional no-op — jsdom does not implement scrollIntoView
};
