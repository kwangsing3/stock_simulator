import dailyFunc from './step/daily.func.js';
import { ConnectToDB, CloseConnect } from './utility/dbhandler.mod.js'
import bank from './data/bank.js'
import storage from './data/storage.js';

const startDate = new Date("2023-01-01");
const endDate = new Date("2023-12-31");
(async () => {
    console.log("-- 開啟資料庫連線")
    await ConnectToDB("127.0.0.1", "root", "manager1");
    const cur_Date = startDate;
    while (cur_Date <= endDate) {
        await dailyFunc(cur_Date); //每日判定
        cur_Date.setDate(cur_Date.getDate() + 1);
    }


})().catch((err) => {
    console.error(err)
}).finally(async () => {
    await CloseConnect();
    console.log("-- 關閉資料庫連線")
    console.log("模擬結束:")
    console.log(`
        交割戶現況:
        ${JSON.stringify(bank)}
        庫存現況:
        ${JSON.stringify(storage)}
    `)
})