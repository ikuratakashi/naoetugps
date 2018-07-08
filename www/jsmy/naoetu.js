//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//
//名前空間作成
//
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　

//naoetu
if(typeof(naoetu)=='undefined')naoetu=function(){};

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//
//共通関数
//
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　

//---------------------------------------------
//
//バインド
//
//---------------------------------------------
naoetu.bind = function(pBind,pFunc){return function(){return pFunc.apply(pBind,arguments);};}

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//
//ログ出力クラス作成
//
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
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

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//
//NaoetuGPSマップ
//
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
naoetu.map = function(){return this.initialize.apply(this,arguments);};
naoetu.map.prototype = {
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // コンストラクタ
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    initialize : function(pIsSend,pIsViewer,pDefLat,pDefLng,pDefZoom,pMapName,pOutNameLat,pOutNameLng,pTypeListName,pSendBtnName,pResultName,pMapPanMode){

        this.MapObj = false;
        this.defPos = false;
        this.imgCenter = false;
        this.makCenter = false;
        this.isSend = pIsSend;      //座標送信機能の有無
        this.isViewer = pIsViewer;  //ビューワー機能の有無
        this.MapPanMode = pMapPanMode; //マップの移動モード

        this.MapDrawObjects = [];  //地図上に描画しているオブジェクト全て

        //地図の初期ズーム番号
        this.defZoom = pDefZoom;

        //各Element Id
        this.outNameLat = pOutNameLat;      //(Element Id) Lat(Y)緯度
        this.outNameLng = pOutNameLng;      //(Element Id) Lng(X)経度
        this.mapName = pMapName;            //(Element Id) 地図
        this.TypeListName = pTypeListName;  //(Element Id) GPSタイプのリスト
        this.SendBtnName = pSendBtnName;    //(Element Id) 送信ボタン
        this.ResultName  = pResultName;     //(Element Id) 実行結果

        //ソケットの接続
        this.Socket = false;

        //各種イベントの設定 
        ////座標送信ボタン pNaoetuObj,pLatName,pLngName,pTypeName,pSendName
        if(this.isSend){
            this.mapAjaxSendBtn = new naoetu.mapAjax(this,this.outNameLat,this.outNameLng,this.TypeListName,this.SendBtnName);
            this.mapAjaxSendBtn.SetEvent(this.mapAjaxSendBtn.SendPos);
        }
        ////表示関連
        if(this.isViewer){
            this.mapAjaxSendBtn = new naoetu.mapAjax(this,false,false,this.TypeListName,this.SendBtnName);
            this.mapAjaxSendBtn.SetEvent(this.mapAjaxSendBtn.getPosDatas);

            //座標送信側へ中心位置をコピーするボタンのイベントを貼り付ける
            var BtnFunction = function(){
                var _MainObjSend = NaoetuMain.getMap("mapsend-map");
                var _MainObjView = NaoetuMain.getMap("mapviewer-map");

                var _CenterPos = false;
                if(_MainObjView){
                    _CenterPos = _MainObjView.MapObj.getCenter();
                }
                if(_MainObjSend && _CenterPos){
                    _MainObjSend.MapObj.panTo(_CenterPos);
                }
            }
            $("#PosCopyBtn").on("click",naoetu.bind(this,BtnFunction));

        }

        //マーカータイプのリスト
        ///位置の送信用
        if(pIsSend == true){
            this.typeList = new Array();
            this.typeList.push({TypeId:"1",Name:"御幸町"});
            var eleSelect = document.getElementById(this.TypeListName);
            for(i=0;i<this.typeList.length;i++){
                var buf = this.typeList[i];
                var option = document.createElement('option');
                option.setAttribute('value', buf.TypeId);
                option.innerHTML = buf.Name;
                eleSelect.appendChild(option);
            }
        }
        ///位置の表示用
        if(pIsViewer == true){
            this.typeList = new Array();
            this.typeList.push({TypeId:"1",Name:"御幸町"});
            var eleSelect = document.getElementById(this.TypeListName);
            for(i=0;i<this.typeList.length;i++){
                var buf = this.typeList[i];
                var option = document.createElement('option');
                option.setAttribute('value', buf.TypeId);
                option.innerHTML = buf.Name;
                eleSelect.appendChild(option);
            }
        }


        //中心マーカー関連
        ////画像
        this.centerImg = 'img/center.gif';
        ////マーカー群
        this.Markers = [];

        //固定座標定義
        ////八坂神社
        this.gpsYasaka = {lat: 37.173332, lng: 138.241317};

        //地図の初期位置設定
        if(pDefLat){
            this.defPos = {lat: pDefLat, lng: pDefLng};
        }else{
            this.defPos = this.gpsYasaka;
        }

    },
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // 地図初期化
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    initMap : function(){

        //地図初期化
        this.MapObj = new google.maps.Map(document.getElementById(this.mapName),{
            center: this.defPos,
            zoom: this.defZoom,
            gestureHandling : this.MapPanMode
        });

        //中央に表示するターゲットスコープの画像設定
        this.imgCenter = {
            url: this.centerImg,  /* 画像ファイル名(32x32 中央16x16) */
            size: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(16, 16)
        };

        //初期動作実行
        this.onMapDragEnd();
        //中心カーソル表示
        this.onMapBoundsChanged();

        //地図のイベントハンドル
        this.MapObj.addListener("dragend",naoetu.bind(this,this.onMapDragEnd));
        this.MapObj.addListener("bounds_changed",naoetu.bind(this,this.onMapBoundsChanged));

        //マーカーの作成 テスト
        this.Markers["item1"] = new naoetu.marker("img/type1.png","img/type1.png","img/type1.png","img/type1.png");

        //マーカにマップオブジェクトを設定する（この段階ではまだ地図上に描画されない）
        for(var key in this.Markers) {
            this.Markers[key].SetMapObject(this.MapObj);
        }
        //オブジェクトを設定した後は、以下のようにSetPosition()に座標を指定すれば地図上に描画される
        //this.Markers["test"].SetPosition(this.gpsYasaka);


    },
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // 地図イベント
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    //-----------------------------    
    // マップのドラッグエンド
    //-----------------------------    
    onMapDragEnd : function(){
        this.ShowCenter();
    },
    //-----------------------------    
    // マップの位置変更
    //-----------------------------    
    onMapBoundsChanged : function(){
        this.ShowCenter();
        this.DrawMarkerCenter();
    },
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // 地図操作メソッド
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    //-----------------------------    
    // 中心位置表示
    //-----------------------------    
    ShowCenter : function(){
        var center = this.MapObj.getCenter();
        if(this.outNameLat != ""){
            document.getElementById(this.outNameLat).value = center.lat();
        }
        if(this.outNameLng != ""){
            document.getElementById(this.outNameLng).value = center.lng();
        }
        naoetu.log.out(1,"onMapDragEnd x=" + center.lat() + "/" + "Y=" + center.lng() );
    },
    //-----------------------------    
    // 中心マーカーの描画
    //-----------------------------    
    DrawMarkerCenter : function(){
        var center = this.MapObj.getCenter();
        if(!this.makCenter){
            this.makCenter = new google.maps.Marker({
                position: {lat: center.lat(), lng: center.lng()},
                map: this.MapObj,
                icon: this.imgCenter,
                clickable: false, /* クリック不可 */
                zIndex: 0
            });
            this.makCenter.setMap(this.MapObj);
        }else{
            this.makCenter.setPosition(center);
        }
    },
    //-----------------------------    
    // マーカーの描画
    //-----------------------------
    DrawMarker : function(pLat,pLng,pType){
    }
}
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//
// マーカークラス
//
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
naoetu.marker = function(){return this.initialize.apply(this,arguments);};
naoetu.marker.prototype = {
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // コンストラクタ
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    initialize : function(pSrcDicWS,pSrcDicWN,pSrcDicES,pSrcDicEN){
        this.SrcDicWS = pSrcDicWS;
        this.SrcDicWN = pSrcDicWN;
        this.SrcDicES = pSrcDicES;
        this.SrcDicEN = pSrcDicEN;

        this.ImgDicWS = new google.maps.MarkerImage(
            this.SrcDicWS,
            new google.maps.Size(32,32),
            new google.maps.Point(0,0),
            new google.maps.Point(16,16)
        );
        this.ImgDicWN = new google.maps.MarkerImage(
            this.SrcDicWN,
            new google.maps.Size(32,32),
            new google.maps.Point(0,0),
            new google.maps.Point(16,16)
        );
        this.ImgDicES = new google.maps.MarkerImage(
            this.SrcDicES,
            new google.maps.Size(32,32),
            new google.maps.Point(0,0),
            new google.maps.Point(16,16)
        );
        this.ImgDicEN = new google.maps.MarkerImage(
            this.SrcDicEN,
            new google.maps.Size(32,32),
            new google.maps.Point(0,0),
            new google.maps.Point(16,16)
        );
        this.Marker = false;
        this.BefPos = {lat:false,lng:false};
        this.Dic = {NS:"",WE:""};
        this.DicImg = "";
        this.MapObj = false;
    },
    //-----------------------------    
    // マップオブジェクトの設定
    //-----------------------------
    SetMapObject : function(pMapObj){
        this.MapObj = pMapObj;
    },
    //-----------------------------
    // マーカーの描画
    //-----------------------------
    SetPosition : function(pPos){

        if(!this.MapObj){
            return false;
        }

        //方向の取得
        var bufNow = 0;
        var bufBef = 0;
        var ans = 0;
        var isNSChange = false;
        var isWEChange = false;

        ////北 or 南
        bufNow = pPos.lng * 100000;
        bufBef = this.BefPos.lng * 100000;
        ans = bufNow - bufBef;
        if(this.Dic.NS == ""){
            this.Dic.NS = "N";
        }else{
            if(ans >= 3){
                //北へ移動
                this.Dic.NS = "N";
                isNSChange = true;
            }else if(ans <= -3){
                //南へ移動
                this.Dic.NS = "S";
                isNSChange = true;
            }else{
                //変化なし
                if(this.Dic.NS == ""){
                    this.Dic.NS = "N";
                    isNSChange = true;
                }
            }
        }

        ////東 or 西
        bufNow = pPos.lat * 100000;
        bufBef = this.BefPos.lat * 100000;
        ans = bufNow - bufBef;
        if(this.Dic.WE == ""){
            this.Dic.WE = "W";
        }else{
            if(ans >= 3){
                //東へ移動
                this.Dic.WE = "W";
            }else if(ans <= -3){
                //西へ移動
                this.Dic.WE = "E";
            }else{
                //変化なし
            }
        }

        //方角に応じた画像の選択
        var DicImg = "";
        if(this.Dic.WE == "W" && this.Dic.NS == "N"){
            DicImg = this.ImgDicWN;
        }else if(this.Dic.WE == "W" && this.Dic.NS == "S"){
            DicImg = this.ImgDicWS;
        }else if(this.Dic.WE == "E" && this.Dic.NS == "N"){
            DicImg = this.ImgDicEN;
        }else if(this.Dic.WE == "E" && this.Dic.NS == "S"){
            DicImg = this.ImgDicES;
        }

        //画像変更によるマーカーの更新
        if(this.DicImg != DicImg || !this.Marker){
            this.DicImg = DicImg;
            if(!this.Marker){
                //マーカー作成
                this.Marker = new google.maps.Marker({
                    position: {lat: pPos.lat, lng: pPos.lng},
                    map : this.MapObj,
                    icon: this.DicImg,
                    clickable: false, /* クリック不可 */
                    zIndex: 0
                });
                this.Marker.setMap(this.MapObj);
            }else{
                //マーカーが作成さてるから画像のみ変更
                this.Marker.setIcon(this.DicImg);
            }
        }

        //位置の設定
        this.Marker.setPosition(pPos);

        //位置の退避
        this.BefPos.lat = pPos.lat;
        this.BefPos.lng = pPos.lng;

        //画像の退避
        this.DicImg = DicImg;

    }
}

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//
//NaoetuGPSマップ - naoetu.map用 Ajaxクラス
//
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
naoetu.mapAjax = function(){return this.initialize.apply(this,arguments);};
naoetu.mapAjax.prototype = {
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // コンストラクタ
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    initialize : function(pNaoetuObj,pLatName,pLngName,pTypeName,pButtonName){

        this.MainObj = pNaoetuObj;

        this.LatName  = pLatName;
        this.LngName  = pLngName;
        this.TypeName = pTypeName;
        this.ButtonName = pButtonName;
        this.SetEventFunction = false;
        this.ResultFunction = false;
        this.PosDataParse = false;

    },
    //-----------------------------
    // イベントの設定
    //-----------------------------
    SetEvent : function(pSetEventFunction,pResultFunction){
        this.SetEventFunction = pSetEventFunction;
        this.ResultFunction = pResultFunction;
        $("#" + this.ButtonName).on("click",naoetu.bind(this,this.SetEventFunction));
        return false;
    },
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆ <  
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆ <  
    //
    // 位置情報の送信
    //
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆ <  
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆ <  
    SendPos : function(){

        var lat  = document.getElementById(this.LatName).value;
        var lng  = document.getElementById(this.LngName).value;
        var type = document.getElementById(this.TypeName).value;
        var SendData = {
            lat:lat,
            lng:lng,
            type:type
        }

        var ajaxParam = {};
        ajaxParam = {
            type: 'get',
            data: SendData,
            dataType: 'json'
        };

        var RunMode = "";
        RunMode = "Socket";
        //RunMode = "Http";

        //----------
        //Socketで送信
        //----------
        if(RunMode == "Socket"){
            NaoetuMain.socket.emit("gpswrite",SendData,naoetu.bind(this,this.onAjaxDoneSendPos));
        }

        //----------
        //Httpで送信
        //----------
        if(RunMode == "Http"){
            var ajaxObj = $.ajax('http://27.120.99.9:50001/gpswrite',ajaxParam)
            .done(naoetu.bind(this,this.onAjaxDoneSendPos)) //成功
            .fail(naoetu.bind(this,this.onAjaxFailSendPos)) //失敗
            .always(naoetu.bind(this,this.onAjaxAlwaysSendPos)); //成功でも失敗でも
        }

    },
    //Ajaxの戻り値 ... 成功時
    onAjaxDoneSendPos : function(pRes){
        console.log('AjaxDone' + pRes);
        var eleResult = document.getElementById(this.MainObj.ResultName);

        //送信時間の表示
        var bufDate= new Date();
        var year = bufDate.getFullYear();
        var month = bufDate.getMonth() + 1;
        var date = bufDate.getDate();
        var hour = bufDate.getHours();
        var minute = bufDate.getMinutes();
        var second = bufDate.getSeconds();
        eleResult.innerHTML = " 送信済 " + ('00' + hour).slice(-2) + ":" + ('00' + minute).slice(-2) + ":" + ('00' + second).slice(-2);
    },
    //Ajaxの戻り値 ... 失敗時
    onAjaxFailSendPos : function(pRes){
        console.log('AjaxFail');
    },
    //Ajaxの戻り値 ... どんな時も、どんな時も♪
    onAjaxAlwaysSendPos : function(pRes){
        console.log('AjaxAlways');
    },
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆ >  
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆ >  
    //
    // 位置情報の送信
    //
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆ >  
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆ >  




    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆ <  
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆ <  
    //
    // 位置情報の取得
    //
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆ <  
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆ <  
    getPosDatas : function(){

        var type = document.getElementById(this.TypeName).value;
        var ajaxParam = {};
        ajaxParam = {
            type: 'get',
            data: {mode:"NOMAL",type:type},
            dataType: 'json'
        };

        var ajaxObj = $.ajax('http://27.120.99.9:50001/gpsread',ajaxParam)
            .done(naoetu.bind(this,this.onAjaxDoneGetPosData)) //成功
            .fail(naoetu.bind(this,this.onAjaxFailGetPosData)) //失敗
            .always(naoetu.bind(this,this.onAjaxAlwaysGetPosData)); //成功でも失敗でも

    },
    //Ajaxの戻り値 ... 成功時
    onAjaxDoneGetPosData : function(pRes){
        console.log('AjaxDone' + pRes);

        //ちょっとゴチャゴチャっとしてしまった...(´・ω・`)ウゥ
        //他の処理を止めたくなかったからDeferred使って直列処理にしたらthisが不安定になってしまた
        //その不安定さを回避するのにゴチャゴチャになってしまったゼ

        //直列処理
        ////パース処理
        var bufFunction1 = function(pThis){
            var def = $.Deferred();
            var FunctionSub = function(){
                this.PosDataParse = this.getPosDataParse(pRes.result.fields);
                def.resolve();
            }
            setTimeout(naoetu.bind(pThis,FunctionSub),1);
            return def.promise();
        }
        ////描画処理
        var bufFunction2 = function(){
            var def = $.Deferred();
            var FunctionSub = function(){
                this.getPosDatasShow(this.PosDataParse);
                def.resolve();
            }
            setTimeout(naoetu.bind(this,FunctionSub),1);
            return def.promise();
        }
        ////処理実行
        var bufFunction = function(){
            bufFunction1(this).then(naoetu.bind(this,bufFunction2));
        };
        setTimeout(naoetu.bind(this,bufFunction),1);

    },
    //Ajaxの戻り値 ... 失敗時
    onAjaxFailGetPosData : function(pRes){
        console.log('AjaxFail');
    },
    //Ajaxの戻り値 ... どんな時も、どんな時も♪
    onAjaxAlwaysGetPosData : function(pRes){
        console.log('AjaxAlways');
    },
    //取得した座標情報をパース
    getPosDataParse : function(pFields){
        //処理内容が大きい為、別途記載
        console.log('naoetu.mapAjax.getPosDataParse　空処理');
    },
    //地図への表示
    getPosDatasShow : function(pDatas){
        //処理内容が大きい為、別途記載
        console.log('naoetu.mapAjax.getPosDatasShow　地図への表示');
        var isCenterPosGet = false;
        var CenterPos = false;
        for(var key in pDatas) {
            if(this.MainObj.MapDrawObjects[key]){
                this.MainObj.MapDrawObjects[key].updateData(pDatas[key]);
            }else{
                this.MainObj.MapDrawObjects[key] =  new naoetu.mapDrawObject(this.MainObj,pDatas[key]);
            }
            setTimeout(naoetu.bind(this.MainObj.MapDrawObjects[key],this.MainObj.MapDrawObjects[key].draws),1);
            
            //先頭の座標を取得　地図の中心座標等に使用する
            if(isCenterPosGet == false){
                if(pDatas[key].length > 0){
                    CenterPos = new google.maps.LatLng(pDatas[key][0].posY, pDatas[key][0].posX);
                }
                isCenterPosGet = true;
            }
        }

        //地図の移動
        if(isCenterPosGet == true){
            var bufFnction = function(){
                this.MainObj.MapObj.panTo(CenterPos);
            }
            setTimeout(naoetu.bind(this,bufFnction),100);
        }

    }
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆ >  
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆ >  
    //
    // 位置情報の取得
    //
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆ >  
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆ >  
}

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//
//取得した座標情報をパース
//
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
naoetu.mapAjax.prototype.getPosDataParse = function(pFields){

    if(pFields.length <= 0){
        return false;
    }

    //pFieldsの内容----------------------
    var tmpFields = {
        fields : [
                    {
                        unid : 0,
                        posX : 0,
                        posY : 0,
                        typeId : 0,
                        add_date : ""
                    },
                    {繰り返し:""}
                ]
    }
    //----------------------------------

    var befTypeId = "";
    var nowTypeId = "";
    var TypeGroup = [];
    if(pFields.length > 0){
        nowTypeId = pFields[0].typeId;
    }
    for(var i=0;i<pFields.length;i++){

        var bufFields = pFields[i];

        if(nowTypeId != befTypeId){
            //TypeIdが変わる毎に描画オブジェクト群を作成する
            TypeGroup["type" + nowTypeId] = new Array();
        }

        var _dataType = "";

        //----------------
        //先頭ポイントの追加
        //----------------
        var isPointAdd = false;
        if(i == 0){
            ////最初の地点
            _dataType = "POINTN";
            isPointAdd = true;
        }else{
            isPointAdd = false;
        }
        ////追加
        if(isPointAdd == true){
            TypeGroup["type" + nowTypeId].push({
                dataType : _dataType,
                unid : bufFields.unid,
                posX : bufFields.posX,
                posY : bufFields.posY,
                typeId : bufFields.typeId,
                add_date : bufFields.add_date
            });
        }

        //----------------
        //ラインの追加
        //----------------
        var isLineAdd = false;
        if(i >= 1 && i == pFields.length - 1){
            //最後のライン
            _dataType = "LINEP";
            befField = pFields[i-1];
            isLineAdd = true;
        }else if(i >= 1){
            //途中のライン
            _dataType = "LINEL";
            befField = pFields[i-1];
            isLineAdd = true;
        }
        if(isLineAdd == true){
            TypeGroup["type" + nowTypeId].push({
                dataType : _dataType,
                unid1 : bufFields.unid,
                unid2 : befField.unid,
                pos1 : {
                    posX:bufFields.posX,
                    posY:bufFields.posY
                },
                pos2 : {
                    posX:befField.posX,
                    posY:befField.posY
                },
                typeId : bufFields.typeId,
                add_date1 : bufFields.add_date,
                add_date2 : befField.add_date
            });
        }

        //----------------
        //途中と最後のポイントの追加
        //----------------
        if(i == 0){
            ////最初の地点
            isPointAdd = false;
        }else if(i == pFields.length - 1){
            ////最後の地点
            _dataType = "POINTP";
            isPointAdd = true;
        }else{
            ////途中の地点
            _dataType = "POINTL";
            isPointAdd = true;
        }
        ////追加
        if(isPointAdd == true){
            TypeGroup["type" + nowTypeId].push({
                dataType : _dataType,
                unid : bufFields.unid,
                posX : bufFields.posX,
                posY : bufFields.posY,
                typeId : bufFields.typeId,
                add_date : bufFields.add_date
            });
        }

        befTypeId = nowTypeId;
    }

    console.log("GetGpsData パース 完了");

    return TypeGroup;

}

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//
// 地図上に図形を描画
//
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
naoetu.mapDrawObject = function(){return this.initialize.apply(this,arguments);};
naoetu.mapDrawObject.prototype = {
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // コンストラクタ
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    initialize : function(pNaoetuObj,pDrawDataSrc){
        this.MainObj = pNaoetuObj;
        this.DrawDataSrc = pDrawDataSrc;
        this.DrawMark = false;
        this.DrawSymbols;
        this.DrawLinesSolid = false;
        this.DrawLinesDot = false;
        this.DrawLineSolidsSrc = new Array();
        this.DrawLineDotsSrc = new Array();
        this.DrawLinesAnime = false;
        this.DrawLinesAnimeLineSymbol = false;
        this.AnimeTimerId = false;
        
    },
    //データ更新
    updateData : function(pDrawDataSrc){
        this.DrawDataSrc = pDrawDataSrc;
    },
    //描画処理
    draws : function(){
        var BufSolidsSrc = new Array();
        var BufDotsSrc = new Array();
        var BufAnimeLineSrc = new Array();
        //マーカにマップオブジェクトを設定する
        for(var i=0;i < this.DrawDataSrc.length;i++) {
            var bufData = this.DrawDataSrc[i];
            if(bufData.dataType == "POINTN"){
                //最初のポイント → アイコン
                this.drawMark(bufData);
                BufSolidsSrc.push(new google.maps.LatLng(bufData.posY, bufData.posX));
                //アニメーション用ポイント追加
                BufAnimeLineSrc.push(new google.maps.LatLng(bufData.posY, bufData.posX));
            }else if(bufData.dataType == "POINTL"){
                //途中のポイント  → シンボル
                this.drawSymbol(bufData);
                //アニメーション用ポイント追加
                BufAnimeLineSrc.push(new google.maps.LatLng(bufData.posY, bufData.posX));
            }else if(bufData.dataType == "POINTP"){
                //最後のポイント
                //描画しない
                //アニメーション用ポイント追加
                BufAnimeLineSrc.push(new google.maps.LatLng(bufData.posY, bufData.posX));
            }else if(bufData.dataType == "LINEL"){
                //途中のライン → 実線
                BufSolidsSrc.push(new google.maps.LatLng(bufData.pos1.posY, bufData.pos1.posX));
            }else if(bufData.dataType == "LINEP"){
                //最後のライン → 点線
                BufDotsSrc.push(new google.maps.LatLng(bufData.pos1.posY, bufData.pos1.posX));
                BufDotsSrc.push(new google.maps.LatLng(bufData.pos2.posY, bufData.pos2.posX));
            }
        }
        //実線描画
        this.drawLineSolid(BufSolidsSrc);
        //点線描画
        this.drawLineDot(BufDotsSrc);
        //アニメーションライン描画
        this.drawSymbolAnimation(BufAnimeLineSrc.reverse());
    },
    //マーク描画
    drawMark : function(pData){
        //マーカーの作成
        if(!this.DrawMark){
            this.DrawMark = new naoetu.marker(
                "img/type%1%WS.png".replace("%1%",pData.typeId),
                "img/type%1%WN.png".replace("%1%",pData.typeId),
                "img/type%1%ES.png".replace("%1%",pData.typeId),
                "img/type%1%EN.png".replace("%1%",pData.typeId)
                );

            //マーカにマップオブジェクトを設定する
            this.DrawMark.SetMapObject(this.MainObj.MapObj);
        }
        //マーカー描画 or 位置変更
        this.DrawMark.SetPosition({lat:pData.posY,lng:pData.posX});
    },
    //シンボル描画
    drawSymbol : function(pData){
    },
    //ライン(実線)描画
    drawLineSolid : function(pDataGoogleLatLng){
        if(this.DrawLinesSolid){
            //すでに存在した場合は削除
            this.DrawLinesSolid.setMap(null);
        }
        this.DrawLinesSolid = new google.maps.Polyline({
            path: pDataGoogleLatLng,
            strokeColor: "blue",
            strokeWeight: 3,
            map: this.MainObj.MapObj
        });
    },
    //ライン(点線)描画
    drawLineDot : function(pDataGoogleLatLng){
        if(this.DrawLinesDot){
            //すでに存在した場合は削除
            this.DrawLinesDot.setMap(null);
        }
        // var lineSymbol = {
        //     path: 'M 0,-1 0,1',
        //     strokeOpacity: 0.5,
        //     scale: 4
        //   };
        this.DrawLinesDot = new google.maps.Polyline({
            path: pDataGoogleLatLng,
            strokeColor: "blue",
            strokeWeight: 3,
            strokeOpacity: 0.5,
        //    icons: [{
        //        icon: lineSymbol,
        //        offset: '0',
        //        repeat: '13px'
        //      }],
            map: this.MainObj.MapObj
        });
    },
    //アニメーションの削除
    drawSymbolAnimationClear : function(){
        //描画中のアニメーションを削除する
        if(this.DrawLinesAnime){
            this.DrawLinesAnime.setMap(null)
        }
        //アニメーションのタイマーを削除
        if(this.AnimeTimerId){
            clearInterval(this.AnimeTimerId);
        }
    },
    //アニメーション設定
    drawSymbolAnimation : function(coordinatesArray){
        
        //アニメーションの削除
        this.drawSymbolAnimationClear();

        //ラインを走るシンボルを定義
        var symbol = google.maps.SymbolPath.FORWARD_CLOSED_ARROW;

        //ラインを走るシンボル作成
        this.DrawLinesAnimeLineSymbol = {
            path:symbol,
            scale:4,
            fillColor:"#ff0000",
            fillOpacity:1,
            strokeOpacity:1,
            strokeColor:"#ff0000"
        };

        //透明のラインを地図へ追加
        this.DrawLinesAnime = new google.maps.Polyline({
            geodesic: true,//trueなら大圏コース、falseなら普通の直線コース
            path: coordinatesArray,
            icons: [{
              icon: this.DrawLinesAnimeLineSymbol,
              offset: '100%'
            }],
            strokeOpacity:0,
            strokeColor:"#ff0000",
            editable:false,
            draggable:false,
            map : this.MainObj.MapObj
        });

        //アニメーション実行
        var animateSymbol = function () {
            var count = 0;
            var anime = function() {
                count = (count + 1) % 200;
                var icons = this.DrawLinesAnime.get('icons');
                icons[0].offset = (count / 2) + '%';
                this.DrawLinesAnime.set('icons', icons);
            };
            this.AnimeTimerId = window.setInterval(naoetu.bind(this,anime), 20);
        }
        setTimeout(naoetu.bind(this,animateSymbol),1);
    }

}

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//
//NaoetuGPSマップ - naoetu.map用 Ajaxクラス
//
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
naoetu.main = function(){return this.initialize.apply(this,arguments);};
naoetu.main.prototype = {
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // コンストラクタ
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    initialize : function(){
        this.naoetumaps = new Array();
        this.socket = false;
        this.SocketObj = false;
    },
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // 地図関連メソッド
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    //追加
    MapAdd : function(pNaoetuMapObj){
        this.naoetumaps.push(pNaoetuMapObj);
    },
    //実体化
    initMap : function(){
        for(var i=0;i < this.naoetumaps.length;i++){
            this.naoetumaps[i].initMap();
        }
    },
    //指定したキーのnaoetu.mapオブジェクトを返す
    getMap : function(pName){
        for(var i=0;i<this.naoetumaps.length;i++){
            var buf = this.naoetumaps[i];
            if(buf.mapName == pName){
                return buf;
            }
        }
        return false;
    },
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // GoogleMap API Javascript の読み込み完了時
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    googlemapComp : function(){

        //地図の初期化
        this.initMap();

        //Socket.ioコネクション
        this.SocketConnect();

    },
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆ <  
    // Socket.io 関連メソッド
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    //Socket.ioのコネクション
    SocketConnect : function(){
        this.socket = false;
        this.SocketObj = new naoetu.socket(this,this.SocketSuccessFunction,this.SocketFailedFunction);
        this.SocketObj.connection();
    },
    //-----------------------------    
    // コネクション成功時
    //-----------------------------    
    SocketSuccessFunction : function(){
        naoetu.log.out(1,"naoetu.map.Socket SuccessFunction start...");
        naoetu.log.out(1,"naoetu.map.Socket SuccessFunction ...end");
        this.socket = this.SocketObj.Socket;
    },
    //-----------------------------    
    // コネクション失敗時(´・ω・`)
    //-----------------------------    
    SocketFailedFunction : function(){
        naoetu.log.out(1,"naoetu.map.Socket FailedFunction start...");
        naoetu.log.out(1,"naoetu.map.Socket FailedFunction ...end");
        this.socket = false;
    }

    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆    
    // Socket.io 関連メソッド 
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆ >
}

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//
//NaoetuGPS - socket.ioクラス
//
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■　
naoetu.socket = function(){return this.initialize.apply(this,arguments);};
naoetu.socket.prototype = {
    initialize : function(pParentObj,pSucccessFnction,pFailedFunction){
        this.ParentObj = pParentObj;
        this.SucccessFnction = pSucccessFnction;
        this.FaildFunction = pFailedFunction;
        this.Socket = false;
        this.SocketData = false;
        this.SocketFnc = false;
    },
    //接続実行
    connection : function(){
        naoetu.log.out(1,"Socket.io connection start...");

        if(!this.Socket){
            var _con = function(){
                return io.connect("http://27.120.99.9:50001/naoetugps");
            }
            this.Socket = _con();
        }

        this.Socket.on("greeting",naoetu.bind(this,this.onConSucccess));

        naoetu.log.out(1,"Socket.io connection ...finish");

    },
    //接続成功(・_・)/
    onConSucccess : function(pData,pFnc){
        naoetu.log.out(1,"Socket.io connection success!!");
        naoetu.log.out(1,"Server Result ====> " + pData.msg);
        this.SocketData = pData;
        this.SocketFnc = pFnc;
        setTimeout(naoetu.bind(this.ParentObj,this.SucccessFnction,1));
    },
    //接続失敗(´・ω・`)??
    onConFailed : function(){
        naoetu.log.out(1,"Socket.io connection failed (´・ω・`)??");
        this.Socket = false;
        setTimeout(naoetu.bind(this.ParentObj,this.FaildFunction,1));
    }
}


var NaoetuMain = new naoetu.main();
//                             pIsSend,pIsViewer,pDefLat,pDefLng,pDefZoom,pMapName,pOutNameLat,pOutNameLng,pTypeListName,pSendBtnName,pResultName,pMapPanMode(cooperative：二本指/greedy:一本指)
//地図表示側
NaoetuMain.MapAdd(new naoetu.map(false,true,false,false,15,"mapviewer-map","","","TypeListViewer","DataGetBtn","","cooperative"));
//座標送信側
NaoetuMain.MapAdd(new naoetu.map(true,false,false,false,18,"mapsend-map","posLat","posLng","TypeList","SendBtn","result1","greedy"));