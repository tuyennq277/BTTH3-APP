import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from './routes';
import {stackOptions} from './stackOptions';
import ScheduleScreen from '../screens/schedule/ScheduleScreen';
import SessionDetailScreen from '../screens/schedule/SessionDetailScreen';

const Stack = createNativeStackNavigator();
export default function ScheduleStack() {
  return <Stack.Navigator screenOptions={stackOptions}>
    <Stack.Screen name={ROUTES.SCHEDULE} component={ScheduleScreen} options={{title: 'Thời khóa biểu'}} />
    <Stack.Screen name={ROUTES.SESSION_DETAIL} component={SessionDetailScreen} options={{title: 'Buổi học'}} />
  </Stack.Navigator>;
}
