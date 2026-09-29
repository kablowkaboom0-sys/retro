export default async function extractPico8Bytes(url){
 const imageInfo=await loadPico8PNG(url);
 if(imageInfo.width!==160||imageInfo.height!==205) throw new Error(`Invalid PICO-8 PNG dimensions: ${imageInfo.width}x${imageInfo.height}, expected 160x205`);
 const p=imageInfo.data, out=new Uint8Array(p.length/4);
 for(let i=0,j=0;i<p.length;i+=4,j++) out[j]=((p[i+3]&3)<<6)|((p[i]&3)<<4)|((p[i+1]&3)<<2)|(p[i+2]&3);
 return out;
}
function loadPico8PNG(url){return new Promise((resolve,reject)=>{
 const img=new Image();
 img.onload=()=>{const c=document.createElement("canvas");c.width=img.width;c.height=img.height;const x=c.getContext("2d");x.drawImage(img,0,0);resolve({width:c.width,height:c.height,data:x.getImageData(0,0,c.width,c.height).data});};
 img.onerror=()=>reject(new Error("Could not read the PNG cartridge."));
 img.src=url;
});}