import{f as rt,D as pt,p as x,m as H,h as ct,c as o,a as t,i as s,d as V,t as p,q as v,B,x as G,F as h,r as j,j as E,v as z,l as F,k as mt,T as ut,o as l,z as Q,n as xt,s as W}from"./DXr9HCwO.js";const bt={class:"px-gutter max-w-container-max mx-auto",style:{"padding-top":"6rem","padding-bottom":"3rem"}},gt={class:"mb-stack-lg flex flex-wrap items-center justify-between gap-stack-md"},ft={class:"font-display text-headline-lg text-primary capitalize"},vt={class:"text-on-surface-variant text-body-md"},yt={key:0,class:"flex flex-wrap items-center gap-3"},ht={class:"flex items-center gap-2"},kt=["value"],wt=["disabled"],_t={key:0,class:"mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md"},$t={key:1,class:"flex items-center justify-center py-12"},jt={class:"grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"},Nt={class:"text-label-sm text-on-surface-variant"},Tt={class:"glass-card rounded-xl shadow-sm overflow-hidden"},St={class:"overflow-x-auto"},zt={class:"w-full text-left"},At={class:"divide-y divide-outline-variant/10"},Ct={class:"px-4 py-3 text-label-sm text-on-surface-variant text-center font-semibold"},Pt={class:"px-4 py-3 text-label-md font-medium"},It={class:"px-4 py-3 text-label-sm text-on-surface-variant"},Et={class:"px-4 py-3 text-label-sm text-on-surface-variant"},Dt={class:"px-4 py-3 text-label-md"},Mt={class:"px-4 py-3 text-center"},Rt=["onClick"],Ut=["onClick"],Kt={key:0},Vt={class:"mb-stack-lg flex items-center gap-4"},Bt={class:"flex items-center gap-2"},Ot={class:"glass-card rounded-xl shadow-sm overflow-hidden"},Gt={class:"overflow-x-auto"},Ft={class:"w-full text-left"},Lt={class:"divide-y divide-outline-variant/10"},qt={class:"px-4 py-3 text-label-md font-medium"},Jt={class:"px-4 py-3 text-label-sm text-on-surface-variant max-w-xs truncate"},Yt={class:"px-4 py-3 text-label-sm text-on-surface-variant"},Ht={class:"px-4 py-3 text-center"},Qt=["onClick"],Wt=["onClick"],Xt={key:0},Zt={class:"mt-stack-lg glass-card rounded-xl p-6 shadow-sm"},te=["value"],ee={class:"md:col-span-3"},ae={class:"bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"},se={class:"bg-primary px-gutter py-stack-md flex justify-between items-center"},ne={class:"space-y-1"},ie=["value"],le={class:"space-y-1"},oe=["value"],de={class:"grid grid-cols-2 gap-stack-md"},re={class:"space-y-1"},pe={class:"space-y-1"},ce={class:"flex justify-end gap-stack-sm pt-stack-sm"},xe=rt({__name:"[type]",setup(me){const L=pt(),m=L.params.kelas,A=L.params.type,O=x(!0),r=x(""),C=x(""),b=x([]),q=x([]),D=x([]),J=x([]),_=x(""),N=x(!1),c=H({sesi:"",subject:"",date:"",duration:90}),P=x(new Date().toISOString().split("T")[0]),I=x(""),g=H({santri:"",catatan:"",date:new Date().toISOString().split("T")[0]}),X=W(()=>[{label:"Total Ujian",value:b.value.length.toString(),color:"text-primary"},{label:"Rata-rata Nilai",value:b.value.length?(b.value.reduce((n,e)=>n+(Number(e.averageScore)||0),0)/b.value.length).toFixed(1):"-",color:"text-secondary"},{label:"Mata Pelajaran",value:[...new Set(b.value.map(n=>n.subject))].length.toString(),color:"text-tertiary"},{label:"Nilai Tertinggi",value:b.value.length?Math.max(...b.value.map(n=>Number(n.averageScore)||0)).toString():"-",color:"text-green-600"}]),Y=W(()=>q.value.filter(n=>(!I.value||n.santri.toLowerCase().includes(I.value.toLowerCase()))&&(!P.value||n.date===P.value)));async function T(){O.value=!0,r.value="";try{const e=(await $fetch("/api/master-data/classes")).find(a=>a.id===m);C.value=e?.name||e?.nama||m,A==="imtihan"?b.value=await $fetch(`/api/akademik/imtihan?kelas=${m}`)||[]:q.value=await $fetch(`/api/akademik/iktibar?kelas=${m}`)||[],D.value=await $fetch(`/api/students?class=${encodeURIComponent(e?.name||m)}`)||[],J.value=await $fetch("/api/akademik/subjects")||[]}catch(n){r.value=n.message||"Gagal memuat data"}finally{O.value=!1}}async function Z(){try{await $fetch("/api/akademik/imtihan",{method:"POST",body:{...c,kelas:m}}),N.value=!1,c.sesi="",c.subject="",c.date="",c.duration=90,await T()}catch(n){r.value=n.message||"Gagal menyimpan"}}async function tt(){if(_.value){r.value="";try{const n=await $fetch(`/api/akademik/imtihan?kelas=${m}`)||[];if(!n.length){r.value="Belum ada data ujian";return}const a=(await Promise.all(n.map(d=>$fetch(`/api/akademik/imtihan/${d.id}`).catch(()=>null)))).filter(Boolean);if(!a.length){r.value="Gagal memuat detail nilai";return}const f=D.value.find(d=>d.id===_.value);if(!f){r.value="Santri tidak ditemukan";return}const k=[];a.forEach(d=>{if(!d.scores)return;const y=d.scores[_.value];y&&k.push({subject:d.subject,date:d.date,score:y.score||"-",notes:y.notes||""})});const M=k.reduce((d,y)=>d+(Number(y.score)||0),0),R=k.length?M/k.length:0,S=a.map(d=>d.subject),w=window.open("","_blank");if(!w)return;w.document.write(`
<html><head><title>Nilai IMTIHAN - ${f.name}</title>
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
  .summary td { padding: 2px 8px; }
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

<h2>DAFTAR NILAI IMTIHAN</h2>

<table class="info">
  <tr><td class="label">Nama Santri</td><td>: ${f.name}</td></tr>
  ${f.nis?`<tr><td>NIS</td><td>: ${f.nis}</td></tr>`:""}
  <tr><td>Kelas</td><td>: ${C.value}</td></tr>
  <tr><td>Mata Pelajaran Diujikan</td><td>: ${S.join(", ")}</td></tr>
</table>

<table class="data">
  <thead>
    <tr>
      <th style="width:32px;">No</th>
      <th style="width:160px;">Mata Pelajaran</th>
      <th style="width:100px;">Tanggal</th>
      <th style="width:70px;">Nilai</th>
      <th>Keterangan</th>
    </tr>
  </thead>
  <tbody>
    ${k.map((d,y)=>`
    <tr>
      <td>${y+1}</td>
      <td class="left">${d.subject}</td>
      <td>${d.date}</td>
      <td style="font-weight:bold;">${d.score}</td>
      <td class="left">${d.notes||"-"}</td>
    </tr>`).join("")}
  </tbody>
</table>

<table class="summary">
  <tr><td>Jumlah Mata Pelajaran</td><td>: ${k.length}</td></tr>
  <tr><td>Total Nilai</td><td>: ${M}</td></tr>
  <tr><td>Rata-rata Nilai</td><td>: ${R.toFixed(1)}</td></tr>
</table>

<div class="ttd">
  <div><div class="jabatan">Kepala Pondok,</div><div class="nama">_____________________</div></div>
</div>
</body></html>
`),w.document.close(),setTimeout(()=>w.print(),500)}catch(n){r.value=n.message||"Gagal mencetak"}}}async function et(){r.value="";try{const n=await $fetch(`/api/akademik/imtihan?kelas=${m}`)||[];if(!n.length){r.value="Belum ada data ujian";return}const a=(await Promise.all(n.map(i=>$fetch(`/api/akademik/imtihan/${i.id}`).catch(()=>null)))).filter(Boolean);if(!a.length){r.value="Gagal memuat detail nilai";return}const k=(await $fetch("/api/master-data/classes")).find(i=>i.id===m),M=await $fetch(`/api/students?class=${encodeURIComponent(k?.name||m)}`)||[],R={};M.forEach(i=>{R[i.id]=i.name});const S={};a.forEach(i=>{i.scores&&Object.entries(i.scores).forEach(([u,$])=>{S[u]||(S[u]={}),S[u][i.subject]=Number($.score)||0})});const w=Object.entries(S).map(([i,u])=>{const $=Object.values(u),K=$.reduce((ot,dt)=>ot+dt,0);return{id:i,name:R[i]||i,subjects:u,total:K,avg:$.length?K/$.length:0}});w.sort((i,u)=>u.total-i.total||u.avg-i.avg);const d=a.map(i=>i.subject),y=d.map(i=>`<th style="padding:6px 8px;border:1px solid #333;font-size:10pt;text-align:center;">${i}</th>`).join(""),lt=w.map((i,u)=>{const $=d.map(K=>`<td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;">${i.subjects[K]||"-"}</td>`).join("");return`<tr>
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;">${u+1}</td>
        <td style="padding:4px 6px;border:1px solid #333;font-size:10pt;">${i.name}</td>
        ${$}
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;font-weight:bold;">${i.total}</td>
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;">${i.avg.toFixed(1)}</td>
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;font-weight:bold;">${u+1}</td>
      </tr>`}).join(""),U=window.open("","_blank");if(!U)return;U.document.write(`
<html><head><title>Rekap Nilai & Ranking - ${C.value}</title>
<style>
  @page { size: landscape; margin: 12mm 15mm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; margin: 0; padding: 15px; }
  .kop { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 16px; }
  .kop .logo { max-height: 55px; vertical-align: middle; margin-right: 8px; }
  .kop .kop-title { font-size: 15pt; font-weight: bold; }
  .kop .kop-alamat { font-size: 9pt; }
  h2 { text-align: center; font-size: 13pt; margin: 14px 0; text-decoration: underline; }
  .info { margin-bottom: 10px; }
  .info td { padding: 2px 6px; font-size: 10pt; }
  table.data { width: 100%; border-collapse: collapse; margin: 10px 0; }
  table.data th { background: #f0f0f0; padding: 6px; border: 1px solid #333; font-size: 10pt; }
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

<h2>REKAP NILAI & RANKING IMTIHAN</h2>

<table class="info">
  <tr><td>Kelas</td><td>: ${C.value}</td></tr>
  <tr><td>Jumlah Ujian</td><td>: ${a.length}</td></tr>
  <tr><td>Jumlah Santri</td><td>: ${w.length}</td></tr>
</table>

<table class="data">
  <thead>
    <tr>
      <th style="width:32px;">No</th>
      <th>Nama Santri</th>
      ${y}
      <th style="width:55px;">Jumlah</th>
      <th style="width:60px;">Rata-rata</th>
      <th style="width:50px;">Rank</th>
    </tr>
  </thead>
  <tbody>${lt}</tbody>
</table>

<div class="ttd">
  <div><div class="jabatan">Kepala Pondok,</div><div class="nama">_____________________</div></div>
</div>
</body></html>
`),U.document.close(),setTimeout(()=>{U.print()},500)}catch(n){r.value=n.message||"Gagal mencetak"}}async function at(n){if(confirm("Yakin ingin menghapus ujian ini?"))try{await $fetch(`/api/akademik/imtihan/${n}`,{method:"DELETE"}),await T()}catch(e){r.value=e.message||"Gagal menghapus"}}async function st(){try{await $fetch("/api/akademik/iktibar",{method:"POST",body:{...g,kelas:m}}),g.santri="",g.catatan="",g.date=new Date().toISOString().split("T")[0],await T()}catch(n){r.value=n.message||"Gagal menyimpan"}}async function nt(n){const e=prompt("Edit catatan iktibar:",n.catatan);if(e)try{await $fetch(`/api/akademik/iktibar/${n.id}`,{method:"PUT",body:{catatan:e}}),await T()}catch(a){r.value=a.message||"Gagal mengupdate"}}async function it(n){if(confirm("Yakin ingin menghapus catatan ini?"))try{await $fetch(`/api/akademik/iktibar/${n}`,{method:"DELETE"}),await T()}catch(e){r.value=e.message||"Gagal menghapus"}}return ct(()=>T()),(n,e)=>(l(),o("div",bt,[t("div",gt,[t("div",null,[t("button",{class:"text-label-sm text-primary hover:underline mb-1 flex items-center gap-1",onClick:e[0]||(e[0]=a=>("navigateTo"in n?n.navigateTo:s(Q))("/akademik/imtihan"))},[...e[15]||(e[15]=[t("span",{class:"material-symbols-outlined text-sm"},"arrow_back",-1),V(" Kembali ",-1)])]),t("h2",ft,p(s(A))+" - "+p(s(C)),1),t("p",vt,p(s(A)==="imtihan"?"Kelola jadwal dan nilai ujian":"Catatan iktibar harian santri"),1)]),s(A)==="imtihan"?(l(),o("div",yt,[t("div",ht,[v(t("select",{"onUpdate:modelValue":e[1]||(e[1]=a=>G(_)?_.value=a:null),class:"bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary max-w-[200px]"},[e[16]||(e[16]=t("option",{value:""},"-- Pilih Santri --",-1)),(l(!0),o(h,null,j(s(D),a=>(l(),o("option",{key:a.id,value:a.id},p(a.name),9,kt))),128))],512),[[B,s(_)]]),t("button",{class:"flex items-center gap-2 px-4 py-2 bg-tertiary text-on-tertiary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-40",disabled:!s(_),onClick:tt},[...e[17]||(e[17]=[t("span",{class:"material-symbols-outlined text-sm"},"badge",-1),V(" Cetak Nilai ",-1)])],8,wt)]),t("button",{class:"flex items-center gap-2 px-6 py-2.5 bg-secondary text-on-secondary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all",onClick:et},[...e[18]||(e[18]=[t("span",{class:"material-symbols-outlined text-sm"},"print",-1),V(" Cetak Nilai & Ranking ",-1)])]),t("button",{class:"flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all",onClick:e[2]||(e[2]=a=>N.value=!0)},[...e[19]||(e[19]=[t("span",{class:"material-symbols-outlined text-sm"},"add",-1),V(" Tambah Ujian ",-1)])])])):E("",!0)]),s(r)?(l(),o("div",_t,p(s(r)),1)):E("",!0),s(O)?(l(),o("div",$t,[...e[20]||(e[20]=[t("span",{class:"material-symbols-outlined animate-spin text-primary text-3xl"},"refresh",-1)])])):s(A)==="imtihan"?(l(),o(h,{key:2},[t("div",jt,[(l(!0),o(h,null,j(s(X),a=>(l(),o("div",{key:a.label,class:"glass-card p-stack-md rounded-xl shadow-sm text-center"},[t("p",{class:xt(["font-display text-headline-md",a.color])},p(a.value),3),t("p",Nt,p(a.label),1)]))),128))]),t("div",Tt,[t("div",St,[t("table",zt,[e[24]||(e[24]=t("thead",{class:"bg-surface-container-low"},[t("tr",null,[t("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant"},"Sesi"),t("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant"},"Mata Pelajaran"),t("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant"},"Tanggal"),t("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant"},"Durasi"),t("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant"},"Nilai Rata-rata"),t("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant text-center"},"Aksi")])],-1)),t("tbody",At,[(l(!0),o(h,null,j(s(b),a=>(l(),o("tr",{key:a.id,class:"hover:bg-primary-fixed/5 transition-colors"},[t("td",Ct,"Imtihan "+p(a.sesi||"-"),1),t("td",Pt,p(a.subject),1),t("td",It,p(a.date),1),t("td",Et,p(a.duration)+" menit",1),t("td",Dt,p(a.averageScore||"-"),1),t("td",Mt,[t("button",{class:"text-primary hover:text-primary-fixed mr-2 transition-colors",onClick:f=>("navigateTo"in n?n.navigateTo:s(Q))(`/akademik/imtihan/${s(m)}/nilai/${a.id}`)},[...e[21]||(e[21]=[t("span",{class:"material-symbols-outlined"},"visibility",-1)])],8,Rt),t("button",{class:"text-error hover:text-red-700 transition-colors",onClick:f=>at(a.id)},[...e[22]||(e[22]=[t("span",{class:"material-symbols-outlined"},"delete",-1)])],8,Ut)])]))),128)),s(b).length===0?(l(),o("tr",Kt,[...e[23]||(e[23]=[t("td",{colspan:"6",class:"px-4 py-8 text-center text-on-surface-variant text-label-md"},"Belum ada data ujian",-1)])])):E("",!0)])])])])],64)):(l(),o(h,{key:3},[t("div",Vt,[t("div",Bt,[e[25]||(e[25]=t("span",{class:"material-symbols-outlined text-on-surface-variant"},"calendar_today",-1)),v(t("input",{type:"date","onUpdate:modelValue":e[3]||(e[3]=a=>G(P)?P.value=a:null),class:"bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"},null,512),[[z,s(P)]])]),v(t("input",{"onUpdate:modelValue":e[4]||(e[4]=a=>G(I)?I.value=a:null),class:"bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary flex-1 max-w-xs",placeholder:"Cari santri..."},null,512),[[z,s(I)]])]),t("div",Ot,[t("div",Gt,[t("table",Ft,[e[29]||(e[29]=t("thead",{class:"bg-surface-container-low"},[t("tr",null,[t("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant"},"Santri"),t("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant"},"Catatan Iktibar"),t("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant"},"Tanggal"),t("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant text-center"},"Aksi")])],-1)),t("tbody",Lt,[(l(!0),o(h,null,j(s(Y),a=>(l(),o("tr",{key:a.id,class:"hover:bg-primary-fixed/5 transition-colors"},[t("td",qt,p(a.santri),1),t("td",Jt,p(a.catatan),1),t("td",Yt,p(a.date),1),t("td",Ht,[t("button",{class:"text-primary hover:text-primary-fixed mr-2 transition-colors",onClick:f=>nt(a)},[...e[26]||(e[26]=[t("span",{class:"material-symbols-outlined"},"edit",-1)])],8,Qt),t("button",{class:"text-error hover:text-red-700 transition-colors",onClick:f=>it(a.id)},[...e[27]||(e[27]=[t("span",{class:"material-symbols-outlined"},"delete",-1)])],8,Wt)])]))),128)),s(Y).length===0?(l(),o("tr",Xt,[...e[28]||(e[28]=[t("td",{colspan:"4",class:"px-4 py-8 text-center text-on-surface-variant text-label-md"},"Belum ada catatan iktibar",-1)])])):E("",!0)])])])]),t("div",Zt,[e[32]||(e[32]=t("h3",{class:"font-display text-title-md text-primary mb-4"},"Tambah Catatan Iktibar",-1)),t("form",{onSubmit:F(st,["prevent"]),class:"grid grid-cols-1 md:grid-cols-3 gap-stack-md"},[v(t("select",{"onUpdate:modelValue":e[5]||(e[5]=a=>s(g).santri=a),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none",required:""},[e[30]||(e[30]=t("option",{value:""},"-- Pilih Santri --",-1)),(l(!0),o(h,null,j(s(D),a=>(l(),o("option",{key:a.id,value:a.name},p(a.name),9,te))),128))],512),[[B,s(g).santri]]),v(t("input",{type:"date","onUpdate:modelValue":e[6]||(e[6]=a=>s(g).date=a),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none",required:""},null,512),[[z,s(g).date]]),e[31]||(e[31]=t("button",{class:"px-6 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all",type:"submit"},"Simpan",-1)),t("div",ee,[v(t("textarea",{"onUpdate:modelValue":e[7]||(e[7]=a=>s(g).catatan=a),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none min-h-[80px]",placeholder:"Catatan iktibar...",required:""},null,512),[[z,s(g).catatan]])])],32)])],64)),(l(),mt(ut,{to:"body"},[s(N)?(l(),o("div",{key:0,class:"fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm",onClick:e[14]||(e[14]=F(a=>N.value=!1,["self"]))},[t("div",ae,[t("div",se,[e[34]||(e[34]=t("h2",{class:"font-display text-headline-md text-on-primary"},"Tambah Ujian",-1)),t("button",{class:"text-on-primary/60 hover:text-on-primary p-2",onClick:e[8]||(e[8]=a=>N.value=!1)},[...e[33]||(e[33]=[t("span",{class:"material-symbols-outlined"},"close",-1)])])]),t("form",{class:"p-gutter space-y-stack-md",onSubmit:F(Z,["prevent"])},[t("div",ne,[e[36]||(e[36]=t("label",{class:"text-label-md text-on-surface-variant"},"Sesi",-1)),v(t("select",{"onUpdate:modelValue":e[9]||(e[9]=a=>s(c).sesi=a),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none",required:""},[e[35]||(e[35]=t("option",{value:""},"-- Pilih Sesi --",-1)),(l(),o(h,null,j(4,a=>t("option",{key:a,value:a},"Imtihan "+p(a),9,ie)),64))],512),[[B,s(c).sesi]])]),t("div",le,[e[38]||(e[38]=t("label",{class:"text-label-md text-on-surface-variant"},"Mata Pelajaran",-1)),v(t("select",{"onUpdate:modelValue":e[10]||(e[10]=a=>s(c).subject=a),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none",required:""},[e[37]||(e[37]=t("option",{value:""},"-- Pilih Mata Pelajaran --",-1)),(l(!0),o(h,null,j(s(J),a=>(l(),o("option",{key:a.id,value:a.name},p(a.name),9,oe))),128))],512),[[B,s(c).subject]])]),t("div",de,[t("div",re,[e[39]||(e[39]=t("label",{class:"text-label-md text-on-surface-variant"},"Tanggal",-1)),v(t("input",{type:"date","onUpdate:modelValue":e[11]||(e[11]=a=>s(c).date=a),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none",required:""},null,512),[[z,s(c).date]])]),t("div",pe,[e[40]||(e[40]=t("label",{class:"text-label-md text-on-surface-variant"},"Durasi (menit)",-1)),v(t("input",{type:"number","onUpdate:modelValue":e[12]||(e[12]=a=>s(c).duration=a),class:"w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none",required:""},null,512),[[z,s(c).duration]])])]),t("div",ce,[t("button",{class:"px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg",type:"button",onClick:e[13]||(e[13]=a=>N.value=!1)},"Batal"),e[41]||(e[41]=t("button",{class:"px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all",type:"submit"},"Simpan",-1))])],32)])])):E("",!0)]))]))}});export{xe as default};
