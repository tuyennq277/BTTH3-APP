import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from './routes';
import {stackOptions} from './stackOptions';
import HomeScreen from '../screens/home/HomeScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';

const Stack = createNativeStackNavigator();
export default function HomeStack() {
  return <Stack.Navigator screenOptions={stackOptions}>
    <Stack.Screen name={ROUTES.HOME} component={HomeScreen} options={{title: 'Tổng quan'}} />
    <Stack.Screen name={ROUTES.COURSE_DETAIL} component={CourseDetailScreen} options={{title: 'Môn học'}} />
    <Stack.Screen name={ROUTES.ASSIGNMENT_DETAIL} component={AssignmentDetailScreen} options={{title: 'Bài tập'}} />
  </Stack.Navigator>;
}
