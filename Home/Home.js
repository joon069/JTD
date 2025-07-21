import { checkLogin, getToken } from "/common/auth.js";
checkLogin();

document.addEventListener("DOMContentLoaded", () => {
  if (!checkLogin()) return;

  const token = getToken();
  renderNavMenu(token);
});

function renderNavMenu(token) {
  const navMenu = document.querySelector(".navbar ul");
  navMenu.innerHTML = "";

  if (token) {
    navMenu.innerHTML = `
      <li><a href="/Home/Home.html">홈</a></li>
      <li><a href="/write/write.html">일기쓰기</a></li>
      <li><a href="/repo/repository.html">일기저장소</a></li>
      <li><a href="/graph/graph.html">감정그래프</a></li>
      <li><a href="/todo/todo.html">Todo리스트</a></li>
      <li><span>joon0</span></li>
      <li><button id="logout-btn">로그아웃</button></li>
    `;

    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("token");  // 키 이름 통일
      alert("로그아웃 되었습니다.");
      window.location.href = "/login/LoginPage.html";
    });
  } else {
    navMenu.innerHTML = `
      <li><a href="./Home.html">홈</a></li>
      <li><button onclick="window.location.href='login.html'">로그인</button></li>
      <li><button onclick="window.location.href='signup.html'">회원가입</button></li>
    `;
  }
}
