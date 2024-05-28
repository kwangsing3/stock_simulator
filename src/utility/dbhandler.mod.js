import * as mariadb from 'mariadb';

let pool = undefined;

/**
 * 連接至SQL資料庫
 * @param host
 * @param user
 * @param password
 * @param db
 */
export function ConnectToDB(
  host = '',
  user = '',
  password = '',
  db = ''
) {
  try {
    pool = mariadb.createPool({
      host: host,
      user: user,
      password: password,
      connectionLimit: 5,
      database: db,
      connectTimeout: 1000 * 10,
    });
  } catch (error) {
    console.log(`無法使用DBhandler服務:${error}`);
  }
  console.log("---連結DB資料庫")
}

/**
 * 向資料庫拉取語法要求的資料
 * @param query SQL命令
 * @returns 資料內容
 */
export async function GetContent(query = '') {
  const conn = await pool.getConnection();
  if (conn) {
    conn.end();
  } else {
    throw new Error('DataBase 連接錯誤');
  }
  const data = await conn.query(query);
  return data;
}

/**
 * 關閉與資料庫的連線
 */
export async function CloseConnect() {
  await pool.end().catch((err) => {
    throw err;
  });
}

/**
 * 需要在input.type內指定PRIMARY KEY
 * @param input
 * @param tableName
 * @param database
 */
export async function CreateTable(
  input,
  database = '',
  tableName = ''
) {
  let volume = '';
  for (let index = 0; index < input.length; index++) {
    volume += ` ${input[index].name} ${input[index].type}${index === input.length - 1 ? '' : ','
      }
    `;
  }
  const query = `
  CREATE TABLE IF NOT EXISTS ${database}.${tableName} 
  (
    ${volume}
  ) CHARACTER SET utf8 COLLATE utf8_general_ci;
  `;
  await GetContent(query);
  console.log("Create Table " + tableName)
}
/**
 * 如果沒有則插入，依照主key為索引更新資料表。  如果結構與表不同(無論增減)，則報錯。
 * @param content
 * @param tableName
 * @param database
 */
export async function Upsert(
  content,
  database = '',
  tableName = ''
) {
  const keylist = Object.keys(content);
  const valuelist = Object.values(content);
  let strkey = '';
  let value = '';
  for (let index = 0; index < valuelist.length; index++) {
    const ele = valuelist[index];
    value += typeof ele === 'string' ? `"${ele}"` : `${ele}`;
    strkey += keylist[index];
    if (index !== valuelist.length - 1) {
      value += ',\n';
      strkey += ',\n';
    }
  }
  let update = '';
  for (let index = 0; index < keylist.length; index++) {
    const ele = valuelist[index];
    update += `${keylist[index]}=${typeof ele === 'string' ? '"' + ele + '"' : ele
      }`;
    if (index !== keylist.length - 1) update += ',\n';
  }
  //
  const query = `
  INSERT INTO ${database}.${tableName} 
    (${strkey})
    VALUES(
      ${value}
    ) ON DUPLICATE KEY UPDATE 
      ${update}
    ;`;
  await GetContent(query);
}

export async function Insert(
  content,
  database = '',
  tableName = '',
) {
  const keylist = Object.keys(content);
  let value = '';
  for (let index = 0; index < keylist.length; index++) {
    const ele = content[keylist[index]];
    value += typeof ele === 'string' ? `"${ele}"` : `${ele}`;
    if (index !== keylist.length - 1) value += ',\n';
  }
  const query = `
  INSERT INTO ${database}.${tableName}
    (${keylist.toString()})
    VALUES(
      ${value}
    )
    ;`;
  await GetContent(query);
}

/**
 * 如果沒有則插入，依照主key為索引更新資料表。  如果結構與表不同(無論增減)，則修改表單結構。
 * 全大寫的key為PRIMRARY KEY。
 * @param content
 * @param tableName
 * @param database
 */
export async function ForceUpsert(
  content,
  database = '',
  tableName = ''
) {
  const keylist = Object.keys(content);
  let hasKey = false; //有沒有指定主鍵
  for (const key of keylist) {
    if (key.toUpperCase() === key) {
      hasKey = true;
    }
  }
  try {
    await Upsert(content, database, tableName);
  } catch (error) {
    if (hasKey) {
      //Force Create Table
      for (let index = 0; index < keylist.length; index++) {
        await GetContent(
          `ALTER TABLE ${database}.${tableName} ADD COLUMN IF NOT EXISTS ${keylist[index]} LONGTEXT;`
        );
      }
      console.log(`Force Alter Table ${database}.${tableName} `);
      await Upsert(content, database, tableName);
    } else {
      throw error;
    }
  }
}
