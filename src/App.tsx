import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const Task = ({ task, deleteTask, editTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState('');
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { type: 'task', id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const handleEdit = () => {
    setIsEditing(false);
    editTask(task.id, text);
  };

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {isEditing ? (
        <input value={text} onChange={(e) => setText(e.target.value)} onBlur={handleEdit} autoFocus />
      ) : (
        <span style={laneTitleStyle} onDoubleClick={() => setIsEditing(true)}>{task.text}</span>
      )}
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </div>
  );
};

const laneStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '50%',
  margin: '0 10px',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: '#f9f9f9',
  minHeight: '500px', // 長い長方形のエリアを作るための最小高さ
};

const laneTitleStyle = {
  marginBottom: '10px', // h2タグの下にマージンを追加
  color: 'black', // テキスト色を黒に変更
};

const Lane = ({ lane, tasks, moveTask, deleteTask, editTask }) => {
  const [, drop] = useDrop({
    accept: 'task',
    drop: (item) => moveTask(item.id, lane),
  });

  // タスクをtimestampの降順にソート
  const sortedTasks = [...tasks].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div ref={drop} style={laneStyle}>
      <h2 style={laneTitleStyle}>{lane}</h2>
      {sortedTasks.map((task) => (
        <Task key={task.id} task={task} deleteTask={deleteTask} editTask={editTask} />
      ))}
    </div>
  );
};

const AddTaskForm = ({ addTask }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit">Add Task</button>
    </form>
  );
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);

  const addTask = (text) => {
    const newTask = { id: Date.now(), text, lane: 'task', timestamp: Date.now() };
    setTasks([...tasks, newTask]);
  };
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const editTask = (taskId, text) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, text } : task));
  };

  const moveTask = (taskId, lane) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, lane, timestamp: Date.now() } : task));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <h1>Task Board</h1>
      <AddTaskForm addTask={addTask} />
      <div style={{ display: 'flex' }}>
        <Lane lane="task" tasks={tasks.filter(task => task.lane === 'task')} moveTask={moveTask} deleteTask={deleteTask} editTask={editTask} />
        <Lane lane="doing" tasks={tasks.filter(task => task.lane === 'doing')} moveTask={moveTask} deleteTask={deleteTask} editTask={editTask} />
        <Lane lane="done" tasks={tasks.filter(task => task.lane === 'done')} moveTask={moveTask} deleteTask={deleteTask} editTask={editTask} />
      </div>
    </DndProvider>
  );
};

export default TaskBoard;