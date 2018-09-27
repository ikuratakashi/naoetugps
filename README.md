# Naoetu GPS
ArukiSoft.  

毎年７月２６日～２９日まで開催される直江津祇園祭。  
祭り期間中、１９町の各山車が直江津の町の中を練り歩きます。  
その山車の位置を地図上に表示し配信します。  

あ、いや...する予定です。  

※現在作成中  

### ◆サーバ起動方法 

カレントパスは、naoetugps/nodejs

#### １．redis-server 起動 
``` 
$ redis-server
``` 
ポート6379でredis-serverが起動する。
このサーバ無いとsocket.ioのスケールアウトができない。

#### ２． nodeサーバの起動
``` 
$ nohup node index.js &
``` 
nodeサーバの永続化が行われる

サーバ起動完了

### ◆nodeサーバの機能

#### １．GPS記録
POST及びGETで送信されるGPSを記録する

##### ・http
/gpswrite?lng=[10進経度]&lat=[10進緯度]&type=[1固定]

##### ・node.js

名前空間：naetugps  
メソッド：gpswrite  
パラメタ：  
 {
   lng:[10進 経度],
   lat:[10進 緯度],
   type:[1固定]
 }

#### ２．GPS履歴読込
記録されたGPSの履歴を取得する

##### ・http
/gpsread?mode=[NOMAL]&type=[1固定]

##### ・node.js

名前空間：naetugps  
メソッド：gpsread  
パラメタ：  
 {
   mode:[NOMAL],
   type:[1固定]
 }

取得される件数は、以下の部分で設定されている

index.js - naoetu.clsGps - readGpsメソッド
```
//通常取得
var sql = "";
var sqlParam = {};
if(this.paramGps.mode == this.MODE_NOMAL){
    sqlParam = {typeId : this.paramGps.typeId};
    sql = "Select * from TBL_GPS Where ? Order By add_date DESC LIMIT 24"; //上位6件の取得
}else{
    sqlParam = {typeId : this.paramGps.typeId};
    sql = "Select * from TBL_GPS Where ? ";
}
```

# GITにコミットされていないファイルについて
  
### １． .env 
DBへアクセスする為の設定やその他の設定が記載されている  

nodejs  
└.env  

```
DB_HOST="DBホスト"
DB_USER="DBユーザ名"
DB_PASS="DBパスワード"
DB_NAME="DB名"
HTTPS_PASS="httpsパスフレーズ"
```
