import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditTaskScreen = ({ route, navigation }) => {
  const { task, index, date, tasks } = route.params;
  const [editedTask, setEditedTask] = useState(task);

  const saveEditedTask = async () => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = editedTask;

    await AsyncStorage.setItem(`tasks-${date}`, JSON.stringify(updatedTasks));
    navigation.goBack(); // повертаємось до TaskList
  };

  const deleteTask = async () => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    await AsyncStorage.setItem(`tasks-${date}`, JSON.stringify(updatedTasks));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Редагувати завдання</Text>
      <TextInput
        style={styles.input}
        value={editedTask}
        onChangeText={setEditedTask}
      />
      <Button title="Зберегти" onPress={saveEditedTask} />
      <Button title="Видалити" onPress={deleteTask} color="#ff5555" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#2e2e2e',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#3a3a3a',
    color: '#fff',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
});

export default EditTaskScreen;
