

const shownotification = (message) => {

    let html = `<p style="position:absolute;background-color:black;border-radius:10px;padding:20px;font_size:15px text-align:center;top:20px;right:10px;color:white;" id="notificationbar" class="show-notification">
      ${message}
    </p>`;
  

    $('body').append(html);
  
    
    const notificationBar = document.getElementById("notificationbar");
  
    
    setTimeout(() => {
      notificationBar.classList.add("translatex");
    }, 10); // Short delay to ensure DOM updates
  
    
    setTimeout(() => {
      notificationBar.classList.remove("translatex");
      notificationBar.classList.add("exit-translatex");
  
      
      setTimeout(() => {
        notificationBar.remove();
      }, 500); // Match the CSS transition duration
    }, 4000); // Display for 4 seconds
  };
  



const profile = document.querySelector(".profile");
const image = document.querySelector('#myprofile');
let  sidebar = document.querySelector(".sidebar");
const myeditpage = document.getElementById("myeditpage")
image.addEventListener('click',(e)=>{
    e.preventDefault();
    // sidebar.style.display="none";
    sidebar.classList.add("hideit");
    profile.style.display="flex";


})

document.getElementById("back-to-profile").addEventListener('click',(e)=>{
    e.preventDefault();
    profile.style.display="none";
    sidebar.classList.remove("hideit");

})

let Name = document.getElementById("name").textContent;
let username = document.getElementById("username").textContent;
let extrainfo = document.getElementById("extrainfo").textContent;

const datasend = ()=>{
    // e.preventDefault();
    const elements = document.querySelectorAll('.aditable');
    elements.forEach(ele=>{

        if(ele.id == "name")
        {
             Name  = ele.textContent;

        }
        if(ele.id=="username")
        {
             username = ele.textContent;
        }
        if(ele.id=="extrainfo")
        {
             extrainfo = ele.textContent;
        }
        
    })
    console.log("name:",Name, " username:",username ,"extrainfo: ",extrainfo);
    $.ajax({
        url:"/save-edit",
        type:"post",
        data:{Name,username,extrainfo,sender_id},
        success: function (response){
            console.log("response from the surver", response);
            if(response.success)
            {
                let user = response.user; 
                let message = response.message;


                console.log("profile seccesfully edit");
                console.log("message from the server :");
                document.getElementById("name").textContent=user.name;
                document.getElementById("username").textContent=user.username;
                document.getElementById("extrainfo").textContent=user.bio;
                shownotification(message);





            }
        }
    })
}

const removeeditmode = (elements)=>{
    elements.forEach((element) => {
        element.removeAttribute("contenteditable");
        element.removeEventListener("click", makeEditable);
        element.classList.remove("edit-mode");
        
    });
    editbtn.textContent = "edit";
    editbtn.style.background="#3e3c30"
    
    elements.forEach((element) => {
        element.setAttribute("data-edit-mode", "false");})
        // removeEventListener("click", makeEditable);
        document.getElementById("remove-edit-mode-btn").remove();

    }


const editbtn = document.getElementById("edit");
editbtn.addEventListener("click", function () {
    const elements = document.querySelectorAll('.aditable');
    console.log("elements are " , elements)
    const isEditable = elements[0].getAttribute("data-edit-mode") === "true";

    if (isEditable) {
           removeeditmode(elements)
           datasend();

    } else {
        elements.forEach((element) => {
            element.setAttribute("data-edit-mode", "true");
            element.addEventListener("click", makeEditable);
            element.classList.add("edit-mode");

        });
        this.textContent = "Save";
        this.style.background="green"
        let html = `<button title="remove edit mode" id="remove-edit-mode-btn" style="position:absolute;top:10px;right:10px;border-radius:2px;background-color:white;color:black;padding:4px;cursor:pointer;">X</button>`
        $(".profile").append(html);
        handleediting(elements);
    }
});

function handleediting(elements){

    document.getElementById("remove-edit-mode-btn").addEventListener('click',(e)=>{
        e.preventDefault();
        removeeditmode(elements);
        document.getElementById("name").textContent=Name;
        document.getElementById("username").textContent=username;
        document.getElementById("extrainfo").textContent=extrainfo;

        
    })
}

function makeEditable(event) {
    const element = event.target;

    if (element.tagName !== "IMG") {
        element.setAttribute("contenteditable", "true");
        element.focus();
    } else {
        const newSrc = prompt("Enter new image URL:", element.src);
        if (newSrc) {
            element.src = newSrc;
        }
    }
}

