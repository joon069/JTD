// write/write.js
import { checkLogin, getToken } from "/common/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  if (!checkLogin()) return;

  const dateInput = document.getElementById("date");
  const saveBtn = document.querySelector(".save-btn");
  if (!dateInput || !saveBtn) return;

  dateInput.valueAsDate = new Date();

  saveBtn.addEventListener("click", async () => {
    const title = document.querySelector(".title-input").value.trim();
    const date = dateInput.value;
    const content = document.querySelector(".content").value.trim();
    const emotion = document.querySelector(".emotion").value;

    if (!content) {
      alert("일기 내용을 입력해주세요!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/diary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          title: title || "무제",
          date,
          emotion,
          content,
        }),
      });

      if (!response.ok) throw new Error("서버 오류");

      alert("일기가 저장되었습니다!");
      location.href = "/repo/repository.html"; // 저장 후 저장소로 이동
    } catch (err) {
      console.error("저장 실패:", err);
      alert("일기 저장에 실패했습니다.");
    }
  });
});
