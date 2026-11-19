const STORAGE_KEY = "little-list-v1";
const taskList = document.querySelector("#tasks");
const empty = document.querySelector("#empty");
const statusMessage = document.querySelector("#status");
let filter = "all";
let statusTimer;

function readTasks() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(value) || value.some((task) => !task || typeof task.id !== "string" || typeof task.title !== "string")) {
      throw new Error("Saved checklist has an unexpected format.");
    }
    return value;
  } catch (error) {
    statusMessage.textContent = `Saved list could not be read: ${error.message}`;
    statusMessage.classList.add("show");
    return [];
  }
}

let tasks = readTasks();

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    showStatus(`Could not save your list: ${error.message}`);
  }
}

function showStatus(message) {
  statusMessage.textContent = message;
  statusMessage.classList.add("show");
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => statusMessage.classList.remove("show"), 2300);
}

function render() {
  const visible = DailyChecklist.filterTasks(tasks, filter);
  const doneCount = tasks.filter((task) => task.done).length;
  const leftCount = tasks.length - doneCount;
  document.querySelector("#summary").textContent = `${leftCount} left · ${doneCount} done`;
  document.querySelector("#clear-row").hidden = doneCount === 0;
  taskList.innerHTML = visible.map((task) => `<li class="task ${task.done ? "completed" : ""}">
    <input type="checkbox" data-toggle="${escapeHtml(task.id)}" ${task.done ? "checked" : ""} aria-label="Mark ${escapeHtml(task.title)} ${task.done ? "not done" : "done"}" />
    <span class="task-title">${escapeHtml(task.title)}</span>
    <button class="remove" type="button" data-delete="${escapeHtml(task.id)}" aria-label="Delete ${escapeHtml(task.title)}">×</button>
  </li>`).join("");
  empty.hidden = visible.length > 0;
  empty.textContent = tasks.length ? "No tasks match this filter." : "A clear page is a good place to start. Add one small thing you want to do.";
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === filter);
    button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
  });
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

document.querySelector("#today").textContent = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date());
document.querySelector("#task-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#task-title");
  try {
    tasks = DailyChecklist.addTask(tasks, input.value, globalThis.crypto.randomUUID());
    saveTasks();
    render();
    input.value = "";
    input.focus();
    showStatus("Task added.");
  } catch (error) {
    showStatus(error.message);
  }
});

document.querySelector(".filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (button) {
    filter = button.dataset.filter;
    render();
  }
});

taskList.addEventListener("change", (event) => {
  const id = event.target.dataset.toggle;
  if (!id) return;
  try {
    tasks = DailyChecklist.toggleTask(tasks, id);
    saveTasks();
    render();
  } catch (error) {
    showStatus(error.message);
  }
});

taskList.addEventListener("click", (event) => {
  const id = event.target.closest("[data-delete]")?.dataset.delete;
  if (!id) return;
  tasks = DailyChecklist.deleteTask(tasks, id);
  saveTasks();
  render();
});

document.querySelector("#clear-completed").addEventListener("click", () => {
  tasks = DailyChecklist.clearCompleted(tasks);
  saveTasks();
  render();
  showStatus("Completed tasks cleared.");
});

render();
