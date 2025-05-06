import {openDatabase} from './database';

export const addTask = async (title, userId) => {
    const db = await openDatabase();
    await db.runAsync('INSERT INTO tasks (title, user_id) VALUES (?, ?)', title, userId);
};

export const getUserTasks = async (userId) => {
    const db = await openDatabase();
    return await db.getAllAsync('SELECT * FROM tasks WHERE user_id = ?', userId);
};

export const addProject = async (title) => {
    const db = await openDatabase();
    await db.runAsync('INSERT INTO projects (title) VALUES (?)', title);
};

export const assignUserToProject = async (userId, projectId) => {
    const db = await openDatabase();
    await db.runAsync('INSERT OR IGNORE INTO user_projects (user_id, project_id) VALUES (?, ?)', userId, projectId);
};

export const getUserProjects = async (userId) => {
    const db = await openDatabase();
    return await db.getAllAsync(`
        SELECT projects.* FROM projects
        JOIN user_projects ON projects.id = user_projects.project_id
        WHERE user_projects.user_id = ?
    `, userId);
};

export const getProjectUsers = async (projectId) => {
    const db = await openDatabase();
    return await db.getAllAsync(`
        SELECT users.* FROM users
        JOIN user_projects ON users.id = user_projects.user_id
        WHERE user_projects.project_id = ?
    `, projectId);
};
