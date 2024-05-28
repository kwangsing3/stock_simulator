/* eslint-disable node/no-unsupported-features/node-builtins */
import * as fs from 'node:fs/promises';
import {readdir, stat} from 'node:fs/promises';
import {join} from 'path';
import {dirname} from 'path';

/** 寫入檔案，並自動檢查是否有相應的資料夾位置
 * @param path 檔案位置
 * @param content 檔案內容
 * @returns true-成功  false-失敗
 */
export async function WriteFile(targetPath = '', content) {
  const parentPath = dirname(targetPath);
  await MKDir(parentPath);
  targetPath = join(targetPath);
  await fs.writeFile(targetPath, JSON.stringify(content), 'utf-8');
}
/**
 * 依照JSON的格式寫入檔案，並自動檢查是否有相應的資料夾位置
 * @param targetPath 指定位置
 * @param content 內容
 */
export async function WriteFileAsJSON(targetPath = '', content) {
  const parentPath = dirname(targetPath);
  await MKDir(parentPath);
  targetPath = join(targetPath);
  await fs.writeFile(targetPath, JSON.stringify(content, null, 4));
}

/** 讀取檔案
 * @param targetPath 檔案位置
 * @returns Buffer-成功  {}-失敗
 */
export async function ReadFile(targetPath = '') {
  const rawdata = await fs.readFile(targetPath, 'utf8');
  //const result = JSON.parse(rawdata);
  return rawdata;
}
export async function ReadFileToJSON(targetPath = '') {
  const rawdata = await fs.readFile(targetPath, 'utf8');
  //const result = JSON.parse(rawdata);
  return JSON.parse(rawdata);
}
// Make Folder with recursive
export async function MKDir(name = '') {
  if (name === '') return;
  name = join(name);
  await fs.mkdir(name, {recursive: true});
}

export async function GetAllFilesName(dirPath = '') {
  //
  const files = await fs.readdir(dirPath);
  const result = [];
  for (const key of files) {
    const isDir = (await stat(join(dirPath, key))).isDirectory();
    if (!isDir) {
      result.push(key);
    }
  }
  return result;
}
export const GetDirectories = async (source = '') =>
  (await readdir(source, {withFileTypes: true}))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
/**
 * 刪除檔案
 * @param path 檔案位置
 */
export async function DeleteFile(path = '') {
  await fs.unlink(path).catch((err) => {
    console.log(err);
  });
}
