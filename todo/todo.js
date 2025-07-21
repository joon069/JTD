const CreateTodoList = async () => {
  try {
    const response = await fetch("http://0.0.0.0:8000/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task: "밥먹기",
        is_done: false,
      }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
const getTodoList = async () => {
  try {
    const response = await fetch("http://0.0.0.0:8000/todo", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
  const data = await respense.json();
  console.log(data);
  return data;
  } catch (error) {
    console.log(error);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("todo-input");
  const addBtn = document.getElementById("add-btn");
  const list = document.getElementById("todo-list");
  const slots = document.querySelectorAll(".timeline-slot");

  // 📌 저장된 ToDo 불러오기
  const todos = JSON.parse(localStorage.getItem("todos") || "[]");
  todos.forEach(({ text, done }) => renderTodo(text, done));
  // 📌 할 일 렌더링 함수
  function renderTodo(text, done = false) {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.draggable = true;

    li.innerHTML = `
      <button class="check-btn">${done ? "✔" : ""}</button>
      <span class="${done ? "done" : ""}">${text}</span>
      <button class="delete-btn">✕</button>
    `;

    // 드래그 설정
    li.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", text);
    });

    // 완료 체크
    li.querySelector(".check-btn").onclick = () => {
      const span = li.querySelector("span");
      span.classList.toggle("done");
      li.querySelector(".check-btn").textContent = span.classList.contains(
        "done"
      )
        ? "✔"
        : "";
      saveTodos();
    };

    // 삭제
    li.querySelector(".delete-btn").onclick = () => {
      li.remove();
      saveTodos();
    };

    list.appendChild(li);
    saveTodos();
  }

  // 📌 추가 버튼 클릭 시
  addBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (text) {
      renderTodo(text);
      input.value = "";
    }
  });

  // 📌 Enter 키로도 추가
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addBtn.click();
  });

  // 📌 로컬스토리지 저장 함수
  function saveTodos() {
    const items = [...document.querySelectorAll("#todo-list li")].map((li) => ({
      text: li.querySelector("span").innerText,
      done: li.querySelector("span").classList.contains("done"),
    }));
    localStorage.setItem("todos", JSON.stringify(items));
  }

  // 📌 타임라인 드롭 관련 이벤트
  slots.forEach((slot) => {
    const time = slot.getAttribute("data-time");

    slot.addEventListener("dragover", (e) => {
      e.preventDefault();
      slot.classList.add("drag-over");
    });

    slot.addEventListener("dragleave", () => {
      slot.classList.remove("drag-over");
    });

    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      slot.classList.remove("drag-over");

      const task = e.dataTransfer.getData("text/plain");
      if (!task) return;

      insertTaskIntoSlot(slot, time, task);

      // 저장
      const schedule = JSON.parse(localStorage.getItem("schedule") || "{}");
      schedule[time] = task;
      localStorage.setItem("schedule", JSON.stringify(schedule));
    });
  });

  // 📌 타임라인 슬롯에 할 일 삽입
  function insertTaskIntoSlot(slot, time, task) {
    slot.innerHTML = `
      <div class="slot-task" draggable="true">
        <span class="slot-time">${time}</span> - <span class="slot-text">${task}</span>
        <button class="remove-btn">×</button>
      </div>
    `;

    const taskDiv = slot.querySelector(".slot-task");

    // 드래그 재설정
    taskDiv.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", task);
    });

    // 삭제 버튼
    slot.querySelector(".remove-btn").addEventListener("click", () => {
      slot.textContent = time;
      const schedule = JSON.parse(localStorage.getItem("schedule") || "{}");
      delete schedule[time];
      localStorage.setItem("schedule", JSON.stringify(schedule));
    });
  }

  // 📌 타임라인 저장된 스케줄 복원
  const savedSchedule = JSON.parse(localStorage.getItem("schedule") || "{}");

  Object.entries(savedSchedule).forEach(([time, task]) => {
    const slot = document.querySelector(`.timeline-slot[data-time="${time}"]`);
    if (slot) {
      insertTaskIntoSlot(slot, time, task);
    }
  });

  // 📌 타임라인에서 다시 ToDo로 드래그 시
  list.addEventListener("dragover", (e) => e.preventDefault());

  list.addEventListener("drop", (e) => {
    e.preventDefault();
    const task = e.dataTransfer.getData("text/plain");
    if (!task) return;

    renderTodo(task);

    // 타임라인에서 삭제
    const schedule = JSON.parse(localStorage.getItem("schedule") || "{}");
    for (let key in schedule) {
      if (schedule[key] === task) {
        const slot = document.querySelector(
          `.timeline-slot[data-time="${key}"]`
        );
        if (slot) slot.textContent = key;
        delete schedule[key];
      }
    }
    localStorage.setItem("schedule", JSON.stringify(schedule));
  });
});
