// --------------------Scrolling navbar animation------------------- 
// -----------------------------------------------------------------

$(document).ready(function(){
  $('.songs-container').on('scroll', function() {
  //  console.log($(this).scrollTop());
  // ---------current scrolling value of container------//
  let containerScroll = $(this).scrollTop();

  // ---------------when to show nav-bar at what point--------//
  let limit =  $('.banner').height();

  if(containerScroll > limit){
    // if limit crossed show nav-bar
    $('.nav-bar').addClass('fixed');
    $('.songs-table-play-icon .fa-play').addClass('fixed');
  }else{
    // hide nav-bar
    $('.nav-bar').removeClass('fixed');
    $('.songs-table-play-icon .fa-play').removeClass('fixed');
  }
  });
})

// allSongs is coming from different file
//<<----------Load Songs----------------------->>
//  add id to songs
for(let i in allSongs){
  allSongs[i]['id'] = i;
}


let songObj = allSongs;

//track of song
let currSongIdx = 0;
let cover = $("#audio-cover");
let songTitle = $("#audio-title");
let artist = $('#artist-name')
// $('#audio').html('<audio ><source src="audio/ding.mp3"></audio>');
let audio = $("#audio");
let seektime = 0.0;

//------------------load Song-----------------
// ------------------------------------------
loadSongObj(songObj[currSongIdx]);

function loadSongObj(song) {
  audio.attr("src", `${song.audioSrc}`);
  songTitle.text(`${song.title}`);
  cover.attr("src", `${song.imgUrl}`);
  artist.text(`${song.artist}`)
}

//------------------- load UI--------------------
// --------------------------------------------------
loadUI();



//<<--------------------button - controls-------------------------->>
let playBtn = $(".fa-play-circle");
let nextBtn = $(".next-btn");
let prevBtn = $(".prev-btn");
let isPlaying = false;

//------------------------display UI --> Songs Table-------------------------
//--------------------------------------------------------------------------
function loadUI(){
  for (let i in songObj) {
    let row = $(`<div id="track-${i}" class="song-row">
                       <div class="song-number">${parseInt(i) + 1}</div>
                       <div  class="song-title">
                            <img class="song-title-img" src=${songObj[i].imgUrl} alt="">
                            <div class="song-title-text">${songObj[i].title}</div>
                       </div>
                       <div class="song-artist">${songObj[i].artist}</div>
                       <div class="song-options">
                            <i class="like far fa-heart"></i>
                        <div>
                  </div>
  `);
    $(".songs-table").append(row);
    //--------------------------------------------------------------------------//
    // can attach event to each row inside for loop as row get attached to DOM
    // -------------------------row.click(callback)----------------------------
    // or if all are loaded at once then we can fire event outside the loop------
    //---------------------$('.song-row).click(callback)-------------------------
  } 
  //for-loop ends--------------------------------------------------------------  
}



  //<<-----------------Play song from song Table------------------------>>
  //-------------------------------------------------------------------->>//
  function playFromRow(el){
        // alert($(this).attr('id'));
    // alert($(this).attr('id').split('-')[1]);
    let songToPlay = parseInt($(el).attr("id").split("-")[1]);

    if (currSongIdx == songToPlay) {
      if (isPlaying) {
        // alert('already playing')
        playBtn.click();
        $(el).removeClass("selected");
      } else {
        // alert('not playing')
        playBtn.click();
        $(el).addClass("selected");
      }
    } else {
      //some random song is clicked
      $(".progress").css("width", 0);
      if (isPlaying) {
        // is some song is already playing and we click different song
        //then stop that song
        $(".song-row.selected").removeClass("selected");
        playBtn.click();
      }
      $(el).addClass("selected");
      //change songIDx
      currSongIdx = songToPlay;
      //load Currentsong
      loadSongObj(songObj[currSongIdx]);
      //play current song
      playBtn.click();
    }
  }
  $(".song-row").click(function () {
    playFromRow(this);
  });

