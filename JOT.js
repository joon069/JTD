import { checkLogin } from "../common/auth.js";  
checkLogin();

document.addEventListener("DOMContentLoaded", () => {
  if (!checkLogin()) return;

  const token = getToken();
  renderNavMenu(token);

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
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              title: title || "무제",
              date,
              emotion,
              content,
              user_id: 1, // 테스트용: 나중엔 로그인한 사용자 ID로 교체해야 함
            }),
          });

          if (!response.ok) {
            throw new Error("서버 오류");
          }

          alert("일기가 저장되었습니다!");
          location.href = "./repo/repository.html"; // 저장 후 저장소로 이동
        } catch (err) {
          console.error("저장 실패:", err);
          alert("일기 저장에 실패했습니다.");
        }
      });
    }

    if (repoList && sortSelect && searchInput) {
      console.log(" repository.html 감지됨");

      async function renderDiaryCards() {
        // 1. 서버에서 diaries 불러오기
        const sortType = sortSelect.value;
        const search = searchInput.value.toLowerCase();
        let diaries = [];

        try {
          const response = await fetch("http://localhost:8000/diary");
          if (response.ok) {
            diaries = await response.json();
          } else {
            alert("서버에서 데이터를 불러오지 못했습니다.");
            return;
          }
        } catch (err) {
          console.error("Fetch 실패:", err);
          alert("서버 연결에 실패했습니다.");
          return;
        }

        // 2. 정렬
        diaries.sort((a, b) => {
          return sortType === "new"
            ? new Date(b.date) - new Date(a.date)
            : new Date(a.date) - new Date(b.date);
        });

        // 3. 검색 필터
        const filtered = diaries.filter(
          (diary) =>
            diary.title.toLowerCase().includes(search) ||
            diary.content.toLowerCase().includes(search)
        );

        // 4. 렌더링
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
          card.querySelector(".delete-btn").onclick = async (e) => {
            e.stopPropagation(); // 카드 클릭 방지

            const confirmDelete = confirm("정말 삭제하시겠습니까?");
            if (!confirmDelete) return;

            try {
              const res = await fetch(`http://localhost:8000/diary/${diary.id}`, {
                method: "DELETE",
              });

              if (!res.ok) throw new Error("삭제 실패");

              alert("삭제되었습니다!");
              renderDiaryCards(); // 목록 다시 렌더링
            } catch (err) {
              console.error(err);
              alert("삭제 중 오류 발생");
            }
          };

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
