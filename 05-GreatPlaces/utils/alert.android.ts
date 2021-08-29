import { ToastAndroid } from 'react-native';

export default (title: string, message: string) => {
  ToastAndroid.show(`${title}\n${message}`, ToastAndroid.LONG);
};
