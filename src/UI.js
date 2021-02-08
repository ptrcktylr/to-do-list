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
  // <a id="submit-btn" onclick="submitTaskForm()" class="btn btn-primary btn-sm">Submit</a>
  // <a id="cancel-btn" onclick="hideTaskForm()" class="btn btn-danger btn-sm">Cancel</a>
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
    console.table(getUserInput());
    hideTaskForm();
  } else {
    invalidFormInput();
  }
}

export { hideTaskForm };