import { checkLogin, getToken } from "/common/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  if (!checkLogin()) return;

  const token = getToken();

  const params = new URLSearchParams(window.location.search);
  const diaryId = params.get("id");

  if (!diaryId) {
    alert("잘못된 접근입니다.");
    location.href = "/repo/repository.html";
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/diary/${diaryId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('서버 오류');

    const data = await response.json();

    document.getElementById("detailTitle").textContent = data.title;
    document.getElementById("detailDate").textContent = data.date;
    document.getElementById("detailEmotion").textContent = data.emotion;
    document.getElementById("detailContent").textContent = data.content;
  } catch (err) {
    console.log('일기 불러오기 실패');
    alert("일기 불러오기 중 문제가 발생했습니다.")
    location.href = "/repo/repository.html";
  }
  console.log(data);
});

