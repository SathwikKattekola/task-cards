import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTaskName, setNewTaskName] = useState("");

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTaskName.trim()) return;
    const newTask = {
      id: Date.now(),
      name: newTaskName,
      lastWork: "",
      resources: [],
      xp: 0
    };
    setTasks([...tasks, newTask]);
    setNewTaskName("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    setSelectedTask(null);
  };

  const updateSelectedTask = (field, value) => {
    setTasks(tasks.map(task => 
      task.id === selectedTask.id ? { ...task, [field]: value } : task
    ));
    setSelectedTask({ ...selectedTask, [field]: value });
  };

  const addResource = () => {
    const url = prompt("Enter resource URL");
    if (url) {
      const updated = [...selectedTask.resources, url];
      updateSelectedTask("resources", updated);
    }
  };

  const deleteResource = (url) => {
    const updated = selectedTask.resources.filter(r => r !== url);
    updateSelectedTask("resources", updated);
  };

  const gainXP = () => {
    const newXP = selectedTask.xp + 10;
    updateSelectedTask("xp", newXP);
  };

  const pickRandomTask = () => {
    if (tasks.length === 0) return;
    const index = Math.floor(Math.random() * tasks.length);
    setSelectedTask(tasks[index]);
  };

  if (selectedTask) {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">{selectedTask.name}</h1>
        <p className="mb-2">XP: {selectedTask.xp}</p>
        <div className="bg-green-200 h-2 rounded mb-4">
          <div
            className="bg-green-600 h-2 rounded"
            style={{ width: `${selectedTask.xp % 100}%` }}
          ></div>
        </div>
        <textarea
          className="w-full border p-2 mb-4"
          placeholder="Last worked on..."
          value={selectedTask.lastWork}
          onChange={(e) => updateSelectedTask("lastWork", e.target.value)}
        />
        <Button onClick={gainXP} className="mb-4">+ Gain XP</Button>
        <div className="mb-2">
          <h2 className="font-semibold">Resources</h2>
          {selectedTask.resources.map((r, i) => (
            <div key={i} className="flex justify-between items-center py-1">
              <a href={r} target="_blank" rel="noreferrer" className="text-blue-500 underline">{r}</a>
              <Button size="sm" onClick={() => deleteResource(r)}>Delete</Button>
            </div>
          ))}
          <Button onClick={addResource} className="mt-2">+ Add Resource</Button>
        </div>
        <Button className="mt-4" onClick={() => setSelectedTask(null)}>← Back</Button>
        <Button variant="destructive" className="ml-2" onClick={() => deleteTask(selectedTask.id)}>Delete Task</Button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🎴 Select a Task</h1>
      <Button onClick={pickRandomTask} className="mb-4">🎲 Pick Random Task</Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tasks.map(task => (
          <Card key={task.id} onClick={() => setSelectedTask(task)} className="cursor-pointer hover:shadow-lg transition">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold">{task.name}</h2>
              <p className="text-sm text-gray-600">XP: {task.xp}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <input
          className="border p-2 w-full mb-2"
          placeholder="New task name"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <Button onClick={addTask}>+ Add Task</Button>
      </div>
    </div>
  );
}

export default App;
