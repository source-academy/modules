import M from"fs";import C from"path";function*f(e){let s=e.ok(),t=e.diagnostic(),i=t?`${t.duration.toFixed(0)}ms`:"";yield`${s?"\u2705":"\u274C"} ${e.name} <code>${i}</code>`,t?.slow&&(yield" \u26A0\uFE0F"),yield`
`}function*S(e){let s=e.name;yield`${e.ok()?"\u2705":"\u274C"} ${s}<ul>`;for(let i of e.children)i.type==="suite"?yield*S(i):(yield"<li>",yield*f(i),yield`</li>
`);yield`</ul>
`}function R(e){return e?"\u2705":"\u274C"}function n(...e){return`<tr>${e.map(t=>`<td>${t}</td>`).join("")}</tr>
`}function h(e){if(e.type==="test")return e.ok()?[1,0]:[0,1];let s=0,t=0;for(let i of e.children){let[a,o]=h(i);s+=a,t+=o}return[s,t]}var m=class{writeStream=null;startTimes={};onInit(){process.env.GITHUB_STEP_SUMMARY&&(this.writeStream=M.createWriteStream(process.env.GITHUB_STEP_SUMMARY,{encoding:"utf-8",flags:"a"}))}onTestModuleStart(s){this.startTimes[s.id]=new Date}onTestRunEnd(s){if(this.writeStream){this.writeStream.write(`<h2>Test Results</h2>
`);for(let t of s){let i=t.ok(),a=t.task,o=C.relative(t.project.config.root,a.filepath),[d,l]=h(t),c=d+l;this.writeStream.write(`<h3>${R(i)} <code>${o}</code> (${c} test${c===1?"":"s"})</h3>
`),this.writeStream.write("<ul>");for(let r of t.children){let g=r.type==="suite"?S(r):f(r),y=Array.from(g).join("");this.writeStream.write(`<li>${y}</li>
`)}this.writeStream.write("</ul>");let w=t.diagnostic().duration.toFixed(0),u=this.startTimes[t.id],p=u.getHours().toString().padStart(2,"0"),T=u.getMinutes().toString().padStart(2,"0"),$=u.getSeconds().toString().padStart(2,"0");if(this.writeStream.write(`

`),this.writeStream.write(`<h4>Summary for <code>${o}</code></h4>
`),this.writeStream.write(`<table>
`),l>0){let r=`${l} Failed | ${d} passed (${c})`;this.writeStream.write(n("Tests",r))}else this.writeStream.write(n("Tests",`${d} passed`));this.writeStream.write(n("Start at",`${p}:${T}:${$}`)),this.writeStream.write(n("Duration",`${w}ms`)),this.writeStream.write("</table>")}this.writeStream.close()}}};export{m as default};
