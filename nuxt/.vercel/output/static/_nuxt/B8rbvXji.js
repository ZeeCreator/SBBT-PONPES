import{f as E,g as Y,m as R,A as T,h as G,c as i,a,i as l,t as d,j as c,F as h,r as $,q as r,v as p,x as S,B as P,e as J,d as W,k as Z,l as C,T as Q,p as v,o,n as _,s as j}from"./DXr9HCwO.js";const X={class:"px-gutter max-w-container-max mx-auto",style:{"padding-top":"6rem","padding-bottom":"3rem"}},tt={key:0,class:"mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md"},at={key:1,class:"flex items-center justify-center py-12"},et={class:"grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"},nt={class:"text-label-sm text-on-surface-variant"},st={class:"glass-card rounded-xl shadow-sm overflow-hidden"},lt={class:"p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"},ot={class:"flex items-center gap-4"},it={class:"flex items-center gap-2"},rt={class:"overflow-x-auto"},dt={class:"w-full text-left"},ut={class:"divide-y divide-outline-variant/10"},pt={class:"px-4 py-3 text-label-md font-medium"},ct={class:"px-4 py-3"},mt={class:"px-4 py-3 text-label-sm text-on-surface-variant"},gt={class:"px-4 py-3 text-label-sm text-on-surface-variant"},bt={class:"px-4 py-3 text-label-sm text-on-surface-variant"},xt={class:"px-4 py-3 text-label-sm text-on-surface-variant"},vt={class:"px-4 py-3"},ft={class:"px-4 py-3 text-center"},yt=["onClick"],kt=["onClick"],ht=["onClick"],wt=["onClick"],_t=["onClick"],Pt={key:0},At={class:"bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"},$t={class:"bg-primary px-gutter py-stack-md flex justify-between items-center"},St={class:"space-y-1"},Kt=["value"],Tt={class:"space-y-1"},Ct={key:0,class:"grid grid-cols-2 gap-stack-md"},jt={class:"space-y-1"},Nt=["placeholder"],Dt={class:"space-y-1"},Bt=["placeholder"],Ft={class:"space-y-1"},Mt={class:"grid grid-cols-2 gap-stack-md"},zt={class:"space-y-1"},qt={class:"space-y-1"},Ut={class:"grid grid-cols-2 gap-stack-md"},Vt={class:"space-y-1"},Ht={class:"space-y-1"},It={class:"space-y-1"},Lt={key:3,class:"grid grid-cols-2 gap-stack-md"},Ot={class:"space-y-1"},Et={class:"space-y-1"},Yt={class:"space-y-1"},Rt={class:"flex justify-end gap-stack-sm pt-stack-sm"},Wt=E({__name:"index",setup(Gt){const m=v(""),g=v(""),b=v(""),f=v(!1),A=v(!0),x=v(""),y=v([]),w=v([]),{getIdToken:N}=Y(),s=R({santri:"",studentId:"",tipe:"Kamar",dari:"",ke:"",keterangan:"",date:new Date().toISOString().split("T")[0]}),D=j(()=>[{label:"Total Mutasi Bulan Ini",icon:"swap_horiz",bg:"bg-primary-fixed",iconColor:"text-primary",valueColor:"text-primary",value:y.value.length.toString()},{label:"Pending Approvals",icon:"hourglass",bg:"bg-amber-100",iconColor:"text-amber-600",valueColor:"text-amber-700",value:y.value.filter(n=>n.status==="pending").length.toString()},{label:"Disetujui",icon:"check_circle",bg:"bg-green-100",iconColor:"text-green-600",valueColor:"text-green-700",value:y.value.filter(n=>n.status==="disetujui").length.toString()},{label:"Ditolak",icon:"cancel",bg:"bg-red-100",iconColor:"text-red-600",valueColor:"text-red-700",value:y.value.filter(n=>n.status==="ditolak").length.toString()}]),K=j(()=>y.value.filter(n=>(!m.value||n.santri.toLowerCase().includes(m.value.toLowerCase()))&&(!g.value||n.tipe===g.value)&&(!b.value||n.status===b.value)));function B(n){return{Kamar:"bg-blue-100 text-blue-700",Kelas:"bg-purple-100 text-purple-700",Boyong:"bg-orange-100 text-orange-700",Halaqoh:"bg-teal-100 text-teal-700","Pindah Pondok Al-Fatah Pusat":"bg-rose-100 text-rose-700"}[n]||"bg-surface-container text-on-surface-variant"}function F(n){return{pending:"bg-amber-100 text-amber-700",disetujui:"bg-green-100 text-green-700",ditolak:"bg-red-100 text-red-700"}[n]||"bg-surface-container text-on-surface-variant"}function M(n){return{pending:"Pending",disetujui:"Disetujui",ditolak:"Ditolak"}[n]||n}async function k(){A.value=!0,x.value="";try{const n={};m.value&&(n.search=m.value),g.value&&(n.tipe=g.value),b.value&&(n.status=b.value);const t=new URLSearchParams(n).toString();y.value=await $fetch(`/api/mutasi${t?"?"+t:""}`)||[]}catch(n){x.value=n.message||"Gagal memuat data"}finally{A.value=!1}}T([m,g,b],()=>k());function z(){s.santri="",s.studentId="",s.tipe="Kamar",s.dari="",s.ke="",s.keterangan="",s.date=new Date().toISOString().split("T")[0],f.value=!0}T(()=>s.tipe,n=>{n==="Pindah Pondok Al-Fatah Pusat"&&(s.dari||(s.dari="Pondok Al-Fatah Panekan"),s.ke||(s.ke="Pondok Al-Fatah Pusat"))});async function q(){try{const n=await N(),t=await fetch("/api/students",{headers:{Authorization:`Bearer ${n}`}});t.ok&&(w.value=await t.json())}catch(n){console.error(n)}}async function U(){try{await $fetch("/api/mutasi",{method:"POST",body:{santri:s.santri,studentId:s.studentId,tipe:s.tipe,dari:s.dari,ke:s.ke,keterangan:s.keterangan,date:s.date,status:"pending"}}),f.value=!1,await k()}catch(n){x.value=n.message||"Gagal mengajukan"}}async function V(n){try{await $fetch(`/api/mutasi/${n}`,{method:"PATCH",body:{status:"disetujui"}}),await k()}catch(t){x.value=t.message||"Gagal menyetujui"}}async function H(n){try{await $fetch(`/api/mutasi/${n}`,{method:"PATCH",body:{status:"ditolak"}}),await k()}catch(t){x.value=t.message||"Gagal menolak"}}async function I(n){if(confirm("Yakin ingin menghapus data mutasi ini?"))try{await $fetch(`/api/mutasi/${n}`,{method:"DELETE"}),await k()}catch(t){x.value=t.message||"Gagal menghapus"}}function L(n){const t=w.value.find(u=>u.id===n.studentId||u.name===n.santri),e=window.open("","_blank");e&&(e.document.write(`
<html><head><title>Surat Boyong - ${n.santri}</title>
<style>
  @page { size: A4; margin: 15mm 20mm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; margin: 0; padding: 0; }
  .kop { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
  .kop .logo { max-height: 60px; vertical-align: middle; }
  .kop .kop-title { font-size: 15pt; font-weight: bold; }
  .kop .kop-alamat { font-size: 9pt; }
  h2 { text-align: center; font-size: 14pt; margin: 16px 0; text-decoration: underline; }
  .no-surat { text-align: center; font-size: 10pt; margin-bottom: 16px; }
  .content { line-height: 1.8; text-align: justify; }
  table.data { width: 100%; border-collapse: collapse; margin: 12px 0; }
  table.data td { padding: 4px 8px; font-size: 11pt; vertical-align: top; }
  table.data .label { width: 120px; }
  .ttd { margin-top: 40px; display: flex; justify-content: space-around; }
  .ttd div { text-align: center; width: 180px; }
  .ttd .jabatan { font-size: 10pt; margin-bottom: 60px; }
  .ttd .nama { font-size: 11pt; font-weight: bold; text-decoration: underline; }
</style></head><body>
<div class="kop">
  <table style="width:100%;"><tr>
    <td style="width:70px;text-align:center;">
      <img src="/image/logo.png" class="logo" style="max-height:55px;" onerror="this.style.display='none'" />
    </td>
    <td style="text-align:center;">
      <div class="kop-title">YAYASAN PONDOK PESANTREN<br>AL FATAH PANEKAN</div>
      <div class="kop-alamat">Turi, Panekan, Kabupaten Magetan, Jawa Timur 63352</div>
    </td>
  </tr></table>
</div>

<h2>SURAT IZIN BOYONG (PULANG)</h2>
<div class="no-surat">No: ${Math.floor(Math.random()*1e3).toString().padStart(3,"0")}/SPPB/AL-FATAH/${new Date().getMonth()+1}/${new Date().getFullYear()}</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini, Kepala Pondok Pesantren Al Fatah Panekan, menerangkan bahwa:</p>
</div>

<table class="data">
  <tr><td class="label">Nama Santri</td><td>: ${n.santri}</td></tr>
  ${t?.nis?`<tr><td>NIS</td><td>: ${t.nis}</td></tr>`:""}
  ${t?.class?`<tr><td>Kelas</td><td>: ${t.class}</td></tr>`:""}
  ${n.dari?`<tr><td>Dari Kamar</td><td>: ${n.dari}</td></tr>`:""}
  ${n.ke?`<tr><td>Dari Kelas</td><td>: ${n.ke}</td></tr>`:""}
  <tr><td>Alasan Boyong</td><td>: ${n.keterangan||"-"}</td></tr>
  <tr><td>Tanggal Boyong</td><td>: ${n.date}</td></tr>
</table>

<div class="content">
  <p>Benar bahwa santri tersebut di atas telah diizinkan untuk boyong (pulang) dari Pondok Pesantren Al Fatah Panekan. Demikian surat ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
</div>

<div class="ttd">
  <div><div class="jabatan">Kepala Pondok,</div><div class="nama">_____________________</div></div>
  <div><div class="jabatan">Santri,</div><div class="nama">_____________________</div></div>
</div>
</body></html>
`),e.document.close(),setTimeout(()=>e.print(),500))}function O(n){const t=w.value.find(u=>u.id===n.studentId||u.name===n.santri),e=window.open("","_blank");e&&(e.document.write(`
<html><head><title>Surat Pindah - ${n.santri}</title>
<style>
  @page { size: A4; margin: 15mm 20mm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; margin: 0; padding: 0; }
  .kop { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
  .kop .logo { max-height: 60px; vertical-align: middle; }
  .kop .kop-title { font-size: 15pt; font-weight: bold; }
  .kop .kop-alamat { font-size: 9pt; }
  h2 { text-align: center; font-size: 14pt; margin: 16px 0; text-decoration: underline; }
  .no-surat { text-align: center; font-size: 10pt; margin-bottom: 16px; }
  .content { line-height: 1.8; text-align: justify; }
  table.data { width: 100%; border-collapse: collapse; margin: 12px 0; }
  table.data td { padding: 4px 8px; font-size: 11pt; vertical-align: top; }
  table.data .label { width: 120px; }
  .ttd { margin-top: 40px; display: flex; justify-content: space-around; }
  .ttd div { text-align: center; width: 180px; }
  .ttd .jabatan { font-size: 10pt; margin-bottom: 60px; }
  .ttd .nama { font-size: 11pt; font-weight: bold; text-decoration: underline; }
</style></head><body>
<div class="kop">
  <table style="width:100%;"><tr>
    <td style="width:70px;text-align:center;">
      <img src="/image/logo.png" class="logo" style="max-height:55px;" onerror="this.style.display='none'" />
    </td>
    <td style="text-align:center;">
      <div class="kop-title">YAYASAN PONDOK PESANTREN<br>AL FATAH PANEKAN</div>
      <div class="kop-alamat">Turi, Panekan, Kabupaten Magetan, Jawa Timur 63352</div>
    </td>
  </tr></table>
</div>

<h2>SURAT PINDAH PONDOK</h2>
<div class="no-surat">No: ${Math.floor(Math.random()*1e3).toString().padStart(3,"0")}/SPPB/AL-FATAH/${new Date().getMonth()+1}/${new Date().getFullYear()}</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini, Kepala Pondok Pesantren Al Fatah Panekan, menerangkan bahwa:</p>
</div>

<table class="data">
  <tr><td class="label">Nama Santri</td><td>: ${n.santri}</td></tr>
  ${t?.nis?`<tr><td>NIS</td><td>: ${t.nis}</td></tr>`:""}
  ${t?.class?`<tr><td>Kelas</td><td>: ${t.class}</td></tr>`:""}
  ${t?.tempat_lahir?`<tr><td>Tempat, Tgl Lahir</td><td>: ${t.tempat_lahir}${t?.tanggal_lahir?", "+t.tanggal_lahir:""}</td></tr>`:""}
  ${t?.alamat?`<tr><td>Alamat</td><td>: ${t.alamat}</td></tr>`:""}
  ${t?.nama_wali?`<tr><td>Nama Wali</td><td>: ${t.nama_wali}</td></tr>`:""}
  ${t?.no_hp_wali?`<tr><td>No. HP Wali</td><td>: ${t.no_hp_wali}</td></tr>`:""}
  ${n.dari?`<tr><td>Dari Pondok</td><td>: ${n.dari}</td></tr>`:""}
  ${n.ke?`<tr><td>Ke Pondok</td><td>: ${n.ke}</td></tr>`:""}
  <tr><td>Tanggal Pindah</td><td>: ${n.date}</td></tr>
</table>

<div class="content">
  <p>Benar bahwa santri tersebut di atas adalah santri kami yang bermaksud untuk mengikuti Program Pondok Pesantren Al Fatah Pusat. Sehubungan dengan hal tersebut, maka yang bersangkutan dipindahkan dari Pondok Pesantren Al Fatah Panekan ke Pondok Pesantren Al Fatah Pusat. Demikian surat ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
</div>

<div class="ttd">
  <div><div class="jabatan">Pengurus Pondok,</div><div class="nama">_____________________</div></div>
  <div><div class="jabatan">Santri,</div><div class="nama">_____________________</div></div>
</div>
</body></html>
`),e.document.close(),setTimeout(()=>e.print(),500))}return G(()=>{k(),q()}),(n,t)=>(o(),i("div",X,[t[50]||(t[50]=a("div",{class:"mb-stack-lg"},[a("h2",{class:"font-display text-headline-lg text-primary"},"Mutasi Kamar, Kelas, Boyong, Halaqoh & Pindah Pondok"),a("p",{class:"text-on-surface-variant text-body-md"},"Kelola permintaan mutasi/pindah kamar, kelas, boyong (pulang), pindah halaqoh, dan pindah pondok santri.")],-1)),l(x)?(o(),i("div",tt,d(l(x)),1)):c("",!0),l(A)?(o(),i("div",at,[...t[20]||(t[20]=[a("span",{class:"material-symbols-outlined animate-spin text-primary text-3xl"},"refresh",-1)])])):(o(),i(h,{key:2},[a("div",et,[(o(!0),i(h,null,$(l(D),e=>(o(),i("div",{key:e.label,class:"glass-card p-stack-md rounded-xl shadow-sm text-center"},[a("div",{class:_(["w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center",e.bg])},[a("span",{class:_(["material-symbols-outlined",e.iconColor])},d(e.icon),3)],2),a("p",{class:_(["font-display text-headline-md",e.valueColor])},d(e.value),3),a("p",nt,d(e.label),1)]))),128))]),a("div",st,[a("div",lt,[a("div",ot,[a("div",it,[t[21]||(t[21]=a("span",{class:"material-symbols-outlined text-on-surface-variant"},"search",-1)),r(a("input",{"onUpdate:modelValue":t[0]||(t[0]=e=>S(m)?m.value=e:null),class:"bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary",placeholder:"Cari santri..."},null,512),[[p,l(m)]])]),r(a("select",{"onUpdate:modelValue":t[1]||(t[1]=e=>S(g)?g.value=e:null),class:"bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"},[...t[22]||(t[22]=[J('<option value="">Semua Tipe</option><option value="Kamar">Kamar</option><option value="Kelas">Kelas</option><option value="Boyong">Boyong</option><option value="Halaqoh">Halaqoh</option><option value="Pindah Pondok Al-Fatah Pusat">Pindah Pondok Al-Fatah Pusat</option>',6)])],512),[[P,l(g)]]),r(a("select",{"onUpdate:modelValue":t[2]||(t[2]=e=>S(b)?b.value=e:null),class:"bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"},[...t[23]||(t[23]=[a("option",{value:""},"Semua Status",-1),a("option",{value:"pending"},"Pending",-1),a("option",{value:"disetujui"},"Disetujui",-1),a("option",{value:"ditolak"},"Ditolak",-1)])],512),[[P,l(b)]])]),a("button",{class:"flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all",onClick:z},[...t[24]||(t[24]=[a("span",{class:"material-symbols-outlined text-sm"},"add",-1),W(" Ajukan Mutasi ",-1)])])]),a("div",rt,[a("table",dt,[t[31]||(t[31]=a("thead",{class:"bg-surface-container-low"},[a("tr",null,[a("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant"},"Santri"),a("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant"},"Tipe Mutasi"),a("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant"},"Dari"),a("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant"},"Ke"),a("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant"},"Keterangan"),a("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant"},"Tanggal"),a("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant"},"Status"),a("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant text-center"},"Aksi")])],-1)),a("tbody",ut,[(o(!0),i(h,null,$(l(K),e=>(o(),i("tr",{key:e.id,class:"hover:bg-primary-fixed/5 transition-colors"},[a("td",pt,d(e.santri),1),a("td",ct,[a("span",{class:_(["px-2.5 py-0.5 text-[11px] font-bold rounded-full",B(e.tipe)])},d(e.tipe),3)]),a("td",mt,d(e.dari||"-"),1),a("td",gt,d(e.ke||"-"),1),a("td",bt,d(e.keterangan||"-"),1),a("td",xt,d(e.date),1),a("td",vt,[a("span",{class:_(["px-2.5 py-0.5 text-[11px] font-bold rounded-full",F(e.status)])},d(M(e.status)),3)]),a("td",ft,[e.status==="pending"?(o(),i("button",{key:0,class:"text-green-600 hover:text-green-800 mr-2 transition-colors",onClick:u=>V(e.id)},[...t[25]||(t[25]=[a("span",{class:"material-symbols-outlined"},"check_circle",-1)])],8,yt)):c("",!0),e.status==="pending"?(o(),i("button",{key:1,class:"text-red-600 hover:text-red-800 mr-2 transition-colors",onClick:u=>H(e.id)},[...t[26]||(t[26]=[a("span",{class:"material-symbols-outlined"},"cancel",-1)])],8,kt)):c("",!0),e.status==="disetujui"&&e.tipe==="Boyong"?(o(),i("button",{key:2,class:"text-blue-600 hover:text-blue-800 mr-2 transition-colors",onClick:u=>L(e),title:"Cetak Surat Boyong"},[...t[27]||(t[27]=[a("span",{class:"material-symbols-outlined"},"print",-1)])],8,ht)):c("",!0),e.status==="disetujui"&&e.tipe==="Pindah Pondok Al-Fatah Pusat"?(o(),i("button",{key:3,class:"text-blue-600 hover:text-blue-800 mr-2 transition-colors",onClick:u=>O(e),title:"Cetak Surat Pindah"},[...t[28]||(t[28]=[a("span",{class:"material-symbols-outlined"},"print",-1)])],8,wt)):c("",!0),a("button",{class:"text-error hover:text-red-700 transition-colors",onClick:u=>I(e.id)},[...t[29]||(t[29]=[a("span",{class:"material-symbols-outlined"},"delete",-1)])],8,_t)])]))),128)),l(K).length===0?(o(),i("tr",Pt,[...t[30]||(t[30]=[a("td",{colspan:"8",class:"px-4 py-8 text-center text-on-surface-variant text-label-md"},"Tidak ada data",-1)])])):c("",!0)])])])])],64)),(o(),Z(Q,{to:"body"},[l(f)?(o(),i("div",{key:0,class:"fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm",onClick:t[19]||(t[19]=C(e=>f.value=!1,["self"]))},[a("div",At,[a("div",$t,[t[33]||(t[33]=a("div",{class:"text-on-primary"},[a("h2",{class:"font-display text-headline-md"},"Ajukan Mutasi"),a("p",{class:"text-[11px] text-on-primary opacity-80 uppercase tracking-widest"},"Mutasi Module")],-1)),a("button",{class:"text-on-primary/60 hover:text-on-primary p-2",onClick:t[3]||(t[3]=e=>f.value=!1)},[...t[32]||(t[32]=[a("span",{class:"material-symbols-outlined"},"close",-1)])])]),a("form",{class:"p-gutter space-y-stack-md",onSubmit:C(U,["prevent"])},[a("div",St,[t[35]||(t[35]=a("label",{class:"text-label-md text-on-surface-variant"},"Nama Santri",-1)),r(a("select",{"onUpdate:modelValue":t[4]||(t[4]=e=>l(s).santri=e),onChange:t[5]||(t[5]=e=>l(s).studentId=l(w).find(u=>u.name===l(s).santri)?.id||""),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none",required:""},[t[34]||(t[34]=a("option",{value:""},"-- Pilih Santri --",-1)),(o(!0),i(h,null,$(l(w),e=>(o(),i("option",{key:e.id,value:e.name},d(e.name)+" ("+d(e.nis||"-")+")",9,Kt))),128))],544),[[P,l(s).santri]])]),a("div",Tt,[t[37]||(t[37]=a("label",{class:"text-label-md text-on-surface-variant"},"Tipe Mutasi",-1)),r(a("select",{"onUpdate:modelValue":t[6]||(t[6]=e=>l(s).tipe=e),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"},[...t[36]||(t[36]=[a("option",{value:"Kamar"},"Kamar",-1),a("option",{value:"Kelas"},"Kelas",-1),a("option",{value:"Boyong"},"Boyong (Pulang)",-1),a("option",{value:"Halaqoh"},"Halaqoh",-1),a("option",{value:"Pindah Pondok Al-Fatah Pusat"},"Pindah Pondok Al-Fatah Pusat",-1)])],512),[[P,l(s).tipe]])]),l(s).tipe==="Kamar"||l(s).tipe==="Kelas"?(o(),i("div",Ct,[a("div",jt,[t[38]||(t[38]=a("label",{class:"text-label-md text-on-surface-variant"},"Dari",-1)),r(a("input",{"onUpdate:modelValue":t[7]||(t[7]=e=>l(s).dari=e),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none",placeholder:l(s).tipe==="Kamar"?"Kamar 1-A":"Kelas 10-A",required:""},null,8,Nt),[[p,l(s).dari]])]),a("div",Dt,[t[39]||(t[39]=a("label",{class:"text-label-md text-on-surface-variant"},"Ke",-1)),r(a("input",{"onUpdate:modelValue":t[8]||(t[8]=e=>l(s).ke=e),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none",placeholder:l(s).tipe==="Kamar"?"Kamar 2-B":"Kelas 11-A",required:""},null,8,Bt),[[p,l(s).ke]])])])):c("",!0),l(s).tipe==="Boyong"?(o(),i(h,{key:1},[a("div",Ft,[t[40]||(t[40]=a("label",{class:"text-label-md text-on-surface-variant"},"Keterangan / Alasan Boyong",-1)),r(a("textarea",{"onUpdate:modelValue":t[9]||(t[9]=e=>l(s).keterangan=e),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none min-h-[80px]",placeholder:"Alasan boyong/pulang...",required:""},null,512),[[p,l(s).keterangan]])]),a("div",Mt,[a("div",zt,[t[41]||(t[41]=a("label",{class:"text-label-md text-on-surface-variant"},"Dari Kamar",-1)),r(a("input",{"onUpdate:modelValue":t[10]||(t[10]=e=>l(s).dari=e),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none",placeholder:"Kamar sebelumnya"},null,512),[[p,l(s).dari]])]),a("div",qt,[t[42]||(t[42]=a("label",{class:"text-label-md text-on-surface-variant"},"Dari Kelas",-1)),r(a("input",{"onUpdate:modelValue":t[11]||(t[11]=e=>l(s).ke=e),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none",placeholder:"Kelas sebelumnya"},null,512),[[p,l(s).ke]])])])],64)):c("",!0),l(s).tipe==="Halaqoh"?(o(),i(h,{key:2},[a("div",Ut,[a("div",Vt,[t[43]||(t[43]=a("label",{class:"text-label-md text-on-surface-variant"},"Dari Halaqoh",-1)),r(a("input",{"onUpdate:modelValue":t[12]||(t[12]=e=>l(s).dari=e),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none",placeholder:"Halaqoh A",required:""},null,512),[[p,l(s).dari]])]),a("div",Ht,[t[44]||(t[44]=a("label",{class:"text-label-md text-on-surface-variant"},"Ke Halaqoh",-1)),r(a("input",{"onUpdate:modelValue":t[13]||(t[13]=e=>l(s).ke=e),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none",placeholder:"Halaqoh B",required:""},null,512),[[p,l(s).ke]])])]),a("div",It,[t[45]||(t[45]=a("label",{class:"text-label-md text-on-surface-variant"},"Keterangan",-1)),r(a("textarea",{"onUpdate:modelValue":t[14]||(t[14]=e=>l(s).keterangan=e),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none min-h-[60px]",placeholder:"Alasan pindah halaqoh..."},null,512),[[p,l(s).keterangan]])])],64)):c("",!0),l(s).tipe==="Pindah Pondok Al-Fatah Pusat"?(o(),i("div",Lt,[a("div",Ot,[t[46]||(t[46]=a("label",{class:"text-label-md text-on-surface-variant"},"Dari",-1)),r(a("input",{"onUpdate:modelValue":t[15]||(t[15]=e=>l(s).dari=e),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none",placeholder:"Pondok Al-Fatah Panekan"},null,512),[[p,l(s).dari]])]),a("div",Et,[t[47]||(t[47]=a("label",{class:"text-label-md text-on-surface-variant"},"Ke",-1)),r(a("input",{"onUpdate:modelValue":t[16]||(t[16]=e=>l(s).ke=e),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none",placeholder:"Pondok Al-Fatah Pusat"},null,512),[[p,l(s).ke]])])])):c("",!0),a("div",Yt,[t[48]||(t[48]=a("label",{class:"text-label-md text-on-surface-variant"},"Tanggal",-1)),r(a("input",{type:"date","onUpdate:modelValue":t[17]||(t[17]=e=>l(s).date=e),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none",required:""},null,512),[[p,l(s).date]])]),a("div",Rt,[a("button",{class:"px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg",type:"button",onClick:t[18]||(t[18]=e=>f.value=!1)},"Batal"),t[49]||(t[49]=a("button",{class:"px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all",type:"submit"},"Ajukan",-1))])],32)])])):c("",!0)]))]))}});export{Wt as default};
