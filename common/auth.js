export function getToken() {
  return localStorage.getItem("token");
}

export function checkLogin() {
  const token = getToken();
  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "/login/LoginPage.html";
    return false;
  }
  return true;
}