playBtn.click(playSong);
function playSong() {
  if (!isPlaying) {
    //trigger play-----------
    // ---------------------
    isPlaying = true;
    $(this).removeClass("fa-play-circle");
    $(this).addClass("fa-pause-circle");
    audio.trigger("play");

    //is song is not playing apply selected class
    // $('.song-row.selected').removeClass('selected');
    $(`#track-${currSongIdx}`).addClass('selected');
  } else {
      //trigger pause-----------
    //   -----------------------
    isPlaying = false;
    $(this).removeClass("fa-pause-circle");
    $(this).addClass("fa-play-circle");
    audio.trigger("pause");

    //if song was playing remove selected class
    $('.song-row.selected').removeClass('selected');
  }
}


// ------------next-btn-click------------------------
//----------------------------------------------------
nextBtn.click(function () {
  currSongIdx = (currSongIdx + 1) % songObj.length;
  $('.song-row.selected').removeClass('selected');
  $(`#track-${currSongIdx}`).addClass('selected');
  loadSongObj(songObj[currSongIdx]);
  if (isPlaying) {
    audio.trigger("play");
  }
  $(".progress").css("width", 0);
});


//------------------prev-btn-click---------------
//-----------------------------------------------
prevBtn.click(function () {
  currSongIdx = currSongIdx - 1 >= 0 ? currSongIdx - 1 : songObj.length - 1;
  $('.song-row.selected').removeClass('selected');
  $(`#track-${currSongIdx}`).addClass('selected');
  loadSongObj(songObj[currSongIdx]);
  if (isPlaying) {
    audio.trigger("play");
  }
  $(".progress").css("width", 0);
});

//<<---------------------Progress-Bar----------------->>
//------------------------------------------------------
// console.log(audio);
// console.log(audio[0]);
audio.on('loadedmetadata',function(){
  //set end duration of audio
  // console.log(this.duration);
  let duration = this.duration;
  let minutes = Math.floor(duration / 60);
  let seconds = Math.floor(duration % 60);
  let endTime;
  endTime = `${minutes}:${seconds}`;
  if (seconds % 10 == seconds) {
    endTime = `${minutes}:0${seconds}`;
  }
  $(".end-timer").text(endTime);
});

// ------------------current timestamp-----------------
// ----------------------------------------------------
audio.bind("timeupdate", function () {
  let currentTime = this.currentTime;
  let duration = this.duration;
  // $('.start-timer').text(currentTime);
  let minutes = Math.floor(currentTime / 60);
  let seconds = Math.floor(currentTime % 60);
  // console.log(minutes);
  let timeStamp = `${minutes}:${seconds}`;
  if (seconds % 10 == seconds) {
    timeStamp = `${minutes}:0${seconds}`;
  } else {
    timeStamp = `${minutes}:${seconds}`;
  }

  $(".start-timer").text(timeStamp);

  let width = (currentTime / duration) * 100;

  //<<--------ProgressBar evolution---------------->>
  $(".progress").css("width", `${width}%`);

  //<<----------------Set Progress---------------------------->>
  //<<-------------------------------------------------------->>
  $(".progress-bar").click((e) => {
    let currlength = e.offsetX;
    let totalLength = Math.round($(".progress-bar").width());

    seektime = (currlength / totalLength) * this.duration;
    this.currentTime = seektime;
  });
});

// ------------------Volume-bar--------------------------
// -----------------------------------------------------
$('.volume-container i').click(function(e){
  let height = $('.volume-slider').height();
  console.log(e.pageX);
  console.log(e.pageY);
  $('.volume-slider').css({'top':`${e.pageY - height - 20}`,'left':e.pageX - 20});
  $('.volume-slider').toggle(200);
  let level = audio.prop('volume');
  $('.volume-fill').css('width',`${level * 100}%`)

});
$('.volume-slider').click(function(e){

  let width = $(this).width();
  let currWidth = e.offsetX;

  let percentage = currWidth/width * 100;
  console.log(percentage);
  $('.volume-fill').css('width',`${percentage}%`);

  audio.prop('volume',percentage/100);
})




