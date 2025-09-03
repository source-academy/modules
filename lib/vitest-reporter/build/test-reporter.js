import S from"fs";import p from"path";function*c(e){let i=e.ok(),t=e.diagnostic(),r=t?`${t.duration.toFixed(0)}ms`:"";yield`${i?"\u2705":"\u274C"} ${e.name} ${r}
`}function*d(e){let i=e.name;yield`${e.ok()?"\u2705":"\u274C"} ${i}<ul>`;for(let r of e.children)r.type==="suite"?yield*d(r):(yield"<li>",yield*c(r),yield"</li>");yield`</ul>
`}function s(...e){return`<tr>${e.map(t=>`<td>${t}</td>`).join("")}</tr>
`}function u(e){if(e.type==="test")return 1;let i=0;for(let t of e.children)i+=u(t);return i}var a=class{writeStream=null;vitest=null;onInit(i){this.vitest=i,process.env.GITHUB_STEP_SUMMARY&&(this.writeStream=S.createWriteStream(process.env.GITHUB_STEP_SUMMARY,{encoding:"utf-8",flags:"a"}))}onTestRunEnd(i){if(this.writeStream){this.writeStream.write(`## Test Results
`);for(let t of i){let r=t.ok(),l=t.task,m=p.relative(t.project.config.root,l.filepath),o=u(t);this.writeStream.write(`<h3>${r?"\u2705":"\u274C"} <code>${m}</code> (${o} test${o===1?"":"s"})</h3>
`),this.writeStream.write("<ul>");for(let n of t.children){let w=n.type==="suite"?d(n):c(n),h=Array.from(w).join("");this.writeStream.write(`<li>${h}</li>`)}this.writeStream.write("</ul>");let f=t.diagnostic().duration.toFixed(0);this.writeStream.write(`

`),this.writeStream.write(`<h4>Summary for <code>${l.filepath}</code></h4>
`),this.writeStream.write(`<table>
`),this.writeStream.write(s("Test Files","")),this.writeStream.write(s("Tests",o.toString())),this.writeStream.write(s("Start at","")),this.writeStream.write(s("Duration",`${f}ms`)),this.writeStream.write("</table>")}this.writeStream.close()}}};export{a as default};
