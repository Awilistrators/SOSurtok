const API="https://script.google.com/macros/s/AKfycbwmMlzWK84NrIxk8UuJ9N_MhZUJoKAxmiHYI-hWRw5LHlxw44jFTUZ8IC7DlSgUyzJY1A/exec";

let MASTER=[];
let produk=null;
let scanner=null;



window.addEventListener(

"load",

async()=>{

await loadMaster();

});


function updatePetugas(){

const tim=
document.getElementById("tim").value;

const petugas=
document.getElementById("petugas");


petugas.innerHTML=

'<option value="">Pilih Petugas</option>';


let daftar=[];


if(tim=="Surtok"){

daftar=[

"Asep",
"Dudi",
"Riki",
"Yanto",
"Ridwan",
"Wildan"

];

}


if(tim=="Audit"){

daftar=[

"Agung",
"Rilo",
"Maul",
"Riki"

];

}


daftar.forEach(nama=>{

petugas.innerHTML+=

`<option>${nama}</option>`;

});

}



async function loadMaster(){

const statusDiv=
document.getElementById("masterStatus");

const scanBtn=
document.getElementById("btnScan");

const scanInput=
document.getElementById("scanInput");


scanBtn.disabled=true;
scanInput.disabled=true;


try{

statusDiv.innerHTML=

`🔄 Memuat master produk...
<br>
mohon tunggu dulu..`;


const res=

await fetch(

API+
"?action=master&t="+
Date.now(),

{
cache:"no-store"
}

);


const data=
await res.json();


MASTER=(data.data||[]).map(item=>({

kode:
String(item.kode||"")
.trim()
.toUpperCase(),

nama:
String(item.nama||""),

barcode:
String(item.barcode||"")
.trim()
.toUpperCase()

}));


scanBtn.disabled=false;
scanInput.disabled=false;


statusDiv.innerHTML=

"✅ Siap mulai hitung";


scanInput.focus();

}
catch(err){

console.log(err);

statusDiv.innerHTML=

`❌ Gagal memuat master
<br>
Hubungi development`;

}

}



async function bukaScanner(){

try{

const reader=
document.getElementById(
"reader"
);

reader.style.display=
"block";


if(scanner){

await scanner.stop();
await scanner.clear();

scanner=null;

reader.innerHTML="";
reader.style.display="none";

return;

}


scanner=
new Html5Qrcode(
"reader"
);


await scanner.start(

{
facingMode:"environment"
},

{
fps:10,
qrbox:250
},

hasilScan

);

}
catch(err){

console.log(err);

alert(
"Gagal membuka kamera"
);

}

}



async function hasilScan(text){

document
.getElementById(
"scanInput"
)
.value=text;


bunyiBeep();


cariProduk(
text
);


if(scanner){

await scanner.stop();

await scanner.clear();

scanner=null;

}


document
.getElementById(
"reader"
)
.style.display="none";

}



function bunyiBeep(){

const audio=

new Audio(

"https://actions.google.com/sounds/v1/alarms/beep_short.ogg"

);

audio.play();

}



/* scanner usb + manual */

function cekInput(e){

if(

e.key==="Enter" ||

e.key==="NumpadEnter" ||

e.key==="Tab"

){

e.preventDefault();

setTimeout(()=>{

const input=

document
.getElementById(
"scanInput"
)
.value
.trim();


if(!input){

return;

}


cariProduk(
input
);

},100);

}

}

function cekBlur(){

const input=

document
.getElementById(
"scanInput"
)
.value
.trim();


if(!input){

return;

}


/* reset produk lama */

produk=null;


/* cari ulang */

cariProduk(
input
);

}

