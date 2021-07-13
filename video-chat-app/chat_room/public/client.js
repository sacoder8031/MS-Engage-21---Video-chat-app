const socket2 = io('/');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container");


const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}


form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    // page will not reload
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket2.emit('send', message);
    messageInput.value = '';
})

const name = prompt("Enter your name to join");
socket2.emit('new-user-joined', ROOM_ID, name);


socket2.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
})


socket2.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket2.on('left', name => {
    append(`${name} left the chat`, 'right');
});

function joinVideo() {
    window.location.href = `https://videocallsharabh.herokuapp.com/${ROOM_ID}`;
}

function leaveRoom() {
    window.location.href = "/";
}
