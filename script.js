const API="https://script.google.com/macros/s/AKfycbw_gZ6sss8zrn8pPLQ6i5Rz0yEN16MaHWtHVJV-YQiG3qZlMsTmrhGMx_F_1teJWmgSdQ/exec";

let MASTER=[];
let produk=null;
let scanner=null;



window.onload=async()=>{

await loadMaster();

};



function updatePetugas(){

const tim=
document.getElementById(
"tim"
).value;

const petugas=
document.getElementById(
"petugas"
);

petugas.innerHTML=

`
<option value="">
Pilih Petugas
</option>
`;


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

`

<option>

${nama}

</option>

`;

});

}



async function loadMaster(){

const statusDiv=
document.getElementById(
"masterStatus"
);

const scanBtn=
document.getElementById(
"btnScan"
);

const scanInput=
document.getElementById(
"scanInput"
);


scanBtn.disabled=true;

scanInput.disabled=true;


try{

statusDiv.innerHTML=`

🔄 Memuat master produk...
<br>
mohon tunggu dulu..

`;


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
String(item.kode),

nama:
String(item.nama),

barcode:
String(item.barcode)

}));


scanBtn.disabled=false;

scanInput.disabled=false;


statusDiv.innerHTML=`

✅ Siap mulai hitung

`;


scanInput.focus();

}
catch(err){

console.log(err);


statusDiv.innerHTML=`

❌ Gagal memuat master
<br>
Hubungi development

`;

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

try{

await scanner.stop();

}catch(e){}


try{

await scanner.clear();

}catch(e){}


scanner=null;

reader.innerHTML="";

reader.style.display=
"none";

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

qrbox:{

width:250,
height:250

}

},

hasilScan,

()=>{}

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

try{

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


const reader=
document.getElementById(
"reader"
);

reader.innerHTML="";

reader.style.display=
"none";

}
catch(err){

console.log(err);

}

}



function bunyiBeep(){

const audio=

new Audio(

"https://actions.google.com/sounds/v1/alarms/beep_short.ogg"

);

audio.play();

}



/* SCANNER USB / MANUAL */

function cekInput(e){

if(

e.key==="Enter"

){

e.preventDefault();


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

}

}



function cariProduk(input){

input=

String(input)
.trim()
.replace(/\s/g,'');


produk=null;


/* cari master */

produk=

MASTER.find(x=>{


const kode=

String(
x.kode || ""
)
.trim()
.replace(/\s/g,'');


const barcode=

String(
x.barcode || ""
)
.trim()
.replace(/\s/g,'');


return (

kode===input ||

barcode===input

);

});



if(!produk){

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



/* tampil produk */

document
.getElementById(
"produk"
)
.innerHTML=

`

<b>${produk.nama}</b>

<br><br>

Kode :
${produk.kode}

<br>

Barcode :
${produk.barcode}

`;


/* pindah qty */

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

!document
.getElementById(
"tim"
)
.value ||

!document
.getElementById(
"petugas"
)
.value ||

!document
.getElementById(
"rak"
)
.value

){

tampilPopup(

"⚠️ Harap pilih tim,<br><br>isi nama petugas dan rak"

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


try{

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
catch(err){

console.log(err);

}

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
document.getElementById(
"tim"
).value,

petugas:
document.getElementById(
"petugas"
).value,

rak:rak

};


document
.getElementById(
"rak"
)
.value="";


document
.getElementById(
"rak"
)
.focus();


try{

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
catch(err){

console.log(err);

}

}
