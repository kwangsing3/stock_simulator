/**
 * 統一變成西元年
 * @param input 例如: "111/2/29"
 * @returns "2022/2/29"
 */
export function NormalizeYear(input = '') {
  if ((input.match(/\//g) || []).length < 2) return '';
  const ls = input.split('/');
  let N = 0;
  try {
    N = parseInt(ls[0]);
  } catch (error) {
    return '';
  }
  return ls[0].length === 4
    ? input
    : (N + 1911).toString() + '/' + ls[1] + '/' + ls[2];
}

export function GetCurrentDate() {
  const cur = new Date();
  const year = cur.getFullYear();
  const Month =
    cur.getMonth() + 1 < 10
      ? `0${cur.getMonth() + 1}`
      : (cur.getMonth() + 1).toString();
  const date =
    cur.getDate() + 1 < 10 ? `0${cur.getDate()}` : cur.getDate().toString();
  return year + Month + date;
}

export function GetCurrentTime() {
  const cur = new Date();
  const year = cur.getFullYear();
  const Month =
    cur.getMonth() + 1 < 10
      ? `0${cur.getMonth() + 1}`
      : (cur.getMonth() + 1).toString();
  const date =
    cur.getDate() + 1 < 10 ? `0${cur.getDate()}` : cur.getDate().toString();

  const hour = cur.getHours();
  const minute = cur.getMinutes();
  const second = cur.getSeconds();
  return `${year}/${Month}/${date} - ${hour}:${minute}:${second}`;
}

/**
 * 計算時間陣列
 * @param sYear  從幾年開始  例:'2010'。
 * @param sMonth 從幾月開始  例:'01'。
 * @returns string[]  [ "20100101","20100201".... ]
 */
export function GetTimeStemp(sYear, sMonth) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  let result = [];
  let tmpYear = parseInt(sYear);
  let tmpMonth = parseInt(sMonth);
  while (tmpYear < year + 1) {
    while (tmpMonth < 13) {
      const mon = tmpMonth > 9 ? `${tmpMonth}` : `0${tmpMonth}`;
      result.push(tmpYear.toString() + mon + '01');
      tmpMonth++;
      if (tmpYear === year && tmpMonth > month) {
        tmpYear = 9999;
        tmpMonth = 9999;
      }
    }
    tmpMonth = 1;
    tmpYear++;
  }
  result = result.reverse();
  return result;
}