import useNetworkStatus from './useNetworkStatus';
import {useSync} from '../context/SyncContext';

export default function usePageState(queries) {
  const {isOnline} = useNetworkStatus();
  const {ready} = useSync();
  return {
    isOnline,
    loading: !ready || queries.some(query => query.loading && !query.data),
    error: queries.find(query => query.error)?.error,
    refreshing: queries.some(query => query.refreshing),
    lastUpdated: queries.map(query => query.lastUpdated).filter(Boolean).sort()[0],
    refresh: () => Promise.all(queries.map(query => query.refresh())),
  };
}
