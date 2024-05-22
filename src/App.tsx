import React, { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider} from 'react-dnd';
import update from 'immutability-helper';
import './TaskBoard.css';

const TASK = 'task';
const DOING = 'doing';
const DONE = 'done';

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
        <span style={{ color: 'black' }} onDoubleClick={() => setIsEditing(true)}>{task.text}</span>
      )}
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </div>
  );
};

const Lane = ({ lane, tasks, moveTask, deleteTask, editTask, deleteLane, moveLane, index }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: 'task',
    drop: (item) => moveTask(item.id, lane),
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'lane',
    item: { type: 'lane', id: lane, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropLane] = useDrop({
    accept: 'lane',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveLane(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));
  dropLane(preview(ref));

  // タスクをtimestampの降順にソート
  const sortedTasks = [...tasks].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div ref={ref} className="laneStyle">
      <h2 style={{ color: 'black' }}>{lane}</h2>
      <button onClick={() => deleteLane(lane)}>Delete Lane</button>
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

const AddLaneForm = ({ addLane }) => {
  const [laneName, setLaneName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addLane(laneName);
    setLaneName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={laneName} onChange={(e) => setLaneName(e.target.value)} />
      <button type="submit">Add Lane</button>
    </form>
  );
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [lanes, setLanes] = useState([TASK, DOING, DONE]);

  const addTask = (text) => {
    const newTaskId = Date.now();
    if (tasks.some(task => task.id === newTaskId)) {
      alert('Task ID must be unique');
      return;
    }
    const newTask = { id: newTaskId, text, lane: lanes[0], timestamp: Date.now() };
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

  const addLane = (laneName) => {
    if (lanes.includes(laneName)) {
      alert('Lane name must be unique');
      return;
    }
    setLanes([...lanes, laneName]);
  };
  const deleteLane = (laneName) => {
    setLanes(lanes.filter(lane => lane !== laneName));
  };

  const moveLane = (dragIndex, hoverIndex) => {
    const dragLane = lanes[dragIndex];
    setLanes(
      update(lanes, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragLane],
        ],
      }),
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <h1>Task Board</h1>
      <AddLaneForm addLane={addLane} />
      <AddTaskForm addTask={addTask} />
      <div style={{ display: 'flex' }}>
        {lanes.map((lane, i) => (
          <Lane key={lane} index={i} lane={lane} tasks={tasks.filter(task => task.lane === lane)} moveTask={moveTask} deleteTask={deleteTask} editTask={editTask} deleteLane={deleteLane} moveLane={moveLane} />
        ))}
      </div>
    </DndProvider>
  );
};

export default TaskBoard;