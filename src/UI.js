import { createTask, getStoredTasks, deleteStoredTask, storeTask, completeTask, editStoredTask } from "./task";
import { format, compareAsc, compareDesc, parse, parseISO } from 'date-fns';

function createHTMLElement(type, id, arrayClasses, content) {
  const element = document.createElement(type);
  if (id) element.id = id;
  if (arrayClasses)
    arrayClasses.forEach((myClass) => element.classList.add(myClass));

  if (content) element.innerText = content;

  return element;
}

function getUserInput() {
  const task_title = document.getElementById("task_title_input").value;
  const task_description = document.getElementById("task_description_input").value;
  const task_date = document.getElementById("task_date_input").value;
  const task_project = document.getElementById("task_project_input").value;

  return [task_title, task_description, task_date, task_project];
}

// informs user of invalid task input
function invalidFormInput() {
  const task_title_field = document.getElementById("task_title_input");
  task_title_field.classList.add("is-invalid");
  if (document.querySelectorAll(".invalid-feedback").length === 0) {
    task_title_field.insertAdjacentHTML("afterend", '<div class="invalid-feedback">Task must have a title.</div >');
  };
}

// checks if task input is invalid
function isFormInputValid() {
  const task_title_field = document.getElementById("task_title_input");
  return task_title_field.value !== "";
}

function createTaskForm() {
  const task_container = document.getElementById("add-task-button");
  const task_form = createHTMLElement("form", "task-form", ["p-4"], null);

  // title
  const title_input_group_div = createHTMLElement("div", null, ["input-group", "mb-2"], null);
  const title_input_group_text = createHTMLElement("span", null, ["input-group-text"], "Title");
  const title_input_field = createHTMLElement("input", "task_title_input", ["form-control"], null);

  title_input_group_div.appendChild(title_input_group_text);
  title_input_group_div.appendChild(title_input_field);
  task_form.appendChild(title_input_group_div);
  title_input_field.type = "text";
  title_input_field.placeholder = "e.g. Homework";
  title_input_field.maxLength = 35;

  // description
  const description_input_group_div = createHTMLElement("div", null, ["input-group", "mb-2"], null);
  const description_input_group_text = createHTMLElement("span", null, ["input-group-text"], "Description");
  const description_input_field = createHTMLElement("input", "task_description_input", ["form-control"], null);

  description_input_group_div.appendChild(description_input_group_text);
  description_input_group_div.appendChild(description_input_field);
  task_form.appendChild(description_input_group_div);
  description_input_field.type = "text";
  description_input_field.placeholder = "e.g. Read calculus chapter 3";

  // due date & project
  const date_project_input_group_div = createHTMLElement("div", null, ["input-group", "mb-2"], null);
  const date_input_group_text = createHTMLElement("span", null, ["input-group-text"], "Due Date");
  const date_input_field = createHTMLElement("input", "task_date_input", ["form-control"], null);

  const project_input_group_text = createHTMLElement("span", null, ["input-group-text"], "Project");
  const project_input_field = createHTMLElement("input", "task_project_input", ["form-control"], null);

  date_input_field.type = "date";
  project_input_field.type = "text";
  project_input_field.placeholder = "e.g. School";

  date_project_input_group_div.appendChild(date_input_group_text);
  date_project_input_group_div.appendChild(date_input_field);
  date_project_input_group_div.appendChild(project_input_group_text);
  date_project_input_group_div.appendChild(project_input_field);
  task_form.appendChild(date_project_input_group_div);

  // buttons
  const submit_btn = createHTMLElement("a", "submit-btn", ["btn", "btn-primary", "btn-sm", "me-1"], "Submit");
  const cancel_btn = createHTMLElement("a", "cancel-btn", ["btn", "btn-danger", "btn-sm"], "Cancel");

  submit_btn.addEventListener("click", submitTaskForm);
  cancel_btn.addEventListener("click", hideTaskForm);

  task_form.appendChild(submit_btn);
  task_form.appendChild(cancel_btn);

  task_container.appendChild(task_form);

  // hidden div for scrolling to bottom
  const end_of_form = createHTMLElement("div", "end-form", null, null);
  task_container.appendChild(end_of_form);
}

