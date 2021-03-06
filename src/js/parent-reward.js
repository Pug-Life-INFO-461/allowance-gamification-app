let database = firebase.database();


var url_string = window.location.href
var url = new URL(url_string);

let famId = sessionStorage.getItem("familyUID");
let userUID = sessionStorage.getItem("userUID");
let userRole = sessionStorage.getItem("role");

let avaiable = document.getElementById("available");
let completed = document.getElementById("claimed");
let firstLoad = false;

database.ref('family/' + famId + '/rewards')
    .once('value')
    .then(function (snapshot) {
        snapshot.forEach(element => {
            data = element.val();
            let reward = createTaskItem(data, element.key);
            if (data.status == "claimed") {
                completed.appendChild(reward);
            } else {
                avaiable.appendChild(reward);
            }
        });
    });

database.ref('family/' + famId + '/rewards')
    .on('value', function (snapshot) {
        if (firstLoad) {
            location.reload();
        }
        firstLoad = true;
    });

//get score and display
if (sessionStorage.getItem("points") === null) {
    database.ref('family/' + famId + '/familyUsers/' + userUID)
        .once('value')
        .then(function (snapshot) {
            data = snapshot.val()
            document.getElementById("pointsCounter").innerText = data.points || 0;
            sessionStorage.setItem("points", data.points.toString());
        })
} else {
    let points = sessionStorage.getItem("points");
    document.getElementById("pointsCounter").innerText = points;
}


function createTaskItem(data, taskUID) {
    let img = document.createElement('img'); // a gravatar img
    let a = document.createElement('a');  // make it a link 
    let task = document.createElement('div'); // represents one task 

    let title = document.createElement('span');  // a span for the title of that task 
    title.classList.add('blue-text', 'text-darken-2'); // added the class names 
    let name = document.createTextNode(data.name);     // the title of the task 
    title.appendChild(name);

    let points = document.createElement('span');   // a span for the points of the task
    points.classList.add('right', 'right-align');  // added class for the points 
    let pointValue = document.createTextNode(data.value + " pt");  // actual points 
    points.appendChild(pointValue);

    if (data.status == 'claimed') {
        let img = document.createElement('img'); //  a gravatar img 
        img.classList.add('profilePicture'); //  
        img.setAttribute("id", 'gravatar');
        console.log(data.completedByHash);
        img.setAttribute('src', 'https://www.gravatar.com/avatar/' + data.completedByHash);
        img.setAttribute('alt', 'gravator image');
        task.appendChild(img);
    }

    task.appendChild(title);
    task.appendChild(points)

    task.classList.add('card-panel', 'task');
    a.appendChild(task);

    a.setAttribute('href', userRole + '-reward-detail.html?rewardUID=' + taskUID);
    return a;
}

function createReward() {
    let rewardName = document.getElementById("rewardName").value;
    let value = document.getElementById("value").value;
    let note = document.getElementById("note").value;

    let familyUID = sessionStorage.getItem("familyUID");

    var rewardObject = {
        name: rewardName,
        value: value,
        description: note,
        status: "avaliable"
    };

    // check for empty values {notes, points, and titles}
    if (value === null || value == 0 || value < 0 || rewardName.length === null || rewardName.length == 0) {
        let save = document.querySelector('save');
        save.disabled = true;
        save.classList.add('disabled');
    } else {
        database.ref("family/" + familyUID + "/rewards").push(rewardObject);
        window.location.replace("./parent-rewards.html");
    }
}