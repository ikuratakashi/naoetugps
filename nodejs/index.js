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

                //タイムスタンプ作成
                var bufDate= new Date();
                var year = bufDate.getFullYear();
                var month = bufDate.getMonth() + 1;
                var date = bufDate.getDate();
                var hour = bufDate.getHours();
                var minute = bufDate.getMinutes();
                var second = bufDate.getSeconds();
                var buf = "[" + year + "/" + month + "/" + date + " " + ('00' + hour).slice(-2) + ":" + ('00' + minute).slice(-2) + ":" + ('00' + second).slice(-2) + "]:";
                console.log(buf + pMsg);


            }
        }
    },
    line : function(plevel){
        var _msg = "***********************************"
        this.out(plevel,_msg);
    }
}

//---------------------------------------------
//
//ログ出力設定
//
//---------------------------------------------
naoetu.log = new naoetu.clsLog(3,true);

//---------------------------------------------
//
//タイトル出力
//
//---------------------------------------------
naoetu.log.out(3,'============================================================');
naoetu.log.out(3,'ArukISoft. 2018 ver 1.00.00 b');
naoetu.log.out(3,'============================================================');
naoetu.log.out(3,'88     8    88     888888  88888888 88888888 8      8');
naoetu.log.out(3,'8 8    8   8  8   8      8 8           88    8      8');
naoetu.log.out(3,'8  8   8  8    8  8      8 88888888    88    8      8');
naoetu.log.out(3,'8    8 8  888888  8      8 8           88    8      8');
naoetu.log.out(3,'8     88 8      8  888888  88888888    88     888888 ');
naoetu.log.out(3,'');
naoetu.log.out(3,'          8888888 8888888  88888888 ');
naoetu.log.out(3,'    8    8        8      8 8        ');
naoetu.log.out(3,'  88888  8  88888 8888888  88888888 ');
naoetu.log.out(3,'    8    8      8 8               8 ');
naoetu.log.out(3,'          888888  8        88888888 ');
naoetu.log.out(3,'');
naoetu.log.out(3,'... I hope NAOETU will be a good city.');
naoetu.log.out(3,'============================================================');

//========================================================================
//
//初期設定
//
//========================================================================
var express = require('express');
naoetu.log.out(3,'express require');
var app = express();

//設定ファイルの読み込み
require('dotenv').config();

//バリデーション(HTTPパラメタチェック)使用
var validator = require('express-validator');
app.use(validator());
naoetu.log.out(3,'express-validator require');

//クロスサイト制限を外す設定
var cors = require('cors');
app.use(cors());
naoetu.log.out(3,'cors require');

//main
var http = require('http').Server(app);
naoetu.log.out(3,'http require');

//共通設定
naoetu.ini = {
    ConPool   : "pool",
    ConMaster : "MASTER"
}

naoetu.log.out(3,"DB_HOST=" + process.env.DB_HOST);

//mySql使用 
naoetu.mysql   = require('mysql');
naoetu.log.out(3,'mysql require');
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
// ルーティング app
//
//========================================================================

//---------------------------------------------
// メイン　ルート
//---------------------------------------------
app.get('/',(req,res)=>{
    res.send('welcome to express!')
});

//---------------------------------------------
// GPS情報書き込み
//---------------------------------------------
app.get('/gpswrite',(req,res)=>{
    naoetu.log.line(3);
    naoetu.log.out(3,'http get: /gpswrite start...');
    naoetu.GpsWrite("http",req,res);
    naoetu.log.out(3,'http get: /gpswrite ...end');
});

//---------------------------------------------
// GPS情報読み込み
//---------------------------------------------
app.get('/gpsread',(req,res)=>{
    naoetu.log.line(3);
    naoetu.log.out(3,'http get: /gpsread start...');
    naoetu.GpsRead("http",req,res);
    naoetu.log.out(3,'http get: /gpsread ...end');
});

//========================================================================
//
// 処理
//
//========================================================================

//---------------------------------------------
//
// 座標情報読み込み処理
//
//---------------------------------------------
naoetu.GpsRead = function(pMode,req,res){

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
                if(pMode == "http"){
                    this.response.json({result:{err:0,description:"GPS情報 読み込み成功",fields:pData}});
                }
            };

            //失敗時のレスポンス
            gps.onFaile = function(){
                if(pMode == "http"){
                    this.response.json({result:{err:-2,description:"GPS情報 読み込み失敗"}});
                }
            };

            //読み込み実行
            gps.readGps(paramGps,res);

        }
    });
}

