import { Alert, Platform } from 'react-native';

export function confirmAction(title: string, message?: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return Promise.resolve(window.confirm([title, message].filter(Boolean).join('\n')));
  }

  return new Promise<boolean>((resolve) => {
    Alert.alert(title, message, [
      { text: 'キャンセル', style: 'cancel', onPress: () => resolve(false) },
      { text: 'OK', style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}