function cariProduk(input){

input=

String(input)
.trim()
.toUpperCase();


produk=null;


produk=

MASTER.find(x=>{

return(

x.kode===input ||

x.barcode===input

);

});


if(!produk){

bunyiError();

document
.getElementById(
"produk"
)
.innerHTML=

"❌ Data tidak ditemukan";


document
.getElementById(
"scanInput"
)
.value="";


setTimeout(()=>{

document
.getElementById(
"produk"
)
.innerHTML=

"Belum ada produk";


document
.getElementById(
"scanInput"
)
.focus();

},3000);

return;

}


bunyiSukses();

document
.getElementById(
"produk"
)
.innerHTML=

`

<b>${produk.nama}</b>

<br><br>

Kode:
${produk.kode}

<br>

Barcode:
${produk.barcode}

`;


setTimeout(()=>{

document
.getElementById(
"qty"
)
.focus();

},50);

}



async function simpan(){

if(

!document.getElementById("tim").value ||

!document.getElementById("petugas").value ||

!document.getElementById("rak").value

){

tampilPopup(

"⚠️ Harap pilih tim,<br><br>isi nama petugas dan rak"

);

return;

}


/* validasi rak */

if(

!validasiRak()

){

tampilPopup(

"⚠️ Pilih rak dari daftar"

);

return;

}


if(!produk){

tampilPopup(

"⚠️ Harap scan atau pilih produk"

);

return;

}


const body={

action:"save",

tim:
document.getElementById(
"tim"
).value,

petugas:
document.getElementById(
"petugas"
).value,

rak:
document.getElementById(
"rak"
).value,

kode:
produk.kode,

nama:
produk.nama,

barcode:
produk.barcode,

qty:
document.getElementById(
"qty"
).value

};



document
.getElementById(
"scanInput"
)
.value="";


document
.getElementById(
"qty"
)
.value="";


document
.getElementById(
"produk"
)
.innerHTML=

"Belum ada produk";


produk=null;


document
.getElementById(
"scanInput"
)
.focus();


fetch(

API,

{

method:"POST",

body:
JSON.stringify(
body
)

}

);

}



function tampilPopup(pesan){

document
.getElementById(
"popupText"
)
.innerHTML=
pesan;


document
.getElementById(
"popup"
)
.style.display=
"flex";

}



function tutupPopup(){

document
.getElementById(
"popup"
)
.style.display=
"none";

}



async function selesaiRak(){

const rak=

document
.getElementById(
"rak"
)
.value;


if(!rak){

tampilPopup(

"⚠️ Rak kosong"

);

return;

}


const body={

action:"selesaiRak",

tim:
document
.getElementById(
"tim"
)
.value,

petugas:
document
.getElementById(
"petugas"
)
.value,

rak:rak

};


document
.getElementById(
"rak"
)
.value="";


try{

await fetch(

API,

{

method:"POST",

body:
JSON.stringify(
body
)

}

);


/* refresh rak */

await loadRak();


document
.getElementById(
"rak"
)
.focus();

}
catch(err){

console.log(err);

}

}


await fetch(

API,

{

method:"POST",

body:
JSON.stringify(
body
)

}

);

}

function resetProduk(){

produk=null;

document
.getElementById(
"produk"
)
.innerHTML=

"Belum ada produk";

}

function bunyiSukses(){

const audio=

new Audio(

"https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"

);

audio.play();

}



function bunyiError(){

const audio=

new Audio(

"https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg"

);

audio.play();

}

async function loadRak(){

const tim=
document
.getElementById(
"tim"
)
.value;


if(!tim){

return;

}


try{

const res=

await fetch(

API+

"?action=rak&tim="+

encodeURIComponent(
tim
)

);


const data=

await res.json();


const rakList=

document
.getElementById(
"rakList"
);


rakList.innerHTML="";


(data.data||[])

.forEach(r=>{

rakList.innerHTML+=

`<option value="${r}">`;

});

}
catch(err){

console.log(err);

}

}

function validasiRak(){

const rak=

document
.getElementById(
"rak"
)
.value
.trim();


const daftarRak=

Array.from(

document
.getElementById(
"rakList"
)
options

)

.map(

x=>x.value.trim()

);


return daftarRak.includes(
rak
);

}
