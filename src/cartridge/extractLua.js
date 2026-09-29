import {arrayEquals} from "../utils.js";
const enc=new TextEncoder();
export default function extractLua(b){
 const s=b.slice(0x4300),h=b.slice(0x4300,0x4304);
 if(arrayEquals(h,enc.encode("\x00pxa")))return dec(s);
 if(arrayEquals(h,enc.encode(":c:\x00")))throw new Error("Old pre-v0.2.0 compressed cartridges are not supported.");
 const n=s.indexOf(0);return new TextDecoder("ascii").decode(s.slice(0,n<0?s.length:n));
}
function dec(s){
 let o=4,L=(s[o]<<8)|s[o+1];o+=2;let C=((s[o]<<8)|s[o+1])-8;o+=2,mtf=Array.from({length:256},(_,i)=>i),bits="";
 for(let i=o;i<s.length&&i<o+C;i++)bits+=s[i].toString(2).padStart(8,"0").split("").reverse().join("");
 let pos=0,out=[];
 const bit=()=>pos<bits.length?bits[pos++]:"0";
 const read=n=>{if(pos+n>bits.length)return 0;const v=parseInt(bits.slice(pos,pos+n).split("").reverse().join(""),2);pos+=n;return v};
 while(out.length<L&&pos<bits.length){if(bit()==="1"){let u=0;while(bit()==="1")u++;let mask=(1<<u)-1,idx=read(4+u)+(mask<<4);if(idx<256){let ch=mtf[idx];out.push(String.fromCharCode(ch));mtf.splice(idx,1);mtf.unshift(ch)}}else{let ob;if(bit()==="1")ob=bit()==="1"?5:10;else ob=15;let back=read(ob)+1;if(ob===10&&back===1){while(pos<bits.length){let ch=read(8);if(ch===0)break;out.push(String.fromCharCode(ch))}continue}let len=3;while(1){let q=read(3);len+=q;if(q!==7)break}if(back>out.length)break;let chunk=out.slice(out.length-back,out.length-back+len);while(chunk.length<len)chunk=chunk.concat(chunk);out.push(...chunk.slice(0,len))}}
 return out.slice(0,L).join("");
}