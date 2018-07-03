//========================================================================
//
//名前空間作成
//
//========================================================================

//naoetu
if(typeof(naoetu)=='undefined')naoetu=function(){};

//========================================================================
//
//共通関数
//
//========================================================================

//---------------------------------------------
//
//バインド
//
//---------------------------------------------
naoetu.bind = function(pBind,pFunc){return function(){return pFunc.apply(pBind,arguments);};}

//---------------------------------------------
//
//ログ出力クラス作成
//
//---------------------------------------------
naoetu.clsLog = function(){return this.initialize.apply(this,arguments);};
naoetu.clsLog.prototype = {
    initialize : function(pLevel,pIsOut){
        this.level = pLevel;
        this.isOut = pIsOut;
    },
    out : function(plevel,pMsg){
        if(this.isOut == true){
            if(plevel <= this.level){
                console.log(pMsg);
            }
        }
    }
}

//---------------------------------------------
//
//ログ出力設定
//
//---------------------------------------------
naoetu.log = new naoetu.clsLog(3,true);

//========================================================================
//
//初期設定
//
//========================================================================
var express = require('express');
var app = express();

//設定ファイルの読み込み
require('dotenv').config();

//バリデーション(HTTPパラメタチェック)使用
var validator = require('express-validator');
app.use(validator());

//クロスサイト制限を外す設定
var cors = require('cors');
app.use(cors());

//共通設定
naoetu.ini = {
    ConPool   : "pool",
    ConMaster : "MASTER"
}

naoetu.log.out(3,"DB_HOST=" + process.env.DB_HOST);

//mySql使用 
naoetu.mysql   = require('mysql');
naoetu.ConConf = {
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
};


//========================================================================
//
//DB接続テスト
//
//========================================================================
// naoetu.connection.connect(function(err) {
//     if (err) {
//       console.error('error connecting: ' + err.stack);
//       return;
//     }
//     naoetu.log.out(3,'connected as id ' + naoetu.connection.threadId);
// });

//========================================================================
//
// ルーティング
//
//========================================================================

//---------------------------------------------
// メイン　ルート
//---------------------------------------------
app.get('/',(req,res)=>{
    res.send('welcome to express!')
})

//---------------------------------------------
// GPS情報書き込み
//---------------------------------------------
app.get('/gpswrite',(req,res)=>{

    var posLng = req.query.lng;
    var posLat = req.query.lat;
    var typeId = req.query.type;

    req.check('lng',{'ErrNo':'0001','description':'経度Xが実数ではありません。'}).isFloat();
    req.check('lat',{'ErrNo':'0001','description':'緯度yが実数ではありません。'}).isFloat();
    req.check('type',{'ErrNo':'0002','description':'データタイプが数値ではありません。'}).isInt();

    req.getValidationResult().then((result)=>{
        if(!result.isEmpty()){
            //エラーあり
            res.send({result:{err:-1,description:"パラメタに不正な値が設定されている"}});
        }else{
            //エラーなし pPosLng,pPosLat,pTypeId,pMode
            var paramGps = new naoetu.clsParamGps(posLng,posLat,typeId,"");

            //GPS情報の保存
            var gps = new naoetu.clsGps();

            //成功時のレスポンス
            gps.onSuccess = function(){
                this.response.json({result:{err:0,description:"GPS情報 登録成功"}});
            };

            //失敗時のレスポンス
            gps.onFaile = function(){
                this.response.json({result:{err:-2,description:"GPS情報 登録失敗"}});
            };

            //書き込み実行
            gps.writeGps(paramGps,res);

        }
    });

})
//---------------------------------------------
// GPS情報読み込み
//---------------------------------------------
app.get('/gpsread',(req,res)=>{
    var mode = req.query.mode;
    var type = req.query.type;
    req.check('mode',{'ErrNo':'0003','description':'データタイプがアルファベットではありません。'}).isAlpha();
    req.check('type',{'ErrNo':'0004','description':'データタイプが数値ではありません。'}).isInt();
    req.getValidationResult().then((result)=>{
        if(!result.isEmpty()){
            //エラーあり 
            res.send({result:{err:-1,description:"パラメタに不正な値が設定されている"}});
        }else{
            //エラーなし pPosLng,pPosLat,pTypeId,pMode
            var paramGps = new naoetu.clsParamGps(0,0,type,mode);

            //GPS情報の保存
            var gps = new naoetu.clsGps();

            //成功時のレスポンス
            gps.onSuccess = function(pData){
                this.response.json({result:{err:0,description:"GPS情報 読み込み成功",fields:pData}});
            };

            //失敗時のレスポンス
            gps.onFaile = function(){
                this.response.json({result:{err:-2,description:"GPS情報 読み込み失敗"}});
            };

            //読み込み実行
            gps.readGps(paramGps,res);

        }
    });
});

