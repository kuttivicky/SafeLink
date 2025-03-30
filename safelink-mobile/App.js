import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ChecklistProvider } from './context/ChecklistContext';

// Screens
import AIScreen from './screens/AIScreen';
import MyChecklistScreen from './screens/MyChecklistScreen';
import SearchScreen from './screens/SearchScreen';
import ProfileScreen from './screens/ProfileScreen';
import AuthScreen from './screens/AuthScreen';
import { AuthProvider } from './AuthContext';
import ChecklistDetailScreen from './screens/ChecklistDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MyChecklistStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MyChecklistScreen"
      component={MyChecklistScreen}
      options={{ title: 'My Checklists' }}
    />
    <Stack.Screen
      name="ChecklistDetailScreen"
      component={ChecklistDetailScreen}
      options={{ title: 'Checklist Details' }}
    />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        switch (route.name) {
          case 'AI':
            iconName = 'smartphone';
            break;
          case 'MyChecklist':
            iconName = 'check-circle';
            break;
          case 'Search':
            iconName = 'search';
            break;
          case 'Profile':
            iconName = 'person';
            break;
          default:
            iconName = 'circle';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4e8bed',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 0.5,
        elevation: 5,
        height: 60,
        paddingBottom: 5,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="AI" component={AIScreen} />
    <Tab.Screen name="MyChecklist" component={MyChecklistStack} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthProvider>
      <ChecklistProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
            <Stack.Screen name="Auth">
              {(props) => <AuthScreen {...props} onLogin={() => setIsLoggedIn(true)} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Main" component={MainTabs} />
        )}
        </Stack.Navigator>
      </NavigationContainer>
    </ChecklistProvider>
    </AuthProvider>
  );
};

export default App;