function createEditForm(id) {
  const selected_task = document.getElementById(`${id}`);
  const task_values = getStoredTasks().filter(task => task.id === id)[0];

  selected_task.classList.add("editing");
  let selected_task_edit_form = createHTMLElement("div", `edit_task_${id}_form`, null, null);
  selected_task_edit_form.innerHTML = `
  <form id="task-form" class="p-1 my-2 mx-4 border border-primary rounded">
    <div class="input-group mb-2">
      <span class="input-group-text">Title</span>
      <input id="task_title_input_${id}" class="form-control" type="text" placeholder="e.g. Homework" maxlength="35">
    </div>
    <div class="input-group mb-2">
      <span class="input-group-text">Description</span>
      <input id="task_description_input_${id}" class="form-control" type="text" placeholder="e.g. Read calculus chapter 3">
    </div>
    <div class="input-group mb-2">
      <span class="input-group-text">Due Date</span>
      <input id="task_date_input_${id}" class="form-control" type="date">
      <span class="input-group-text">Project</span>
      <input id="task_project_input_${id}" class="form-control" type="text" placeholder="e.g. School">
    </div>
    <a id="edit-task-${id}-btn" class="btn btn-primary btn-sm me-1">Submit</a>
    <a id="cancel-edit-task-${id}-btn" class="btn btn-danger btn-sm">Cancel</a>
  </form>
  `;
  selected_task.after(selected_task_edit_form);

  // fill edit form with values
  document.getElementById(`task_title_input_${id}`).value = task_values.title;
  document.getElementById(`task_description_input_${id}`).value = task_values.description;
  if (task_values.dueDate !== "") {
    document.getElementById(`task_date_input_${id}`).value = format(parseISO(task_values.dueDate), "yyyy-MM-dd");
  }
  document.getElementById(`task_project_input_${id}`).value = task_values.project;

  const submit_edit_button = document.getElementById(`edit-task-${id}-btn`);
  submit_edit_button.addEventListener("click", function() {
    if (isEditFormValid(id)){
      submitEditForm(id);
      closeEditForm(id);
      updateTaskDisplay(id);
    } else {
      invalidEditForm(id);
    };
  });

  const cancel_edit_button = document.getElementById(`cancel-edit-task-${id}-btn`);
  cancel_edit_button.addEventListener("click", function() {
    closeEditForm(id);
  });
}

function closeEditForm(id) {
  const task_edit_form = document.getElementById(`edit_task_${id}_form`);
  task_edit_form.remove();
  const task_being_edited = document.getElementById(`${id}`);
  task_being_edited.classList.remove("editing");
}

function submitEditForm(id) {

  const title_input_field = document.getElementById(`task_title_input_${id}`);
  const description_input_field = document.getElementById(`task_description_input_${id}`);
  const date_input_field = document.getElementById(`task_date_input_${id}`);
  const project_input_field = document.getElementById(`task_project_input_${id}`);

  let date_value = date_input_field.value;
  if (date_value !== "") {
    date_value = parse(date_value, "yyyy-MM-dd", new Date());
  };

  editStoredTask(id, [title_input_field.value, description_input_field.value, date_value, project_input_field.value]);
}

function updateTaskDisplay(id) {
  let task_to_update = getStoredTasks().filter(task => task.id === id)[0];
  const task_title = document.querySelector(`.user_task_title_${id}`);
  const task_date = document.querySelector(`.user_task_due_date_${id}`);

  task_title.textContent = task_to_update.title;
  if (task_date !== "") {
    task_date.textContent = format(parseISO(task_to_update.dueDate), "M/dd/yyyy");
  } else {
    task_date.textContent = "";
  }
}

