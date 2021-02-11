const createTask = (title, description, dueDate, project = "uncategorized") => ({
  title, description, dueDate, project, completed: false
});

function getStoredTasks() {
  let all_tasks = JSON.parse(localStorage.getItem("tasks"));
  if (all_tasks === null) return [];

  return all_tasks;
}

function deleteStoredTask(id) {
  let all_tasks = getStoredTasks();
  all_tasks = all_tasks.filter(task => task.id !== id);

  localStorage.setItem("tasks", JSON.stringify(all_tasks));
}

function editStoredTask(id, updated_input) {
  let all_tasks = getStoredTasks();
  let task_to_update = all_tasks.filter(task => task.id === id)[0];

  task_to_update.title = updated_input[0];
  task_to_update.description = updated_input[1];
  task_to_update.dueDate = updated_input[2];
  task_to_update.project = updated_input[3];

  all_tasks[id] = task_to_update;

  localStorage.setItem("tasks", JSON.stringify(all_tasks));
}

function storeTask(task) {
  let all_tasks = getStoredTasks();
  if (all_tasks.length === 0) {
    task.id = 0;
  } else {
    task.id = all_tasks[all_tasks.length - 1].id + 1;
  }
  
  all_tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(all_tasks));
}

function completeTask(id) {
  let all_tasks = getStoredTasks();

  if (id >= 0 && id < all_tasks.length) {
    all_tasks[id].completed = !all_tasks[id].completed;
  }

  localStorage.setItem("tasks", JSON.stringify(all_tasks));
}

export { createTask, getStoredTasks, deleteStoredTask, storeTask, completeTask, editStoredTask };