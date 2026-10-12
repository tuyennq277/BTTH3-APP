import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainTabParamList, RootStackParamList} from '../types';
import {useStudy} from '../context/StudyContext';

import {DashboardScreen} from '../screens/DashboardScreen';
import {CoursesScreen} from '../screens/CoursesScreen';
import {ScheduleScreen} from '../screens/ScheduleScreen';
import {AssignmentsScreen} from '../screens/AssignmentsScreen';
import {ProfileScreen} from '../screens/ProfileScreen';

import {CourseDetailScreen} from '../screens/CourseDetailScreen';
import {ScheduleDetailScreen} from '../screens/ScheduleDetailScreen';
import {AssignmentDetailScreen} from '../screens/AssignmentDetailScreen';
import {GradeDetailScreen} from '../screens/GradeDetailScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

interface TabIconProps {
  emoji: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({emoji, focused}) => (
  <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
    <Text style={styles.iconEmoji}>{emoji}</Text>
  </View>
);

const renderDashboardIcon = ({focused}: {focused: boolean}) => (
  <TabIcon emoji="🏠" focused={focused} />
);
const renderCoursesIcon = ({focused}: {focused: boolean}) => (
  <TabIcon emoji="📚" focused={focused} />
);
const renderScheduleIcon = ({focused}: {focused: boolean}) => (
  <TabIcon emoji="🗓️" focused={focused} />
);
const renderAssignmentsIcon = ({focused}: {focused: boolean}) => (
  <TabIcon emoji="📝" focused={focused} />
);
const renderProfileIcon = ({focused}: {focused: boolean}) => (
  <TabIcon emoji="🎓" focused={focused} />
);

function MainTabs() {
  const {incompleteAssignmentsCount} = useStudy();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E3A8A',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 17,
        },
        tabBarActiveTintColor: '#1D4ED8',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}>
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          title: 'Tổng quan học tập',
          tabBarLabel: 'Tổng quan',
          tabBarIcon: renderDashboardIcon,
        }}
      />
      <Tab.Screen
        name="CoursesTab"
        component={CoursesScreen}
        options={{
          title: 'Danh sách môn học',
          tabBarLabel: 'Môn học',
          tabBarIcon: renderCoursesIcon,
        }}
      />
      <Tab.Screen
        name="ScheduleTab"
        component={ScheduleScreen}
        options={{
          title: 'Thời khóa biểu tuần',
          tabBarLabel: 'Lịch học',
          tabBarIcon: renderScheduleIcon,
        }}
      />
      <Tab.Screen
        name="AssignmentsTab"
        component={AssignmentsScreen}
        options={{
          title: 'Quản lý bài tập',
          tabBarLabel: 'Bài tập',
          tabBarIcon: renderAssignmentsIcon,
          tabBarBadge:
            incompleteAssignmentsCount > 0
              ? incompleteAssignmentsCount
              : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '700',
          },
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Cá nhân & Kết quả học tập',
          tabBarLabel: 'Cá nhân',
          tabBarIcon: renderProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
}

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1E3A8A',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 17,
          },
          headerBackTitle: 'Quay lại',
        }}>
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CourseDetail"
          component={CourseDetailScreen}
          options={{title: 'Chi tiết môn học'}}
        />
        <Stack.Screen
          name="ScheduleDetail"
          component={ScheduleDetailScreen}
          options={{title: 'Chi tiết buổi học'}}
        />
        <Stack.Screen
          name="AssignmentDetail"
          component={AssignmentDetailScreen}
          options={{title: 'Chi tiết bài tập'}}
        />
        <Stack.Screen
          name="GradeDetail"
          component={GradeDetailScreen}
          options={{title: 'Chi tiết kết quả học tập'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  iconWrap: {
    width: 34,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#DBEAFE',
  },
  iconEmoji: {
    fontSize: 17,
  },
});
