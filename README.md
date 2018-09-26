# Naoetu GPS
ArukiSoft.  

毎年７月２６日～２９日まで開催される直江津祇園祭。  
祭り期間中、１９町の各山車が直江津の町の中を練り歩きます。  
その山車の位置を地図上に表示し配信します。  

あ、いや...する予定です。  

※現在作成中  

### サーバ起動方法 

カレントパスは、naoetugps/nodejs

１．redis-server 起動 
``` 
$ redis-server
``` 
ポート6379でredis-serverが起動する。
このサーバ無いとsocket.ioのスケールアウトができない。

２． nodeサーバの起動
``` 
$ nohup node index.js &
``` 
nodeサーバの永続化が行われる

サーバ起動完了
