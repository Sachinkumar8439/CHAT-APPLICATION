// import use from './function.js';

console.log("this is my id ",sender_id);



var current_in = '';
var unreadmessages = 0;


var socket = io('/user-namespace', {
    auth: {
        token: sender_id,
    }
});

let readed = {
    notifications: false,
    connections: false,
}
var receiver_id;
var receiver_name;
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        if (button.id === 'nottification-btn') {
            readed.notifications = true;
            
            if (readed.notifications) {
                unread = 0;
                notification_count = 0;
                $("#notification-badge").remove();
                readed.notifications = false;
                socket.emit('updatedata', { sender_id: sender_id })
                
                
            }
            
            
        }
    });
});

function showPage(pageId) {
    
    
    const pages = document.querySelectorAll('.page');
    pages.forEach((page) => (page.style.display = 'none'));
    
    document.getElementById(pageId).style.display = 'block';
}

var seenpara = document.getElementById("seentag");
console.log("this is seen tag ", seenpara);

// scrolling function 
scrollchat = () => {
    $('.messages').animate({
        scrollTop: $('.messages').offset().top + $('.messages')[0].scrollHeight
    }, 0)
}

$(document).on('click', '.users', async function () {

    receiver_id = $(this).attr('data-id');
    receiver_name = $(this).attr('data-name');
    current_in = receiver_id;
    console.log("current user is ", current_in);
    // let html = ``+receiver_name+``;
    // $('#chatusername').append(html);
    document.getElementById("chatusername").innerHTML = `` + receiver_name + ``;
    console.log("this is the click name " + receiver_name);
    console.log("Receiver ID after click:", receiver_id); // Check this output
    if (!receiver_id) {
        console.error("Receiver ID is not set");
    }

    $(this).addClass('active');
    $('.start-head').hide();
    $('#chat-window').removeClass('no-display');
    $('#chat-window').addClass('chat-window');
    $('.sidebar').addClass('no-display');
    // socket.emit('seen', { sender_id: sender_id,seener:receiver_id })
    //  seenpara.style.display = "none";
     document.getElementById("seen-typing-box").style.display = "none";




    socket.emit('existschat', { sender_id: sender_id, receiver_id: receiver_id })
    // socket.emit('seen', { sender_id: sender_id, receiver_id: receiver_id })



});
// addition a follower 
$(document).on('click', '#follow-btn', async function (e) {


    e.stopPropagation();
    e.preventDefault();
    let userId = $(this).attr('follow-id');
    $(this).html(`requested`);
    $(this).css({
        'font-size': '15px',
        'background-color': 'green',
        'color': 'white',
        'padding': '5px',
        'border-radius': '5px'
    });
    
    $.ajax({
        url: '/follow',
        type: 'POST',
        data: { sender_id, userId },
        
        success: function (response) {
            console.log("Response from server on follow: ", response);
            if (response.success) {
                let userId = response.data._id;


                socket.emit('newnottification', {
                    sender_id: sender_id,
                    userId: userId,
                });

            }
            else {
                console.log(response.msg);
            }

        }
    });



})


socket.on('addnottification', (data) => {

    if (sender_id == data.myrelation.userId) {

        console.log("addnotification is running..");
        if (data) {
            let myid = sender_id;
            let follower = data.follower;
            const latestNotification = data.myrelation.notifications[0];
            let notification_count = 0;
            let html = ` <div class="` + 'notification-list' + `" data-name="` + follower.username + `"
            data-id="`+ follower._id + `">
            <img  src="user1.jpg" alt="0" class="user-img" width="15px">
            <p style="font-size:15px">
                `+ follower.username + `` + latestNotification.message + `
                </p>
                <div>
                    <button id="delete-request" delete-id="`+ follower._id + `" class="` + 'response-btn' + `">delete</button>
                    <button id="confirm-request" confirm-id="`+ follower._id + `" class="` + 'response-btn' + `">confirm</button>
                    </div>                                       
                    </div>`
            notification_count++;
            notification_count = notification_count + Number(unread);

            // $('#nottification-btn').css({
            //     'background-color':'green',
            //     'color':'white',
            // })


            $('#nottification-btn').append(`<span id="notification-badge"  style="font-size: 12px;border-radius: 5px;background-color: black;color: white;padding: 3px;position: absolute;margin-top: -10px;">` + notification_count + `</span>`)

            $('#nottification').prepend(html);
        }

        else {
            console.log("notification data is not present");
        }
    }


});

