const API="https://script.google.com/macros/s/AKfycbyAHGsQouvw1_dP5kSOMqpn_1mVDClLdtoiA80c_HyMRP6UYZgeRaOqADPLr1I77f0jkA/exec";

let MASTER=[];
let produk={};
let scanner=null;


window.onload=async()=>{

await loadMaster();

};



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


let res=
await fetch(

API+
"?action=master"

);


let data=
await res.json();


MASTER=data.data;


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
Periksa koneksi internet

`;

}

}



async function bukaScanner(){

try{


if(scanner){

await scanner.stop();

scanner.clear();

scanner=null;

document.getElementById(
"reader"
).innerHTML="";

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

try{


document
.getElementById(
"scanInput"
)
.value=text;


bunyiBeep();


cariProduk(text);



if(scanner){

await scanner.stop();

scanner.clear();

scanner=null;

}


document
.getElementById(
"reader"
)
.innerHTML="";


document
.getElementById(
"qty"
)
.focus();

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



function cekInput(e){

if(

e.key==="Enter"

){

cariProduk(

document
.getElementById(
"scanInput"
)
.value

);

}

}



function cariProduk(input){

input=
input.trim();



produk=

MASTER.find(

x=>

x.kode==input ||

x.barcode==input

);



if(!produk){

document
.getElementById(
"produk"
)
.innerHTML=

"❌ Produk tidak ditemukan";


return;

}



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


document
.getElementById(
"qty"
)
focus();

}



async function simpan(){

if(!produk){

alert(
"Pilih produk"
);

return;

}


let body={

action:"save",

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

rak:
document
.getElementById(
"rak"
)
.value,

kode:
produk.kode,

nama:
produk.nama,

barcode:
produk.barcode,

qty:
document
.getElementById(
"qty"
)
.value

};



let res=

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


let data=
await res.json();


alert(
data.message
);



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


produk={};



document
.getElementById(
"scanInput"
)
.focus();

}
