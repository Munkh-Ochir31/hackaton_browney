const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform === 'web' &&
    (moduleName === 'react-native' || moduleName === 'react-native/index.js')
  ) {
    return {
      type: 'sourceFile',
      filePath: path.join(__dirname, 'src/web/reactNativeWebProxy.js'),
    };
  }

  if (
    platform === 'web' &&
    moduleName.endsWith('platform-specific/RNRenderer')
  ) {
    return {
      type: 'sourceFile',
      filePath: path.join(
        __dirname,
        'node_modules/react-native-reanimated/lib/module/reanimated2/platform-specific/RNRenderer.web.js',
      ),
    };
  }

  if (
    platform === 'web' &&
    moduleName === 'react-native/Libraries/Renderer/shims/ReactNative'
  ) {
    return {
      type: 'sourceFile',
      filePath: path.join(__dirname, 'src/web/reactNativeRendererStub.js'),
    };
  }

  if (
    platform === 'web' &&
    moduleName === 'react-native/Libraries/ReactPrivate/ReactNativePrivateInterface'
  ) {
    return {
      type: 'sourceFile',
      filePath: path.join(__dirname, 'src/web/reactNativePrivateInterfaceStub.js'),
    };
  }

  if (
    platform === 'web' &&
    (moduleName === '../Utilities/Platform' ||
      moduleName === './Platform' ||
      moduleName.endsWith('/Platform')) &&
    context.originModulePath.includes('react-native/Libraries/')
  ) {
    return {
      type: 'sourceFile',
      filePath: path.join(__dirname, 'src/web/platformStub.js'),
    };
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
