var database = firebase.database();

let gravatarRoot = "https://www.gravatar.com/avatar/";

let familyUID = sessionStorage.getItem("familyUID");
let userUID = sessionStorage.getItem("userUID");

let gravatar = document.getElementById("gravatar");
let name = document.getElementById("name");
let email = document.getElementById("email");
var oldName = "";
var oldEmailHash = "";

database.ref("family/" + familyUID + "/familyUsers/" + userUID)
    .once('value')
    .then(function (snapshot) {
        let data = snapshot.val();
        name.value = data.name;
        email.value = data.email;
        oldName = data.name;
        oldEmailHash = data.emailHash;
    })
    .then(() => {
        M.updateTextFields();
    });

function goBack() {
    window.history.back();
}

function save() {
    var userRef = database.ref("users");

    console.log(!isNameAvailable());
    // if (!isNameAvailable()) {
    //     name.classList.add("invalid");
    // } else if (!isEmailAvailable()) {
    //     email.classList.add("invalid");
    // } else {
    //     var user = firebase.auth().currentUser;
    //     user.updateEmail(email.value).then(function () {
    //         console.log("success");
    //     }).catch(function (error) {
    //         console.log(error);
    //     });

    //     userRef.child(oldEmailHash).once("value")
    //         .then(function (snap) {
    //             var data = snap.val();
    //             let newEmailHash = md5(email.value);
    //             database.ref("users/" + newEmailHash).set(data);
    //         })
    //         .then(
    //         database.ref("family/" + familyUID + "/familyUsers/" + userUID)
    //             .update({
    //                 name: name.value,
    //                 email: email.value,
    //                 emailHash: md5(email.value)
    //             })
    //         );
    //     setTimeout(function () {
    //         removeOldUser();
    //     }, 1000);
    //     setTimeout(function () {
    //         goBack();
    //     }, 1200);
    // }
}

function isNameAvailable() {
    var result = true;
    name.classList.remove("invalid");
    database.ref("family/" + familyUID + "/familyUsers")
        .once("value")
        .then(function (familyRef) {
            familyRef.forEach(function (family) {
                let tempName = family.val().name;
                if (oldName !== tempName && name.value == tempName) {
                    result = false;
                }
            });
        })
        .finally(() => {
            if (!result) {
                name.classList.add("invalid");
            }
            console.log(result);
            return result;
        });
    return result;
}

function isEmailAvailable() {
    var result = true;
    let hashedEmail = md5(email.value);
    email.classList.remove("invalid");
    database.ref("users")
        .once("value")
        .then(function (userRef) {
            userRef.forEach(function(user) {
                if (user.key !== oldEmailHash && hashedEmail == user.key) {
                    result = false;
                }
            });
        })
        .finally(() => {
            if (!result) {
                email.classList.add("invalid");
            }
            console.log(result);
            return result; 
        });
    return result;
}

function removeOldUser() {
    var oldReference = database.ref("users/" + oldEmailHash);
    oldReference.remove();
}