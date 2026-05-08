const noop = () => undefined;

const registry = {
  get() {
    return {};
  },
  register() {
    return undefined;
  },
};

const uiManager = {
  createView: noop,
  updateView: noop,
  setChildren: noop,
  manageChildren: noop,
  measure: noop,
  measureInWindow: noop,
  measureLayout: noop,
  setJSResponder: noop,
  clearJSResponder: noop,
  dispatchViewManagerCommand: noop,
  removeRootView: noop,
};

const privateInterfaceStub = {
  BatchedBridge: {},
  ExceptionsManager: {},
  Platform: { OS: 'web', select: (options) => options.web ?? options.default },
  RCTEventEmitter: { register: noop },
  ReactNativeViewConfigRegistry: registry,
  TextInputState: { blurTextInput: noop, focusTextInput: noop },
  UIManager: uiManager,
  deepDiffer: () => false,
  deepFreezeAndThrowOnMutationInDev: (value) => value,
  flattenStyle: (style) => style,
  ReactFiberErrorDialog: { showErrorDialog: () => false },
  legacySendAccessibilityEvent: noop,
  RawEventEmitter: { emit: noop },
  CustomEvent: typeof globalThis.CustomEvent === 'function' ? globalThis.CustomEvent : noop,
  createAttributePayload: () => ({}),
  diffAttributePayloads: () => ({}),
  createPublicInstance: noop,
  createPublicTextInstance: noop,
  getNativeTagFromPublicInstance: () => 0,
  getNodeFromPublicInstance: noop,
  getInternalInstanceHandleFromPublicInstance: noop,
};

module.exports = privateInterfaceStub;
module.exports.default = privateInterfaceStub;