// addding a emojis here 
$(document).on('click', '#follow-btn', async function (e) {

})




// axxept request 

$(document).on('click', '#confirm-request', function (e) {
    e.stopPropagation();
    let response_id = $(this).attr('confirm-id');
    console.log("this is response id ", response_id);
    let username;
    socket.emit('getdata', { id: response_id, sender_id })
    socket.on('dataIs', (user) => {


        let html = `<li class="users" data-name="` + + `"
        data-id="`+ response_id + `">
                                <img src="user1.jpg" alt="User1" class="user-img">
                                <p>
                                    `+ user.username + `
                                    </p>
                                    <div class="status-follow-icon">
                                        <p id="follow-btn" style="font-size: 30px;"
                                        follow-id="`+ response_id + `">+</p>`
        if (user.is_online === '1') {
            `<p class="status" id="` + response_id + `-status"></p>`
        }
        ` </div>
        </li>`;

        $('#connections').prepend(html);
    });






})













$(document).on('click', '.message-menu-btn', function () {
    console.log('Menu button clicked!');
    message_id = $(this).attr('message-rightId');
    console.log("message id ", message_id);
    // message = document.querySelector(`[message-box-id="${message_id}"]`).html();
    console.log("message id and message are ", message_id);

    //  Toggle menu visibility
    function toggleMenu() {
        menu.classList.toggle('active');
    }
    function closeMenu() {
        menu.classList.remove('active');
    }
    const menu = document.getElementById('menu');
    toggleMenu();



    //    main logic is here deletetion , updation , 


    document.getElementById("delete-message").addEventListener("click", () => {
        console.log("message is deleted");
        closeMenu()
        const popup = document.getElementById("popup");
        popup.style.display = "flex";
        $('.messages').on('click', function () {
            popup.style.display = "none";
            return;
        });

        //  $(document).on('click','#delete-confirm',()=>{


        //  })








    })




});

// });



// chat save of user 
// $(document).on('click', '#chating-form', function (e) 

