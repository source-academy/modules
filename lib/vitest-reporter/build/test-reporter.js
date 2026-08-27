import R from"fs";import b from"path";function f(e){return e?"\u2705":"\u274C"}function*S(e){let i=e.ok(),t=e.diagnostic(),s=t&&e.result().state!=="skipped"?` <code>${t.duration.toFixed(0)}ms</code>`:"";yield`${f(i)} ${e.name}${s}`,t?.slow&&(yield" \u26A0\uFE0F"),yield`
`}function*h(e){let i=e.name,t=e.ok();yield`${f(t)} ${i}<ul>`;for(let s of e.children)s.type==="suite"?yield*h(s):(yield"<li>",yield*S(s),yield`</li>
`);yield`</ul>
`}function u(...e){return`<tr>${e.map(t=>`<td>${t}</td>`).join("")}</tr>
`}function w(e){if(e.type==="test")switch(e.result().state){case"failed":return{failed:1,passed:0,skipped:0};case"passed":return{failed:0,passed:1,skipped:0};case"skipped":return{failed:0,passed:0,skipped:1};default:throw new Error("Should not get here")}let i=0,t=0,s=0;for(let a of e.children){let{failed:o,passed:r,skipped:n}=w(a);i+=r,t+=o,s+=n}return{failed:t,passed:i,skipped:s}}var p=class{writeStream=null;startTimes={};onInit(){process.env.GITHUB_STEP_SUMMARY&&(this.writeStream=R.createWriteStream(process.env.GITHUB_STEP_SUMMARY,{encoding:"utf-8",flags:"a"}))}onTestModuleStart(i){this.startTimes[i.id]=new Date}onTestRunEnd(i){if(this.writeStream){this.writeStream.write(`<h2>Test Results</h2>
`);for(let t of i){let s=t.ok(),a=t.task,o=b.relative(t.project.config.root,a.filepath),{failed:r,passed:n,skipped:d}=w(t),m=n+r+d;this.writeStream.write(`<h3>${f(s)} <code>${o}</code> (${m} test${m===1?"":"s"})</h3>
`),this.writeStream.write("<ul>");for(let c of t.children){let C=c.type==="suite"?h(c):S(c),M=Array.from(C).join("");this.writeStream.write(`<li>${M}</li>
`)}this.writeStream.write("</ul>");let T=t.diagnostic().duration.toFixed(0),l=this.startTimes[t.id],$=l.getHours().toString().padStart(2,"0"),g=l.getMinutes().toString().padStart(2,"0"),y=l.getSeconds().toString().padStart(2,"0");this.writeStream.write(`

`),this.writeStream.write(`<h4>Summary for <code>${o}</code></h4>
`),this.writeStream.write(`<table>
`);function*k(){r>0&&(yield`${r} Failed`),d>0&&(yield`${d} Skipped`),yield`${n} Passed`}this.writeStream.write(u("Tests",Array.from(k()).join(" | "))),this.writeStream.write(u("Start at",`${$}:${g}:${y}`)),this.writeStream.write(u("Duration",`${T}ms`)),this.writeStream.write("</table>")}this.writeStream.close()}}};export{p as default};
