//==============================
// ■検索結果から各サイトの情報を取得する
//==============================

// 利用モジュールの取り込み
let fs = require('fs');
let client = require('cheerio-httpcli');

// 検索結果情報の読み込み
// （※「fileName」を配列にして一括処理も出来るようにすることも考えた。しかし、処理に時間がかかるため、1ファイルずつ処理するのが現実的と判断した。）
const fileName = 'data';
let searchFilePath = 'dist/searchInfo/' + fileName + '.json';
const searchJson = fs.readFileSync(searchFilePath, {encoding: 'utf-8'});
const searchObj = JSON.parse(searchJson);

// 各サイトの情報を取得
let siteInfoList = [];
for(let i = 0; i < searchObj.items.length; i++) {
  let site = searchObj.items[i]
  let siteInfo = {};
  siteInfo.title = site.title;
  siteInfo.url = site.link;
  siteInfo.html = getSiteHtml(site.link);
  siteInfoList.push(siteInfo);
  console.log((i + 1) + '/10 サイト読み込み完了')
}

// JSONファイルへ書き込み
let siteJson = JSON.stringify(siteInfoList);
let savePath = 'dist/siteInfo/' + fileName + '.json';
fs.writeFileSync(savePath, siteJson);
console.log('ファイル書き出し完了');

// getSiteHtml('https://business.nikkeibp.co.jp/nbs/books/diary/');
// URLからサイト内の情報を取得
function getSiteHtml(url) {
  let siteHtml = {};
  result = client.fetchSync(url);

  // タグ内のテキストは「文字列に変更 ⇒ 空白・改行・ダブルクォートの調整」をしてプロパティに入れる
  siteHtml.title = result.$('title').text().replace(/(\"|\n|\r|\s\s+|　+)/g, ' ') || '';
  siteHtml.h1 = result.$('h1').text().replace(/(\"|\n|\r|\s\s+|　+)/g, ' ') || '';
  siteHtml.description = result.$('meta[name="description"]').attr('content') || '';
  siteHtml.keywords = result.$('meta[name="keywords"]').attr('content') || '';

  // bodyは不要なタグを削除した後に「文字列に変更 ⇒ 改行・ダブルクォートの調整 ⇒ 空白の調整」をしてプロパティに入れる
  // （※空白の量が多いため、他の要素とは違い、空白の処理のタイミングを最後にしている）
  var body = result.$('body') || '';
  body.find('script').remove();
  body.find('style').remove();
  body.find('header').remove();
  body.find('footer').remove();
  siteHtml.body = body.text();
  siteHtml.body = siteHtml.body.replace(/(\"|\n|\r|　+)/g, ' ').replace(/(\s\s+)/g, ' ');
  return siteHtml;
}
