import React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import {ROUTES} from './routes';
import HomeStack from './HomeStack';
import CourseStack from './CourseStack';
import ScheduleStack from './ScheduleStack';
import AssignmentStack from './AssignmentStack';
import ProfileStack from './ProfileStack';
import {useAppData} from '../context/AppDataContext';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

const Tab = createBottomTabNavigator();
const icons = {
  [ROUTES.HOME_TAB]: 'home-outline', [ROUTES.COURSES_TAB]: 'book-outline',
  [ROUTES.SCHEDULE_TAB]: 'calendar-outline', [ROUTES.ASSIGNMENTS_TAB]: 'checkbox-outline',
  [ROUTES.PROFILE_TAB]: 'person-outline',
};
export default function AppNavigator() {
  const {assignments} = useAppData();
  const undone = assignments.filter(item => item.status !== 'done').length;
  return <NavigationContainer><Tab.Navigator screenOptions={({route}) => ({
    headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.textMuted,
    tabBarStyle: styles.tabBar,
    tabBarLabelStyle: styles.tabLabel,
    tabBarIcon: ({color, size}) => <Ionicons name={icons[route.name]} size={size} color={color} />,
  })}>
    <Tab.Screen name={ROUTES.HOME_TAB} component={HomeStack} options={{title: 'Tổng quan'}} />
    <Tab.Screen name={ROUTES.COURSES_TAB} component={CourseStack} options={{title: 'Môn học'}} />
    <Tab.Screen name={ROUTES.SCHEDULE_TAB} component={ScheduleStack} options={{title: 'Lịch học'}} />
    <Tab.Screen name={ROUTES.ASSIGNMENTS_TAB} component={AssignmentStack} options={{title: 'Bài tập', tabBarBadge: undone || undefined}} />
    <Tab.Screen name={ROUTES.PROFILE_TAB} component={ProfileStack} options={{title: 'Cá nhân'}} />
  </Tab.Navigator></NavigationContainer>;
}
const styles = StyleSheet.create({
  tabBar: {backgroundColor: colors.surface, minHeight: spacing.touch + spacing.xl},
  tabLabel: typography.small,
});
