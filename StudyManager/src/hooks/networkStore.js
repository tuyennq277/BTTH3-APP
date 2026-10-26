import NetInfo from '@react-native-community/netinfo';

let online = null;
let stop;
const listeners = new Set();
const update = state => {
  const next = Boolean(state.isConnected) && state.isInternetReachable !== false;
  if (next !== online) {online = next; listeners.forEach(listener => listener());}
};
export const getIsOnline = () => online;
export function subscribeNetwork(listener) {
  listeners.add(listener);
  if (!stop) {
    stop = NetInfo.addEventListener(update);
    NetInfo.fetch().then(update).catch(() => update({isConnected: false}));
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size && stop) {stop(); stop = undefined;}
  };
}
