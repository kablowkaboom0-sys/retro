const {lua}=window.fengari;
let ctx=null,keys=null,gfx=null,mapd=null,gff=null,cx=0,cy=0;
const P=["#000000","#1D2B53","#7E2553","#008751","#AB5236","#5F574F","#C2C3C7","#FFF1E8","#FF004D","#FFA300","#FFEC27","#00E436","#29ADFF","#83769C","#FF77A8","#FFCCAA"];
export function bindAPIResources(c,k,r){ctx=c;keys=k;({gfx,map:mapd,gff}=r)}
export function camera(L){const x=lua.lua_isnoneornil(L,1)?0:lua.lua_tonumber(L,1)||0,y=lua.lua_isnoneornil(L,2)?0:lua.lua_tonumber(L,2)||0,px=cx,py=cy;cx=Math.floor(x);cy=Math.floor(y);ctx.setTransform(1,0,0,1,-cx,-cy);lua.lua_pushnumber(L,px);lua.lua_pushnumber(L,py);return 2}
export function cls(L){const c=lua.lua_isnoneornil(L,1)?0:lua.lua_tonumber(L,1)||0;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=P[Math.floor(c)%16];ctx.fillRect(0,0,128,128)}
export function pset(L){ctx.fillStyle=P[Math.floor(lua.lua_tonumber(L,3)||0)%16];ctx.fillRect(Math.floor(lua.lua_tonumber(L,1)||0),Math.floor(lua.lua_tonumber(L,2)||0),1,1)}
export function spr(L){if(!gfx)return;const n=Math.floor(lua.lua_tonumber(L,1)||0),x=Math.floor(lua.lua_tonumber(L,2)||0),y=Math.floor(lua.lua_tonumber(L,3)||0),w=lua.lua_isnoneornil(L,4)?1:Math.floor(lua.lua_tonumber(L,4)||1),h=lua.lua_isnoneornil(L,5)?1:Math.floor(lua.lua_tonumber(L,5)||1),fx=!lua.lua_isnoneornil(L,6)&&lua.lua_toboolean(L,6),fy=!lua.lua_isnoneornil(L,7)&&lua.lua_toboolean(L,7),sx=n%16*8,sy=Math.floor(n/16)*8,sw=w*8,sh=h*8;ctx.save();ctx.translate(x+(fx?sw:0),y+(fy?sh:0));ctx.scale(fx?-1:1,fy?-1:1);ctx.drawImage(gfx,sx,sy,sw,sh,0,0,sw,sh);ctx.restore()}
export function btn(L){lua.lua_pushboolean(L,!!keys[Math.floor(lua.lua_tonumber(L,1)||0)]);return 1}
export function sfx(){return 0}
function mg(x,y){if(x<0||x>=128||y<0||y>=128)return 0;return mapd[y*128+x]??0}
export function mget(L){lua.lua_pushnumber(L,mg(Math.floor(lua.lua_tonumber(L,1)||0),Math.floor(lua.lua_tonumber(L,2)||0)));return 1}
export function mset(L){const x=Math.floor(lua.lua_tonumber(L,1)||0),y=Math.floor(lua.lua_tonumber(L,2)||0),v=Math.floor(lua.lua_tonumber(L,3)||0);if(x>=0&&x<128&&y>=0&&y<64)mapd[y*128+x]=v}
export function map(L){const x0=lua.lua_tonumber(L,1)||0,y0=lua.lua_tonumber(L,2)||0,sx=lua.lua_isnoneornil(L,3)?0:lua.lua_tonumber(L,3),sy=lua.lua_isnoneornil(L,4)?0:lua.lua_tonumber(L,4),w=lua.lua_isnoneornil(L,5)?128:lua.lua_tonumber(L,5),h=lua.lua_isnoneornil(L,6)?32:lua.lua_tonumber(L,6);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const t=mg(x0+x,y0+y);lua.lua_getglobal(L,"spr");lua.lua_pushnumber(L,t);lua.lua_pushnumber(L,sx+x*8);lua.lua_pushnumber(L,sy+y*8);lua.lua_call(L,3,0)}}
export function cos(L){lua.lua_pushnumber(L,Math.cos((lua.lua_tonumber(L,1)||0)*2*Math.PI));return 1}
export function flr(L){lua.lua_pushnumber(L,Math.floor(lua.lua_tonumber(L,1)||0));return 1}
export function sqrt(L){lua.lua_pushnumber(L,Math.sqrt(lua.lua_tonumber(L,1)||0));return 1}
let st=performance.now();export function time(L){lua.lua_pushnumber(L,(performance.now()-st)/1000);return 1}export const t=time;