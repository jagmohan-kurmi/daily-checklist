(function (root, factory) {
  const logic = factory();
  if (typeof module === "object" && module.exports) module.exports = logic;
  root.DailyChecklist = logic;
})(globalThis, function () {
  function addTask(tasks, title, id, createdAt = new Date().toISOString()) {
    const cleanTitle = String(title || "").trim();
    if (!cleanTitle) throw new Error("Task title cannot be empty.");
    if (!id) throw new Error("Task id is required.");
    return [{ id, title: cleanTitle, done: false, createdAt }, ...tasks];
  }

  function toggleTask(tasks, id) {
    let found = false;
    const updated = tasks.map((task) => {
      if (task.id !== id) return task;
      found = true;
      return { ...task, done: !task.done };
    });
    if (!found) throw new Error("Task was not found.");
    return updated;
  }

  function deleteTask(tasks, id) {
    return tasks.filter((task) => task.id !== id);
  }

  function clearCompleted(tasks) {
    return tasks.filter((task) => !task.done);
  }

  function filterTasks(tasks, filter) {
    if (filter === "active") return tasks.filter((task) => !task.done);
    if (filter === "done") return tasks.filter((task) => task.done);
    return tasks;
  }

  return { addTask, toggleTask, deleteTask, clearCompleted, filterTasks };
});
