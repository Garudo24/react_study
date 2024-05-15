import { editUser, deleteUser } from './actionCreators';

const UserRow = ({ user, dispatch }) => (
    <tr>
      <td>{user.name}</td>
      <td>{user.age}</td>
      <td>{user.gender}</td>
      <td>
        <button onClick={() => dispatch({ type: 'EDIT_USER', userId: user.id })}>編集</button>
        <button onClick={() => dispatch({ type: 'DELETE_USER', userId: user.id })}>削除</button>
      </td>
    </tr>
  );