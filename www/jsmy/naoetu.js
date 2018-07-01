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
    initialize : function(pDefLat,pDefLng,pDefZoom,pMapName,pOutNameLat,pOutNameLng,pTypeListName,pSendBtnName){

        this.mapobj = false;
        this.outNameLat = pOutNameLat;
        this.outNameLng = pOutNameLng;
        this.mapName = pMapName;
        this.defZoom = pDefZoom;
        this.defPos = false;
        this.imgCenter = false;
        this.makCenter = false;
        this.centerImg = 'img/center.gif';
        this.TypeListName = pTypeListName;
        this.SendBtnName = pSendBtnName;


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


        //八坂神社
        this.gpsYasaka = {lat: 37.173332, lng: 138.241317};

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
        this.mapobj = new google.maps.Map(document.getElementById(this.mapName),{
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
        this.mapobj.addListener("dragend",naoetu.bind(this,this.onMapDragEnd));
        this.mapobj.addListener("bounds_changed",naoetu.bind(this,this.onMapBoundsChanged));


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
        var center = this.mapobj.getCenter();
        document.getElementById(this.outNameLat).value = center.lat();
        document.getElementById(this.outNameLng).value = center.lng();
        naoetu.log.out(1,"onMapDragEnd x=" + center.lat() + "/" + "Y=" + center.lng() );
    },
    //-----------------------------    
    // 中心マーカーの描画
    //-----------------------------    
    DrawMarkerCenter : function(){
        var center = this.mapobj.getCenter();
        if(!this.makCenter){
            this.makCenter = new google.maps.Marker({
                position: {lat: center.lat(), lng: center.lng()},
                map: this.mapobj,
                icon: this.imgCenter,
                clickable: false, /* クリック不可 */
                zIndex: 0
            });
            this.makCenter.setMap(this.mapobj);
        }else{
            this.makCenter.setPosition(center);
        }
    }
}
var naoetumap = new naoetu.map(false,false,18,"mapsend-map","posLat","posLng","TypeList","SendBtn");