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

//---------------------------------------------
//
//NaoetuGPSマップ
//
//---------------------------------------------
naoetu.map = function(){return this.initialize.apply(this,arguments);};
naoetu.map.prototype = {
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // コンストラクタ
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    initialize : function(pIsSend,pIsViewer,pDefLat,pDefLng,pDefZoom,pMapName,pOutNameLat,pOutNameLng,pTypeListName,pSendBtnName){

        this.MapObj = false;
        this.defPos = false;
        this.imgCenter = false;
        this.makCenter = false;
        this.isSend = pIsSend;      //座標送信機能の有無
        this.isViewer = pIsViewer;  //ビューワー機能の有無

        //地図の初期ズーム番号
        this.defZoom = pDefZoom;

        //各Element Id
        this.outNameLat = pOutNameLat;      //(Element Id) Lat(Y)緯度
        this.outNameLng = pOutNameLng;      //(Element Id) Lng(X)経度
        this.mapName = pMapName;            //(Element Id) 地図
        this.TypeListName = pTypeListName;  //(Element Id) GPSタイプのリスト
        this.SendBtnName = pSendBtnName;    //(Element Id) 送信ボタン

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
        }

        //マーカータイプのリスト
        ///位置の送信用
        if(pIsSend == true){
            this.typeList = new Array();
            this.typeList.push({TypeId:"0",Name:"自分"});
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
            this.typeList.push({TypeId:"-1",Name:"全て"});
            this.typeList.push({TypeId:"0",Name:"自分"});
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
            zoom: this.defZoom
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

        //マーカにマップオブジェクトを設定する
        for(var key in this.Markers) {
            this.Markers[key].SetMapObject(this.MapObj);
        }

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
//---------------------------------------------
//
// マーカークラス
//
//---------------------------------------------
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
//---------------------------------------------
//
//NaoetuGPSマップ - naoetu.map用 Ajaxクラス
//
//---------------------------------------------
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
    //-----------------------------
    // 位置情報の送信
    //-----------------------------
    SendPos : function(){

        var lat  = document.getElementById(this.LatName).value;
        var lng  = document.getElementById(this.LngName).value;
        var type = document.getElementById(this.TypeName).value;

        var ajaxParam = {};
        ajaxParam = {
            type: 'get',
            data: {lat:lat,lng:lng,type:type},
            dataType: 'json'
        };

        var ajaxObj = $.ajax('http://27.120.99.9:50001/gpswrite',ajaxParam)
            .done(naoetu.bind(this,this.onAjaxDoneSendPos)) //成功
            .fail(naoetu.bind(this,this.onAjaxFailSendPos)) //失敗
            .always(naoetu.bind(this,this.onAjaxAlwaysSendPos)); //成功でも失敗でも

    },
    //Ajaxの戻り値 ... 成功時
    onAjaxDoneSendPos : function(pRes){
        console.log('AjaxDone' + pRes);
    },
    //Ajaxの戻り値 ... 失敗時
    onAjaxFailSendPos : function(pRes){
        console.log('AjaxFail');
    },
    //Ajaxの戻り値 ... どんな時も、どんな時も♪
    onAjaxAlwaysSendPos : function(pRes){
        console.log('AjaxAlways');
    },
    //-----------------------------
    // 位置情報の取得
    //-----------------------------
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
        this.getPosDatasShow(pRes.fields);
    },
    //Ajaxの戻り値 ... 失敗時
    onAjaxFailGetPosData : function(pRes){
        console.log('AjaxFail');
    },
    //Ajaxの戻り値 ... どんな時も、どんな時も♪
    onAjaxAlwaysGetPosData : function(pRes){
        console.log('AjaxAlways');
    },
    //地図への表示
    getPosDatasShow : function(){
        //処理内容が大きい為、別途記載
    }
}
//------------------------------------------
//
//
//
//地図への表示
//
//
//
//------------------------------------------
naoetu.mapAjax.getPosDatasShow = function(pFields){
    if(pFields.length <= 0){
        return;
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
            TypeGroup[nowTypeId] = new Array();
        }

        var _dataType = "";

        //ポイントの追加
        if(i == 0){
            ////最初の地点
            _dataType = "POINTN";
        }else if(i == pFields.length){
            ////最後の地点
            _dataType = "POINTP";
        }else{
            ////途中の地点
            _dataType = "POINTL";
        }
        ////追加
        TypeGroup[nowTypeId].push({
            dataType : _dataType,
            unid : bufFields.unid,
            posX : bufFields.posX,
            posY : bufFields.posY,
            typeId : bufFields.pTypeId,
            add_date : bufFields.add_date
        });

        //ラインの追加
        var isLineAdd = false;
        if(i >= 1 && i == pFields.length){
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
            TypeGroup[nowTypeId].push({
                dataType : _dataType,
                unid1 : bufFields.unid,
                unid2 : bufFields.unid,
                posX1 : bufFields.posX,
                posY1 : bufFields.posY,
                posX2 : bufFields.posX,
                posY2 : bufFields.posY,
                typeId : bufFields.pTypeId,
                add_date1 : bufFields.add_date,
                add_date2 : bufFields.add_date
            });
        }

        nowTypeId = befTypeId;
    }

}

//---------------------------------------------
//
//NaoetuGPSマップ - naoetu.map用 Ajaxクラス
//
//---------------------------------------------
naoetu.maps = function(){return this.initialize.apply(this,arguments);};
naoetu.maps.prototype = {
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // コンストラクタ
    //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    initialize : function(){
        this.naoetumaps = new Array();
    },
    //追加
    add : function(pNaoetuMapObj){
        this.naoetumaps.push(pNaoetuMapObj);
    },
    //実体化
    initMap : function(){
        for(var i=0;i < this.naoetumaps.length;i++){
            this.naoetumaps[i].initMap();
        }
    }
}

var naoetumaps = new naoetu.maps();
//                             pIsSend,pIsViewer,pDefLat,pDefLng,pDefZoom,pMapName,pOutNameLat,pOutNameLng,pTypeListName,pSendBtnName
naoetumaps.add(new naoetu.map(true,false,false,false,18,"mapsend-map","posLat","posLng","TypeList","SendBtn"));
naoetumaps.add(new naoetu.map(false,true,false,false,15,"mapviewer-map","","","TypeListViewer","DataGetBtn"));

