// repo/repository.js
import { checkLogin, getToken } from "/common/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  if (!checkLogin()) return;

  const repoList = document.getElementById("repoList");
  const sortSelect = document.getElementById("sortSelect");
  const searchInput = document.getElementById("searchInput");
  const emotionMap = {
    happy: "😊",
    neutral: "😐",
    sad: "😢",
    angry: "😠",
    tired: "😴",
    thanks: "❤️",
  };

  //  이 3가지 중 하나라도 없으면 종료
  if (!repoList || !sortSelect || !searchInput) return;

  async function renderDiaryCards() {
    const sortType = sortSelect.value;
    const search = searchInput.value.toLowerCase();
    let diaries = [];

    try {
      const response = await fetch("http://localhost:8000/diary");
      if (!response.ok) throw new Error("불러오기 실패");
      diaries = await response.json();
    } catch (err) {
      console.error("Fetch 실패:", err);
      alert("서버 연결에 실패했습니다.");
      return;
    }
    //시간 갱신 ->감정 그래프 용
    diaries.sort((a, b) =>
      sortType === "new"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

    const filtered = diaries.filter(
      (diary) =>
        diary.title.toLowerCase().includes(search) ||
        diary.content.toLowerCase().includes(search)
    );

    //초기화
    repoList.innerHTML = "";
    //길이가 0이면
    if (filtered.length === 0) {
      repoList.innerHTML =
        '<p style="padding:20px;">저장된 일기가 없습니다.</p>';
      return;
    }
    //일기 카드 생성
    filtered.forEach((diary) => {
      const card = document.createElement("div");
      card.className = "repo-card";
      console.log("일기 목록:", diaries);
      card.innerHTML = `
        <div class="repo-header">
          <span class="repo-date">${diary.date}</span>
          <span class="repo-emotion">${emotionMap[diary.emotion] || diary.emotion}</span>
          <button class="delete-btn" data-id="${diary.id}">🗑</button>
        </div>
        <h3 class="repo-title">${diary.title}</h3>
        <p class="repo-preview">
        ${diary.content.slice(0, 10).replace(/\n/g, " ")}
        ...</p>
      `;
      //카드 삭제
      card.querySelector(".delete-btn").onclick = async (e) => {
        e.stopPropagation();
        if (!confirm("정말 삭제하시겠습니까?")) return;
        //삭제 요청 -> id보내서 삭제
        try {
          const res = await fetch(`http://localhost:8000/diary/${diary.id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${getToken()}`,
            }
          });
          //삭제가 안되었을 시 에러
          if (!res.ok) throw new Error("삭제 실패");
          //삭제 성공
          alert("삭제되었습니다!");
          renderDiaryCards();
          //삭제 중 오류
        } catch (err) {
          console.error(err);
          alert("삭제 중 오류 발생");
        }
      };
      //카드 클릭 시 상세 페이지로 이동
      card.onclick = () => {
        location.href = `/detail/detail.html?id=${diary.id}`;
      };
      //card에 새 카드 추가
      repoList.appendChild(card);
    });
  }
  //이벤트 리스너
  sortSelect.addEventListener("change", renderDiaryCards);
  searchInput.addEventListener("input", renderDiaryCards);
  renderDiaryCards();
});
