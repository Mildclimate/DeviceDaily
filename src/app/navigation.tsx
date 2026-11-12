/**
 * 导航配置与路由参数类型
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../core/theme';
import { DeviceListScreen } from '../features/devices/screens/DeviceListScreen';
import { DeviceEditScreen } from '../features/devices/screens/DeviceEditScreen';
import type { Device } from '../domain/device';

export type RootStackParamList = {
  DeviceList: undefined;
  DeviceEdit: { device?: Device };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { colors, dark } = useTheme();
  return (
    <NavigationContainer
      theme={{
        colors: {
          primary: colors.accent,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
          notification: colors.accent,
        },
        dark,
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '800' },
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DeviceList" component={DeviceListScreen} />
        <Stack.Screen
          name="DeviceEdit"
          component={DeviceEditScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