$('#chating-form').submit((e) => {
    console.log("submitted");
    
    
    e.preventDefault();
    var message = $('#message-input').val();
    $('#message-input').val('');
    seenpara.style.display = "none";

    $('#message-input').focus();
    console.log("Sending data:", { sender_id, receiver_id, message });

    $.ajax({
        url: '/save-chat',
        type: 'POST',
        data: { sender_id, receiver_id, message },
        
        success: function (response) {
            console.log("Response from server:", response);
            if (response.success) {
                console.log(response.data.message);
                $('#message-input').val('');
                let chat = response.data.message;
                let messageId = response.data._id;
                let html = `
                <div div-id="`+ messageId + `"  class="message right">
                <div style="display: flex;" class="flexing">
                <img message-rightId="`+ messageId + `" id="message-menu-btn" class="message-menu-btn" src="menu-dots-vertical.png" alt="">
                <p>`+ chat + `</p>
                </div>
                <span class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>`;
                //   const seentag =  $(`#${sender_id}-seen`)
                $('.messages').append(html);
                scrollchat();
                
                socket.emit('newchat', response.data);

                
                
                
            }
            else {
                alert(response.msg);
            }

        }
    })
    
    
});
socket.on('loadnewchat', (data) => {
    if (sender_id == data.receiver_id && receiver_id == data.sender_id) {
        unreadmessages=0;
        console.log("welcome sir");
        // console.log("these are unread mesages", unreadmessages)
        // document.getElementById(`${data.sender_id}-unread`).innerText = `${unreadmessages}`;
        // document.getElementById(`${data.sender_id}-unread`).style.display = 'flex';
        document.getElementById("typing").style.display = "none";
        seenpara.style.display = "flex";
        
        // document.getElementById("seen-typing-box").style.display = "none";
        
        
        
        let html = `<div  class="message left">
        <div message-leftId="`+ data._id + `"  style="display: flex;" class="flexing">
        <p>`+ data.message + `</p>
        </div>
        <span class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>`;
        
        // if(!(current_in == data.sender_id))
        // {
        //     unreadmessages++;
        //   let unreadbox=  document.getElementById(`${data.sender_id}-unread`).innerText=`${unreadmessages}`;
        //   console.log("this is unread box",unreadbox)
        //   unreadbox.style.display="flex";
        
        
        // }
        
        $('.messages').append(html);
        if (current_in == data.sender_id) {
            scrollchat();
            console.log("this is running here ");
            socket.emit('seen', { sender_id: sender_id, seener: data.sender_id });

        }
        //   console.log("this is unread box",unreadbox)
        //   unreadbox.style.display="flex";
        
        
        // seentag = $(`#${data.sender_id}-seen`);
        // let userseentag = document.getElementById(`${data.sender_id}-seen`);
        // if (current_in === data.sender_id) {
            //     console.log("current id is running and seentag ", userseentag)
            //     seentag.style.display = "flex";
            
            
            // }
            // else {
        //     console.log(" else current id is running and seentag ", userseentag)
        
        //     seentag.style.display = "none";
        
        
        
        // }
        // seentag.style.display="flex";
    }
    else{
        if(sender_id == data.receiver_id && receiver_id != data.sender_id)
            {
                unreadmessages++;
                
                console.log("these are unread mesages", unreadmessages)
                document.getElementById(`${data.sender_id}-unread`).innerText = `${unreadmessages}`;
                document.getElementById(`${data.sender_id}-unread`).style.display = 'flex';
                
            }
        }

});
$('.backbtn').click(function () {
    current_in = "";
    
    $('.start-head').hide();
    $('#chat-window').addClass('no-display');
    $('.sidebar').removeClass('no-display');
    socket.emit('seen', { sender_id: sender_id, seener: current_in })
    
    
})

socket.on('loadchats', (data) => {
    document.getElementById(`${data.receiver_id}-unread`).innerText = ``;
    document.getElementById(`${data.receiver_id}-unread`).style.display = "none";
    unreadmessages = 0;
    
    $('.messages').html('');
    var chats = data.chats;
    let seener = data.receiver_id;
    console.log('this is seener ', seener)
    // console.log("on reloading message id exists which is ",chats._id)
    let html = '';
    for (let i = 0; i < chats.length; i++) {
        let addclass = '';
        let img = '';
        if (chats[i]['sender_id'] == sender_id) {
            addclass = 'message right';
            img = `<img message-rightId="` + chats[i]._id + `" class="message-menu-btn" src="menu-dots-vertical.png" alt="">`
        }
        else {
            addclass = 'message left';
            
        }
        html = html + `
        <div div-id="`+ chats[i]._id + `" class="` + addclass + `">
        <div style="display: flex;" class="flexing">
        `+ img + `
        <p>`+ chats[i]['message'] + `</p>
        </div>
        <span class="time">10:16 AM</span>
        </div>`
    }
    
    $('.messages').append(html);
    // var seentag =  document.getElementById(`${seener}-seen`);
    // seentag.style.display="flex";
    
    
    scrollchat();
    
    socket.emit('seen', { sender_id: sender_id, seener })
    
    
    
    
    
});
socket.on('loadseen', (data) => {
    if (sender_id == data.seener && current_in == data.sender_id) {
        console.log("hii haan yaha hai");
        document.getElementById("seen-typing-box").style.display = "flex";
        seenpara.style.display = "flex";
        scrollchat();
        
        console.log("seen html is ", seenpara);
    }
    else {
        // seenpara.style.display = "none";
        // document.getElementById("seen-typing-box").style.display = "none";
        
        
    }
})



