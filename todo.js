document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("todo-input");
  const addBtn = document.getElementById("add-btn");
  const list = document.getElementById("todo-list");

  // 저장된 ToDo 불러오기
  const todos = JSON.parse(localStorage.getItem("todos") || "[]");
  todos.forEach(renderTodo);

  function renderTodo(text, done = false) {
    const li = document.createElement("li");
  
    li.className = done ? "done" : "";
  
    li.innerHTML = `
      <button class="check-btn"></button>
      <span>${text}</span>
      <button class="delete-btn">✕</button>
    `;
  
    list.appendChild(li);
  
    li.querySelector(".check-btn").onclick = () => {
      li.classList.toggle("done");
      saveTodos();
    };
  
    li.querySelector(".delete-btn").onclick = () => {
      li.remove();
      saveTodos();
    };
  }
  const todoItems = document.querySelectorAll(".todo-item");
  const slots = document.querySelectorAll(".timeline-slot");

  todoItems.forEach(item => {
    item.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", e.target.innerText);
    });
  });

  slots.forEach(slot => {
    slot.addEventListener("dragover", e => {
      e.preventDefault();
      slot.classList.add("drag-over");
    });

    slot.addEventListener("dragleave", () => {
      slot.classList.remove("drag-over");
    });

    slot.addEventListener("drop", e => {
      e.preventDefault();
      const task = e.dataTransfer.getData("text/plain");
      slot.textContent = slot.getAttribute("data-time") + " - " + task;
      slot.classList.remove("drag-over");
    });
  });

  function saveTodos() {
    const items = [...list.querySelectorAll("li")].map(li => ({
      text: li.querySelector("span").innerText,
      done: li.querySelector("span").classList.contains("done")
    }));
    localStorage.setItem("todos", JSON.stringify(items));
  }

  addBtn.onclick = () => {
    const text = input.value.trim();
    if (!text) return;
    renderTodo(text);
    input.value = "";
    saveTodos();
  };
});
