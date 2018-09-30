var soundpack=[];
//裝所有音樂的資料
var soundpack_index=[1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,8,8.5,9,9.5,10,11,11.5,12,12.5,13,13.5,14,15];
//所有會用到的index 會用到的數字
for(var i=0;i<soundpack_index.length;i++){
  soundpack.push({
    //將每個音用sound_index 紀錄順序編號+網站 存入 soundpack
    number: soundpack_index[i],
    url: "https://awiclass.monoame.com/pianosound/set/"+soundpack_index[i]+".wav"
  });
}
var vm =new Vue({
  el: "#app",
  data: {
    sounddata: soundpack,
    notes: [{"num":1,"time":150},{"num":1,"time":265},{"num":5,"time":380},{"num":5,"time":501},{"num":6,"time":625},{"num":6,"time":748},{"num":5,"time":871},{"num":4,"time":1126},{"num":4,"time":1247},{"num":3,"time":1365},{"num":3,"time":1477},{"num":2,"time":1597},{"num":2,"time":1714},{"num":1,"time":1837}],
    now_note_id: 0,
    time_id: 0,
    playing_time: 0,
    record_time: 0,
    now_press_key: -1,
    player: null,
    recorder: null,
    display_keys: [
      {num: 1,key: 90,type:'white'},
      //num 要對應到要撥的聲音檔案
      //key要撥的聲音 對應到鍵盤上的哪個按鍵 
      // 90=ascll key 鍵盤 按下對應的數字 例 按A= 電腦讀到45
      //90 =Z
      {num: 1.5,key: 83  ,type:'black'},
      {num: 2,key: 88  ,type:'white'},
      {num: 2.5,key: 68  ,type:'black'},
      {num: 3,key: 67  ,type:'white'},
      {num: 4,key: 86  ,type:'white'},
      {num: 4.5,key: 71  ,type:'black'},
      {num: 5,key: 66  ,type:'white'},
      {num: 5.5,key: 72  ,type:'black'},
      {num: 6,key: 78  ,type:'white'},
      {num: 6.5,key: 74  ,type:'black'},
      {num: 7,key: 77  ,type:'white'},
      {num: 8,key: 81  ,type:'white'},
      {num: 8.5,key: 50  ,type:'black'},
      {num: 9,key: 87  ,type:'white'},
      {num: 9.5,key: 51,type:'black'},
      {num: 10,key: 69  ,type:'white'},
      {num: 11,key: 82  ,type:'white'},
      {num: 11.5,key: 53  ,type:'black'},
      {num: 12,key: 84  ,type:'white'},
      {num: 12.5,key: 54  ,type:'black'},
      {num: 13,key: 89  ,type:'white'},
      {num: 13.5,key: 55  ,type:'black'},
      {num: 14,key: 85  ,type:'white'},
      {num: 15,key: 73  ,type:'white'}
    ]
  },
  methods: {
    playnote: function(id,volume){
      //撥放 +重複撥放
      if(id>0){
    //$("audio[data-num=1]")[0].play() 聲音播放
       var audio_obj=$("audio[data-num='"+id+"']")[0];
 //audio_obj= audio音檔[data-num=id]第id=number個的 [0];第一個物件(聲音網址) id 單引號 是因為小數
        //v-bind:data-num='s.number'
        audio_obj.volume=volume;
        //設定audio_obj.volume audio_obj裡面的volume等於  藍色的volume  
        //volume是聲音大小
        audio_obj.currentTime=0;
        //讓每次播放前都 倒帶到時間等於0的時候 可以連"按"撥放 不須等到放結束時間結束
        audio_obj.play();
        //播放
      }
    },
    playnext: function(volume){
      //播放playnote+自動準備撥放下一個
      var play_note=this.notes[this.now_note_id].num;
    //play_note等於 vm裡面的notes陣列 第 [裡的vm.now_note_id]個 的num數字是 
      this.playnote(play_note,volume);
      //帶入 playnote 方法
      this.now_note_id+=1;
      //準備撥下一個 讀陣列的下一個
      if (this.now_note_id>=this.notes.length){
         this.stopplay();
      }
    },
    startplay: function(){
      
     this.now_note_id=0;
     this.playing_time=0;
     this.time_id=0;
     var vobj=this;//=vm
   
    this.player=setInterval(function(){
       //setInterval會一直執行段東西
       if(vm.playing_time>=vobj.notes[vobj.time_id].time){
         //在這邊使用this 不會抓到vm  會抓到setInterval(function()的this
         //用vobj 存取
         //如果playing_time>= note裡對應[time_id]的time
         vobj.playnext(1);
         //播放
         vobj.time_id++;
         //time_id+1 設定 下一個 time_id的數值
       }
     vobj.playing_time++;  
     },2);
    },
    stopplay: function(){
      clearInterval(this.player);
      //清掉
      this.now_note_id=0;
      this.playing_time=0;
      this.time_id=0;
      
    },
    addnote: function(id){
      if(this.record_time>0)
        this.notes.push({num: id,time: this.record_time});
      this.playnote(id,1);//當playnote用
    },
    
    start_record: function(){
      this.record_time=0;
      this.recorder=setInterval(function(){
       vm.record_time++;
    })
    },
    stop_record: function(){
      clearInterval(this.recorder);
      this.record_time=0;
    },
    get_current_highhlight: function(id,key){
      if(this.now_press_key==key)
         return true;
      if(this.notes.length==0){
        return false;
       }    
       var cur_id=this.now_note_id-1;
        //正在播這個音的id -1 是因為聽到的是上一個
      if(cur_id<0) {cur_id=0; return false;}
      //如果小於0 cur_id=0 避免error
      var num=this.notes[cur_id].num;
      //抓住 cur_id 的num 現在播的音的num
      if(num==id)
        return true;
      return false;
    },
    load_sample: function(){
    var vobj=this;
    $.ajax({
      url: "https://awiclass.monoame.com/api/command.php?type=get&name=music_dodoro",
      success: function(res){
        vobj.notes=JSON.parse(res);
      }
    });
    }
  }
});
$(window).keydown(function(e){
  
  var key=e.which;
  //抓key值
  vm.now_press_key=key;
  //記錄他現在按下的值
  for(var i=0;i<vm.display_keys.length;i++){
      if(key==vm.display_keys[i].key){
        //vm.playnote(vm.display_keys[i].num,1)
        vm.addnote(vm.display_keys[i].num)
      }
    }
});
$(window).keyup(function(){
  vm.now_press_key=-1;
});