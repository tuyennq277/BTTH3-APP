import {useCallback, useEffect, useRef, useState} from 'react';
import {AppState} from 'react-native';
import useNetworkStatus from './useNetworkStatus';
import * as outbox from '../storage/outbox';
import {flushOutbox} from '../context/syncEngine';
import {getIsOnline} from './networkStore';
import {refreshAll} from '../context/queryStore';
import {SYNC_RETRY_MS} from '../config';

export default function useOutboxSync() {
  const {isOnline} = useNetworkStatus();
  const [actions, setActions] = useState([]);
  const [ready, setReady] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const mounted = useRef(true);
  const busy = useRef(false);
  const reload = useCallback(async () => {
    const next = await outbox.getAll();
    if (mounted.current) {setActions(next); setReady(true);}
    return next;
  }, []);
  const syncNow = useCallback(async () => {
    if (!getIsOnline() || busy.current) {return;}
    busy.current = true;
    setSyncing(true); setError(null);
    const conflicts = [];
    try {
      const result = await flushOutbox({isOnline: getIsOnline, onChange: reload,
        onConflict: record => conflicts.push(record)});
      if (mounted.current) {
        const parts = [];
        if (result.synced) {parts.push(`Đã đồng bộ ${result.synced} thay đổi`);}
        if (conflicts.length) {parts.push(`${conflicts.length} xung đột: đã dùng dữ liệu mới hơn trên máy chủ.`);}
        if (parts.length) {setMessage(parts.join('. ')); await refreshAll(true);}
      }
    } catch (e) {
      if (mounted.current) {
        setError(e.message || 'Không đồng bộ được. Thao tác vẫn được giữ an toàn trong hàng đợi.');
        if (conflicts.length) {setMessage('Có xung đột: đã dùng dữ liệu mới hơn trên máy chủ.');}
      }
    } finally {
      busy.current = false;
      if (mounted.current) {setSyncing(false); reload().catch(e => setError(e.message));}
    }
  }, [reload]);
  useEffect(() => {
    mounted.current = true;
    const unsubscribe = outbox.subscribe(() => reload().catch(e => setError(e.message)));
    reload().catch(e => setError(e.message));
    return () => {mounted.current = false; unsubscribe();};
  }, [reload]);
  useEffect(() => {
    if (isOnline && ready && actions.length) {syncNow();}
    // A failure keeps the queue length stable; the interval retries without a render loop.
  }, [isOnline, ready, actions.length, syncNow]);
  useEffect(() => {
    if (!isOnline) {return;}
    const timer = setInterval(syncNow, SYNC_RETRY_MS);
    const subscription = AppState.addEventListener('change', state => {if (state === 'active') {syncNow();}});
    return () => {clearInterval(timer); subscription.remove();};
  }, [isOnline, syncNow]);
  return {isOnline, actions, ready, pendingCount: actions.length, syncing, error,
    message, dismissMessage: () => setMessage(''), syncNow, reload};
}
