import {arrayEquals} from "../utils.js";
const enc=new TextEncoder();

const LEGACY_LITERAL_TABLE = new TextEncoder().encode("#\n 0123456789abcdefghijklmnopqrstuvwxyz!#%(){}[]<>+=/*:;.,~_");
const FUTURE_CODE1 = "if(_update60)_update=function()_update60()_update60()end";
const FUTURE_CODE2 = "if(_update60)_update=function()_update60()_update_buttons()_update60()end";

export default function extractLua(b){
 const s=b.slice(0x4300),h=b.slice(0x4300,0x4304);
 if(arrayEquals(h,enc.encode("\x00pxa")))return dec(s);
 if(arrayEquals(h,enc.encode(":c:\x00")))return decLegacy(s);
 const n=s.indexOf(0);return new TextDecoder("ascii").decode(s.slice(0,n<0?s.length:n));
}

function dec(s){
 let o=4,L=(s[o]<<8)|s[o+1];o+=2;let C=((s[o]<<8)|s[o+1])-8;o+=2,mtf=Array.from({length:256},(_,i)=>i),bits="";
 for(let i=o;i<s.length&&i<o+C;i++)bits+=s[i].toString(2).padStart(8,"0").split("").reverse().join("");
 let pos=0,out=[];
 const bit=()=>pos<bits.length?bits[pos++]:"0";
 const read=n=>{if(pos+n>bits.length)return 0;const v=parseInt(bits.slice(pos,pos+n).split("").reverse().join(""),2);pos+=n;return v};
 while(out.length<L&&pos<bits.length){if(bit()==="1"){let u=0;while(bit()==="1")u++;let mask=(1<<u)-1,idx=read(4+u)+(mask<<4);if(idx<256){let ch=mtf[idx];out.push(String.fromCharCode(ch));mtf.splice(idx,1);mtf.unshift(ch)}}else{let ob;if(bit()==="1")ob=bit()==="1"?5:10;else ob=15;let back=read(ob)+1;if(ob===10&&back===1){while(pos<bits.length){let ch=read(8);if(ch===0)break;out.push(String.fromCharCode(ch))}continue}let len=3;while(1){let q=read(3);len+=q;if(q!==7)break}if(back>out.length)break;for(let i=0;i<len;i++)out.push(out[out.length-back])}}
 return out.slice(0,L).join("");
}

function decLegacy(s){
 const L=(s[4]<<8)|s[5];
 const out=new Uint8Array(L);
 let oi=0,ii=8;
 while(oi<L&&ii<s.length){
  const a=s[ii];
  if(a===0){
   ii++;
   if(ii>=s.length)throw new Error("Invalid legacy PICO-8 cartridge: truncated literal.");
   out[oi++]=s[ii++];
  }else if(a<=0x3b){
   const ch=LEGACY_LITERAL_TABLE[a];
   if(ch===undefined)throw new Error("Invalid legacy PICO-8 cartridge: bad literal.");
   out[oi++]=ch;ii++;
  }else{
   ii++;
   if(ii>=s.length)throw new Error("Invalid legacy PICO-8 cartridge: truncated back-reference.");
   const b=s[ii++];
   const offset=(a-0x3c)*16+(b&0x0f);
   const len=(b>>4)+2;
   if(offset<=0||offset>oi)throw new Error("Invalid legacy PICO-8 cartridge: bad back-reference.");
   for(let i=0;i<len&&oi<L;i++)out[oi++]=out[oi-offset];
  }
 }
 if(oi<L)throw new Error("Invalid legacy PICO-8 cartridge: decompression ended early.");
 let code=new TextDecoder("latin1").decode(out);
 if(code.endsWith(FUTURE_CODE1))code=code.slice(0,-FUTURE_CODE1.length);
 if(code.endsWith(FUTURE_CODE2))code=code.slice(0,-FUTURE_CODE2.length);
 return code.replace(/\r/g," ");
}