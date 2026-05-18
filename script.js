const API="https://script.google.com/macros/s/AKfycbyAHGsQouvw1_dP5kSOMqpn_1mVDClLdtoiA80c_HyMRP6UYZgeRaOqADPLr1I77f0jkA/exec";

let MASTER=[];

let produk={};

window.onload=async()=>{

loadMaster();

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



function bukaScanner(){

const scanner=

new Html5Qrcode(
"reader"
);

scanner.start(

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



function hasilScan(text){

document
.getElementById(
"scanInput"
)
.value=text;

cariProduk(text);

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

"Produk tidak ditemukan";

return;

}



document
.getElementById(
"produk"
)
.innerHTML=

`

${produk.nama}

<br><br>

Kode :
${produk.kode}

<br>

Barcode :
${produk.barcode}

`;

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

}
