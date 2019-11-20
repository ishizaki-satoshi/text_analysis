//==============================
// ■ページに使用されている文言の使用頻度を分析
//==============================

// 利用モジュールの取り込み
let fs = require('fs');
let Mecab = require('mecab-lite');
let mecab = new Mecab();

// サイト情報の読み込み
const fileName = 'data';
let siteFilePath = 'dist/siteInfo/' + fileName + '.json';
const siteJson = fs.readFileSync(siteFilePath, {encoding: 'utf-8'});
const siteObj = JSON.parse(siteJson);

// 要素のリストを準備
let elList = [
  'title',
  'h1',
  'description',
  'keywords',
  'body'
];

for(let i = 0; i < elList.length; i++) {
  // 文字列を全サイト分マージ
  let mergeText = '';
  for(let j = 0; j < siteObj.length; j++) {
    mergeText += siteObj[j].html[elList[i]];
  }
  mecab.parse(mergeText, function(err, items) {
    mecabToCsv(items, elList[i]);
  });
}

function mecabToCsv(items, elName) {
  let words = {};
  for(let i in items) {
    let it = items[i];
    let w = it[0];
    let h = it[1];
    if(h != '名詞' && h != '動詞' && h != '形容詞') continue;
    if(words[w] == undefined) {
      words[w] = 1;
    } else {
      words[w]++;
    }
  }
  let list = [];
  for(let key in words) {
    list.push({
      "word": key,
      "nums": words[key]
    });
  }
  list.sort(function(a, b) {
    return b.nums - a.nums;
  });

  // JSONファイルへ書き込み
  let listJson = JSON.stringify(list);
  let savePath = 'dist/analysis/' + elName + '.json';
  fs.writeFileSync(savePath, listJson);
  console.log('ファイル書き出し完了：' + elName);
}
