import $ from"fs";import y from"path";function*c(e){let i=e.ok(),t=e.diagnostic(),r=t?`${t.duration.toFixed(0)}ms`:"";yield`${i?"\u2705":"\u274C"} ${e.name} <code>${r}</code>`,t?.slow&&(yield" \u26A0\uFE0F"),yield`
`}function*u(e){let i=e.name;yield`${e.ok()?"\u2705":"\u274C"} ${i}<ul>`;for(let r of e.children)r.type==="suite"?yield*u(r):(yield"<li>",yield*c(r),yield`</li>
`);yield`</ul>
`}function a(...e){return`<tr>${e.map(t=>`<td>${t}</td>`).join("")}</tr>
`}function m(e){if(e.type==="test")return 1;let i=0;for(let t of e.children)i+=m(t);return i}var d=class{writeStream=null;startTimes={};onInit(){process.env.GITHUB_STEP_SUMMARY&&(this.writeStream=$.createWriteStream(process.env.GITHUB_STEP_SUMMARY,{encoding:"utf-8",flags:"a"}))}onTestModuleStart(i){this.startTimes[i.id]=new Date}onTestRunEnd(i){if(this.writeStream){this.writeStream.write(`<h2>Test Results</h2>
`);for(let t of i){let r=t.ok(),S=t.task,l=y.relative(t.project.config.root,S.filepath),s=m(t);this.writeStream.write(`<h3>${r?"\u2705":"\u274C"} <code>${l}</code> (${s} test${s===1?"":"s"})</h3>
`),this.writeStream.write("<ul>");for(let n of t.children){let T=n.type==="suite"?u(n):c(n),g=Array.from(T).join("");this.writeStream.write(`<li>${g}</li>
`)}this.writeStream.write("</ul>");let f=t.diagnostic().duration.toFixed(0),o=this.startTimes[t.id],h=o.getHours().toString().padStart(2,"0"),w=o.getMinutes().toString().padStart(2,"0"),p=o.getSeconds().toString().padStart(2,"0");this.writeStream.write(`

`),this.writeStream.write(`<h4>Summary for <code>${l}</code></h4>
`),this.writeStream.write(`<table>
`),this.writeStream.write(a("Tests",s.toString())),this.writeStream.write(a("Start at",`${h}:${w}:${p}`)),this.writeStream.write(a("Duration",`${f}ms`)),this.writeStream.write("</table>")}this.writeStream.close()}}};export{d as default};
