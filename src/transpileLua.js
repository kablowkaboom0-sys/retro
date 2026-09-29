// Convert common PICO-8 Lua syntax to Lua 5.1 syntax used by Fengari.
export default function transpileLua(source){
  let s=String(source||"").replace(/\r\n?/g,"\n");

  // PICO-8 uses != while standard Lua uses ~=.
  s=s.replace(/!=/g,"~=");

  // PICO-8 supports compound assignments (+=, -=, *=, /=, %=).
  // The previous converter only handled a single non-space token on the RHS,
  // which could leave an '=' behind and cause "unexpected symbol near '='".
  s=s.replace(
    /^(\s*)([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)\s*([+\-*/%])=\s*(.+)$/gm,
    (m,indent,name,op,rhs)=>indent+name+" = "+name+" "+op+" "+rhs
  );

  // A few PICO-8 cartridges use parenthesized conditions with a bare
  // one-line return. Lua accepts the condition without the parentheses.
  s=s.replace(/if\s*\(([^\n()]*)\)\s*return\s+([^\n]+)$/gm,"if $1 then return $2 end");

  // PICO-8 compressed cartridges can contain these legacy character codes.
  s=s.replace(new RegExp(String.fromCharCode(139),"g"),"0");
  s=s.replace(new RegExp(String.fromCharCode(145),"g"),"1");
  s=s.replace(new RegExp(String.fromCharCode(148),"g"),"2");
  s=s.replace(new RegExp(String.fromCharCode(131),"g"),"3");

  return s;
}
