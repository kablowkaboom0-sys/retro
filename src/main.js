import {extractPico8Bytes,extractGFX,extractMap,extractGFF,extractLua} from "./cartridge/index.js";
import LuaVM from "./luaVM.js";
import transpileLua from "./transpileLua.js";
import * as picoAPI from "./pico8api.js";
const FPS=30,FRAME=1000/FPS,keys=new Array(8).fill(false);
let vm=null,raf=null,last=0,acc=0;
const canvas=document.createElement("canvas");canvas.width=128;canvas.height=128;canvas.tabIndex=0;
const container=document.querySelector(".game-container");container.innerHTML="";container.appendChild(canvas);
const ctx=canvas.getContext("2d");ctx.imageSmoothingEnabled=false;
const status=document.getElementById("status"),fileInput=document.getElementById("cart-file"),loadBtn=document.getElementById("load-button");
const noMsg=document.getElementById("no-cart-message");
const keyMap={ArrowLeft:0,ArrowRight:1,ArrowUp:2,ArrowDown:3,"z":4,"x":5,"c":6,"v":7};
addEventListener("keydown",e=>{const k=keyMap[e.key];if(k!==undefined){keys[k]=true;e.preventDefault()}});
addEventListener("keyup",e=>{const k=keyMap[e.key];if(k!==undefined){keys[k]=false;e.preventDefault()}});
async function loadFile(file){
 if(!file)return;
 if(!file.name.toLowerCase().endsWith(".p8.png")){status.textContent="Please choose a .p8.png cartridge.";return}
 try{
  status.textContent="Loading "+file.name+"…";
  const bytes=await extractPico8Bytes(file);
  const gfx=extractGFX(bytes),map=extractMap(bytes),gff=extractGFF(bytes),lua=transpileLua(extractLua(bytes));
  picoAPI.bindAPIResources(ctx,keys,{gfx,map,gff});vm=new LuaVM();
  Object.entries(picoAPI).forEach(([n,fn])=>{if(typeof fn==="function"&&n!=="bindAPIResources")vm.addFunction(n,fn)});
  if(!vm.executeCode(lua))throw new Error("The cartridge Lua code could not be executed.");
  vm.callFunction("_init");keys.fill(false);noMsg.style.display="none";status.textContent="Playing: "+file.name;canvas.focus();
  if(raf)cancelAnimationFrame(raf);last=performance.now();acc=0;loop(last);
 }catch(e){console.error(e);status.textContent="Could not load: "+e.message}
}
function loop(t){if(!vm)return;const d=t-last;last=t;acc+=d;while(acc>=FRAME){ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,128,128);vm.callFunction("_update");vm.callFunction("_draw");acc-=FRAME}raf=requestAnimationFrame(loop)}
loadBtn.onclick=()=>loadFile(fileInput.files[0]);
fileInput.onchange=()=>{if(fileInput.files[0])loadFile(fileInput.files[0])};
canvas.addEventListener("click",()=>canvas.focus());