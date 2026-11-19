const test = require("node:test");
const assert = require("node:assert/strict");
const checklist = require("../logic.js");

test("adds trimmed tasks without mutating the original list", () => {
  const original = [];
  const result = checklist.addTask(original, "  Call home  ", "task-1", "2026-01-01");
  assert.deepEqual(original, []);
  assert.deepEqual(result, [{ id: "task-1", title: "Call home", done: false, createdAt: "2026-01-01" }]);
});

test("rejects blank task titles and missing IDs", () => {
  assert.throws(() => checklist.addTask([], "   ", "task-1"), /cannot be empty/);
  assert.throws(() => checklist.addTask([], "Task", ""), /id is required/);
});

test("toggles, filters, and clears completed tasks", () => {
  const tasks = [{ id: "a", title: "A", done: false }, { id: "b", title: "B", done: true }];
  const toggled = checklist.toggleTask(tasks, "a");
  assert.equal(toggled[0].done, true);
  assert.equal(checklist.filterTasks(toggled, "active").length, 0);
  assert.deepEqual(checklist.clearCompleted(toggled), []);
  assert.equal(tasks[0].done, false);
});

test("throws when asked to toggle an unknown task", () => {
  assert.throws(() => checklist.toggleTask([], "missing"), /not found/);
});