//---------------------------------------------
//
// 座標情報書き込み処理
//
//---------------------------------------------
naoetu.GpsWrite = function(pMode,req,res){

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

                naoetu.log.out(3,'Step clsGps onSuccess start...');

                if(pMode == "http"){
                    this.response.json({result:{err:0,description:"GPS情報 登録成功"}});
                }
                if(pMode == "socket"){
                    //クライアントに座標登録完了を送信
                    if(naoetu.socket.socketObj){
                        naoetu.log.out(3,'Step emit "gpswrite finish" start...');
                        var _socket = naoetu.socket.socketObj;
                        _socket.emit('gpswrite finish',{msg:"naoetu.GpsWrite emit"},function(){});
                        naoetu.log.out(3,'Step emit "gpswrite finish" ...end');
                    };
                }
                // //クライアントに座標登録完了を送信
                // if(naoetu.socket.socketObj){
                //     naoetu.log.out(3,'Step broadcast.emit "gpswrite success" start...');
                //     var _socket = naoetu.socket.socketObj;
                //     _socket.broadcast.emit('gpswrite success',{msg:"gpswrite success to broadcast"});
                //     //_socket.emit('gpswrite success',{msg:"gpswrite success to one"});
                //     naoetu.log.out(3,'Step broadcast.emit "gpswrite success" ...end');
                // }

                naoetu.log.out(3,'Step clsGps onSuccess ...end');
            };

            //失敗時のレスポンス
            gps.onFaile = function(){
                if(pMode == "http"){
                    this.response.json({result:{err:-2,description:"GPS情報 登録失敗"}});
                }
            };

            //書き込み実行
            gps.writeGps(paramGps,res);

        }
    });
}

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
    // コネクションの生成
    //-----------------------------
    DbConnectin : function(pConnectFunction){

        //-----------------------------
        //コネクションの確立
        //-----------------------------
        //*
        //* プールした接続だとトランザクションを管理できない為、実行するたびに接続を生成する
        //*
        //-----------------------------
        naoetu.log.out(3,'Step DataBase connection start...');
        this.masterConnection = naoetu.mysql.createConnection(naoetu.ConConf);
            //接続時のエラー
            var _bufConnectFnc = function(err) {
            if (err) {
                naoetu.log.out(3,'Error clsGps.writeGps DB Connect Failde.');
                console.error(err);
                return;
            }else{
                naoetu.log.out(3,'OK clsGps.writeGps DB Connect Success.');
            }
        }
        if(pConnectFunction){
            _bufConnectFnc = pConnectFunction;
        }
        this.masterConnection.connect(naoetu.bind(this,_bufConnectFnc));
        naoetu.log.out(3,'Step DataBase Connection ...finish');

        //error('PROTOCOL_CONNECTION_LOST')時に再接続
        naoetu.log.out(3,'Step DataBase Connection Error Handle start...');
        var _bufConErrFnc = function(err){

            naoetu.log.out(3,'*********************');
            naoetu.log.out(3,'Error DataBase Connection Error Code => ' + err.code);
            naoetu.log.out(3,'*********************');

            if(err.code === "PROTOCOL_CONNECTION_LOST"){
            //コネクション 消失時 ... 再接続
                naoetu.log.out(3,'Step DataBase Connection Error Run handleDisconnect.');
                this.DbConnectin();
            }
        }
        this.masterConnection.on("error",naoetu.bind(this,_bufConErrFnc));
        naoetu.log.out(3,'Step DataBase Connection Error Handle ...finish');

    },
    //-----------------------------
    // GPS情報をテーブルへ書き込む
    //-----------------------------
    writeGps : function(pGps,pRes){

        this.paramGps = pGps;
        this.response = pRes;

        naoetu.log.out(3,'WriteGPS Parameter  ' + 'posLat:' + this.paramGps.posLat + "/" + 'posLng:' + this.paramGps.posLng + "/" + 'type:' + this.paramGps.type);

        //DBコネクション生成と生成時の処理実行
        this.DbConnectin(false);

        //-----------------------------
        //トランザクション実行後のコールバック <
        //-----------------------------
        var _TranCallback = function(pErr){
            if(pErr){
                naoetu.log.out(3,'Error clsGps.writeGps transaction Failed.');
                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                //処理失敗時の処理実行
                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                this.onFaile();
            }else{
                naoetu.log.out(3,'OK clsGps.writeGps Transaction Success ... Run SQL Start.');

                //SQL実行後のコールバック定義 <
                var _SqlCallback = function(err,results,fields){
                    if(err){
                        //エラー時 → ロールバック
                        naoetu.log.out(3,'Error clsGps.writeGps SQL Failde ... Run Rollback Start.');

                        //DBコネクション時のコールバック定義 <
                        var _masterConnection = function(err) {
                            if(err){
                                naoetu.log.out(3,'Error clsGps.writeGps Rollback Failed.');
                                console.error(err);
                                //throw err;
                                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                                //処理失敗時の処理実行
                                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                                this.onFaile();
                            }else{
                                naoetu.log.out(3,'OK clsGps.writeGps Rollback Success.');
                            }
                        }
                        //DBコネクション時のコールバック定義 >

                        this.masterConnection.rollback(naoetu.bind(this,_masterConnection));

                    }else{
                        //正常時 → コミット
                        naoetu.log.out(3,'OK clsGps.writeGps SQL Success ... Run Commit Start');

                        //コミット時のコールバック定義 <
                        var _commit = function(err) {
                            if (err) { 
                                naoetu.log.out(3,'Error clsGps.writeGps Commit Failed ... Run Rollback Start.');

                                //ロールバック時のコールバック定義 <
                                var _roolback = function(err) {
                                    if(err){
                                        naoetu.log.out(3,'Error clsGps.writeGps RollBack Failed.');
                                        console.error(err);
                                        //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                                        //処理失敗時の処理実行
                                        //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                                        this.onFaile();
                                        //throw err;
                                    }else{
                                        naoetu.log.out(3,'OK clsGps.writeGps RollBack Success.');
                                        //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                                        //処理失敗時の処理実行
                                        //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                                        this.onFaile();
                                    }
                                }
                                //ロールバック時のコールバック定義 >

                                master.rollback(naoetu.bind(this,_roolback));

                            }else{
                                naoetu.log.out(3,'OK clsGps.writeGps Commit Success.');

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
        //-----------------------------
        //トランザクション実行後のコールバック >
        //-----------------------------

        //-----------------------------
        //トランザクション開始
        //-----------------------------
        naoetu.log.out(3,'Step Transaction...Start');
        this.masterConnection.beginTransaction(naoetu.bind(this,_TranCallback));
        naoetu.log.out(3,'Step Transaction...End');

    },
    //-----------------------------
    // テーブルへからGPS情報を取得する
    //-----------------------------
    readGps : function(pGps,pRes){

        this.paramGps = pGps;
        this.response = pRes;
        
        naoetu.log.out(3,'ReadGPS Parameter ' + 'mode:' + this.paramGps.mode + "/" + 'type:' + this.paramGps.typeId);

        //コネクションの確立
        naoetu.log.out(3,'Step Connection...Start');
        this.masterConnection = naoetu.mysql.createConnection(naoetu.ConConf);
        var _ConnectionCallBack = function(err){
            
            //接続時のエラー
            if (err) {
                naoetu.log.out(3,'Error clsGps.readGps DB Connection Failed.');
                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                //処理失敗時の処理実行
                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                this.onFaile();
                return;
            }else{
                naoetu.log.out(3,'OK clsGps.readGps DB Connection Success.');
            }

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

            //コールバック定義
            var _callBack = function(err,results,fields){

                if(err){
                    naoetu.log.out(3,'NG clsGps.readGps SQL Failed.');
                    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                    //処理失敗時の処理実行
                    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                    this.onFaile();
                    return;
                }else{
                    naoetu.log.out(3,'OK clsGps.readGps SQL Success.');
                }

                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                //処理成功時の処理実行
                //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
                naoetu.log.out(3,'Search Result Get Record Count :' + results.length);
                this.onSuccess(results);

            };

            //SQL実行
            this.masterConnection.query(sql,sqlParam,naoetu.bind(this,_callBack));
        };
        //DBコネクション生成と生成時の処理実行
        this.DbConnectin(_ConnectionCallBack);

        naoetu.log.out(3,'Step Connection...Finish');

    }
}

//---------------------------------------------
//
// socket.ioとhttpの差を吸収する為のクラス群
//
//---------------------------------------------
naoetu.socket = [];


//-----------------------------
// ソケットオブジェクト
//-----------------------------
naoetu.socket.socketObj = false;

//-----------------------------
// 引数のチェック
//-----------------------------
naoetu.socket.Request = function(){return this.initialize.apply(this,arguments);};
naoetu.socket.Request.prototype = {
    initialize : function(pData){
        this.checkItems = new Array();
        this.ErrItems = new Array();
        this.CheckData = pData;
        this.query = pData;
    },
    //-----------------------------
    // Validationの種類を追加　実際のチェックは naoetu.socket.ValidationItem で実行
    //-----------------------------
    check : function(pValueName,pMessage){
        this.checkItems.push(new naoetu.socket.ValidationItem(this.CheckData[pValueName],pMessage));
        return this.checkItems[this.checkItems.length - 1];
    },
    //-----------------------------
    // Validation処理をthis.checkItemsの数分 実行
    //-----------------------------
    getValidationResult : function(){
        this.IsEmpty = true;
        for(var i=0;i < this.checkItems.length;i++){
            var buf = this.checkItems[i];
            if(buf.isError == true){
                this.ErrItems.push(buf);
            }
        }
        return this;
    },
    then : function(pFunction){
        pFunction(this);
    },
    isEmpty : function(){
        if(this.ErrItems.length > 0){
            return false;
        }else{
            return true;
        }
    }
}

//-----------------------------
// Validationアイテム 
// ※チェック処理はここに実装
//-----------------------------
naoetu.socket.ValidationItem = function(){return this.initialize.apply(this,arguments);};
naoetu.socket.ValidationItem.prototype = {
    initialize : function(pValue,pMessage){
        this.Value = pValue;
        this.Message = pMessage;
        this.ValiType = ""; 
        this.isError = false;
    },
    isAlpha : function(){
        try {
            if (this.Value.match(/[^A-Za-z0-9]+/)) {
                this.isError = false;
            }else{
                this.isError = true;
            }
        } catch (T_T) {
            this.isError = false;
        }
    },
    isFloat : function(){
        try {
            if(isNaN(this.Value)){
                this.isError = true;
            }else{
                this.isError = false;
            }
        }catch(T_T){
            this.isError = false;
        }
    },
    isInt : function(){
        try {
            if(isFinite(this.Value)){
                this.isError = false;
            }else{
                this.isError = true;
            }
        }catch(T_T){
            this.isError = false;
        }
    }

}

//-----------------------------
// Dmmy Request
//-----------------------------
naoetu.socket.Response = function(){return this.initialize.apply(this,arguments);};
naoetu.socket.Response.prototype = {
    initialize : function(){
    },
    send : function(pData){
        this.Data = pData;
        this.query = pData;
    }
}

//-----------------------------
// Connection
//-----------------------------
naoetu.socket.Connection = function(pSocket){
    naoetu.log.out(3,'socket.io connection successfull');
    pSocket.emit('greeting',{msg:"greeting connection successfull!!"},function(pData){
        naoetu.log.out(3,'socket.io greeting from client');
    });
}

//========================================================================
//
//サーバデプロイ
//
//========================================================================

//サーバ起動
http.listen(50001,() => {
    naoetu.log.out(3,'Start server port:50001');
});

//socket.io
var io = require('socket.io')(http);
var IoNaoetuGps = io.of("/naoetugps");
naoetu.log.out(3,'socket.io require');

//========================================================================
//
// ルーティング socket.io
//
//========================================================================

//---------------------------------------------
// socket.io コネクション
//---------------------------------------------
naoetu.log.out(3,'socket.io routeing "connection" on start...');
IoNaoetuGps.on("connection",function(pSocket){

    naoetu.log.line(3);

    naoetu.socket.socketObj = pSocket;
    naoetu.socket.Connection(pSocket);

    //---------------------------------------------
    //ソケットに対してイベント処理を追加
    //---------------------------------------------

    //-----------------
    // GPS情報書き込み
    //-----------------
    naoetu.log.out(3,'socket.io routeing "gpswrite" on start...');
    pSocket.on('gpswrite',function(pData){
        naoetu.log.line(3);
        naoetu.log.out(3,'socket  :  gpswrite start...');
        var dmyResponse = new naoetu.socket.Response();
        var dmyRequest = new naoetu.socket.Request(pData);
        naoetu.GpsWrite("socket",dmyRequest,dmyResponse);
        naoetu.log.out(3,'socket  :  gpswrite ...end');
    });
    naoetu.log.out(3,'socket.io routeing "gpswrite" on ...end');

    //-----------------
    // GPS情報読み込み
    //-----------------
    naoetu.log.out(3,'socket.io routeing "gpsread" on start...');
    pSocket.on('gpsread',function(pData){
        naoetu.log.line(3);
        naoetu.log.out(3,'socket  :  gpsread start...');
        var dmyResponse = new naoetu.socket.Response();
        var dmyRequest = new naoetu.socket.Response(pData);
        naoetu.GpsRead("socket",dmyRequest,dmyResponse);
        naoetu.log.out(3,'socket  :  gpsread ...end');
    });
    naoetu.log.out(3,'socket.io routeing "gpsread" on ...end');

    //-----------------
    // 位置情報の送信依頼を出す為のブロードキャスト送信
    //-----------------
    naoetu.log.out(3,'socket.io routeing "gpsdatas broadcast" on start...');
    pSocket.on('gpsdatas broadcast',function(pData){
        naoetu.log.line(3);
        naoetu.log.out(3,'socket  :  gpswrite finish broadcast start...');

        var _socket = naoetu.socket.socketObj;
        _socket.broadcast.emit('get PosDatas',{msg:"gpswrite success to broadcast"});

        naoetu.log.out(3,'socket  :  gpswrite finish broadcast ...end');
    });
    naoetu.log.out(3,'socket.io routeing "gpsdatas broadcast" on ...end');

});
naoetu.log.out(3,'socket.io routeing "connection" on ...end');

// //-----------------
// // GPS情報書き込み
// //-----------------
// naoetu.log.out(3,'socket.io routeing "gpswrite" on start...');
// IoNaoetuGps.on('gpswrite',function(pData){
//     naoetu.log.line(3);
//     naoetu.log.out(3,'socket  :  gpswrite start...');
//     var dmyResponse = new naoetu.socket.Response(pData);
//     var dmyResponse = new naoetu.socket.Request();
//     naoetu.GpsWrite("socket",dmyResponse,dmyResponse);
//     naoetu.log.out(3,'socket  :  gpswrite ...end');
// });
// naoetu.log.out(3,'socket.io routeing "gpswrite" on ...end');

// //-----------------
// // GPS情報読み込み
// //-----------------
// naoetu.log.out(3,'socket.io routeing "gpsread" on start...');
// IoNaoetuGps.on('gpsread',function(pData){
//     naoetu.log.line(3);
//     naoetu.log.out(3,'socket  :  gpsread start...');
//     var dmyResponse = new naoetu.socket.Response(pData);
//     var dmyResponse = new naoetu.socket.Response();
//     naoetu.GpsRead("socket",dmyResponse,dmyResponse);
//     naoetu.log.out(3,'socket  :  gpsread ...end');
// });
// naoetu.log.out(3,'socket.io routeing "gpsread" on ...end');


//socket.io
var IoTest = io.of("/test");
naoetu.log.line(3);
naoetu.log.out(3,'Test Connection Start...');
IoTest.on("connection",function(pSocket){

    naoetu.log.out(3,'Test Connection ...finish!');
    
    //接続先へ送信
    pSocket.emit("connectin finish","サーバより");

    //メッセージが送られてきたらブロードキャスト
    pSocket.on("send msg",function(pMsg){
        naoetu.log.out(3,'Test broadcast Start...');
        pSocket.broadcast.emit("test message",pMsg);
        pSocket.emit('test message',pMsg);
        naoetu.log.out(3,'Test broadcast ...End');
    });

});
naoetu.log.out(3,'Test Connection ...End');

