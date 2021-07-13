
function newRoom() {
    console.log("click");
    const val = "1"
    window.location.href = `/${NEW_ROOM}/${val}`;
}

const inp = document.getElementById('inputId');
const form = document.getElementById('send-container');

form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    // page will not reload
    
    const val = "2";
    const room_id = inp.value;
    window.location.href = `/${room_id}/${val}`;
})