function isEditFormValid(id) {
  const title_input_field = document.getElementById(`task_title_input_${id}`);
  return title_input_field.value !== "";
}

function invalidEditForm(id) {
  const title_input_field = document.getElementById(`task_title_input_${id}`);
  title_input_field.classList.add("is-invalid");
  if (document.querySelectorAll(`#invalid-feedback-${id}`).length === 0) {
    title_input_field.insertAdjacentHTML("afterend", `<div id="invalid-feedback-${id}" class="invalid-feedback">Task must have a title.</div >`);
  };
}

function addEditButtonListeners() {
  document.querySelectorAll("[id$='-edit']").forEach(e => {
    e.addEventListener("click", function() {
      createEditForm(parseInt(this.id.replace("-edit", "")));
    });
  });
}

function addDeleteButtonListeners() {
  document.querySelectorAll("[id$='-delete']").forEach(e => {
    e.addEventListener("click", function () {
      deleteStoredTask(parseInt(this.id.replace("-delete", "")));
      updateHomeTasks();
    });
  });
}

function addCheckButtonListeners() {
  document.querySelectorAll("[id$='-check']").forEach(e => {
    e.addEventListener("click", function () {
      completeTask(parseInt(this.id.replace("-check", "")));
      updateHomeTasks();
    });
  });
}

function createAddTaskButton() {
  const task_container = document.getElementById("add-task-button");

  const new_task_button = createHTMLElement("div", "new_task_button", ["add_task_container", "d-flex", "align-items-center"], null);
  const add_task_plus = createHTMLElement("i", "add-task-plus", ["fas", "fa-plus-circle", "text-secondary"], null);
  const add_task_title = createHTMLElement("div", "add-task-title", ["add_task_title", "text-secondary"], "Add Task");

  new_task_button.appendChild(add_task_plus);
  new_task_button.appendChild(add_task_title);

  task_container.appendChild(new_task_button);

  new_task_button.addEventListener("click", showTaskForm);
}

function resetTaskForm() {
  const task_container = document.getElementById("add-task-button");
  task_container.innerHTML = "";
}

function showTaskForm() {
  resetTaskForm();
  createTaskForm();
  document.getElementById("end-form").scrollIntoView({ behavior: "smooth" });
}

function hideTaskForm() {
  resetTaskForm();
  createAddTaskButton();
}

function submitTaskForm() {
  if (isFormInputValid()) {
    let input = getUserInput();
    if (input[2] === "" ) {
      storeTask(createTask(input[0], input[1], input[2], input[3]));
    } else {
      storeTask(createTask(input[0], input[1], parse(input[2], "yyyy-MM-dd", new Date()), input[3]));
    }

    hideTaskForm();
    updateHomeTasks();
  } else {
    invalidFormInput();
  }
}

function updateHomeTasks(order = "none") {
  
  const task_list = document.getElementById("task_list");
  task_list.innerHTML = '';

  let all_tasks = getStoredTasks();

  if (order === "descending") {
    all_tasks = getTasksDesc();
  };
  if (order === "ascending") {
    all_tasks = getTasksAsc();
  };
  

  if (all_tasks != []) {
    all_tasks.forEach(task => {
      task_list.appendChild(createTaskDOM(task));
    });
  }

  addTaskListeners();
}

function addTaskListeners() {
  addEditButtonListeners();
  addDeleteButtonListeners();
  addCheckButtonListeners();

  sortAscButton();
  sortDescButton();

  // addHomeButton();
  // addTodayButton();
}

