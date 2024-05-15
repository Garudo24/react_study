export const editUser = (userId) => ({ type: 'EDIT_USER', userId });
export const updateUser = () => ({ type: 'UPDATE_USER' });
export const addUser = () => ({ type: 'ADD_USER' });
export const deleteUser = (userId) => ({ type: 'DELETE_USER', userId });
export const setNewUserName = (name) => ({ type: 'SET_NEW_USER_NAME', name });
export const setNewUserAge = (age) => ({ type: 'SET_NEW_USER_AGE', age });
export const setNewUserGender = (gender) => ({ type: 'SET_NEW_USER_GENDER', gender });
