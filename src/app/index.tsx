/**
 * 应用根组件：Provider 组装（主题 / i18n / 导航）
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { I18nProvider } from '../core/i18n';
import { ThemeProvider, useTheme } from '../core/theme';
import { DevicesProvider } from '../features/devices/hooks/useDevices';
import { AppNavigator } from './navigation';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <I18nProvider>
        <DevicesProvider>
          <Root />
        </DevicesProvider>
      </I18nProvider>
    </ThemeProvider>
  );
};

/** StatusBar 颜色需要读取主题，因此独立在 Provider 内部 */
const Root: React.FC = () => {
  const { dark } = useTheme();
  return (
    <>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </>
  );
};

export default App;
