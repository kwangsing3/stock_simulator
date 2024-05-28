import { GetContent } from '../utility/dbhandler.mod.js'

/** 
 * @param {Date} cur
 * 
 */
export default async (cur) => {
    //獲取下一個月的除權息紀錄決定是否要參加除息)
    cur.setMonth(cur.getMonth() + 1);
    const nMD = cur;
    const YEAR = nMD.getFullYear() - 1911;
    const MONTH = (nMD.getMonth() + 1) < 10 ? "0" + (nMD.getMonth() + 1) : (nMD.getMonth() + 1);
    const DATE = (nMD.getDate()) < 10 ? "0" + (nMD.getDate() + 2) : (nMD.getDate());
    const Yrecord = await GetContent(`SELECT * FROM stock_agent_history.yields WHERE 除權息日期 like "${YEAR}年${MONTH > 12 ? 1 : MONTH}月%";`);
    //獲取當前股價
    for (const key of Yrecord) {
        const curP = await GetContent(`
        SELECT * FROM stock_agent_history.records WHERE 證券代號="${key.股票代號}" 
        AND 
        日期 = "${YEAR}年${MONTH}月${DATE}日";`);
        console.log();
    }
    //計算是否參加、而且要計算是否已經買過


    //檢查目前庫存是否有可以賣出的項目
    console.log();
}