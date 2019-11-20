//==============================
// ■検索結果のJSONをダウンロードする
//==============================

// googleカスタム検索の設定
const searchKey = ''; // googleカスタム検索のキーを入力
const searchCx = ''; // googleカスタム検索のcxを入力
const searchParam = '&pws=0' // 参考：http://www13.plala.or.jp/bigdata/google.html
const searchUrlBase = 'https://www.googleapis.com/customsearch/v1?key=' + searchKey + '&cx=' + searchCx + searchParam + '&q=';
let searchQueryList = {name: 'data', query: '検索 文言'};

// 利用モジュールの取り込み
let https = require('https');
let fs = require('fs');
let commandLineArgs = require('command-line-args');

// コマンドラインのオプション「--kw ○○」の文字列を検索クエリに設定に上書きする
const optionDefinitions = [
  {
    name: 'kw',
    type: String,
    multiple: true
  }
];
const options = commandLineArgs(optionDefinitions);
if(options.kw) {
  searchQueryList.query = options.kw.join(" ");
}

// ダウンロード実行
let savePath = 'dist/searchInfo/' + searchQueryList.name + '.json'
let outfile = fs.createWriteStream(savePath);
let url = searchUrlBase + escape(searchQueryList.query);

https.get(url, function(res) {
  res.pipe(outfile);
  res.on('end', function() {
    outfile.close();
    console.log('ダウンロード完了：' + searchQueryList.query);
  });
});
