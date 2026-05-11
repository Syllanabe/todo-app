const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const taskCounter = document.getElementById("taskCounter");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("themeToggle");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function createTodo(text) {
  return {
    id: Date.now(),
    text: text,
    completed: false
  };
}

function addTodo(text) {
  const newTodo = createTodo(text);
  todos.push(newTodo);
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map(function(todo) {
    if (todo.id === id) {
      return {
        ...todo,
        completed: !todo.completed
      };
    }

    return todo;
  });

  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(function(todo) {
    return todo.id !== id;
  });

  saveTodos();
  renderTodos();
}

function clearCompletedTodos() {
  todos = todos.filter(function(todo) {
    return !todo.completed;
  });

  saveTodos();
  renderTodos();
}

function getFilteredTodos() {
  if (currentFilter === "active") {
    return todos.filter(function(todo) {
      return !todo.completed;
    });
  }

  if (currentFilter === "completed") {
    return todos.filter(function(todo) {
      return todo.completed;
    });
  }

  return todos;
}

function updateCounter() {
  const activeTasks = todos.filter(function(todo) {
    return !todo.completed;
  }).length;

  taskCounter.textContent =
    activeTasks <= 1 ? `${activeTasks} tâche restante` : `${activeTasks} tâches restantes`;
}

function renderTodos() {
  todoList.innerHTML = "";

  const filteredTodos = getFilteredTodos();

  if (filteredTodos.length === 0) {
    todoList.innerHTML = `<li class="empty-message">Aucune tâche à afficher.</li>`;
    updateCounter();
    return;
  }

  filteredTodos.forEach(function(todo) {
    const li = document.createElement("li");
    li.className = "todo-item";

    li.innerHTML = `
      <div class="todo-content">
        <input type="checkbox" ${todo.completed ? "checked" : ""} />
        <span class="todo-text ${todo.completed ? "completed" : ""}">
          ${todo.text}
        </span>
      </div>
      <button class="delete-btn">Supprimer</button>
    `;

    const checkbox = li.querySelector("input");
    const deleteButton = li.querySelector(".delete-btn");

    checkbox.addEventListener("change", function() {
      toggleTodo(todo.id);
    });

    deleteButton.addEventListener("click", function() {
      deleteTodo(todo.id);
    });

    todoList.appendChild(li);
  });

  updateCounter();
}

todoForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const text = todoInput.value.trim();

  if (text === "") {
    alert("Veuillez saisir une tâche.");
    return;
  }

  addTodo(text);
  todoInput.value = "";
});

filterButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    filterButtons.forEach(function(btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTodos();
  });
});

clearCompletedBtn.addEventListener("click", clearCompletedTodos);

themeToggle.addEventListener("click", function() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "Mode clair";
  } else {
    themeToggle.textContent = "Mode sombre";
  }
});

renderTodos();