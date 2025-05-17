import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, Button, View } from 'react-native';
import Calendar from './src/components/Calendar';
import AuthScreen from './src/components/AuthScreen';
import { LanguageProvider } from './src/components/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from './src/components/ThemeContext'; // контекст теми

const AppContent: React.FC = () => {
  const { theme, toggleTheme } = useTheme(); // Отримуємо доступ до теми
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem('currentUser');
      if (user) setIsLoggedIn(true);
    };
    checkUser();
  }, []);

  const handleLogin = async () => {
    await AsyncStorage.setItem('currentUser', 'userData');
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('currentUser');
    setIsLoggedIn(false);
  };

  const containerStyle = theme === 'light' ? styles.containerLight : styles.containerDark;
  const buttonColor = theme === 'light' ? '#000' : '#fff';

  if (!isLoggedIn) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <SafeAreaView style={containerStyle}>
      <Calendar theme={theme} />
      <View style={styles.buttonContainer}>
        <Button title="Log Out" onPress={handleLogout} color={buttonColor} />
        <Button title="Toggle Theme" onPress={toggleTheme} color={buttonColor} />
      </View>
    </SafeAreaView>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
              <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  containerLight: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  containerDark: {
    flex: 1,
    backgroundColor: '#222',
    paddingTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 10,
  },
});

export default App;
