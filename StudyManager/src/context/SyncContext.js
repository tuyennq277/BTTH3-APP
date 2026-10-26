import React, {createContext, useContext, useEffect} from 'react';
import {Alert} from 'react-native';
import useOutboxSync from '../hooks/useOutboxSync';

const SyncContext = createContext(null);
export default function SyncProvider({children}) {
  const value = useOutboxSync();
  useEffect(() => {
    if (value.message) {Alert.alert('Đồng bộ', value.message); value.dismissMessage();}
  }, [value.message]);
  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}
export function useSync() {return useContext(SyncContext);}
