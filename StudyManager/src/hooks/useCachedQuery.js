import {useCallback, useEffect, useRef, useSyncExternalStore} from 'react';
import useNetworkStatus from './useNetworkStatus';
import {getSnapshot, subscribeQuery, loadQuery} from '../context/queryStore';

export default function useCachedQuery(key, fetcher) {
  const {isOnline} = useNetworkStatus();
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const subscribe = useCallback(listener => subscribeQuery(key, listener), [key]);
  const snapshot = useCallback(() => getSnapshot(key), [key]);
  const state = useSyncExternalStore(subscribe, snapshot, snapshot);
  const refresh = useCallback(() => loadQuery(key, () => fetcherRef.current(), isOnline), [key, isOnline]);
  useEffect(() => {refresh();}, [refresh]);
  return {...state, refresh};
}
