let allRows = [], charts = {};
const money = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n||0);
function parseCSV(text){
  const lines=text.trim().split(/\r?\n/), headers=lines.shift().split(',');
  return lines.map(line=>{const vals=line.split(',');const obj={};headers.forEach((h,i)=>obj[h]=vals[i]);obj.amount=Number(obj.amount);return obj;});
}
function fillSelect(id, values){const el=document.getElementById(id);[...new Set(values)].sort().forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;el.appendChild(o);});}
function selectedRows(){
  const city=document.getElementById('cityFilter').value,cat=document.getElementById('categoryFilter').value,status=document.getElementById('statusFilter').value;
  return allRows.filter(r=>(city==='All'||r.city===city)&&(cat==='All'||r.category===cat)&&(status==='All'||r.status===status));
}
function sum(rows,type){return rows.filter(r=>r.transaction_type===type).reduce((s,r)=>s+r.amount,0);}
function destroyChart(id){if(charts[id])charts[id].destroy();}
function chart(id,config){destroyChart(id);charts[id]=new Chart(document.getElementById(id),config);}
function update(){
  const rows=selectedRows(),done=rows.filter(r=>r.status==='Completed');
  const income=sum(done,'Income'),expense=sum(done,'Expense'),refund=sum(done,'Refund');
  document.getElementById('incomeValue').textContent=money(income);
  document.getElementById('expenseValue').textContent=money(expense);
  document.getElementById('cashValue').textContent=money(income+refund-expense);
  document.getElementById('countValue').textContent=done.length.toLocaleString('en-IN');
  const months=[...new Set(allRows.map(r=>r.transaction_date.slice(0,7)))].sort();
  const monthlyType=(type)=>months.map(m=>done.filter(r=>r.transaction_date.startsWith(m)&&r.transaction_type===type).reduce((s,r)=>s+r.amount,0));
  chart('trendChart',{type:'line',data:{labels:months,datasets:[{label:'Income',data:monthlyType('Income'),borderColor:'#15966c',backgroundColor:'#15966c18',fill:true,tension:.35,pointRadius:2},{label:'Expenses',data:monthlyType('Expense'),borderColor:'#e06a73',backgroundColor:'#e06a7310',fill:true,tension:.35,pointRadius:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{usePointStyle:true,boxWidth:6,font:{size:10}}}},scales:{y:{ticks:{callback:v=>'₹'+(v/1000).toFixed(0)+'k',font:{size:9}},grid:{color:'#f0f2f5'}},x:{ticks:{font:{size:8},maxRotation:0},grid:{display:false}}}}});
  const cats={};done.filter(r=>r.transaction_type==='Expense').forEach(r=>cats[r.category]=(cats[r.category]||0)+r.amount);
  const catLabels=Object.keys(cats).sort((a,b)=>cats[b]-cats[a]);
  chart('categoryChart',{type:'doughnut',data:{labels:catLabels,datasets:[{data:catLabels.map(k=>cats[k]),backgroundColor:['#1a8b68','#6e9bd6','#e4a65b','#8879d8','#dc777d','#63b7b0','#9aa8b9','#c58ba8'],borderWidth:0,hoverOffset:5}]},options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{display:false}}}});
  document.getElementById('categoryLegend').innerHTML=catLabels.slice(0,8).map((k,i)=>`<span><i style="background:${['#1a8b68','#6e9bd6','#e4a65b','#8879d8','#dc777d','#63b7b0','#9aa8b9','#c58ba8'][i]}"></i>${k}</span>`).join('');
  const methods={};done.forEach(r=>methods[r.payment_method]=(methods[r.payment_method]||0)+1);
  chart('paymentChart',{type:'bar',data:{labels:Object.keys(methods),datasets:[{data:Object.values(methods),backgroundColor:'#77a995',borderRadius:5,maxBarThickness:35}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{font:{size:9}},grid:{color:'#f0f2f5'}},x:{ticks:{font:{size:9}},grid:{display:false}}}}});
  const merchants={};done.forEach(r=>merchants[r.merchant]=(merchants[r.merchant]||0)+r.amount);
  const top=Object.entries(merchants).sort((a,b)=>b[1]-a[1]).slice(0,8).reverse();
  chart('merchantChart',{type:'bar',data:{labels:top.map(x=>x[0]),datasets:[{data:top.map(x=>x[1]),backgroundColor:'#8c9bd0',borderRadius:4,maxBarThickness:22}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{callback:v=>'₹'+(v/1000).toFixed(0)+'k',font:{size:9}},grid:{color:'#f0f2f5'}},y:{ticks:{font:{size:9}},grid:{display:false}}}}});
  const recent=[...rows].sort((a,b)=>b.transaction_date.localeCompare(a.transaction_date)).slice(0,12);
  document.getElementById('transactionRows').innerHTML=recent.map(r=>`<tr><td>#${r.transaction_id}</td><td>${r.transaction_date}</td><td>${r.category}</td><td>${r.customer_id}</td><td>${r.payment_method}</td><td class="amount">${money(r.amount)}</td><td><span class="status ${r.status}">${r.status}</span></td></tr>`).join('');
  document.getElementById('rowCount').textContent=`Showing ${Math.min(rows.length,12)} of ${rows.length.toLocaleString('en-IN')} filtered records`;
}
function downloadCSV(){
  const rows=selectedRows(),headers=Object.keys(rows[0]||{});
  const csv=[headers.join(','),...rows.map(r=>headers.map(h=>r[h]).join(','))].join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='filtered_financial_transactions.csv';a.click();URL.revokeObjectURL(a.href);
}
async function init(){
  try{
    const response=await fetch('data/financial_transactions.csv');if(!response.ok)throw new Error('Dataset could not be loaded');
    allRows=parseCSV(await response.text());
    fillSelect('cityFilter',allRows.map(r=>r.city));fillSelect('categoryFilter',allRows.map(r=>r.category));
    ['cityFilter','categoryFilter','statusFilter'].forEach(id=>document.getElementById(id).addEventListener('change',update));
    document.getElementById('resetBtn').addEventListener('click',()=>{document.getElementById('cityFilter').value='All';document.getElementById('categoryFilter').value='All';document.getElementById('statusFilter').value='Completed';update();});
    document.getElementById('downloadBtn').addEventListener('click',downloadCSV);
    update();
  }catch(e){document.querySelector('.main-content').innerHTML=`<h2>Unable to load dashboard data</h2><p>${e.message}. Check that data/financial_transactions.csv is included in the deployment.</p>`;}
}
init();
