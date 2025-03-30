import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ChecklistProvider } from './context/ChecklistContext';

// Screen imports
import AIScreen from './screens/AIScreen';
import MyChecklistScreen from './screens/MyChecklistScreen';
import SearchScreen from './screens/SearchScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const App = () => {
  return (
    <ChecklistProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'AI') {
                iconName = 'smartphone'; // Icon for AI tab
              } else if (route.name === 'My_Checklist') {
                iconName = 'check-circle'; // Icon for My Checklist tab
              } else if (route.name === 'Search') {
                iconName = 'search'; // Icon for Search tab
              } else if (route.name === 'Profile') {
                iconName = 'person'; // Icon for Profile tab
              }
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          })}
        >
          <Tab.Screen name="AI" component={AIScreen} />
          <Tab.Screen name="My_Checklist" component={MyChecklistScreen} />
          <Tab.Screen name="Search" component={SearchScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ChecklistProvider>
  );
};

export default App;