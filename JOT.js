document.addEventListener("DOMContentLoaded", () => {
  //  write.html 전용 처리
  const dateInput = document.getElementById("date");
  const saveBtn = document.querySelector(".save-btn");
  // repository.html 전용 처리
  const repoList = document.getElementById("repoList");
  const sortSelect = document.getElementById("sortSelect");
  const searchInput = document.getElementById("searchInput");
  
  if (dateInput && saveBtn) {
    console.log(" write.html 감지됨");
    dateInput.valueAsDate = new Date();

    saveBtn.addEventListener("click", () => {
      const title = document.querySelector(".title-input").value.trim();
      const date = dateInput.value;
      const content = document.querySelector(".content").value.trim();
      const emotion = document.querySelector(".emotion").value;
    
      if (!content) {
        alert("일기 내용을 입력해주세요!");
        return;
      }
    
      let diaries = JSON.parse(localStorage.getItem("diaries") || "[]");
    
      // 같은 날짜의 일기 제거
      diaries = diaries.filter(d => d.date !== date);
    
      const newDiary = {
        id: Date.now(),
        title: title || "무제",
        date,
        emotion,
        content,
      };
    
      diaries.unshift(newDiary);
      localStorage.setItem("diaries", JSON.stringify(diaries));
      alert("일기가 저장되었습니다!");
      location.href = "./repository.html";
    });    
  }

  if (repoList && sortSelect && searchInput) {
    console.log(" repository.html 감지됨");

    function renderDiaryCards() {
      const diaries = JSON.parse(localStorage.getItem("diaries") || "[]");
      const sortType = sortSelect.value;

      diaries.sort((a, b) => {
        return sortType === "new" ? b.id - a.id : a.id - b.id;
      });

      const search = searchInput.value.toLowerCase();
      const filtered = diaries.filter(
        (diary) =>
          diary.title.toLowerCase().includes(search) ||
          diary.content.toLowerCase().includes(search)
      );

      repoList.innerHTML = "";

      if (filtered.length === 0) {
        repoList.innerHTML =
          '<p style="padding:20px;">저장된 일기가 없습니다.</p>';
        return;
      }

      filtered.forEach((diary) => {
        const card = document.createElement("div");
        card.className = "repo-card";
        card.innerHTML = `
          <div class="repo-header">
            <span class="repo-date">${diary.date}</span>
            <span class="repo-emotion">${diary.emotion}</span>
            <button class="delete-btn" data-id="${diary.id}">🗑</button>
          </div>
          <h3 class="repo-title">${diary.title}</h3>
          <p class="repo-preview">${diary.content.slice(0, 10)}...</p>
        `;
      
        // 삭제 버튼 기능
        card.querySelector(".delete-btn").onclick = (e) => {
          e.stopPropagation(); // 카드 클릭 막기
          const diaries = JSON.parse(localStorage.getItem("diaries") || "[]");
          const updated = diaries.filter(d => d.id !== diary.id);
          localStorage.setItem("diaries", JSON.stringify(updated));
          renderDiaryCards(); // 다시 렌더링
        };
      
        // 상세 보기 연결
        card.onclick = () => {
          location.href = `./detail.html?id=${diary.id}`;
        };
      
        repoList.appendChild(card);
      });
      
    }

    sortSelect.addEventListener("change", renderDiaryCards);
    searchInput.addEventListener("input", renderDiaryCards);
    renderDiaryCards();
  }
});
