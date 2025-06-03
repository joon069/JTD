document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  const diaries = JSON.parse(localStorage.getItem("diaries") || "[]");
  const diary = diaries.find(d => d.id.toString() === id);

  if (!diary) {
    document.body.innerHTML = "<p style='padding:100px; text-align:center;'>일기를 찾을 수 없습니다.</p>";
  } else {
    document.getElementById("detailTitle").textContent = diary.title;
    document.getElementById("detailDate").textContent = diary.date;
    document.getElementById("detailEmotion").textContent = diary.emotion;
    document.getElementById("detailContent").textContent = diary.content;
  }
});
