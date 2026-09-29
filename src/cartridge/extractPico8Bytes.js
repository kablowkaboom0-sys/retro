export default async function extractPico8Bytes(file){
 const img=await createImageBitmap(file);
 if(img.width!==160||img.height!==205){
  img.close();
  throw new Error(`Invalid PICO-8 PNG: ${img.width}x${img.height}. A PICO-8 cartridge PNG should be 160x205.`);
 }
 const c=new OffscreenCanvas(img.width,img.height);
 const ctx=c.getContext("2d",{willReadFrequently:true});
 ctx.drawImage(img,0,0);
 const p=ctx.getImageData(0,0,img.width,img.height).data;
 img.close();
 const out=new Uint8Array(160*205);
 for(let i=0,j=0;i<p.length;i+=4,j++) out[j]=((p[i+3]&3)<<6)|((p[i]&3)<<4)|((p[i+1]&3)<<2)|(p[i+2]&3);
 return out;
}