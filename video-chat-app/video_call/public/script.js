
const socket = io('/');

const name1 = prompt("Enter your name to join");

const videoGrid = document.getElementById('video-grid');
 console.log(videoGrid);
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: 443,
});


let peers = {};
let peerList = [];
let currentPeer
let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
            currentPeer = call.peerConnection;
            peerList.push(call.peer);
        })

    })

    let text = $('input');

    $('html').keydown((e) => {
        if(e.which == 13 && text.val().length != 0) {
            socket.emit('message', text.val(), name1);
            text.val('');
        }
    })
    socket.on('createMessage', (message, name) => {
        $('.messages').append(`<li class="message"><b style="color: green">${name}</b><br/>${message}</li>`);
        scrollToBottom();
    })

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    })

});

peer.on('open', id => {
    console.log(name1);
    socket.emit('join-room', ROOM_ID, id);
});

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })

    call.on('close', () => {
        video.remove()
    })
    
    peers[userId] = call;
    
};


socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
})


const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })

    videoGrid.append(video);
}

const scrollToBottom = () => {
    let d = $('.main_chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}




//Mute and unmute

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }
    else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
    `
    document.querySelector('.main_mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
    `
    document.querySelector('.main_mute_button').innerHTML = html;
  }



  // stop video

  const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }

  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
    `
    document.querySelector('.main_video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
    `
    document.querySelector('.main_video_button').innerHTML = html;
  }




//   Screen share

document.getElementById("screenShare").addEventListener('click', (e) => {
    navigator.mediaDevices.getDisplayMedia({
        video:{
            cursor: "always"
        },
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
        }
    }).then((stream) => {
        let videoTrack = stream.getVideoTracks()[0];
        videoTrack.onended = function() {
            stopScreenShare();
        }
        let sender = currentPeer.getSenders().find((s) => {
            return s.track.kind == videoTrack.kind
        })

        sender.replaceTrack(videoTrack);
    }).catch((err) => {
        console.log("unable to diplay media" + err);
    })
})

function stopScreenShare() {
    let videoTrack = myVideoStream.getVideoTracks()[0];
    var sender = currentPeer.getSenders().find( function(s) {
        return s.track.kind == videoTrack.kind;
    })
    sender.replaceTrack(videoTrack);

}


 document.getElementById('stopscreenShare').addEventListener('click', (e) => {
    let videoTrack = myVideoStream.getVideoTracks()[0];
    var sender = currentPeer.getSenders().find( function(s) {
        return s.track.kind == videoTrack.kind;
    })
    sender.replaceTrack(videoTrack);

})


function pageRedirect() {
    window.location.href = `https://chatsharabh.herokuapp.com/${ROOM_ID}`;
  }      