function createTaskDOM(task) {
  const task_element = createHTMLElement("div", `${task.id}`, ["user_task"], null);

  const left_items = createHTMLElement("div", null, ["left_items"], null);
  const check_box = createHTMLElement("i", `${task.id}-check`, ["far"], null);
  const task_title = createHTMLElement("div", null, [`user_task_title_${task.id}`], task.title);

  const right_items = createHTMLElement("div", null, ["right_items"], null);
  const due_date = createHTMLElement("div", null, [`user_task_due_date_${task.id}`], null);
  if (task.dueDate !== "") {
    due_date.textContent = format(parseISO(task.dueDate), "M/dd/yyyy");
  }
  const edit_button = createHTMLElement("i", `${task.id}-edit`, ["far", "fa-edit"], null);
  const delete_button = createHTMLElement("i", `${task.id}-delete`, ["far", "fa-trash-alt"], null);

  if (task.completed) {
    task_element.classList.add("completed");
    check_box.classList.add("fa-check-square");
  } else {
    task_element.classList.add("uncompleted")
    check_box.classList.add("fa-square");
  };

  left_items.appendChild(check_box);
  left_items.appendChild(task_title);

  right_items.appendChild(due_date);
  right_items.appendChild(edit_button);
  right_items.appendChild(delete_button);

  task_element.appendChild(left_items);
  task_element.appendChild(right_items);

  // add popup button 
  task_title.addEventListener("click", function() {
    // openTaskPopup();
    openTaskPopup(task);
  })

  return task_element;
  // returns element
}

function getTasksDesc() {
  let all_tasks = getStoredTasks().sort(function (a, b) {
    return compareDesc(parseISO(a.dueDate), parseISO(b.dueDate));
  });

  return all_tasks;
};

function getTasksAsc() {
  let all_tasks = getStoredTasks().sort(function(a,b) {
    return compareAsc(parseISO(a.dueDate), parseISO(b.dueDate));
  });

  return all_tasks;
};

function sortAscButton() {
  document.querySelector(".fa-angle-double-up").addEventListener("click", function() {
    updateHomeTasks("ascending");
  });
};

function sortDescButton() {
  document.querySelector(".fa-angle-double-down").addEventListener("click", function () {
    updateHomeTasks("descending");
  });
}

function openTaskPopup(task) {
  const centerer = createHTMLElement("div", "centerer", null, null);
  const taskPopupContainer = createHTMLElement("div", "taskPopupContainer", null, null);
  const titleContainer = createHTMLElement("div", "titleContainer", null, null);

  const title = createHTMLElement("div", "taskPopupTitle", null, task.title);
  const close_button = createHTMLElement("i", "closePopupButton", ["far", "fa-times-circle", "pt-1", "fa-lg"], null);
  const due = createHTMLElement("div", "taskPopupDueDate", null, null);
  if (task.dueDate !== "") {
    due.textContent = "Due: " + format(parseISO(task.dueDate), "M/dd/yyyy") 
  } else {
    due.textContent = "Due: N/A";
  }

  const project = createHTMLElement("div", "taskPopupProject", null, null);
  if (task.project === "uncategorized") {
    project.textContent = "Project: none";
  } else {
    project.textContent = "Project: " + task.project
  }

  const details = createHTMLElement("div", "taskPopupDetails", null, null);
  if (task.description === "") {
    details.textContent = "Details: none";
  } else {
    details.textContent = "Details: " + task.description;
  }

  titleContainer.appendChild(title);
  titleContainer.appendChild(close_button);

  taskPopupContainer.appendChild(titleContainer);
  taskPopupContainer.appendChild(due);
  taskPopupContainer.appendChild(project);
  taskPopupContainer.appendChild(details);

  centerer.appendChild(taskPopupContainer);

  const body = document.querySelector("body");
  body.append(centerer);
  body.append(createHTMLElement("div", "mask", null, null));

  close_button.addEventListener("click", function() {
    document.querySelector("#centerer").remove();
    document.querySelector("#mask").remove();
  });
}


// function addHomeButton() {
//   document.querySelector(".home_tab").addEventListener("click", function() {
//     updateHomeTasks();
//   });
// }

// function addTodayButton() {
//   document.querySelector(".today_tab").addEventListener("click", function () {
//     get
//   });
// }

function addWeekButton() {

}

function updateProjects() {

}

function addProjectButton(project_name) {

}

export { hideTaskForm, updateHomeTasks, addTaskListeners };