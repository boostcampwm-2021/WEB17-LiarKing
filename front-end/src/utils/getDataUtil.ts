/**
 * userData를 요청하고 유저 상태를 변경한다.
 * 데이터가 없을 경우 메인페이지로 이동한다.
 * data: {user_id: string, point: number, rank: string}
 * @param setState user 상태를 변경하는 함수.
 */
const getUserData = async (setState: (...value: any) => any) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = await fetch('/api/users/data', options);
  const userData = await res.json();

  if (!userData.user_id) window.location.href = '/';

  setState(userData);
};

export { getUserData };
