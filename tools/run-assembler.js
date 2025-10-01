/* संस्कृत-असेंबलर चलक (Node.js) — Phase 1 demo
   उपयोगः: node tools/run-assembler.js <पथ/.अस> [--hex] [--out <पथ/.bin>]
   टिप्पणीः: Unicode (UTF-8) देवनागरी-इनपुटः अपेक्षितः। */

const fs = require('fs');

function wb(a, b) { a.push(b & 0xFF); }
function wu32(a, v) { wb(a, v); wb(a, v>>8); wb(a, v>>16); wb(a, v>>24); }
function wi64(a, n) { for (let i=0n;i<8n;i++) wb(a, Number((n>>(8n*i)) & 0xFFn)); }
function clean(line){ const i=line.indexOf('//'); return (i>=0? line.slice(0,i): line).trim(); }
function devToInt(s){ let v=0n; for(const ch of s){ if(ch==='_') continue; const d=ch.charCodeAt(0)-'०'.charCodeAt(0); if(d<0||d>9) break; v=v*10n+BigInt(d);} return v; }

function firstPass(lines){ const labelAt=new Map(); let pc=0; for(const raw of lines){ const r=clean(raw); if(!r) continue; if(r.startsWith('.')) continue; if(r.endsWith(':')){ labelAt.set(r.slice(0,-1).trim(), pc); continue; } if(r.startsWith('निक्षिप ')){ const rest=r.slice(8).trim(); if(rest.startsWith('"')){ const m=raw.match(/"([\s\S]*)"/); const s=m?m[1]:''; const n=Buffer.from(s,'utf8').length; pc+=1+4+n; } else { pc+=1+8; } } else if (r==='योजय'||r==='अपसारय'||r==='गुणय'||r==='भागय'||r==='लेखय'||r==='निरोधित'){ pc+=1; } else if (r.startsWith('गच्छ ')||r.startsWith('यदि-गच्छ-सम ')||r.startsWith('यदि-गच्छ-असम ')){ pc+=1+4; } } return {labelAt}; }
function secondPass(lines, labelAt){ const code=[]; const fixups=[]; for(const raw of lines){ const r=clean(raw); if(!r) continue; if(r.startsWith('.')) continue; if(r.endsWith(':')) continue; if(r.startsWith('निक्षिप ')){ const rest=r.slice(8).trim(); if(rest.startsWith('"')){ const m=raw.match(/"([\s\S]*)"/); const s=m?m[1]:''; const buf=Buffer.from(s,'utf8'); wb(code,0x12); wu32(code,buf.length); for(const b of buf) wb(code,b); continue; } else { const n=devToInt(rest); wb(code,0x10); wi64(code,n); continue; } } if(r==='योजय'){ wb(code,0x20); continue; } if(r==='अपसारय'){ wb(code,0x21); continue; } if(r==='गुणय'){ wb(code,0x22); continue; } if(r==='भागय'){ wb(code,0x23); continue; } if(r==='लेखय'){ wb(code,0x30); continue; } if(r==='लघु'){ wb(code,0x40); continue; } if(r==='महान्'){ wb(code,0x41); continue; } if(r==='सम'){ wb(code,0x42); continue; } if(r==='असम'){ wb(code,0x43); continue; } if(r==='लघु-सम'){ wb(code,0x44); continue; } if(r==='महान्-सम'){ wb(code,0x45); continue; } if(r==='च'){ wb(code,0x46); continue; } if(r==='वा'){ wb(code,0x47); continue; } if(r==='न'){ wb(code,0x48); continue; } if(r==='निरोधित' || r==='निरोधित'){ wb(code,0x01); continue; } function j(op, pf){ const name=r.slice(pf.length).trim(); wb(code,op); const at=code.length; wu32(code,0); fixups.push({at,name}); } if(r.startsWith('गच्छ ')){ j(0x50,'गच्छ '); continue; } if(r.startsWith('यदि-गच्छ-सम ')){ j(0x51,'यदि-गच्छ-सम '); continue; } if(r.startsWith('यदि-गच्छ-असम ')){ j(0x52,'यदि-गच्छ-असम '); continue; } }
  for(const f of fixups){ const tgt=labelAt.get(f.name); if(tgt===undefined) throw new Error(`अज्ञात-लेबलः: ${f.name}`); const rel=tgt-(f.at+4); code[f.at]=rel&0xFF; code[f.at+1]=(rel>>8)&0xFF; code[f.at+2]=(rel>>16)&0xFF; code[f.at+3]=(rel>>24)&0xFF; }
  return Uint8Array.from(code); }

function assembleFile(p){ const txt=fs.readFileSync(p,'utf8'); const lines=txt.split(/\r?\n/); const {labelAt}=firstPass(lines); return secondPass(lines,labelAt); }

function main(){ const argv=process.argv.slice(2); if(argv.length<1){ console.error('उपयोगः: node tools/run-assembler.js <फाइल.अस> [--hex] [--out <फाइल.bin>]'); process.exit(1);} const inPath=argv[0]; const bytes=assembleFile(inPath); const outIx=argv.indexOf('--out'); if(outIx>=0&&argv[outIx+1]) fs.writeFileSync(argv[outIx+1], Buffer.from(bytes)); if(argv.includes('--hex')||outIx<0){ console.log(Array.from(bytes).map(b=>b.toString(16).padStart(2,'0')).join(' ')); } }
if(require.main===module) main();