//----------------------------search in table--------------------------//
//---------------------------------------------------------------------//
$(".search-bar").on("keyup", function() {
  let value = $(this).text().toLowerCase();
  // console.log(value);
  
  $('.song-row').filter(function() {
    // console.log($($(this).children()[1]).children()[1]);
    let titleDiv = $($(this).children()[1]).children()[1]
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
});



//<<-----------------menu-left-container Options------------------------->>//
// <<-------------------------------------------------------------------->>//
$(".menu-item").click(function () {
  $(".menu-item.selected").removeClass("selected");
  $(this).addClass("selected");
});

// browse-----------------------------------------
// ----------------------------------------------------




// ------------------------------Create playlist------------------
// -----------------------------------------------------------------
let playList = {};
//------------------------------ playlist dataStructure description
//-------------- playlist = {playlist-name-1:{id:{},id2:{}},playlist-name-2:{}}
// ----------------------------------------------------------------
$('.create-playlist-btn').click(function(e){
  // append a new playlist module
  let playListModal = $(`<div class="playlist-modal-parent">
                           <div class='playlist-modal-top'>
                             <div class="playlist-name-container">
                               <i class="add-playlist-btn fas fa-plus-circle"></i>
                               <div id="playlist-name" contenteditable="true"  data-placeholder="Enter your playlist Name"></div>
                             </div>   
                           </div>
                           <div class="playlist-modal-bottom">
                             <div class="select-songs">Select Songs</div>
                             <div class="playlist-song-container"></div>
                           </div>
                           <i class=" cancel-playlist far fa-window-close"></i>
                         </div>`);
  $('.main-container').append(playListModal);
  // close-modal
  $('.cancel-playlist').click(function(){
    playListModal.remove();
  });

  for (let i in allSongs) {
    let playListRow = $(`<div class="playlist-row ">
                          <div class="playlist-song-title">
                            <img class="song-title-img" src=${allSongs[i].imgUrl} alt="">
                            <div class="song-title-text">${allSongs[i].title}</div>
                         </div>
                         <div class="add-to-playlist">
                            <i id="track-${i}" class=" fas fa-plus-circle"></i>
                         </div>
                        </div>`);
         $('.playlist-song-container').append(playListRow);
  }
  
  let tempObj = {};
  $('.add-to-playlist i').click(function(){
     //  alert($(this).attr('id'));
     let trackNo = parseInt($(this).attr('id').split('-')[1]);
     if($(this).hasClass('selected')){
       //alredy in current playlist
       //remove from playlist
      //  alert('already present')
       delete tempObj[trackNo];
       $(this).removeClass('selected');
     }else{
      $(this).addClass('selected');       
      tempObj[trackNo] = allSongs[trackNo];
      tempObj[trackNo]['id'] = trackNo; 
     }
    });

    //------------------- add playlist finally-------------
    // ------------------------------------------------------
    $('.add-playlist-btn').click(function(){
      let key = $('#playlist-name').text().toUpperCase(); 
      if(key){
        //playlist has been named
        let temparr = [];
        for(let i in tempObj){
          temparr.push(tempObj[i]);
        }
        playList[key] = temparr;
        
        localStorage.setItem(key,JSON.stringify(temparr));
        // console.log(playList);
        playListModal.remove();
        let playListName = $(`<div class="playlist-menu-name">${key.toUpperCase()}</div>`);
        $('.playlist-box-content').append(playListName);
        addPlayListEvents();
      }else{
        // alert('name playlist');
        $('#playlist-name').attr('data-placeholder','Playlist name  required');
        $('#playlist-name').addClass('error');
      }
    }); 
});
// ---------------HOME-buttom---------------------
// --------------------------------------------
$($('.menu-item')[0]).click(function(){
  $('.menu-item').removeClass('selected');
  $(this).addClass('selected');

  if(songObj != allSongs){

    // currently playing from playlist
    //  switch back to all songs
    // unselect playlist
    // select all songs

    // $('.playlist-menu-name').removeClass('selected');
    // $('.table-name').text('ALL SONGS');
    selectHome();
  }
   
});

$($('.menu-item')[3]).click(function(){
  $('.menu-item').removeClass('selected');
  $(this).addClass('selected');
  $('.playlist-box').toggle();
});


// events that will occur on clicking on playlists
// ----------------------------------------------------
function addPlayListEvents(){

  // playlist-context-menu
  // -----------------------------------------------
 $('.playlist-menu-name').on('contextmenu',function(e){
   
  e.preventDefault();

  // remove any existing modal
  // ----------------------------
  $('.playlist-options-modal').remove();

  // create modal-------------------------
  // --------------------------------------------
   let modal = $(`<div class="playlist-options-modal">
   <div class="edit-playlist">Edit playlist</div>
   <div class="delete-playlist">Delete playlist</div>
   </div>`);


  //  if anywhere else is clicked
   $(window).click(function(){
    $('.playlist-options-modal').remove();
   })

  //  set modal position---------------------
  // -------------------------------------
   modal.css({'left':e.pageX, 'top':e.pageY});
   $(this).addClass('selected');
   selectPlayList(this);

  //  appned modal to container----------------------
  // -------------------------------------------
   $('.main-container').append(modal);

  //  -------------------delete playlist----------------
  // ---------------------------------------------------

  $('.delete-playlist').click(() => {
    
    if(songObj == playList[$(this).text()]){
      console.log($(this).text());

      //-----delete from playlist array
       let curridx = Object.keys(playList).indexOf($(this).text());
       delete playList[$(this).text()];

      // if playing from curent playlist
      // ================================
      if(Object.keys(playList).length != 0){
        // after key deleted
        // load another key

        // load some other playlist after deleting this
        // ---------------------------------------------
        curridx !=0 ? selectPlayList( $('.playlist-menu-name')[0]):selectPlayList( $('.playlist-menu-name')[1]);
        //  if(curridx != 0)
        //    selectPlayList( $('.playlist-menu-name')[0]);
        //  else
        //    selectPlayList( $('.playlist-menu-name')[1]);


      }else{
        //  if there is no list switch back to home
        // ----------------------------------------
        
        selectHome();
      }
    }else{
        // delete from playlist array
        delete playList[$(this).text()];
    }

    // delete from UI
    $(this).remove();

    // console.log(playList);
    // delete from local storage
    localStorage.removeItem($(this).text());
    $('.playlist-options-modal').remove();
  });
  //  ----------------------Edit playlist------------------------
// ------------------------------------------------------------
$('.edit-playlist').click(()=>{
  // ----------------close edit delete options modal-----------------------
  // -----------------------------------------------------------------------

  $('.playlist-options-modal').remove();
  // ----------- modal to edit playlist--------------------
  // ----------------------------------------------------------
    let playListModal = $(`<div class="playlist-modal-parent">
    <div class='playlist-modal-top'>
      <div class="playlist-name-container">
        <i class="add-playlist-btn fas fa-plus-circle"></i>
        <div id="playlist-name" contenteditable="true"  data-placeholder="Enter your playlist Name">${$(this).text()}</div>
      </div>   
    </div>
    <div class="playlist-modal-bottom">
      <div class="select-songs">EDIT PLAYLIST</div>
      <div class="playlist-song-container"></div>
    </div>
    <i class=" cancel-playlist far fa-window-close"></i>
  </div>`);
  $('.main-container').append(playListModal);
  // close-modal
  $('.cancel-playlist').click(function(){
  playListModal.remove();
 });

//  console.log(playList[$(this).text()]);

//  songs already present in playlist
// data structure changed to delete songs 
//  searching is made easy
// direct access to key 
  let tempobj ={};

  for (let i in playList[$(this).text()]) {
  let playListRow = $(`<div class="playlist-row ">
                        <div class="playlist-song-title">
                          <img class="song-title-img" src=${playList[$(this).text()][i].imgUrl} alt="">
                          <div class="song-title-text">${playList[$(this).text()][i].title}</div>
                       </div>
                       <div class="add-to-playlist">
                          <i id="track-${playList[$(this).text()][i].id}" class=" fas fa-plus-circle selected"></i>
                       </div>
                      </div>`);
       $('.playlist-song-container').append(playListRow);
       tempobj[playList[$(this).text()][i].id] = playList[$(this).text()][i];
  }
  console.log(tempobj);
  // delete playList[$(this).text()];

  // songs not present in playlist
  // skip songs which were already in playlist
  for (let i in allSongs) {
    if(i in tempobj){
      continue
    }
    let playListRow = $(`<div class="playlist-row ">
                          <div class="playlist-song-title">
                            <img class="song-title-img" src=${allSongs[i].imgUrl} alt="">
                            <div class="song-title-text">${allSongs[i].title}</div>
                         </div>
                         <div class="add-to-playlist">
                            <i id="track-${i}" class=" fas fa-plus-circle "></i>
                         </div>
                        </div>`);
         $('.playlist-song-container').append(playListRow);
    }
    $('.add-to-playlist i').click(function(){
      //  alert($(this).attr('id'));
      let trackNo = parseInt($(this).attr('id').split('-')[1]);
      console.log(trackNo);
      if($(this).hasClass('selected')){
        //alredy in current playlist
        //remove from playlist
        delete tempobj[trackNo];
        $(this).removeClass('selected');
      }else{
       $(this).addClass('selected');       
       tempobj[trackNo] = allSongs[trackNo];
       tempobj[trackNo]['id'] = trackNo; 
      }
      // console.log(tempobj);
     });

     $('.add-playlist-btn').click(function(){

      delete playList[ $('.playlist-menu-name.selected').text()];
     
      localStorage.removeItem($('.playlist-menu-name.selected').text());
      // console.log(playList);

      let key = $('#playlist-name').text().toUpperCase(); 
      if(key){
        //playlist has been named
        let temparr = [];
        for(let i in tempobj){
          temparr.push(tempobj[i]);
        }

        // storing playlist in local storage as well
        // -----------------------------------------------------
        playList[key] = temparr;
        localStorage.setItem(key,JSON.stringify(temparr));


        // console.log(playList);
        playListModal.remove();

        // update playlist name
        // ----------------------------
        
        console.log(playList);
        songObj = playList[key];

        console.log(songObj);
        updateEditedPlaylist();
        $('.table-name').text(key.toUpperCase());
        $('.playlist-menu-name.selected').text(key.toUpperCase());
      }else{
        // alert('name playlist');
        $('#playlist-name').attr('data-placeholder','Playlist name  required');
        $('#playlist-name').addClass('error');
      }  
    });
    
    
  });
 });


 
// playlist left-click-----------------------
// ----------------------------------------------

  $('.playlist-menu-name').click(function(){
    selectPlayList(this);
  })
}



function selectPlayList(el){

  $('.menu-item').removeClass('selected');
  $($('.menu-item')[3]).addClass('selected');
  $('.playlist-menu-name').removeClass('selected');
  $(el).addClass('selected');
  // console.log(playList[$(this).text()]);
  $('.table-name').text($(el).text());
  emptySongsList();
  songObj = playList[$(el).text()];
  currSongIdx = 0;
  loadUI();
  loadSongObj(songObj[currSongIdx]);
  if(isPlaying){
    playBtn.click();
  }
  $(".progress").css("width", 0);
  $(".song-row").click(function () {
    playFromRow(this);
  });
}

function updateEditedPlaylist(){
  emptySongsList();
  currSongIdx = 0;
  loadUI();
  loadSongObj(songObj[currSongIdx]);
  if(isPlaying){
    playBtn.click();
  }
  $(".progress").css("width", 0);
  $(".song-row").click(function () {
    playFromRow(this);
  });
}



function selectHome(){

  $('.playlist-menu-name').removeClass('selected');
  $('.menu-item.selected').removeClass('selected');
  $($('.menu-item')[0]).addClass('selected');
  $('.table-name').text('ALL SONGS');
  emptySongsList();  
  
  songObj = allSongs;  
  currSongIdx = 0;
  loadUI();
  loadSongObj(songObj[currSongIdx]);
  if(isPlaying){
    playBtn.click();
  }
  $(".progress").css("width", 0);
  $(".song-row").click(function () {
    playFromRow(this);
  });
}

// ------------------emptySongsList----------------------
// --------------------------------------------------------
function emptySongsList(){
  $('.song-row').remove();
}

// load playlist from local storage
function loadPlaylist(){
  Object.keys(localStorage).forEach((key) => {
    // console.log(localStorage.getItem(key));
    playList[key] = JSON.parse(localStorage.getItem(key));
    // console.log(playList);
    let playListName = $(`<div class="playlist-menu-name">${key.toUpperCase()}</div>`);
    $('.playlist-box-content').append(playListName);
    addPlayListEvents();
   });
}

loadPlaylist();

