async function getImage(file){
  if(typeof createImageBitmap==="function"){
    try{return await createImageBitmap(file)}catch(e){}
  }
  const url=URL.createObjectURL(file);
  try{
    return await new Promise((resolve,reject)=>{
      const img=new Image();
      img.onload=()=>resolve(img);
      img.onerror=()=>reject(new Error("The selected PNG could not be decoded by the browser."));
      img.src=url;
    });
  }finally{URL.revokeObjectURL(url)}
}
export default async function extractPico8Bytes(file){
 const img=await getImage(file);
 const w=img.naturalWidth||img.width,h=img.naturalHeight||img.height;
 if(w!==160||h!==205){
  if(typeof img.close==="function")img.close();
  throw new Error(`Invalid PICO-8 PNG: ${w}x${h}. A PICO-8 cartridge PNG should be 160x205.`);
 }
 const c=document.createElement("canvas");
 c.width=w;c.height=h;
 const ctx=c.getContext("2d",{willReadFrequently:true});
 if(!ctx)throw new Error("Canvas is unavailable in this browser.");
 ctx.drawImage(img,0,0);
 const p=ctx.getImageData(0,0,w,h).data;
 if(typeof img.close==="function")img.close();
 const out=new Uint8Array(w*h);
 for(let i=0,j=0;i<p.length;i+=4,j++)
   out[j]=((p[i+3]&3)<<6)|((p[i]&3)<<4)|((p[i+1]&3)<<2)|(p[i+2]&3);
 return out;
}