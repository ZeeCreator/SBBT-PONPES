import{f as at,h as st,c as i,a as e,d as K,q as N,B as z,i as n,x as B,F as v,r as k,t as m,j as S,k as lt,l as O,v as nt,T as ot,p as b,m as it,s as F,o,n as V,C as dt}from"./DXr9HCwO.js";const rt={class:"px-gutter max-w-container-max mx-auto",style:{"padding-top":"6rem","padding-bottom":"3rem"}},ut={class:"flex flex-wrap items-center gap-4 mb-stack-lg"},ct={class:"flex items-center gap-2"},pt=["value"],mt={class:"flex items-center gap-2"},gt={class:"flex items-center gap-2"},xt=["value"],bt={key:0,class:"mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md"},ft={key:1,class:"flex items-center justify-center py-12"},vt={class:"grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"},ht={class:"text-label-sm text-on-surface-variant"},yt={class:"grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-stack-lg"},kt={class:"lg:col-span-2 glass-card rounded-xl p-6 shadow-sm overflow-hidden"},wt={class:"overflow-x-auto"},_t={class:"w-full text-left"},$t={class:"bg-surface-container-low"},jt={class:"divide-y divide-outline-variant/10"},Nt={key:0},St=["colspan"],At={class:"px-3 py-2 text-label-md font-medium sticky left-0 bg-surface z-10"},Tt=["onClick"],Ct={key:1,class:"text-on-surface-variant/40 text-label-sm"},zt={class:"px-3 py-2 text-center font-bold text-primary"},It={class:"px-3 py-2 text-center"},Et={class:"px-3 py-2 text-center"},Pt=["onClick"],Mt={class:"space-y-gutter"},Rt={class:"glass-card rounded-xl p-6 shadow-sm"},Kt={key:0,class:"text-on-surface-variant text-label-md"},Dt={class:"flex justify-between text-label-sm"},Gt={class:"text-on-surface-variant"},Lt={class:"font-bold"},Ut={class:"w-full h-2 bg-surface-container-highest rounded-full overflow-hidden"},Bt={class:"glass-card rounded-xl p-6 shadow-sm"},Ft={class:"space-y-3"},Vt=["value"],Yt=["disabled"],Ot={class:"bg-surface rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-modal-enter"},qt={class:"bg-primary px-gutter py-stack-md flex justify-between items-center"},Ht={class:"font-display text-headline-md text-on-primary"},Jt={class:"space-y-1"},Qt=["disabled"],Wt=["value"],Xt={class:"space-y-1"},Zt=["value"],te={class:"space-y-1"},ee={class:"flex justify-end gap-stack-sm pt-stack-sm"},ae={class:"bg-surface rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-modal-enter"},se={class:"p-6 text-center"},le={class:"text-on-surface-variant text-label-md"},ne={class:"p-6 border-t border-outline-variant/20 flex justify-end gap-3"},de=at({__name:"grading",setup(oe){const D=b(!0),g=b(""),I=b([]),A=b([]),E=b([]),w=b([]),T=b([]),h=b(""),_=b("Ganjil"),f=b("2025/2026"),$=b(""),j=b(!1),P=b(!1),M=b(null),u=it({id:"",studentId:"",subject:"",score:0}),G=F(()=>h.value?E.value.filter(s=>s.class===h.value):E.value),L=F(()=>{const s={};return T.value.forEach(t=>{s[t.studentId]||(s[t.studentId]={}),s[t.studentId][t.subject]={score:Number(t.score)||0,gradeId:t.id}}),G.value.map(t=>{const a=s[t.id]||{},r={},x={};w.value.forEach(l=>{a[l.name]?(r[l.name]=a[l.name].score,x[l.name]=a[l.name].gradeId):r[l.name]=null});const p=Object.values(r).filter(l=>l!==null),d=p.length?p.reduce((l,c)=>l+c,0)/p.length:0;return{id:t.id,name:t.name,nis:t.nis||"",scores:r,gradeIds:x,average:d?d.toFixed(1):"-",passed:d>=75}})}),Y=F(()=>{const s=L.value,t=s.length,a=s.map(p=>parseFloat(p.average)).filter(p=>!isNaN(p)),r=a.length?a.reduce((p,d)=>p+d,0)/a.length:0,x=s.filter(p=>p.passed).length;return[{label:"Total Santri",value:t.toString(),color:"text-primary"},{label:"Rata-rata Kelas",value:r?r.toFixed(1):"-",color:"text-secondary"},{label:"Tingkat Kelulusan",value:t?Math.round(x/t*100)+"%":"-",color:"text-tertiary"},{label:"Mata Pelajaran",value:w.value.length.toString(),color:"text-green-600"}]}),q=F(()=>{const s=[];L.value.forEach(d=>{Object.values(d.scores).forEach(l=>{l!==null&&s.push(l)})});const t=s.length;if(!t)return[];const a=s.filter(d=>d>=90).length,r=s.filter(d=>d>=80&&d<90).length,x=s.filter(d=>d>=70&&d<80).length,p=s.filter(d=>d<70).length;return[{label:"A (90-100)",percentage:Math.round(a/t*100),barColor:"bg-green-500"},{label:"B (80-89)",percentage:Math.round(r/t*100),barColor:"bg-primary-container"},{label:"C (70-79)",percentage:Math.round(x/t*100),barColor:"bg-amber-500"},{label:"D (<70)",percentage:Math.round(p/t*100),barColor:"bg-red-500"}]});function J(){u.id="",u.studentId="",u.subject="",u.score=0,j.value=!0}function Q(s,t){u.id=s.gradeIds[t]||"",u.studentId=s.id,u.subject=t,u.score=s.scores[t]||0,j.value=!0}async function W(){if(!(!u.studentId||!u.subject||u.score===void 0)){g.value="";try{const s=E.value.find(a=>a.id===u.studentId),t={studentId:u.studentId,studentName:s?.name||"",subject:u.subject,score:u.score,semester:_.value,academicYear:f.value,class:s?.class||h.value||""};u.id?await $fetch(`/api/akademik/grades/${u.id}`,{method:"PUT",body:t}):await $fetch("/api/akademik/grades",{method:"POST",body:t}),j.value=!1,await C()}catch(s){g.value=s.message||"Gagal menyimpan nilai"}}}function X(s){M.value=s,P.value=!0}async function Z(){if(M.value){g.value="";try{const s=Object.values(M.value.gradeIds).filter(Boolean);await Promise.all(s.map(t=>$fetch(`/api/akademik/grades/${t}`,{method:"DELETE"}))),P.value=!1,M.value=null,await C()}catch(s){g.value=s.message||"Gagal menghapus nilai"}}}async function tt(){g.value="";try{const s=L.value;if(!s.length){g.value="Tidak ada data untuk dicetak";return}const t=w.value.map(l=>l.name),a=t.map(l=>`<th style="padding:6px 8px;border:1px solid #333;font-size:10pt;text-align:center;background:#f0f0f0;">${l}</th>`).join(""),r=s.map((l,c)=>{const y=t.map(R=>`<td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;">${l.scores[R]!==null?l.scores[R]:"-"}</td>`).join(""),U=l.passed?"LULUS":"REMEDIAL",H=l.passed?"#16a34a":"#dc2626";return`<tr>
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;">${c+1}</td>
        <td style="padding:4px 6px;border:1px solid #333;font-size:10pt;">${l.name}</td>
        ${y}
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;font-weight:bold;">${l.average}</td>
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;font-weight:bold;color:${H};">${U}</td>
      </tr>`}).join(""),x=Y.value[1].value,p=Y.value[2].value,d=window.open("","_blank");if(!d)return;d.document.write(`
<html><head><title>Rekap Nilai - ${h.value||"Semua Kelas"}</title>
<style>
  @page { size: landscape; margin: 12mm 15mm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; margin: 0; padding: 15px; }
  .kop { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 16px; }
  .kop .logo { max-height: 55px; vertical-align: middle; }
  .kop .kop-title { font-size: 15pt; font-weight: bold; }
  .kop .kop-alamat { font-size: 9pt; }
  h2 { text-align: center; font-size: 13pt; margin: 14px 0; text-decoration: underline; }
  .info { margin-bottom: 10px; }
  .info td { padding: 2px 6px; font-size: 10pt; }
  table.data { width: 100%; border-collapse: collapse; margin: 10px 0; }
  table.data th { padding: 6px; border: 1px solid #333; font-size: 10pt; }
  table.data td { padding: 4px 6px; border: 1px solid #333; font-size: 10pt; }
  .ttd { margin-top: 30px; display: flex; justify-content: space-around; }
  .ttd div { text-align: center; width: 180px; }
  .ttd .jabatan { font-size: 10pt; margin-bottom: 50px; }
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

<h2>REKAP NILAI SANTRI</h2>

<table class="info">
  <tr><td>Kelas</td><td>: ${h.value||"Semua Kelas"}</td></tr>
  <tr><td>Semester</td><td>: ${_.value}</td></tr>
  <tr><td>Tahun Ajaran</td><td>: ${f.value}</td></tr>
  <tr><td>Jumlah Santri</td><td>: ${s.length}</td></tr>
  <tr><td>Rata-rata Kelas</td><td>: ${x}</td></tr>
  <tr><td>Tingkat Kelulusan</td><td>: ${p}</td></tr>
</table>

<table class="data">
  <thead>
    <tr>
      <th style="width:32px;">No</th>
      <th style="width:140px;">Nama Santri</th>
      ${a}
      <th style="width:55px;">Rata-rata</th>
      <th style="width:65px;">Status</th>
    </tr>
  </thead>
  <tbody>${r}</tbody>
</table>

<div class="ttd">
  <div><div class="jabatan">Kepala Pondok,</div><div class="nama">_____________________</div></div>
</div>
</body></html>`),d.document.close(),setTimeout(()=>d.print(),500)}catch(s){g.value=s.message||"Gagal mencetak"}}async function et(){if($.value){g.value="";try{const s=E.value.find(c=>c.id===$.value);if(!s){g.value="Santri tidak ditemukan";return}const t=T.value.filter(c=>c.studentId===$.value),a=t.reduce((c,y)=>c+(Number(y.score)||0),0),r=t.length?a/t.length:0,x=r>=75,p=x?"LULUS":"REMEDIAL",d=x?"#16a34a":"#dc2626",l=window.open("","_blank");if(!l)return;l.document.write(`
<html><head><title>Nilai Santri - ${s.name}</title>
<style>
  @page { size: A4; margin: 15mm 20mm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; margin: 0; padding: 0; }
  .kop { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 16px; }
  .kop .logo { max-height: 55px; vertical-align: middle; }
  .kop .kop-title { font-size: 15pt; font-weight: bold; }
  .kop .kop-alamat { font-size: 9pt; }
  h2 { text-align: center; font-size: 13pt; margin: 14px 0; text-decoration: underline; }
  table.info { margin-bottom: 12px; width: 100%; }
  table.info td { padding: 2px 6px; font-size: 10pt; vertical-align: top; }
  table.info .label { width: 120px; }
  table.data { width: 100%; border-collapse: collapse; margin: 10px 0; }
  table.data th { background: #f0f0f0; padding: 6px; border: 1px solid #333; font-size: 10pt; }
  table.data td { padding: 4px 6px; border: 1px solid #333; font-size: 10pt; text-align: center; }
  table.data td.left { text-align: left; }
  .summary { margin-top: 8px; font-size: 10pt; }
  .ttd { margin-top: 30px; display: flex; justify-content: space-around; }
  .ttd div { text-align: center; width: 180px; }
  .ttd .jabatan { font-size: 10pt; margin-bottom: 50px; }
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

<h2>DAFTAR NILAI SANTRI</h2>

<table class="info">
  <tr><td class="label">Nama Santri</td><td>: ${s.name}</td></tr>
  ${s.nis?`<tr><td>NIS</td><td>: ${s.nis}</td></tr>`:""}
  <tr><td>Kelas</td><td>: ${s.class||"-"}</td></tr>
  <tr><td>Semester</td><td>: ${_.value}</td></tr>
  <tr><td>Tahun Ajaran</td><td>: ${f.value}</td></tr>
</table>

<table class="data">
  <thead>
    <tr>
      <th style="width:32px;">No</th>
      <th style="width:160px;">Mata Pelajaran</th>
      <th style="width:70px;">Nilai</th>
      <th>Keterangan</th>
    </tr>
  </thead>
  <tbody>
    ${t.map((c,y)=>`
    <tr>
      <td>${y+1}</td>
      <td class="left">${c.subject}</td>
      <td style="font-weight:bold;">${c.score}</td>
      <td class="left">${c.score>=75?"LULUS":"REMEDIAL"}</td>
    </tr>`).join("")}
    ${t.length===0?'<tr><td colspan="4" style="text-align:center;">Belum ada nilai</td></tr>':""}
  </tbody>
</table>

<table class="summary">
  <tr><td>Jumlah Mata Pelajaran</td><td>: ${t.length}</td></tr>
  <tr><td>Total Nilai</td><td>: ${a}</td></tr>
  <tr><td>Rata-rata Nilai</td><td>: ${r.toFixed(1)}</td></tr>
  <tr><td>Status</td><td>: <span style="font-weight:bold;color:${d};">${p}</span></td></tr>
</table>

<div class="ttd">
  <div><div class="jabatan">Kepala Pondok,</div><div class="nama">_____________________</div></div>
</div>
</body></html>`),l.document.close(),setTimeout(()=>l.print(),500)}catch(s){g.value=s.message||"Gagal mencetak"}}}async function C(){D.value=!0,g.value="";try{const[s,t,a,r,x,p]=await Promise.all([$fetch("/api/master-data/classes"),$fetch("/api/master-data/academic-years"),$fetch("/api/students"),$fetch("/api/akademik/subjects"),$fetch("/api/akademik/grades",{query:{semester:_.value,academicYear:f.value}}),$fetch("/api/akademik/imtihan")]);I.value=s||[],A.value=t||[],E.value=a||[],w.value=r||[],T.value=x||[];const d=[];p&&p.length>0&&((await Promise.all(p.map(c=>$fetch(`/api/akademik/imtihan/${c.id}`).catch(()=>null)))).filter(Boolean).forEach(c=>{c.scores&&Object.entries(c.scores).forEach(([y,U])=>{T.value.find(R=>R.studentId===y&&R.subject===c.subject)||d.push({id:`imtihan_${c.id}_${y}`,studentId:y,studentName:U.studentName||y,subject:c.subject,score:Number(U.score)||0,semester:_.value,academicYear:f.value,class:c.kelas||"",createdAt:c.date||c.createdAt||"",sesi:c.sesi||""})})}),T.value=[...T.value,...d]),!h.value&&I.value.length>0&&(h.value=I.value[0].name||I.value[0].nama||""),A.value.length>0&&!A.value.some(l=>(l.name||l.code)===f.value)&&(f.value=A.value[0].name||A.value[0].code||f.value)}catch(s){g.value=s.message||"Gagal memuat data"}finally{D.value=!1}}return st(()=>C()),(s,t)=>(o(),i("div",rt,[e("div",{class:"mb-stack-lg flex flex-wrap items-center justify-between gap-stack-md"},[t[14]||(t[14]=e("div",null,[e("h2",{class:"font-display text-headline-lg text-primary"},"Management Penilaian"),e("p",{class:"text-on-surface-variant text-body-md"},"Kelola nilai santri per mata pelajaran dan cetak rapor.")],-1)),e("div",{class:"flex items-center gap-3"},[e("button",{class:"flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md shadow-sm hover:brightness-110 active:scale-95 transition-all",onClick:J},[...t[12]||(t[12]=[e("span",{class:"material-symbols-outlined text-sm"},"add",-1),K(" Tambah Nilai ",-1)])]),e("button",{class:"flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary rounded-lg text-label-md shadow-sm hover:brightness-110 active:scale-95 transition-all",onClick:tt},[...t[13]||(t[13]=[e("span",{class:"material-symbols-outlined text-sm"},"print",-1),K(" Cetak Rekap ",-1)])])])]),e("div",ut,[e("div",ct,[t[16]||(t[16]=e("label",{class:"text-label-sm text-on-surface-variant whitespace-nowrap"},"Kelas:",-1)),N(e("select",{"onUpdate:modelValue":t[0]||(t[0]=a=>B(h)?h.value=a:null),class:"bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary min-w-[160px]",onChange:C},[t[15]||(t[15]=e("option",{value:""},"-- Semua Kelas --",-1)),(o(!0),i(v,null,k(n(I),a=>(o(),i("option",{key:a.id,value:a.name||a.nama},m(a.name||a.nama),9,pt))),128))],544),[[z,n(h)]])]),e("div",mt,[t[18]||(t[18]=e("label",{class:"text-label-sm text-on-surface-variant whitespace-nowrap"},"Semester:",-1)),N(e("select",{"onUpdate:modelValue":t[1]||(t[1]=a=>B(_)?_.value=a:null),class:"bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary",onChange:C},[...t[17]||(t[17]=[e("option",{value:"Ganjil"},"Ganjil",-1),e("option",{value:"Genap"},"Genap",-1)])],544),[[z,n(_)]])]),e("div",gt,[t[19]||(t[19]=e("label",{class:"text-label-sm text-on-surface-variant whitespace-nowrap"},"Tahun Ajaran:",-1)),N(e("select",{"onUpdate:modelValue":t[2]||(t[2]=a=>B(f)?f.value=a:null),class:"bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary min-w-[130px]",onChange:C},[(o(!0),i(v,null,k(n(A),a=>(o(),i("option",{key:a.id,value:a.name||a.code},m(a.name||a.code),9,xt))),128))],544),[[z,n(f)]])])]),n(g)?(o(),i("div",bt,m(n(g)),1)):S("",!0),n(D)?(o(),i("div",ft,[...t[20]||(t[20]=[e("span",{class:"material-symbols-outlined animate-spin text-primary text-3xl"},"refresh",-1)])])):S("",!0),n(D)?S("",!0):(o(),i(v,{key:2},[e("div",vt,[(o(!0),i(v,null,k(n(Y),a=>(o(),i("div",{key:a.label,class:"glass-card p-stack-md rounded-xl shadow-sm text-center"},[e("p",{class:V(["font-display text-headline-md",a.color])},m(a.value),3),e("p",ht,m(a.label),1)]))),128))]),e("div",yt,[e("div",kt,[t[26]||(t[26]=e("h3",{class:"font-display text-title-lg text-primary mb-4"},"Daftar Nilai",-1)),e("div",wt,[e("table",_t,[e("thead",$t,[e("tr",null,[t[21]||(t[21]=e("th",{class:"px-3 py-3 text-label-sm text-on-surface-variant whitespace-nowrap sticky left-0 bg-surface-container-low z-10"},"Santri",-1)),(o(!0),i(v,null,k(n(w),a=>(o(),i("th",{key:a.id,class:"px-3 py-3 text-label-sm text-on-surface-variant whitespace-nowrap text-center"},m(a.name),1))),128)),t[22]||(t[22]=e("th",{class:"px-3 py-3 text-label-sm text-on-surface-variant whitespace-nowrap text-center"},"Rata-rata",-1)),t[23]||(t[23]=e("th",{class:"px-3 py-3 text-label-sm text-on-surface-variant whitespace-nowrap text-center"},"Status",-1)),t[24]||(t[24]=e("th",{class:"px-3 py-3 text-label-sm text-on-surface-variant whitespace-nowrap text-center"},"Aksi",-1))])]),e("tbody",jt,[n(G).length===0?(o(),i("tr",Nt,[e("td",{colspan:n(w).length+4,class:"px-4 py-8 text-center text-on-surface-variant text-label-md"},"Belum ada data santri. Pilih kelas terlebih dahulu.",8,St)])):S("",!0),(o(!0),i(v,null,k(n(L),a=>(o(),i("tr",{key:a.id,class:"hover:bg-primary-fixed/5 transition-colors"},[e("td",At,m(a.name),1),(o(!0),i(v,null,k(n(w),r=>(o(),i("td",{key:r.id,class:"px-2 py-2 text-center cursor-pointer",onClick:x=>Q(a,r.name)},[a.scores[r.name]!==void 0&&a.scores[r.name]!==null?(o(),i("span",{key:0,class:V(["px-2 py-0.5 rounded text-label-sm font-bold",a.scores[r.name]>=90?"bg-green-100 text-green-700":a.scores[r.name]>=80?"bg-primary-fixed text-on-primary-fixed":a.scores[r.name]>=70?"bg-amber-50 text-amber-700":"bg-red-50 text-red-700"])},m(a.scores[r.name]),3)):(o(),i("span",Ct,"-"))],8,Tt))),128)),e("td",zt,m(a.average),1),e("td",It,[e("span",{class:V(["px-2 py-1 text-[10px] font-bold rounded-full uppercase whitespace-nowrap",a.passed?"bg-green-100 text-green-700":"bg-red-50 text-red-700"])},m(a.passed?"Lulus":"Remedial"),3)]),e("td",Et,[e("button",{class:"text-error hover:text-red-700 transition-colors p-1",title:"Hapus semua nilai santri",onClick:r=>X(a)},[...t[25]||(t[25]=[e("span",{class:"material-symbols-outlined text-sm"},"delete",-1)])],8,Pt)])]))),128))])])])]),e("div",Mt,[e("div",Rt,[t[27]||(t[27]=e("h3",{class:"font-display text-title-lg text-primary mb-4"},"Distribusi Nilai",-1)),n(q).length===0?(o(),i("div",Kt,"Belum ada data")):S("",!0),(o(!0),i(v,null,k(n(q),a=>(o(),i("div",{key:a.label,class:"space-y-1 mb-3"},[e("div",Dt,[e("span",Gt,m(a.label),1),e("span",Lt,m(a.percentage)+"%",1)]),e("div",Ut,[e("div",{class:V(["h-full rounded-full transition-all duration-500",a.barColor]),style:dt({width:a.percentage+"%"})},null,6)])]))),128))]),e("div",Bt,[t[30]||(t[30]=e("h3",{class:"font-display text-title-lg text-primary mb-4"},"Cetak per Santri",-1)),e("div",Ft,[N(e("select",{"onUpdate:modelValue":t[3]||(t[3]=a=>B($)?$.value=a:null),class:"w-full bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary"},[t[28]||(t[28]=e("option",{value:""},"-- Pilih Santri --",-1)),(o(!0),i(v,null,k(n(G),a=>(o(),i("option",{key:a.id,value:a.id},m(a.name),9,Vt))),128))],512),[[z,n($)]]),e("button",{class:"w-full bg-tertiary text-on-tertiary py-2 rounded-lg text-label-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40",disabled:!n($),onClick:et},[...t[29]||(t[29]=[e("span",{class:"material-symbols-outlined text-sm"},"badge",-1),K(" Cetak Nilai Santri ",-1)])],8,Yt)])])])])],64)),(o(),lt(ot,{to:"body"},[n(j)?(o(),i("div",{key:0,class:"fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm",onClick:t[9]||(t[9]=O(a=>j.value=!1,["self"]))},[e("div",Ot,[e("div",qt,[e("h2",Ht,m(n(u).id?"Edit Nilai":"Tambah Nilai"),1),e("button",{class:"text-on-primary/60 hover:text-on-primary p-2",onClick:t[4]||(t[4]=a=>j.value=!1)},[...t[31]||(t[31]=[e("span",{class:"material-symbols-outlined"},"close",-1)])])]),e("form",{class:"p-gutter space-y-stack-md",onSubmit:O(W,["prevent"])},[e("div",Jt,[t[33]||(t[33]=e("label",{class:"text-label-md text-on-surface-variant"},"Santri",-1)),N(e("select",{"onUpdate:modelValue":t[5]||(t[5]=a=>n(u).studentId=a),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none",required:"",disabled:!!n(u).id},[t[32]||(t[32]=e("option",{value:""},"-- Pilih Santri --",-1)),(o(!0),i(v,null,k(n(G),a=>(o(),i("option",{key:a.id,value:a.id},m(a.name),9,Wt))),128))],8,Qt),[[z,n(u).studentId]])]),e("div",Xt,[t[35]||(t[35]=e("label",{class:"text-label-md text-on-surface-variant"},"Mata Pelajaran",-1)),N(e("select",{"onUpdate:modelValue":t[6]||(t[6]=a=>n(u).subject=a),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none",required:""},[t[34]||(t[34]=e("option",{value:""},"-- Pilih Mapel --",-1)),(o(!0),i(v,null,k(n(w),a=>(o(),i("option",{key:a.id,value:a.name},m(a.name),9,Zt))),128))],512),[[z,n(u).subject]])]),e("div",te,[t[36]||(t[36]=e("label",{class:"text-label-md text-on-surface-variant"},"Nilai (0-100)",-1)),N(e("input",{type:"number",min:"0",max:"100","onUpdate:modelValue":t[7]||(t[7]=a=>n(u).score=a),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none",required:""},null,512),[[nt,n(u).score,void 0,{number:!0}]])]),e("div",ee,[e("button",{class:"px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg",type:"button",onClick:t[8]||(t[8]=a=>j.value=!1)},"Batal"),t[37]||(t[37]=e("button",{class:"px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all",type:"submit"},"Simpan",-1))])],32)])])):S("",!0),n(P)?(o(),i("div",{key:1,class:"fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm",onClick:t[11]||(t[11]=O(a=>P.value=!1,["self"]))},[e("div",ae,[e("div",se,[t[40]||(t[40]=e("div",{class:"w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"},[e("span",{class:"material-symbols-outlined text-red-500 text-3xl"},"warning")],-1)),t[41]||(t[41]=e("h3",{class:"font-display text-title-lg text-on-surface mb-2"},"Hapus Semua Nilai",-1)),e("p",le,[t[38]||(t[38]=K("Yakin ingin menghapus semua nilai ",-1)),e("strong",null,m(n(M)?.name),1),t[39]||(t[39]=K("?",-1))])]),e("div",ne,[e("button",{class:"px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all",onClick:t[10]||(t[10]=a=>P.value=!1)},"Batal"),e("button",{class:"px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm",onClick:Z},"Hapus")])])])):S("",!0)]))]))}});export{de as default};
