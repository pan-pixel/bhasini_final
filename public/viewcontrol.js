// import { loadModel } from "./3d.js";

const cont1 = document.getElementById('threeview');
const cont2 = document.getElementById('ar-screen');
const b1=document.getElementById('btn1');
const b2=document.getElementById('btn2');

cont1.classList.add("active");
b1.classList.add("active");

b1.addEventListener('click',()=>{
    cont1.classList.add("active")
    b1.classList.add("active");
    b2.classList.remove("active");
    cont2.classList.remove("active");
//   document.getElementById("ar-screen").style.display = "block";
    cont2.style.display = "none";

});
b2.addEventListener('click',()=>{
    cont2.classList.add("active")
    cont2.style.display = "block";
    b2.classList.add("active");
    b1.classList.remove("active");
    cont1.classList.remove("active");
});