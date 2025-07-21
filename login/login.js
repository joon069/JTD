const form = document.querySelector('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try{
      const response = await fetch ("http://127.0.0.1:8000/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });
      if (!response.ok) {
        alert('로그인 실패, 아이디 또는 비밀번호를 확인 하세요' );
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      alert('로그인 성공');
      window.location.href = "/Home/Home.html";
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      alert('로그인 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
    }

  });