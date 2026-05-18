const API="https://script.google.com/macros/s/AKfycbyRqFqWsrDiyyvuLnstQPrUsXIz8LLIdjJI7YnZfptb8qUPf_YBUGTuMyKfGU8N3IxI0w/exec";

let produk={};

let history=[];


function mulai(){

let petugas=
document.getElementById(
"petugas"
).value;

let tim=
document.getElementById(
"tim"
).value;

let rak=
document.getElementById(
"rak"
).value;


if(!petugas||!tim||!rak){

alert(
"Lengkapi data"
);

return;

}

localStorage.setItem(
"petugas",
petugas
);

localStorage.setItem(
"tim",
tim
);

localStorage.setItem(
"rak",
rak
);


document.getElementById(
"showPetugas"
).innerText=petugas;

document.getElementById(
"showTim"
).innerText=tim;

document.getElementById(
"showRak"
).innerText=rak;


document.getElementById(
"loginArea"
).style.display="none";

document.getElementById(
"scanArea"
).style.display="block";


startScanner();

}



function startScanner(){

const qr=

new Html5Qrcode(
"reader"
);


qr.start(

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

cariProduk(text);

}



function cariManual(){

let text=

document.getElementById(
"manualInput"
).value;

cariProduk(text);

}



function cariProduk(input){

fetch(

API+

"?action=find&input="+input

)

.then(

r=>r.json()

)

.then(data=>{


if(!data.status){

alert(
"Produk tidak ditemukan"
);

return;

}


produk=data;


document.getElementById(
"produk"
).innerHTML=

`

Kode : ${data.kode}
<br>

Produk :
${data.nama}

<br>

Barcode :
${data.barcode}

`;

});

}



function simpan(){

let body={

action:"save",

tim:
localStorage.getItem(
"tim"
),

petugas:
localStorage.getItem(
"petugas"
),

rak:
localStorage.getItem(
"rak"
),

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


fetch(

API,

{

method:"POST",

body:
JSON.stringify(
body
)

}

)

.then(
r=>r.json()
)

.then(data=>{

alert(
data.message
);

tambahHistory();

document.getElementById(
"qty"
).value="";

});

}



function tambahHistory(){

history.unshift(

produk.nama

);

history=history.slice(
0,
10
);


document.getElementById(
"history"
).innerHTML=

history.join(
"<br>"
);

}



function selesaiRak(){

fetch(

API,

{

method:"POST",

body:
JSON.stringify({

action:
"lockRak",

rak:
localStorage.getItem(
"rak"
)

})

}

)

.then(
r=>r.json()
)

.then(data=>{

alert(
data.message
);

});

}
