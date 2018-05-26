var database = firebase.database();

// function verifyFamily() {
//     var existingFamily = false;
//     var familyName = document.getElementById("familyName").value;
//     console.log(familyName);
//     var ref = database.ref("family")
//         .once("value")
//         .then(function (familyRef) {
//             familyRef.forEach(function (family) {
//                 let child = familyRef.child(family.key);
//                 let tempFamilyname = child.val().name;
//                 console.log(tempFamilyname);
//                 if (familyName === tempFamilyname) {
//                     existingFamily = true;
//                     return existingFamily;
//                 }
//             });
//             return existingFamily;
//         }).then(existingFamily => {
//             if (existingFamily) {
//                 console.log("yo");
//                 if (verifyPassword()) {
//                     alert("all correct");
//                 }
//             }
//         });
    
//     if (existingFamily) {
//         alert("hello");
//     }
// }

function verifyPassword() {
    var correctPassword = false;
    var familyName = document.getElementById("familyName").value;
    var passwordVal = document.getElementById("password").value;
    var joinBtn = document.getElementById("join-btn");
    var joinBtnTxt = document.getElementById("join-btn-txt");
    var familyNameElem = document.getElementById("familyName");
    var passwordElem = document.getElementById("password");

    familyNameElem.classList.remove("invalid");
    passwordElem.classList.remove("invalid");
    
    var ref = database.ref("family")
        .once("value")
        .then(function (familyRef) {
            familyRef.forEach(function (family) {
                let child = familyRef.child(family.key);
                let tempFamilyName = child.val().name;
                let tempFamilyPassword = child.val().password;
                // console.log(tempFamilyName);
                // console.log(familyName);
                if (tempFamilyName === familyName && passwordVal !== tempFamilyPassword) {
                    passwordElem.classList.add("invalid");
                } else if (tempFamilyName === familyName && passwordVal === tempFamilyPassword) {
                    correctPassword = true;
                    joinBtn.classList.remove("hidden");
                    joinBtnTxt.classList.add(family.key);
                    sessionStorage.setItem("familyName", familyName);
                } 
            });
        })
}

// var containsFamily = false;

function checkFamilyExists() {
    var containsFamily = false;
    var familyName = document.getElementById("familyName").value;
    var familyNameElem = document.getElementById("familyName");

    familyNameElem.classList.remove("invalid");
    
    database.ref("family")
        .once("value")
        .then(function (familyRef) {
            familyRef.forEach(function (family) {
                let child = familyRef.child(family.key);
                let tempFamilyName = child.val().name;
                let tempFamilyPassword = child.val().password;
                if (tempFamilyName === familyName) {
                    containsFamily = true;
                }
            });
        })
        .finally(() => {
            console.log(containsFamily);
            if (!containsFamily) {
                familyNameElem.classList.add("invalid");
            }
        });
}

function onButtonPress() {
    var familyUID = document.getElementById("join-btn-txt").className;
    sessionStorage.setItem("familyUID", familyUID);
    window.location.replace("signup.html");
}
