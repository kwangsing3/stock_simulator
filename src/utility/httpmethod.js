import axios from 'axios';

/**
 * GET method
 * @param url request path
 * @returns 取得伺服器回應
 */
export async function GET(
  url,
  header = {},
  timeout = 15000
) {
  const config = {
    method: 'get',
    url: url,
    headers: header === undefined ? {} : header,
    timeout: timeout === undefined ? 15000 : timeout,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  };
  let data;
  try {
    const wait = GetRateLimit();
    if (wait !== 0) {
      await Sleep(wait);
    }
    data = await axios(config);
    cache = new Date();
  } catch (error) {
    console.log(error);
    throw error;
  }
  return data;
}
/**
 * POST method
 * @param url request path
 * @param content request body
 * @returns 取決於伺服器實作，可能不會出現回傳。
 */
export async function POST(
  url,
  content,
  header,
  timeout
) {
  const config = {
    method: 'post',
    url: url,
    data: content,
    headers: header === undefined ? {} : header,
    timeout: timeout === undefined ? 15000 : timeout,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  };
  let data;
  try {
    if (waitRateMS !== 0) {
      await Sleep(GetRateLimit());
    }
    data = await axios(config);
    cache = new Date();
  } catch (error) {
    console.log(error);
    throw error;
  }
  return data;
}
/**
 * 暫停執行緒 (毫秒)
 * @param {*} ms 
 * @returns 
 */
export function Sleep(ms = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

/*
  製作目標:
      依照速率阻塞線程。
*/
let waitRateMS = 0;
let cache = new Date();

// 一分鐘可接受次數
export const SetRatePerMin = (ms = 0) => {
  waitRateMS = 60000 / ms;
};

export const GetRateLimit = () => {
  const minus = new Date().getMilliseconds() - cache.getMilliseconds();

  return minus <= 0 ? 0 : waitRateMS - minus;
};
