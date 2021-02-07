
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

function showTaskForm() {
  const add_task_button = document.getElementById("add-task-button");

  add_task_button.innerHTML = `
    <form id="task-form" class="p-4">
      <div class="input-group mb-2">
        <span class="input-group-text">Title</span>
        <input type="text" class="form-control" id="task_title_input" placeholder="e.g. Homework">
      </div>
      <div class="input-group mb-2">
        <span class="input-group-text">Description</span>
        <input type="text" class="form-control" id="task_description_input" placeholder="e.g. Read calculus chapter 3">
      </div>
      <div class="input-group mb-2">
        <span class="input-group-text">Due Date</span>
        <input type="date" class="form-control" id="task_date_input">
          <span class="input-group-text">Project</span>
        <input type="text" class="form-control" id="task_project_input" placeholder="e.g. School">
      </div>
      <a id="submit-btn" onclick="submitTaskForm()" class="btn btn-primary btn-sm">Submit</a>
      <a id="cancel-btn" onclick="hideTaskForm()" class="btn btn-danger btn-sm">Cancel</a>
    </form>
    <div id="end-form"></div>
  `;


  document.getElementById("end-form").scrollIntoView({ behavior: "smooth" });

}

function hideTaskForm() {
  const add_task_button = document.getElementById("add-task-button");

  add_task_button.innerHTML = `
    <div id="new_task_button" class="add_task_container d-flex align-items-center" onclick="showTaskForm()">
      <i id="add-task-plus" class="fas fa-plus-circle text-secondary"></i>
      <div id="add-task-title" class="add_task_title text-secondary">Add Task</div>
    </div>
  `;
}

function submitTaskForm() {
  if (isFormInputValid()) {
    console.table(getUserInput());
    hideTaskForm();
  } else {
    invalidFormInput();
  }
}