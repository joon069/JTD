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

  // 현재 날짜 기준 이번 주의 시작(월요일)과 끝(일요일) 계산
  const today = new Date();
  const currentDay = today.getDay(); // 0(일) ~ 6(토)
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((currentDay + 6) % 7)); // 이번 주 월요일
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  diaries.forEach(diary => {
    const date = new Date(diary.date);
    if (date >= monday && date <= sunday) {
      const day = date.getDay(); // 0: 일 ~ 6: 토
      const weekdayIndex = (day + 6) % 7; // 월=0, 일=6

      const emoji = diary.emotion?.trim().slice(0, 2);
      const score = emotionScoreMap[emoji];

      if (score !== undefined) {
        weekScores[weekdayIndex] = score;
      }
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
      responsive: false,
      maintainAspectRatio: false,
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