// searching a user 

// seeing the typing 
$('#message-input').on('input', function (e) {
    e.preventDefault();
    let id = current_in;
    console.log("current id is ", id);
    const text = $(this).val().trim();
    console.log("trimed text is", text);
    console.log("searching");
    socket.emit('typing', { sender_id, id, text });
    
});


let timingRun; 
socket.on('loadtyping', (data) => {
    if (data) {
        if (sender_id === data.id && receiver_id === data.sender_id) {
            clearTimeout(timingRun);
            document.getElementById("seen-typing-box").style.display = "flex";
            document.getElementById("typing").style.display = "flex";
            scrollchat();
            
            timingRun = setTimeout(() => {
                document.getElementById("typing").style.display = "none";
                // document.getElementById("seen-typing-box").style.display = "none";
            }, 1500);
        }
    }
});






const originalContent = $('.searched-user').html();
$('#searchusername').on('input', function (e) {
    e.preventDefault();
    const username = $(this).val().trim();
    console.log("trimed text is", username);
    if (username === '') {
        // If the input is empty, restore the original content
        $('.searched-user').empty().append(originalContent);
        return;
    }
    console.log("searching");
    
    
    console.log("Sending data:", { sender_id, username });
    
    $.ajax({
        url: '/search',
        type: 'POST',
        data: { sender_id, username },

        success: function (response) {
            console.log("Response from server:", response);
            if (response.success) {
                $('.searched-user').empty();
                for (let i = 0; i < response.data.length; i++) {
                    console.log(response.data[i].username);
                    // $('#message-input').val('');
                    let username = response.data[i].username;
                    let userId = response.data[i]._id;
                    let html = `
                    <li class="users" data-name="${username}" data-id="${userId}">
                    <img src="user1.jpg" alt="User1" class="user-img">
                    <p>${username}</p>
                    </li>`;
                    
                    
                    $('.searched-user').append(html);
                    
                }
                
            }
            else {
                $('.searched-user').html = 'user not found';
            }
            
        }
    })
    
    
});

$('#searchusername').on('focusout', function () {
    setTimeout(() => {
        $(this).val('');
        $('.searched-user').empty().append(originalContent);
    }, 200);
    
    
    
});

if (unread != 0) {
    $('#nottification-btn').append(`<span id="notification-badge" style="font-size: 12px;border-radius: 5px;background-color: black;color: white;padding: 3px;position: absolute;margin-top: -10px;">${unread}</span>`)
    
    console.log('notification count is ', unread)
}
console.log(readed.notifications)
console.log(readed.connections)

socket.on('getOnlineUser', (data) => {
    const statusElement = document.getElementById(`${data.user_id}-status`);
    if (statusElement) {
        console.log("element is presnet")
        // statusElement.classList.remove('offline-class');
        statusElement.classList.add('status');
    }

    console.log("hey there")
    // use.intro("sachin");
});

socket.on('getOfflineUser', (data) => {
    const statusElement = document.getElementById(`${data.user_id}-status`);
    if (statusElement) {
        statusElement.classList.remove('status');
        // statusElement.classList.add('offline-class');
    }
});

let isdark = false;
const modebtn = document.getElementById("dark-mode-btn");
modebtn.addEventListener('click',()=>{
    console.log("mode-button clicked");
    const content = document.body.querySelectorAll('*');
    // let username = document.getElementById("username");
    // username.style.color="white";
    // let userprofile =document.querySelector(".user-profile");
    // userprofile.style.background="black";
    if(isdark)
    {
        console.log("the content is ",content)
        content.forEach((e)=>{
         e.style.background="white";
         e.style.color="black";})
         modebtn.innerText="dark mode";
         isdark=false;

    }

    else{

        console.log("the content is ",content)
        content.forEach((e)=>{
         e.style.background="black";
         e.style.color="white";
        })
        modebtn.innerText="white mode";

        isdark=true;
    }
    // const content = document.body.querySelectorAll('*');







})




// turning in dark mode and mode check here 


