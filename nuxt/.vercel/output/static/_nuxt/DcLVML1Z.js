import{f as D,D as F,h as P,c as m,a as e,i as s,d as u,t as i,j as k,F as S,r as R,p as b,o as p,z as V,q as A,v as z,s as w}from"./DXr9HCwO.js";const U={class:"px-gutter max-w-container-max mx-auto",style:{"padding-top":"6rem","padding-bottom":"3rem"}},E={class:"mb-stack-lg flex flex-wrap items-center justify-between gap-stack-md"},B={class:"font-display text-headline-lg text-primary"},J={class:"text-on-surface-variant text-body-md"},L={key:0,class:"mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md"},G={key:1,class:"mb-stack-lg p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-label-md"},H={key:2,class:"flex items-center justify-center py-12"},O={class:"glass-card rounded-xl shadow-sm overflow-hidden"},Y={class:"overflow-x-auto"},q={class:"w-full text-left"},Q={class:"divide-y divide-outline-variant/10"},W={class:"px-4 py-3 text-label-sm text-on-surface-variant text-center"},X={class:"px-4 py-3 text-label-md font-medium"},Z={class:"px-4 py-3 text-center"},tt=["onUpdate:modelValue"],et={class:"px-4 py-3"},at=["onUpdate:modelValue"],st={key:0},nt={class:"mt-stack-lg glass-card rounded-xl p-6 shadow-sm"},ot={class:"flex items-center gap-6 text-label-md text-on-surface-variant"},it={class:"text-primary text-title-md"},lt={class:"text-green-600"},rt={class:"text-red-600"},mt=D({__name:"[examId]",setup(dt){const N=F(),h=N.params.kelas,$=N.params.examId,f=b(!0),x=b(""),g=b(""),o=b(null),y=b(""),l=b([]),I=w(()=>{const a=l.value.map(t=>Number(t.score)||0).filter(t=>t>0);return a.length?(a.reduce((t,n)=>t+n,0)/a.length).toFixed(1):"-"}),j=w(()=>{const a=l.value.map(t=>Number(t.score)||0).filter(t=>t>0);return a.length?Math.max(...a).toString():"-"}),M=w(()=>{const a=l.value.map(t=>Number(t.score)||0).filter(t=>t>0);return a.length?Math.min(...a).toString():"-"});async function T(){f.value=!0,x.value="",g.value="";try{o.value=await $fetch(`/api/akademik/imtihan/${$}`);const t=(await $fetch("/api/master-data/classes")).find(r=>r.id===h);y.value=t?.name||t?.nama||h;const n=t?.name||h,v=await $fetch(`/api/students?class=${encodeURIComponent(n)}`),c=o.value?.scores||{};l.value=v.map(r=>({id:r.id,name:r.name,score:c[r.id]?.score??"",notes:c[r.id]?.notes??""}))}catch(a){x.value=a.message||"Gagal memuat data"}finally{f.value=!1}}async function K(){x.value="",g.value="";const a={};for(const t of l.value){const n=Number(t.score);a[t.id]={studentName:t.name,score:isNaN(n)?0:n,notes:t.notes||""}}try{await $fetch(`/api/akademik/imtihan/${$}`,{method:"PUT",body:{scores:a}}),await T(),g.value="Nilai berhasil disimpan",setTimeout(()=>g.value="",3e3)}catch(t){x.value=t.message||"Gagal menyimpan nilai"}}function C(){const a=l.value.map(d=>Number(d.score)||0).filter(d=>d>0),t=a.length?(a.reduce((d,_)=>d+_,0)/a.length).toFixed(1):"-",n=a.length?Math.max(...a):"-",v=a.length?Math.min(...a):"-",c=l.value.map((d,_)=>`
    <tr>
      <td style="text-align:center;padding:6px 8px;border:1px solid #333;">${_+1}</td>
      <td style="padding:6px 8px;border:1px solid #333;">${d.name}</td>
      <td style="text-align:center;padding:6px 8px;border:1px solid #333;">${d.score||"-"}</td>
      <td style="padding:6px 8px;border:1px solid #333;">${d.notes||"-"}</td>
    </tr>
  `).join(""),r=window.open("","_blank");r&&(r.document.write(`
<html><head><title>Nilai Imtihan - ${o.value?.subject}</title>
<style>
  @page { size: landscape; margin: 15mm 20mm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; margin: 0; padding: 20px; }
  .kop { text-align: center; border-bottom: 2px solid #333; padding-bottom: 12px; margin-bottom: 20px; }
  .kop .logo { max-height: 60px; vertical-align: middle; margin-right: 10px; }
  .kop .kop-title { font-size: 16pt; font-weight: bold; }
  .kop .kop-alamat { font-size: 10pt; }
  h2 { text-align: center; font-size: 14pt; margin: 16px 0; text-decoration: underline; }
  .info { margin-bottom: 12px; }
  .info td { padding: 2px 8px; font-size: 11pt; }
  table.data { width: 100%; border-collapse: collapse; margin: 12px 0; }
  table.data th { background: #f0f0f0; padding: 8px; border: 1px solid #333; font-size: 11pt; }
  table.data td { padding: 6px 8px; border: 1px solid #333; font-size: 11pt; }
  .ringkasan { margin: 12px 0; font-size: 11pt; }
  .ttd { margin-top: 40px; display: flex; justify-content: space-between; }
  .ttd div { text-align: center; width: 200px; }
  .ttd .jabatan { font-size: 10pt; margin-bottom: 60px; }
  .ttd .nama { font-size: 11pt; font-weight: bold; text-decoration: underline; }
</style></head><body>
<div class="kop">
  <table style="width:100%;"><tr>
    <td style="width:80px;text-align:center;">
      <img src="/image/logo.png" class="logo" style="max-height:60px;" onerror="this.style.display='none'" />
    </td>
    <td style="text-align:center;">
      <div class="kop-title">YAYASAN PONDOK PESANTREN<br>AL FATAH PANEKAN</div>
      <div class="kop-alamat">Turi, Panekan, Kabupaten Magetan, Jawa Timur 63352</div>
    </td>
  </tr></table>
</div>

<h2>DAFTAR NILAI IMTIHAN ${o.value?.sesi?`${o.value.sesi}`:""}</h2>

<table class="info">
  <tr><td>Mata Pelajaran</td><td>: ${o.value?.subject||"-"}</td></tr>
  <tr><td>Kelas</td><td>: ${y.value}</td></tr>
  <tr><td>Tanggal</td><td>: ${o.value?.date||"-"}</td></tr>
  <tr><td>Durasi</td><td>: ${o.value?.duration||"-"} menit</td></tr>
  ${o.value?.sesi?`<tr><td>Sesi</td><td>: Imtihan ${o.value.sesi}</td></tr>`:""}
</table>

<table class="data">
  <thead>
    <tr><th style="width:40px;">No</th><th>Nama Santri</th><th style="width:80px;">Nilai</th><th>Keterangan</th></tr>
  </thead>
  <tbody>${c}</tbody>
</table>

<div class="ringkasan">
  Rata-rata: <strong>${t}</strong> |
  Tertinggi: <strong>${n}</strong> |
  Terendah: <strong>${v}</strong> |
  Jumlah Santri: <strong>${l.value.length}</strong>
</div>

<div class="ttd">
  <div>
    <div class="jabatan">Kepala Pondok,</div>
    <div class="nama">_____________________</div>
  </div>
</div>
</body></html>
`),r.document.close(),setTimeout(()=>{r.print()},500))}return P(()=>T()),(a,t)=>(p(),m("div",U,[e("div",E,[e("div",null,[e("button",{class:"text-label-sm text-primary hover:underline mb-1 flex items-center gap-1",onClick:t[0]||(t[0]=n=>("navigateTo"in a?a.navigateTo:s(V))(`/akademik/imtihan/${s(h)}/imtihan`))},[...t[1]||(t[1]=[e("span",{class:"material-symbols-outlined text-sm"},"arrow_back",-1),u(" Kembali ",-1)])]),e("h2",B,"Input Nilai "+i(s(o)?.subject),1),e("p",J,i(s(y))+" — "+i(s(o)?.date)+" ("+i(s(o)?.duration)+" menit) "+i(s(o)?.sesi?`— Imtihan ${s(o)?.sesi}`:""),1)]),e("div",{class:"flex gap-3"},[e("button",{class:"flex items-center gap-2 px-6 py-2.5 bg-secondary text-on-secondary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all",onClick:C},[...t[2]||(t[2]=[e("span",{class:"material-symbols-outlined text-sm"},"print",-1),u(" Cetak ",-1)])]),e("button",{class:"flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all",onClick:K},[...t[3]||(t[3]=[e("span",{class:"material-symbols-outlined text-sm"},"save",-1),u(" Simpan Nilai ",-1)])])])]),s(x)?(p(),m("div",L,i(s(x)),1)):k("",!0),s(g)?(p(),m("div",G,i(s(g)),1)):k("",!0),s(f)?(p(),m("div",H,[...t[4]||(t[4]=[e("span",{class:"material-symbols-outlined animate-spin text-primary text-3xl"},"refresh",-1)])])):(p(),m(S,{key:3},[e("div",O,[e("div",Y,[e("table",q,[t[6]||(t[6]=e("thead",{class:"bg-surface-container-low"},[e("tr",null,[e("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant w-12 text-center"},"No"),e("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant"},"Nama Santri"),e("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant w-24 text-center"},"Nilai"),e("th",{class:"px-4 py-3 text-label-sm text-on-surface-variant"},"Keterangan")])],-1)),e("tbody",Q,[(p(!0),m(S,null,R(s(l),(n,v)=>(p(),m("tr",{key:n.id,class:"hover:bg-primary-fixed/5 transition-colors"},[e("td",W,i(v+1),1),e("td",X,i(n.name),1),e("td",Z,[A(e("input",{type:"number",min:"0",max:"100","onUpdate:modelValue":c=>n.score=c,class:"w-20 bg-surface-container-low border border-outline-variant/30 rounded-lg text-label-md py-1.5 px-2 text-center focus:ring-primary"},null,8,tt),[[z,n.score]])]),e("td",et,[A(e("input",{"onUpdate:modelValue":c=>n.notes=c,class:"w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-label-md py-1.5 px-2 focus:ring-primary",placeholder:"—"},null,8,at),[[z,n.notes]])])]))),128)),s(l).length===0?(p(),m("tr",st,[...t[5]||(t[5]=[e("td",{colspan:"4",class:"px-4 py-8 text-center text-on-surface-variant text-label-md"},"Tidak ada santri di kelas ini",-1)])])):k("",!0)])])])]),e("div",nt,[e("div",ot,[e("span",null,[t[7]||(t[7]=u("Rata-rata: ",-1)),e("strong",it,i(s(I)),1)]),e("span",null,[t[8]||(t[8]=u("Tertinggi: ",-1)),e("strong",lt,i(s(j)),1)]),e("span",null,[t[9]||(t[9]=u("Terendah: ",-1)),e("strong",rt,i(s(M)),1)]),e("span",null,[t[10]||(t[10]=u("Jumlah Santri: ",-1)),e("strong",null,i(s(l).length),1)])])])],64))]))}});export{mt as default};
