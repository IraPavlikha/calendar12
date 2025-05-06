import * as SQLite from 'expo-sqlite';

const openDatabase = async () => {
  return await SQLite.openDatabaseAsync('mydatabase.db');
};

export const createTables = async () => {
  const db = await openDatabase();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL
    );

    -- Tasks table (one-to-many relationship)
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Projects table (many-to-many relationship)
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL
    );

    -- Junction table for users and projects
    CREATE TABLE IF NOT EXISTS user_projects (
      user_id INTEGER NOT NULL,
      project_id INTEGER NOT NULL,
      PRIMARY KEY (user_id, project_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_phone ON users (phone);
    CREATE INDEX IF NOT EXISTS idx_task_user ON tasks (user_id);
    CREATE INDEX IF NOT EXISTS idx_user_project_user ON user_projects (user_id);
    CREATE INDEX IF NOT EXISTS idx_user_project_project ON user_projects (project_id);
  `);
};

// User operations
export const insertUser = async (name, phone) => {
  const db = await openDatabase();

  // Check for unique phone
  const existingUser = await db.getAsync('SELECT * FROM users WHERE phone = ?', [phone]);
  if (existingUser) {
    throw new Error('User with this phone already exists.');
  }

  const result = await db.runAsync(
    'INSERT INTO users (name, phone) VALUES (?, ?)',
    name, phone
  );
  return result.lastInsertRowId;
};

export const fetchUsers = async () => {
  const db = await openDatabase();
  return await db.getAllAsync('SELECT * FROM users');
};

export const updateUser = async (name, phone, id) => {
  const db = await openDatabase();
  // Check for unique phone
  const existingUser = await db.getAsync('SELECT * FROM users WHERE phone = ? AND id != ?', [phone, id]);
  if (existingUser) {
    throw new Error('User with this phone already exists.');
  }

  await db.runAsync(
    'UPDATE users SET name = ?, phone = ? WHERE id = ?',
    name, phone, id
  );
};

export const deleteUser = async (id) => {
  const db = await openDatabase();
  await db.runAsync('DELETE FROM users WHERE id = ?', id);
};

// Task operations
export const addTask = async (title, userId) => {
  const db = await openDatabase();
  const result = await db.runAsync(
    'INSERT INTO tasks (title, user_id) VALUES (?, ?)',
    title, userId
  );
  return result.lastInsertRowId;
};

export const fetchUserTasks = async (userId) => {
  const db = await openDatabase();
  return await db.getAllAsync('SELECT * FROM tasks WHERE user_id = ?', [userId]);
};

export const deleteTask = async (taskId) => {
  const db = await openDatabase();
  await db.runAsync('DELETE FROM tasks WHERE id = ?', taskId);
};

// Project operations
export const addProject = async (title) => {
  const db = await openDatabase();
  const result = await db.runAsync(
    'INSERT INTO projects (title) VALUES (?)',
    title
  );
  return result.lastInsertRowId;
};

export const fetchProjects = async () => {
  const db = await openDatabase();
  return await db.getAllAsync('SELECT * FROM projects');
};

export const addUserToProject = async (userId, projectId) => {
  const db = await openDatabase();
  await db.runAsync(
    'INSERT OR IGNORE INTO user_projects (user_id, project_id) VALUES (?, ?)',
    userId, projectId
  );
};

export const fetchUserProjects = async (userId) => {
  const db = await openDatabase();
  return await db.getAllAsync(`
    SELECT p.* FROM projects p
    JOIN user_projects up ON p.id = up.project_id
    WHERE up.user_id = ?
  `, [userId]);
};

export const fetchProjectUsers = async (projectId) => {
  const db = await openDatabase();
  return await db.getAllAsync(`
    SELECT u.* FROM users u
    JOIN user_projects up ON u.id = up.user_id
    WHERE up.project_id = ?
  `, [projectId]);
};