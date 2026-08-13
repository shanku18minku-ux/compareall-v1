import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#0A0A0A" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0A0A0A' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
          contentStyle: { backgroundColor: '#0F0F0F' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ title: 'CompareAll', headerShown: false }} />
        <Stack.Screen name="results" options={{ title: 'Results', headerBackTitle: 'Back' }} />
        <Stack.Screen name="connect" options={{ title: 'Connect Accounts' }} />
        <Stack.Screen 
          name="webview-login" 
          options={{ 
            title: 'Connect Account',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#1A1A1A' },
          }} 
        />
      </Stack>
    </>
  );
}
