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
// GPS情報取得　ルート
//---------------------------------------------
app.get('/gpswrite',(req,res)=>{

    var posX = req.query.x;
    var posY = req.query.y;
    var typeId = req.query.type;

    req.check('x',{'ErrNo':'0001','description':'x座標が実数ではありません。'}).isFloat();
    req.check('y',{'ErrNo':'0001','description':'y座標が実数ではありません。'}).isFloat();
    req.check('type',{'ErrNo':'0002','description':'データタイプが数値ではありません。'}).isInt();

    req.getValidationResult().then((result)=>{
        if(!result.isEmpty()){
            //エラーあり
            res.send('err gps!');
        }else{
            //エラーなし
            var paramGps = new naoetu.clsParamGps(posX,posY,typeId);
            res.send('welcome to gps! x=' + posX + ' y=' + posY + ' type=' + typeId);

            //GPS情報の保存
            var gps = new naoetu.clsGps();
            gps.writeGps(paramGps);

        }
    });

})

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
    initialize : function(pPosX,pPosY,pTypeId){
        this.posX = pPosX;
        this.posY = pPosY;
        this.typeId = pTypeId;
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
    },
    //-----------------------------
    // GPS情報をテーブルへ書き込む
    //-----------------------------
    writeGps : function(pGps){

        this.paramGps = pGps;

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
                naoetu.log.out(3,'Error clsGps.writeGps DB接続成功.');
            }
        });
        naoetu.log.out(3,'Step コネクションの確立...終了');

        //トランザクション実行後のコールバック
        var _TranCallback = function(pErr, pCon){
            if(pErr){
                naoetu.log.out(3,'Error clsGps.writeGps トランザクション開始失敗.');
            }else{
                naoetu.log.out(3,'Error clsGps.writeGps トランザクション開始成功.');

                //SQL実行後のコールバック
                var _SqlCallback = function(err,results,fields){
                    if(err){
                        //エラー時 → ロールバック
                        naoetu.log.out(3,'Error clsGps.writeGps SQL実行失敗.');
                        this.masterConnection.rollback(function(err) {
                            if(err){
                                naoetu.log.out(3,'Error clsGps.writeGps ロールバック失敗.');
                                console.error(err);
                                //throw err;
                            }
                        });
                    }else{
                        //正常時 → コミット
                        naoetu.log.out(3,'OK clsGps.writeGps SQL実行成功.');
                        this.masterConnection.commit(function(err) {
                            if (err) { 
                                naoetu.log.out(3,'Error clsGps.writeGps コミット失敗.');
                                master.rollback(function(err) {
                                    if(err){
                                        naoetu.log.out(3,'Error clsGps.writeGps コミット失敗時のロールバック失敗.');
                                        console.error(err);
                                        //throw err;
                                    }else{
                                        naoetu.log.out(3,'Error clsGps.writeGps コミット失敗時のロールバック成功.');
                                    }
                                });
                            }else{
                                naoetu.log.out(3,'Error clsGps.writeGps コミット成功.');
                            }
                        });
                    }
                }

                //SQL実行
                pCon.query("insert into TBL_GPS ? ",
                    {
                        posX   : this.paramGps.posX,
                        posY   : this.paramGps.posY,
                        typeId : this.paramGps.typeId
                    },
                    naoetu.bind(this,_SqlCallback)
                );
            }
        }

        //トランザクション開始
        naoetu.log.out(3,'Step トランザクション...開始');
        this.masterConnection.beginTransaction(naoetu.bind(this,_TranCallback));
        naoetu.log.out(3,'Step トランザクション...開始');

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