const grouppage = document.getElementById("groups");
const groupform = document.querySelector(".create-group-form");

const creategroup = document.getElementById("create-group-btn");
creategroup.addEventListener('click',(e)=>{
    console.log("group create btn clicked ");
e.preventDefault();
sidebar.classList.add("hideit");
groupform.style.display="flex";
})

let checkboxes = document.querySelectorAll('.group-checkbox')
let groupnametag =  document.getElementById("group-name")

function registergroup()

{
    let groupmembers=[];
    // e.preventDefault();
    console.log("register group btn clicked")
    let groupname = groupnametag.value;
    console.log("group name is ",groupnametag,groupname);
    if(groupname.length < 4)
  {
    console.log("your groupname name is to short");
    shownotification("group name is too short please make it greater then 4 latters");
    checkboxes.forEach(checkbox=>{
        checkbox.checked=false;
    })
    groupnametag.value="";

    return;

  }

  let checkedusers =0;

    
    checkboxes.forEach(checkbox=>{
        if(checkbox.checked)
            {
                checkedusers++;
                console.log(checkbox.id);
                groupmembers.push(checkbox.id);
            }
        });

        if(checkedusers==0)
        {
            checkboxes.forEach(checkbox=>{
                checkbox.checked=false;
            })
            groupnametag.value="";
            shownotification("please select atleaste one user")
            checkedusers=0;
            return;

        }

        $.ajax({
            url:'/create-group',
            type:'POST',
            data:{groupname,groupmembers,sender_id},
            success: function (response){
                console.log("response from the surver", response);
                if(response.success)
                {
                    const group = response.data.group;
                    const members = response.data.members;
                    console.log("members are here ", members);
                    const groupname = response.data.groupname;
                    console.log("group created succsefully");
                    checkboxes.forEach(checkbox=>{
                        checkbox.checked=false;
                    })
                    groupnametag.value="";
                    checkedusers=0;
                    groupform.style.display="none";
                    sidebar.classList.remove("hideit");
                    let html = `<li class="groups" data-name="${group.groupname}"
                    data-id="${group._id}"> 
                    <img id="group-image" src="man.png" alt="User1" class="group-img" width="40px">
                    <p style="margin: 0px 15px;">${group.groupname}</p>
                    <p style="margin: 0px 15px;color:red">new</p>
                    </li>`
                    $(".group-list").prepend(html);  
                   
                        shownotification("group created successfully wait for joing the peoples");
                        socket.emit("newnottification", {
                            sender_id: sender_id,
                            members,
                            type:"group",
                            group,
                          });
                        
                }
            }
            
        })

        
        
}

socket.on('addGroupnottification',(data)=>{
    console.log("addgroup reached")
    let members = data.datas.members;
    console.log("members are" ,members)
    let group = data.datas.group;
    let sender = data.sender;
    members.forEach(id=>{
        if(sender_id == id)
        {
            console.log("group  notification arrived");
            let html =
        ` <div class="` +
        "notification-list" +
        `" data-name="` +
        group.groupname +
        `"
            data-id="` +
        group._id +
        `">
            <img  src="man.png" alt="0" class="user-img" width="15px">
            <p style="font-size:12px">
                ` +
        sender.username +
        ` wants to add you in a group <strong>${group.groupname}</strong>
                </p>
                <div>
                    <button id="delete-request" delete-id="` +
        group._id +
        `" class="` +
        "response-btn" +
        `">delete</button>
                    <button id="confirm-request" confirm-id="` +
        group._id +
        `" class="` +
        "response-btn" +
        `">join</button>
                    </div>                                       
                    </div>`;
      notification_count++;
      notification_count = notification_count + Number(unread);

      // $('#nottification-btn').css({
      //     'background-color':'green',
      //     'color':'white',
      // })

      $("#nottification-btn").append(
        `<span id="notification-badge"  style="font-size: 12px;border-radius: 5px;background-color: black;color: white;padding: 3px;position: absolute;margin-top: -10px;">` +
          notification_count +
          `</span>`
      );

      $("#nottification").prepend(html);

        }
    })

})

document.getElementById("cancel-group-creation").addEventListener('click',(e)=>{
    e.preventDefault();
    checkboxes.forEach(checkbox=>{
        checkbox.checked=false;
    })
    groupnametag.value="";

    groupform.style.display="none";
    sidebar.classList.remove("hideit");


})
