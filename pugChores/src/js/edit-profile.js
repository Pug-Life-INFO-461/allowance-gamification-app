var database = firebase.database();

let gravatarRoot = "https://www.gravatar.com/avatar/";

let familyUID = "-LCw5ow5u64CdtprojEp"; //sessionStorage.getItem("familyUID"); TODO: change
let userUID = "-LCwAQIZMo3tGGDwZWgr"; //sessionStorage.getItem("userUID"); TODO: change

let gravatar = document.getElementById("gravatar");
let name = document.getElementById("name");
let email = document.getElementById("email");

database.ref("family/" + familyUID + "/familyUsers/" + userUID)
        .once('value')
        .then(function (snapshot) {
            let data = snapshot.val();
            name.value = data.name;
            email.value = data.email;
        })
        .then(() => {
            M.updateTextFields();
        });

function goBack(){
    window.history.back();
}

function save(){


    database.ref("family/" + familyUID + "/familyUsers/" + userUID)
    .update({
        name : name.value,
        email : email.value,
        emailHash : md5(email.value)
    });
    goBack();
}