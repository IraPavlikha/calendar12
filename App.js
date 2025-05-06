import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button,
  FlatList, TouchableOpacity, StyleSheet,
  ScrollView
} from 'react-native';
import {
  createTables, deleteUser, fetchUsers,
  insertUser, updateUser, fetchUserTasks,
  addTask, fetchProjects, addProject,
  addUserToProject, fetchUserProjects,
  fetchProjectUsers, deleteTask
} from './database';

export default function App() {
  const [screen, setScreen] = useState('list');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [users, setUsers] = useState([]);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskUserId, setTaskUserId] = useState('');
  const [userTasks, setUserTasks] = useState([]);

  const [projectTitle, setProjectTitle] = useState('');
  const [projects, setProjects] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [projectUsers, setProjectUsers] = useState([]);
  const [projectUserId, setProjectUserId] = useState('');
  const [projectId, setProjectId] = useState('');

  const loadUsers = async () => {
    const allUsers = await fetchUsers();
    setUsers(allUsers);
  };

  const loadProjects = async () => {
    const allProjects = await fetchProjects();
    setProjects(allProjects);
  };

  useEffect(() => {
    createTables();
    loadUsers();
    loadProjects();
  }, []);

  const addUser = async () => {
    if (name.trim() && phone.trim()) {
      await insertUser(name.trim(), phone.trim());
      setName('');
      setPhone('');
      loadUsers();
      setScreen('list');
    }
  };

  const saveUser = async () => {
    if (editingId && name.trim() && phone.trim()) {
      await updateUser(name.trim(), phone.trim(), editingId);
      setEditingId(null);
      setName('');
      setPhone('');
      setScreen('list');
      loadUsers();
    }
  };

  const deleteUserHandler = async (id) => {
    await deleteUser(id);
    loadUsers();
  };

  const addTaskHandler = async () => {
    if (taskTitle.trim() && taskUserId) {
      await addTask(taskTitle.trim(), parseInt(taskUserId));
      setTaskTitle('');
      setTaskUserId('');
      loadUserTasks(parseInt(taskUserId));
    }
  };

  const loadUserTasks = async (userId) => {
    const tasks = await fetchUserTasks(userId);
    setUserTasks(tasks);
  };

  const deleteTaskHandler = async (taskId, userId) => {
    await deleteTask(taskId);
    loadUserTasks(userId);
  };

  const addProjectHandler = async () => {
    if (projectTitle.trim()) {
      await addProject(projectTitle.trim());
      setProjectTitle('');
      loadProjects();
    }
  };

  const addUserToProjectHandler = async () => {
    if (projectUserId && projectId) {
      await addUserToProject(parseInt(projectUserId), parseInt(projectId));
      setProjectUserId('');
      setProjectId('');
    }
  };

  const loadUserProjects = async (userId) => {
    const userProjs = await fetchUserProjects(userId);
    setUserProjects(userProjs);
  };

  const loadProjectUsers = async (projId) => {
    const projUsers = await fetchProjectUsers(projId);
    setProjectUsers(projUsers);
  };

  const renderListScreen = () => (
    <View style={styles.container}>
      <Text style={styles.header}>User List</Text>
      <View style={styles.buttonGroup}>
        <Button title="Add New User" onPress={() => {
          setName('');
          setPhone('');
          setEditingId(null);
          setScreen('edit');
        }} />
        <Button title="Manage Tasks" onPress={() => setScreen('tasks')} />
        <Button title="Manage Projects" onPress={() => setScreen('projects')} />
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => {
              setName(item.name);
              setPhone(item.phone);
              setEditingId(item.id);
              setScreen('details');
            }}
          >
            <Text style={styles.nameOnly}>{item.name}</Text>
            <TouchableOpacity onPress={() => deleteUserHandler(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderDetailsScreen = () => (
    <View style={styles.container}>
      <Text style={styles.header}>User Details</Text>
      <Text style={styles.detailText}>Name: {name}</Text>
      <Text style={styles.detailText}>Phone: {phone}</Text>

      <View style={styles.buttonGroup}>
        <Button title="Edit" onPress={() => setScreen('edit')} />
        <Button title="View Tasks" onPress={() => {
          setTaskUserId(editingId);
          loadUserTasks(editingId);
          setScreen('userTasks');
        }} />
        <Button title="View Projects" onPress={() => {
          loadUserProjects(editingId);
          setScreen('userProjects');
        }} />
        <Button title="Back" onPress={() => {
          setEditingId(null);
          setScreen('list');
        }} />
      </View>
    </View>
  );

  const renderEditScreen = () => (
    <View style={styles.container}>
      <Text style={styles.header}>
        {editingId ? 'Edit User' : 'Add New User'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <View style={styles.buttonGroup}>
        {editingId ? (
          <Button title="Save" onPress={saveUser} />
        ) : (
          <Button title="Add" onPress={addUser} />
        )}
        <Button title="Cancel" onPress={() => {
          setName('');
          setPhone('');
          setScreen(editingId ? 'details' : 'list');
        }} />
      </View>
    </View>
  );

  const renderTasksScreen = () => (
    <View style={styles.container}>
      <Text style={styles.header}>Task Management</Text>

      <Text style={styles.subHeader}>Add New Task</Text>
      <TextInput
        style={styles.input}
        placeholder="User ID"
        value={taskUserId}
        onChangeText={setTaskUserId}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={taskTitle}
        onChangeText={setTaskTitle}
      />
      <Button title="Add Task" onPress={addTaskHandler} />

      <Text style={styles.subHeader}>View User Tasks</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter User ID"
        value={taskUserId}
        onChangeText={(text) => {
          setTaskUserId(text);
          if (text) {
            loadUserTasks(parseInt(text));
          }
        }}
        keyboardType="numeric"
      />

      <FlatList
        data={userTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text>{item.title}</Text>
            <TouchableOpacity onPress={() => deleteTaskHandler(item.id, item.user_id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button title="Back" onPress={() => setScreen('list')} />
    </View>
  );

  const renderUserTasksScreen = () => (
    <View style={styles.container}>
      <Text style={styles.header}>Tasks for User {taskUserId}</Text>

      <FlatList
        data={userTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text>{item.title}</Text>
            <TouchableOpacity onPress={() => deleteTaskHandler(item.id, item.user_id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button title="Back" onPress={() => setScreen('details')} />
    </View>
  );

  const renderProjectsScreen = () => (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Project Management</Text>

      <Text style={styles.subHeader}>Add New Project</Text>
      <TextInput
        style={styles.input}
        placeholder="Project Title"
        value={projectTitle}
        onChangeText={setProjectTitle}
      />
      <Button title="Add Project" onPress={addProjectHandler} />

      <Text style={styles.subHeader}>All Projects</Text>
      <FlatList
        data={projects}
        scrollEnabled={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.projectItem}>
            <Text>{item.title}</Text>
          </View>
        )}
      />

      <Text style={styles.subHeader}>Add User to Project</Text>
      <TextInput
        style={styles.input}
        placeholder="User ID"
        value={projectUserId}
        onChangeText={setProjectUserId}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Project ID"
        value={projectId}
        onChangeText={setProjectId}
        keyboardType="numeric"
      />
      <Button title="Add User to Project" onPress={addUserToProjectHandler} />

      <Text style={styles.subHeader}>View User Projects</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter User ID"
        value={projectUserId}
        onChangeText={(text) => {
          setProjectUserId(text);
          if (text) {
            loadUserProjects(parseInt(text));
          }
        }}
        keyboardType="numeric"
      />
      <FlatList
        data={userProjects}
        scrollEnabled={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.projectItem}>
            <Text>{item.title}</Text>
          </View>
        )}
      />

      <Text style={styles.subHeader}>View Project Users</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Project ID"
        value={projectId}
        onChangeText={(text) => {
          setProjectId(text);
          if (text) {
            loadProjectUsers(parseInt(text));
          }
        }}
        keyboardType="numeric"
      />
      <FlatList
        data={projectUsers}
        scrollEnabled={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text>{item.name}</Text>
          </View>
        )}
      />

      <Button title="Back" onPress={() => setScreen('list')} />
    </ScrollView>
  );

  const renderUserProjectsScreen = () => (
    <View style={styles.container}>
      <Text style={styles.header}>Projects for User {editingId}</Text>

      <FlatList
        data={userProjects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.projectItem}>
            <Text>{item.title}</Text>
          </View>
        )}
      />

      <Button title="Back" onPress={() => setScreen('details')} />
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      {screen === 'list' && renderListScreen()}
      {screen === 'details' && renderDetailsScreen()}
      {screen === 'edit' && renderEditScreen()}
      {screen === 'tasks' && renderTasksScreen()}
      {screen === 'userTasks' && renderUserTasksScreen()}
      {screen === 'projects' && renderProjectsScreen()}
      {screen === 'userProjects' && renderUserProjectsScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingTop: 50,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  projectItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  deleteButton: {
    color: '#FF4D4D',
    fontWeight: 'bold',
  },
  nameOnly: {
    fontSize: 18,
    fontWeight: '500',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
});