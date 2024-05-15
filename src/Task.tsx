import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

type TaskProps = {
  task: Task;
  deleteTask: (id: number) => void;
  editTask: (id: number, text: string) => void;
};

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
          <span onDoubleClick={() => setIsEditing(true)}>{task.text}</span>
        )}
        <button onClick={() => deleteTask(task.id)}>Delete</button>
      </div>
    );
  };