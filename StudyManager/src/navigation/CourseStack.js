import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from './routes';
import {stackOptions} from './stackOptions';
import CourseListScreen from '../screens/courses/CourseListScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';

const Stack = createNativeStackNavigator();
export default function CourseStack() {
  return <Stack.Navigator screenOptions={stackOptions}>
    <Stack.Screen name={ROUTES.COURSE_LIST} component={CourseListScreen} options={{title: 'Môn học'}} />
    <Stack.Screen name={ROUTES.COURSE_DETAIL} component={CourseDetailScreen} options={{title: 'Môn học'}} />
  </Stack.Navigator>;
}
