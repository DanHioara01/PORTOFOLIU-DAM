import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import RootNavigator from './navigation/RootNavigator';

// NavigationContainer trebuie să fie sub ThemeProvider ca să poată citi tema
function ThemedNavigation() {
  const { mode } = useTheme();
  return (
    <NavigationContainer theme={mode === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// Ordinea contează: NotesProvider folosește useAuth, deci stă în interiorul AuthProvider
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotesProvider>
          <ThemedNavigation />
        </NotesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
