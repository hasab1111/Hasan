/* ===================================
   LOVE PROJECT
   Main Script
=================================== */

const $ = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);

/*==============================
      تاريخ بداية العلاقة
==============================*/

const startDate = new Date("2024-01-01T00:00:00");

/*==============================
          العداد
==============================*/

function updateTimer() {

    const now = new Date();

    const diff = now - startDate;

    const days = Math.floor(diff / 86400000);

    const hours = Math.floor(diff / 3600000) % 24;

    const minutes = Math.floor(diff / 60000) % 60;

    const seconds = Math.floor(diff / 1000) % 60;

    if ($("#days")) $("#days").textContent = days;
    if ($("#hours")) $("#hours").textContent = hours;
    if ($("#minutes")) $("#minutes").textContent = minutes;
    if ($("#seconds")) $("#seconds").textContent = seconds;

}

updateTimer();

setInterval(updateTimer,1000);

/*==============================
      ظهور العناصر
==============================*/

const observer = new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.animate([

{
opacity:0,
transform:"translateY(60px)"
},

{
opacity:1,
transform:"translateY(0)"
}

],{

duration:900,
fill:"forwards",
easing:"ease"

});

}

});

},{
threshold:.15
});

$$(".glass,.item").forEach(el=>{

el.style.opacity=0;

observer.observe(el);

});

/*==============================
        زر لا يهرب
==============================*/

const noBtn=$("#noBtn");

if(noBtn){

const moveButton=()=>{

const w=window.innerWidth-140;

const h=window.innerHeight-80;

const x=Math.random()*w;

const y=Math.random()*h;

noBtn.style.position="fixed";

noBtn.style.left=x+"px";

noBtn.style.top=y+"px";

};

noBtn.addEventListener("mouseenter",moveButton);

noBtn.addEventListener("click",moveButton);

}

/*==============================
      زر نعم
==============================*/

const yes=$("#yesBtn");

if(yes){

yes.onclick=()=>{

createExplosion();

showMessage();

};

}

/*==============================
      رسالة رومانسية
==============================*/

function showMessage(){

const old=document.querySelector(".lovePopup");

if(old) old.remove();

const box=document.createElement("div");

box.className="lovePopup";

box.innerHTML=`

<h2>❤️</h2>

<h1>شكراً لأنك موجود/ة بحياتي</h1>

<p>

كل يوم يمرك ويانا...

يزيدني قناعة إنك أجمل شيء صار إلي.

</p>

`;

document.body.appendChild(box);

setTimeout(()=>{

box.classList.add("show");

},50);

}

/*==============================
       قلوب طائرة
==============================*/

function createHeart(){

const heart=document.createElement("div");

heart.className="floatingHeart";

heart.innerHTML="❤";

heart.style.left=Math.random()*100+"vw";

heart.style.fontSize=(18+Math.random()*40)+"px";

heart.style.animationDuration=(5+Math.random()*6)+"s";

document.body.appendChild(heart);

setTimeout(()=>{

heart.remove();

},12000);

}

setInterval(createHeart,350);

/*==============================
      انفجار قلوب
==============================*/

function createExplosion(){

for(let i=0;i<80;i++){

const p=document.createElement("div");

p.className="particle";

const angle=Math.random()*Math.PI*2;

const distance=100+Math.random()*250;

const x=Math.cos(angle)*distance;

const y=Math.sin(angle)*distance;

p.style.setProperty("--x",x+"px");

p.style.setProperty("--y",y+"px");

p.style.left="50%";

p.style.top="50%";

document.body.appendChild(p);

setTimeout(()=>{

p.remove();

},1800);

}

}

/*==============================
     حركة الماوس
==============================*/

document.addEventListener("mousemove",e=>{

const heart=document.querySelector(".crystal");

if(!heart) return;

const x=(e.clientX/window.innerWidth-.5)*20;

const y=(e.clientY/window.innerHeight-.5)*20;

heart.style.transform=`

rotateY(${x}deg)

rotateX(${-y}deg)

`;

});

/*==============================
      تأثير الكتابة
==============================*/

const letter=$(".letter");

if(letter){

const text=letter.innerHTML;

letter.innerHTML="";

let i=0;

const timer=setInterval(()=>{

letter.innerHTML+=text.charAt(i);

i++;

if(i>=text.length){

clearInterval(timer);

}

},25);

}

/*==============================
      نجوم بالخلفية
==============================*/

const canvas=$("#bgCanvas");

if(canvas){

const ctx=canvas.getContext("2d");

resize();

window.addEventListener("resize",resize);

function resize(){

canvas.width=innerWidth;

canvas.height=innerHeight;

}

const stars=[];

for(let i=0;i<180;i++){

stars.push({

x:Math.random()*innerWidth,

y:Math.random()*innerHeight,

r:Math.random()*2,

s:Math.random()*0.6

});

}

function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="white";

stars.forEach(star=>{

ctx.globalAlpha=.2+Math.random()*.8;

ctx.beginPath();

ctx.arc(star.x,star.y,star.r,0,Math.PI*2);

ctx.fill();

star.y+=star.s;

if(star.y>innerHeight){

star.y=0;

star.x=Math.random()*innerWidth;

}

});

requestAnimationFrame(animate);

}

animate();

}

/*==============================
      رسالة الترحيب
==============================*/

window.onload=()=>{

setTimeout(()=>{

const title=$(".mainTitle");

if(title){

title.animate([

{

transform:"scale(.7)",

opacity:0

},

{

transform:"scale(1)",

opacity:1

}

],{

duration:1200,

fill:"forwards"

});

}

},400);

};

/*============================
      Loader
============================*/

window.addEventListener("load",()=>{

setTimeout(()=>{

const loader=document.getElementById("loader");

if(loader){

loader.style.opacity="0";

setTimeout(()=>{

loader.remove();

},900);

}

},1800);

});

/*============================
 Scroll To Top
============================*/

const topBtn=document.getElementById("scrollTop");

window.addEventListener("scroll",()=>{

if(window.scrollY>500){

topBtn.style.display="block";

}else{

topBtn.style.display="none";

}

});

topBtn.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};

/*============================
 Cursor Glow
============================*/

const glow=document.getElementById("cursorGlow");

document.addEventListener("mousemove",(e)=>{

glow.style.left=e.clientX+"px";

glow.style.top=e.clientY+"px";

});

/*============================
 Card Tilt
============================*/

document.querySelectorAll(".glass").forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;

const y=e.clientY-rect.top;

const rx=-(y-rect.height/2)/18;

const ry=(x-rect.width/2)/18;

card.style.transform=

`rotateX(${rx}deg) rotateY(${ry}deg)`;

});

card.addEventListener("mouseleave",()=>{

card.style.transform="";

});

});

/*============================
 Hidden Surprise
============================*/

let clicks=0;

document.querySelector(".crystal")?.addEventListener("click",()=>{

clicks++;

if(clicks==7){

alert("❤️ مفاجأة! أحبك إلى ما لا نهاية ❤️");

}

});
