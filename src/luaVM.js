const {lua,lauxlib,lualib,to_luastring,to_jsstring}=window.fengari;
export default class LuaVM{
 constructor(){this.L=lauxlib.luaL_newstate();lualib.luaL_openlibs(this.L);this.isReady=true}
 executeCode(code){try{const c=to_luastring(code),r=lauxlib.luaL_loadbuffer(this.L,c,c.length,to_luastring("chunk"));if(r!==lua.LUA_OK)return this.#err("Lua load error");return lua.lua_pcall(this.L,0,0,0)===lua.LUA_OK||this.#err("Lua execution error")}catch(e){console.error(e);return false}}
 callFunction(n,...a){try{lua.lua_getglobal(this.L,to_luastring(n));if(lua.lua_isnil(this.L,-1)){lua.lua_pop(this.L,1);return null}if(!lua.lua_isfunction(this.L,-1)){lua.lua_pop(this.L,1);return null}a.forEach(v=>this.#push(v));const nr=["_init","_update","_draw"].includes(n)?0:1,r=lua.lua_pcall(this.L,a.length,nr,0);if(r!==lua.LUA_OK)return this.#err("Function error");if(nr){const v=this.#read(-1);lua.lua_pop(this.L,1);return v}return null}catch(e){console.error(e);return null}}
 addFunction(n,fn){lua.lua_pushjsfunction(this.L,fn);lua.lua_setglobal(this.L,to_luastring(n))}
 #push(v){if(typeof v==="number")lua.lua_pushnumber(this.L,v);else if(typeof v==="string")lua.lua_pushstring(this.L,to_luastring(v));else if(typeof v==="boolean")lua.lua_pushboolean(this.L,v);else lua.lua_pushnil(this.L)}
 #read(i){if(lua.lua_isnumber(this.L,i))return lua.lua_tonumber(this.L,i);if(lua.lua_isstring(this.L,i))return to_jsstring(lua.lua_tostring(this.L,i));if(lua.lua_isboolean(this.L,i))return lua.lua_toboolean(this.L,i);return null}
 #err(p){const m=lua.lua_tostring(this.L,-1);console.error(p,m?to_jsstring(m):"");lua.lua_pop(this.L,1);return false}
}