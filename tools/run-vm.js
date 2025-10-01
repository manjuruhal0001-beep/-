/* Sanskrit VM runner (Node.js) — minimal opcodes to run assembled .bin
   Usage: node tools/run-vm.js <path/to/file.bin>
*/
const fs = require('fs');

function readI64LE(buf, off){ let v=0n; for(let i=0;i<8;i++) v |= BigInt(buf[off+i]) << BigInt(i*8); return v; }
function readU32LE(buf, off){ return buf[off] | (buf[off+1]<<8) | (buf[off+2]<<16) | (buf[off+3]<<24); }

function run(bytes){
  const b = Buffer.from(bytes); let ip=0; const st=[];
  const pushI=v=>st.push({t:'i',v}); const pushS=s=>st.push({t:'s',v:s}); const pop=()=>st.pop();
  const asStr=x=> x.t==='s'? x.v : (x.t==='i'? x.v.toString() : String(x.v));
  while(ip<b.length){
    const op=b[ip++];
    if(op===0x00){ /* NOP */ }
    else if(op===0x01){ break; }
    else if(op===0x10){ const v=readI64LE(b,ip); ip+=8; pushI(v); }
    else if(op===0x12){ const len=readU32LE(b,ip); ip+=4; const s=b.toString('utf8', ip, ip+len); ip+=len; pushS(s); }
    else if(op===0x20){ const y=pop(), x=pop(); pushI((x.v??0n)+(y.v??0n)); }
    else if(op===0x21){ const y=pop(), x=pop(); pushI((x.v??0n)-(y.v??0n)); }
    else if(op===0x22){ const y=pop(), x=pop(); pushI((x.v??0n)*(y.v??0n)); }
    else if(op===0x23){ const y=pop(), x=pop(); pushI((x.v??0n)/(y.v||1n)); }
    else if(op===0x24){ const y=pop(), x=pop(); pushS(asStr(x)+asStr(y)); }
    else if(op===0x30){ const v=pop(); process.stdout.write(asStr(v)+"\n"); }
    else if(op===0x40){ // LT → push bool as int 0/1
      const y=pop(), x=pop(); pushI((x.v??0n) < (y.v??0n) ? 1n : 0n);
    }
    else if(op===0x41){ // GT
      const y=pop(), x=pop(); pushI((x.v??0n) > (y.v??0n) ? 1n : 0n);
    }
    else if(op===0x42){ // EQ
      const y=pop(), x=pop(); pushI((x.v??0n) === (y.v??0n) ? 1n : 0n);
    }
    else if(op===0x43){ // NE
      const y=pop(), x=pop(); pushI((x.v??0n) !== (y.v??0n) ? 1n : 0n);
    }
    else if(op===0x44){ // LE
      const y=pop(), x=pop(); pushI((x.v??0n) <= (y.v??0n) ? 1n : 0n);
    }
    else if(op===0x45){ // GE
      const y=pop(), x=pop(); pushI((x.v??0n) >= (y.v??0n) ? 1n : 0n);
    }
    else if(op===0x46){ // AND (logical)
      const y=pop(), x=pop(); const xv=(x.v??0n)!==0n, yv=(y.v??0n)!==0n; pushI((xv&&yv)?1n:0n);
    }
    else if(op===0x47){ // OR
      const y=pop(), x=pop(); const xv=(x.v??0n)!==0n, yv=(y.v??0n)!==0n; pushI((xv||yv)?1n:0n);
    }
    else if(op===0x48){ // NOT
      const x=pop(); const xv=(x.v??0n)!==0n; pushI((!xv)?1n:0n);
    }
    else if(op===0x50){ const rel=readU32LE(b,ip); ip+=4; ip = ip + (rel|0); }
    else if(op===0x51){ const rel=readU32LE(b,ip); ip+=4; const v=pop(); const zero=(v.t==='i'&&v.v===0n); if(zero) ip = ip + (rel|0); }
    else if(op===0x52){ const rel=readU32LE(b,ip); ip+=4; const v=pop(); const nz=(v.t==='i'&&v.v!==0n); if(nz) ip = ip + (rel|0); }
    else { throw new Error('Unknown opcode 0x'+op.toString(16)); }
  }
}

function main(){
  const argv=process.argv.slice(2); if(argv.length<1){ console.error('Usage: node tools/run-vm.js <file.bin>'); process.exit(1);} const p=argv[0];
  const bytes=fs.readFileSync(p); run(bytes);
}

if(require.main===module) main();
