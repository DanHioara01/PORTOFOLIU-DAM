import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import NotesScreen from '../screens/NotesScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, ready } = useAuth();

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Home" options={{ title: 'Profil' }}>
            {(props) => <HomeScreen {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Notes" options={{ title: 'Notițe' }}>
            {(props) => <NotesScreen {...props} />}
          </Stack.Screen>
        </>
      ) : (
        <Stack.Screen name="Login" options={{ title: 'Autentificare' }}>
          {(props) => <LoginScreen {...props} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