//========================================================================
//
// 処理
//
//========================================================================

//---------------------------------------------
//
//GPSパラメタクラス作成
//
//---------------------------------------------
naoetu.clsParamGps = function(){return this.initialize.apply(this,arguments);};
naoetu.clsParamGps.prototype = {
    initialize : function(pPosLng,pPosLat,pTypeId,pMode){
        this.posLng = pPosLng;
        this.posLat = pPosLat;
        this.typeId = pTypeId;
        this.mode = pMode;
    }
}

//---------------------------------------------
//
//GPS情報クラス
//
//---------------------------------------------
naoetu.clsGps = function(){return this.initialize.apply(this,arguments);};
naoetu.clsGps.prototype = {
    initialize : function(){
        this.paramGps = false;
        this.masterConnection = false;
        this.response = false;
        this.Type = false;
        this.MODE_NOMAL = "NOMAL";
        this.Cnnection = false;
    },
    //-----------------------------
    // 書き込み成功時のメソッド
    //-----------------------------
    onSuccess : function(){
    },
    //-----------------------------
    // 書き込み失敗時のメソッド
    //-----------------------------
    onFaile : function(){
    },
    //-----------------------------
    // GPS情報をテーブルへ書き込む
    //-----------------------------
    writeGps : function(pGps,pRes){

        this.paramGps = pGps;
        this.response = pRes;

        naoetu.log.out(3,'パラメタ ' + 'posLat:' + this.paramGps.posLat + "/" + 'posLng:' + this.paramGps.posLng + "/" + 'type:' + this.paramGps.type);

        //コネクションの確立
        naoetu.log.out(3,'Step コネクションの確立...開始');
        this.masterConnection = naoetu.mysql.createConnection(naoetu.ConConf);
        this.masterConnection.connect(function(err) {
            //接続時のエラー
            if (err) {
                naoetu.log.out(3,'Error clsGps.writeGps DB接続失敗.');
                console.error(err);
                return;
            }else{
                naoetu.log.out(3,'OK clsGps.writeGps DB接続成功.');
            }
        });
        naoetu.log.out(3,'Step コネクションの確立...終了');

        //トランザクション実行後のコールバック <
        var _TranCallback = function(pErr){

            if(pErr){
                naoetu.log.out(3,'Error clsGps.writeGps トランザクション開始失敗.');
                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                //処理失敗時の処理実行
                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                this.onFaile();
            }else{
                naoetu.log.out(3,'OK clsGps.writeGps トランザクション開始成功.');

                //SQL実行後のコールバック定義 <
                var _SqlCallback = function(err,results,fields){
                    if(err){
                        //エラー時 → ロールバック
                        naoetu.log.out(3,'Error clsGps.writeGps SQL実行失敗.');

                        //DBコネクション時のコールバック定義 <
                        var _masterConnection = function(err) {
                            if(err){
                                naoetu.log.out(3,'Error clsGps.writeGps ロールバック失敗.');
                                console.error(err);
                                //throw err;
                                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                                //処理失敗時の処理実行
                                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                                this.onFaile();
                            }
                        }
                        //DBコネクション時のコールバック定義 >

                        this.masterConnection.rollback(naoetu.bind(this,_masterConnection));

                    }else{
                        //正常時 → コミット
                        naoetu.log.out(3,'OK clsGps.writeGps SQL実行成功.');

                        //コミット時のコールバック定義 <
                        var _commit = function(err) {
                            if (err) { 
                                naoetu.log.out(3,'Error clsGps.writeGps コミット失敗.');

                                //ロールバック時のコールバック定義 <
                                var _roolback = function(err) {
                                    if(err){
                                        naoetu.log.out(3,'Error clsGps.writeGps コミット失敗時のロールバック失敗.');
                                        console.error(err);
                                        //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                                        //処理失敗時の処理実行
                                        //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                                        this.onFaile();
                                        //throw err;
                                    }else{
                                        naoetu.log.out(3,'OK clsGps.writeGps コミット失敗時のロールバック成功.');
                                        //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                                        //処理失敗時の処理実行
                                        //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                                        this.onFaile();
                                    }
                                }
                                //ロールバック時のコールバック定義 >

                                master.rollback(naoetu.bind(this,_roolback));

                            }else{
                                naoetu.log.out(3,'OK clsGps.writeGps コミット成功.');

                                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                                //処理成功時の処理実行
                                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                                this.onSuccess();

                            }
                        }
                        //コミット時のコールバック定義 >

                        this.masterConnection.commit(naoetu.bind(this,_commit));

                    }
                }
                //SQL実行後のコールバック定義 >

                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                //SQL実行
                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                this.masterConnection.query("insert into TBL_GPS set ? ",
                    {
                        posX   : this.paramGps.posLng,
                        posY   : this.paramGps.posLat,
                        typeId : this.paramGps.typeId
                    },
                    naoetu.bind(this,_SqlCallback)
                );
            }
        }
        //トランザクション実行後のコールバック >

        //トランザクション開始
        naoetu.log.out(3,'Step トランザクション...開始');
        this.masterConnection.beginTransaction(naoetu.bind(this,_TranCallback));
        naoetu.log.out(3,'Step トランザクション...終了');

    },
    //-----------------------------
    // テーブルへからGPS情報を取得する
    //-----------------------------
    readGps : function(pGps,pRes){

        this.paramGps = pGps;
        this.response = pRes;
        
        naoetu.log.out(3,'パラメタ ' + 'mode:' + this.paramGps.mode + "/" + 'type:' + this.paramGps.typeId);

        //コネクションの確立
        naoetu.log.out(3,'Step コネクションの確立...開始');
        this.masterConnection = naoetu.mysql.createConnection(naoetu.ConConf);
        var _ConnectionCallBack = function(err){
            
            //接続時のエラー
            if (err) {
                naoetu.log.out(3,'Error clsGps.readGps DB接続失敗.');
                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                //処理失敗時の処理実行
                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                this.onFaile();
                return;
            }else{
                naoetu.log.out(3,'OK clsGps.readGps DB接続成功.');
            }

            //通常取得
            var sql = "";
            var sqlParam = [];
            if(this.paramGps.mode == this.MODE_NOMAL){
                sqlParam = {typeId:this.paramGps.type};
                sql = "Select * from TBL_GPS Where ? Order By add_date DESC";
            }else{
                sqlParam = {typeId:this.paramGps.type};
                sql = "Select * from TBL_GPS Where ? ";
            }

            //コールバック定義
            var _callBack = function(err,results,fields){

                if(err){
                    naoetu.log.out(3,'OK clsGps.readGps SQL実行失敗.');
                    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                    //処理失敗時の処理実行
                    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                    this.onFaile();
                    return;
                }else{
                    naoetu.log.out(3,'OK clsGps.readGps SQL実行成功.');
                }

                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                //処理成功時の処理実行
                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                this.onSuccess(fields);

            };

            //SQL実行
            this.masterConnection.query(sql,sqlParam,naoetu.bind(this,_callBack));
        };
        this.masterConnection.connect(naoetu.bind(this,_ConnectionCallBack));
        naoetu.log.out(3,'Step コネクションの確立...終了');

    }
}

//========================================================================
//
//サーバデプロイ
//
//========================================================================
app.listen(50001,() => {
    naoetu.log.out(3,'Start server port:50001')
})
