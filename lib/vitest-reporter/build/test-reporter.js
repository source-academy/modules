import S from"fs";function*d(t){let i=t.ok(),e=t.diagnostic(),r=e?`${e.duration.toFixed(0)}ms`:"";yield`${i?"\u2705":"\u274C"} ${t.name} ${r}
`}function*u(t){let i=t.name;yield`${t.ok()?"\u2705":"\u274C"} ${i}<ul>`;for(let r of t.children)r.type==="suite"?yield*u(r):(yield"<li>",yield*d(r),yield"</li>");yield`</ul>
`}function s(...t){return`<tr>${t.map(e=>`<td>${e}</td>`).join("")}</tr>
`}function c(t){if(t.type==="test")return 1;let i=0;for(let e of t.children)i+=c(e);return i}var a=class{writeStream=null;vitest=null;onInit(i){this.vitest=i,process.env.GITHUB_STEP_SUMMARY&&(this.writeStream=S.createWriteStream(process.env.GITHUB_STEP_SUMMARY,{encoding:"utf-8",flags:"a"}))}onTestRunEnd(i){if(this.writeStream){this.writeStream.write(`## Test Results
`);for(let e of i){let r=e.ok(),l=e.task,n=c(e);this.writeStream.write(`### ${r?"\u2705":"\u274C"} \`${l.filepath}\` (${n} test${n===1?"":"s"}) 
`),this.writeStream.write("<ul>");for(let o of e.children){let f=o.type==="suite"?u(o):d(o),w=Array.from(f).join("");this.writeStream.write(`<li>${w}</li>`)}this.writeStream.write("</ul>");let m=e.diagnostic().duration.toFixed(0);this.writeStream.write(`

`),this.writeStream.write(`#### Summary for \`${l.filepath}\`
`),this.writeStream.write(`<table>
`),this.writeStream.write(s("Test Files","")),this.writeStream.write(s("Tests",n.toString())),this.writeStream.write(s("Start at","")),this.writeStream.write(s("Duration",`${m}ms`)),this.writeStream.write("</table>")}this.writeStream.close()}}};export{a as default};
