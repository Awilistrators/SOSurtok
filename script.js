const API="https://script.google.com/macros/s/AKfycbx2uHNwMZSjm_d4EAgOXmI-Yg5yK3_2to8n5Qsp2U7Cle_zrxFCty1M8dAxsZjVwnhO6Q/exec";

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


daftar.forEach(n=>{

petugas.innerHTML+=

`<option>${n}</option>`;

});

}



async function loadMaster(){

const status=
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

const res=

await fetch(

API+
"?action=master&t="+
Date.now()

);


const data=

await res.json();


MASTER=

data.data||[];


scanBtn.disabled=false;
scanInput.disabled=false;


status.innerHTML=

"✅ Siap mulai hitung";


scanInput.focus();

}
catch(err){

status.innerHTML=

"❌ Gagal memuat master";

}

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


const res=

await fetch(

API+

"?action=rak&tim="+

tim

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



function validasiRak(){

const rak=

document
.getElementById(
"rak"
)
.value
.trim();


const daftar=

Array.from(

document
.getElementById(
"rakList"
)
options

)

.map(

x=>x.value

);


return daftar.includes(
rak
);

}



function cekInput(e){

if(

e.key=="Enter" ||

e.key=="Tab" ||

e.key=="NumpadEnter"

){

e.preventDefault();


setTimeout(()=>{

cariProduk(

document
.getElementById(
"scanInput"
)
.value

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
.value;


if(input){

produk=null;

cariProduk(
input
);

}

}



function cariProduk(input){

input=

String(input)
.trim()
.toUpperCase();


produk=

MASTER.find(x=>

String(
x.kode
)
.toUpperCase()==input ||

String(
x.barcode
)
.toUpperCase()==input

);


if(!produk){

bunyiError();

document
.getElementById(
"produk"
)
.innerHTML=

"❌ Data tidak ditemukan";


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

<br>

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
.focus();

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
