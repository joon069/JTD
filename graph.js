document.addEventListener('DOMContentLoaded', () => {
  const emotionScoreMap = {
    "😊": 8,
    "❤️": 6,
    "😴": 4,
    "😐": 2,
    "😢": 0,
    "😠": -2
  };

  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const weekScores = Array(7).fill(null);
  const diaries = JSON.parse(localStorage.getItem("diaries") || "[]");

  diaries.forEach(diary => {
    const date = new Date(diary.date);
    const day = date.getDay(); // 0: 일 ~ 6: 토
    const weekdayIndex = (day + 6) % 7; // 월=0, 일=6
  
    const emoji = diary.emotion?.trim().slice(0, 2); // ✅ 이모지만 추출
    const score = emotionScoreMap[emoji];
  
    if (score !== undefined) {
      weekScores[weekdayIndex] = score;
    }
  });
  

  const ctx = document.getElementById("emotionChart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: days,
      datasets: [{
        label: "감정 점수",
        data: weekScores,
        borderColor: "#E94F24",
        backgroundColor: "#fcd5c5",
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: "#292927"
      }]
    },
    options: {
      responsive: false,               // ✅ 반응형 꺼서 고정 크기 사용
      maintainAspectRatio: false,     // ✅ 비율 유지 해제
      scales: {
        y: {
          min: -3,
          max: 10,
          grid: { color: "#eee" },
          ticks: { stepSize: 1 }
        }
      },
      plugins: {
        annotation: {
          annotations: {
            zeroLine: {
              type: 'line',
              yMin: 0,
              yMax: 0,
              borderColor: '#999',
              borderWidth: 2,
              borderDash: [6, 4],
              label: {
                enabled: true,
                position: 'start',
                backgroundColor: '#999',
                color: '#fff',
                font: {
                  size: 12,
                  weight: 'bold'
                }
              }
            }
          }
        }
      }
    }
  });
});