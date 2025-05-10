import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);  // Це дозволяє перемикатися між режимами "Увійти" та "Зареєструватися"

  const handleLogin = async () => {
    if (!username || !password) return;

    const usersJson = await AsyncStorage.getItem('users');
    const users = usersJson ? JSON.parse(usersJson) : {};

    if (users[username] !== password) {
      alert('Невірний логін або пароль');
      return;
    }

    await AsyncStorage.setItem('currentUser', username);
    onLogin();  // Викликаємо onLogin після успішного входу
  };

  const handleRegister = async () => {
    if (!username || !password) return;

    const usersJson = await AsyncStorage.getItem('users');
    const users = usersJson ? JSON.parse(usersJson) : {};

    if (users[username]) {
      alert('Цей логін вже існує');
      return;
    }

    users[username] = password;
    await AsyncStorage.setItem('users', JSON.stringify(users));

    // Збереження поточного користувача
    await AsyncStorage.setItem('currentUser', username);
    onLogin();  // Викликаємо onLogin після успішної реєстрації
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Логін"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {isLogin ? (
        <Button title="Увійти" onPress={handleLogin} />
      ) : (
        <Button title="Зареєструватися" onPress={handleRegister} />
      )}

      <Text
        style={styles.switchText}
        onPress={() => setIsLogin((prev) => !prev)}
      >
        {isLogin ? 'Не маєш акаунту? Зареєструйся' : 'Вже є акаунт? Увійди'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',  // Світло-сірий фон для загальної обробки
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#fff',  // Білий фон для полів введення
    color: '#333',  // Текст в полях буде темно-сірим для кращого контрасту
  },
  switchText: {
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default AuthScreen;
