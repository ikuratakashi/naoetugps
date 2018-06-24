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

//バインド
naoetu.bind = function(pBind,pFunc){return function(){return pFunc.apply(pBind,arguments);};}

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

console.log("DB_HOST=" + process.env.DB_HOST);

//mySql使用 
naoetu.mysql      = require('mysql');
naoetu.connection = naoetu.mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
});
var _pool = naoetu.mysql.createPoolCluster();
_pool.add(naoetu.ini.ConMaster, naoetu.connection);
app.set(naoetu.ini.ConPool, _pool);


//========================================================================
//
//DB接続テスト
//
//========================================================================
naoetu.connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + naoetu.connection.threadId);
});

//========================================================================
//
// ルーティング
//
//========================================================================

//---------------------------------------------
// ルート
//---------------------------------------------
app.get('/',(req,res)=>{
    res.send('welcome to express!')
})

//---------------------------------------------
// GPS情報取得
//---------------------------------------------
app.get('/gpswrite',(req,res)=>{

    var posX = req.query.x;
    var posY = req.query.y;
    req.check('x',{'ErrNo':'0001','description':'x座標が実数ではありません。'}).isFloat();
    req.check('y',{'ErrNo':'0001','description':'y座標が実数ではありません。'}).isFloat();

    req.getValidationResult().then((result)=>{
        if(!result.isEmpty()){
            //エラーあり
            res.send('err gps! x=' + posX + 'y=' + posY);
        }else{
            //エラーなし
            var paramGps = new naoetu.clsParamGps(posX,posY);
            res.send('welcome to gps! x=' + posX + 'y=' + posY);
            writeDb(paramGps);
        }
    });

})

//========================================================================
//
//GPSパラメタクラス作成
//
//========================================================================
naoetu.clsParamGps = function(){return this.initialize.apply(this,arguments);};
naoetu.clsParamGps.prototype = {
    initialize : function(pPosX,pPosY){
        this.posX = pPosX;
        this.posY = pPosY;
    }
}

//========================================================================
//
//DB接続パラメタクラス作成
//
//========================================================================
naoetu.clsParamDb = function(){return this.initialize.apply(this,arguments);};
naoetu.clsParamDb.prototype = {
    initialize : function(){
    }
}

//========================================================================
//
//GPS情報クラス
//
//========================================================================
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

        var _dbPool = app.get(naoetu.ini.ConPool);
        var _masterPool = _dbPool.of(naoetu.ini.ConMaster);
        this.masterConnection = naoetu.mysql.createConnection(_masterPool);

        //接続後のコールバック
        var _con = function(pErr, pCon){
            if(pErr){
                console.log('Error clsGps.writeGps DB接続失敗.');
            }else{
                console.log('Error clsGps.writeGps DB接続成功.');
                //SQL実行後のコールバック
                var _cb = function(err,results,fields){
                    if(err){
                        console.log('Error clsGps.writeGps SQL実行失敗.');
                        this.masterConnection.rollback(function() {
                            console.error(err);
                            throw err;
                        });
                    }else{
                        console.log('OK clsGps.writeGps SQL実行成功.');
                        this.masterConnection.commit(function(err) {
                            if (err) { 
                                master.rollback(function() {
                                    throw err;
                                });
                            }
                        });
                    }
                }
                //SQL実行
                pCon.query("insert into TBL_GPS ? ",
                    {
                        posX:this.paramGps.posX,
                        posY:this.paramGps.posY
                    },
                    naoetu.bind(this,_cb)
                );
            }
        }
        this.masterConnection.beginTransaction(naoetu.bind(this,_con));

    }

}

//========================================================================
//
//サーバデプロイ
//
//========================================================================
app.listen(50001,() => {
    console.log('Start server port:50001')
})
