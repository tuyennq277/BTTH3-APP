import {useSyncExternalStore} from 'react';
import {getIsOnline, subscribeNetwork} from './networkStore';

export default function useNetworkStatus() {
  return {isOnline: useSyncExternalStore(subscribeNetwork, getIsOnline, getIsOnline)};
}
