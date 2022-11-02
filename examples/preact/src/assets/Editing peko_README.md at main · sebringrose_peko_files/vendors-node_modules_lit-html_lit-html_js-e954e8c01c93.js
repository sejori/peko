"use strict";(globalThis.webpackChunk=globalThis.webpackChunk||[]).push([["vendors-node_modules_lit-html_lit-html_js"],{13695(a,b,c){c.d(b,{X:()=>e,w:()=>f});/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */ let d=new WeakMap,e=a=>(...b)=>{let c=a(...b);return d.set(c,!0),c},f=a=>"function"==typeof a&&d.has(a)},66921(a,b,c){c.d(b,{V:()=>e,eC:()=>d,r4:()=>f});/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */ /**
 * True if the custom elements polyfill is in use.
 */ let d=void 0!==window.customElements&& void 0!==window.customElements.polyfillWrapFlushCallback,e=(a,b,c=null,d=null)=>{for(;b!==c;){let e=b.nextSibling;a.insertBefore(b,d),b=e}},f=(a,b,c=null)=>{for(;b!==c;){let d=b.nextSibling;a.removeChild(b),b=d}}},31301(a,b,c){c.d(b,{J:()=>d,L:()=>e});/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */ /**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */ let d={},e={}},28356(a,b,c){c.d(b,{JG:()=>BooleanAttributePart,K1:()=>EventPart,QG:()=>AttributeCommitter,"_l":()=>AttributePart,m:()=>PropertyCommitter,nt:()=>NodePart,pt:()=>j});var d=c(13695),e=c(66921),f=c(31301),g=c(3122),h=c(89823),i=c(60560);/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */ /**
 * @module lit-html
 */ let j=a=>null===a||!("object"==typeof a||"function"==typeof a),k=a=>Array.isArray(a)||!!(a&&a[Symbol.iterator]);class AttributeCommitter{constructor(a,b,c){this.dirty=!0,this.element=a,this.name=b,this.strings=c,this.parts=[];for(let d=0;d<c.length-1;d++)this.parts[d]=this._createPart()}_createPart(){return new AttributePart(this)}_getValue(){let a=this.strings,b=a.length-1,c="";for(let d=0;d<b;d++){c+=a[d];let e=this.parts[d];if(void 0!==e){let f=e.value;if(j(f)||!k(f))c+="string"==typeof f?f:String(f);else for(let g of f)c+="string"==typeof g?g:String(g)}}return c+a[b]}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class AttributePart{constructor(a){this.value=void 0,this.committer=a}setValue(a){a===f.J||j(a)&&a===this.value||(this.value=a,(0,d.w)(a)||(this.committer.dirty=!0))}commit(){for(;(0,d.w)(this.value);){let a=this.value;this.value=f.J,a(this)}this.value!==f.J&&this.committer.commit()}}class NodePart{constructor(a){this.value=void 0,this.__pendingValue=void 0,this.options=a}appendInto(a){this.startNode=a.appendChild((0,i.IW)()),this.endNode=a.appendChild((0,i.IW)())}insertAfterNode(a){this.startNode=a,this.endNode=a.nextSibling}appendIntoPart(a){a.__insert(this.startNode=(0,i.IW)()),a.__insert(this.endNode=(0,i.IW)())}insertAfterPart(a){a.__insert(this.startNode=(0,i.IW)()),this.endNode=a.endNode,a.endNode=this.startNode}setValue(a){this.__pendingValue=a}commit(){for(;(0,d.w)(this.__pendingValue);){let a=this.__pendingValue;this.__pendingValue=f.J,a(this)}let b=this.__pendingValue;b!==f.J&&(j(b)?b!==this.value&&this.__commitText(b):b instanceof h.j?this.__commitTemplateResult(b):b instanceof Node?this.__commitNode(b):k(b)?this.__commitIterable(b):b===f.L?(this.value=f.L,this.clear()):this.__commitText(b))}__insert(a){this.endNode.parentNode.insertBefore(a,this.endNode)}__commitNode(a){this.value!==a&&(this.clear(),this.__insert(a),this.value=a)}__commitText(a){let b=this.startNode.nextSibling;a=null==a?"":a;let c="string"==typeof a?a:String(a);b===this.endNode.previousSibling&&3===b.nodeType?b.data=c:this.__commitNode(document.createTextNode(c)),this.value=a}__commitTemplateResult(a){let b=this.options.templateFactory(a);if(this.value instanceof g.R&&this.value.template===b)this.value.update(a.values);else{let c=new g.R(b,a.processor,this.options),d=c._clone();c.update(a.values),this.__commitNode(d),this.value=c}}__commitIterable(a){Array.isArray(this.value)||(this.value=[],this.clear());let b=this.value,c=0,d;for(let e of a)void 0===(d=b[c])&&(d=new NodePart(this.options),b.push(d),0===c?d.appendIntoPart(this):d.insertAfterPart(b[c-1])),d.setValue(e),d.commit(),c++;c<b.length&&(b.length=c,this.clear(d&&d.endNode))}clear(a=this.startNode){(0,e.r4)(this.startNode.parentNode,a.nextSibling,this.endNode)}}class BooleanAttributePart{constructor(a,b,c){if(this.value=void 0,this.__pendingValue=void 0,2!==c.length||""!==c[0]||""!==c[1])throw Error("Boolean attributes can only contain a single expression");this.element=a,this.name=b,this.strings=c}setValue(a){this.__pendingValue=a}commit(){for(;(0,d.w)(this.__pendingValue);){let a=this.__pendingValue;this.__pendingValue=f.J,a(this)}if(this.__pendingValue===f.J)return;let b=!!this.__pendingValue;this.value!==b&&(b?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=b),this.__pendingValue=f.J}}class PropertyCommitter extends AttributeCommitter{constructor(a,b,c){super(a,b,c),this.single=2===c.length&&""===c[0]&&""===c[1]}_createPart(){return new PropertyPart(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class PropertyPart extends AttributePart{}let l=!1;try{let m={get capture(){return l=!0,!1}};window.addEventListener("test",m,m),window.removeEventListener("test",m,m)}catch(n){}class EventPart{constructor(a,b,c){this.value=void 0,this.__pendingValue=void 0,this.element=a,this.eventName=b,this.eventContext=c,this.__boundHandleEvent=a=>this.handleEvent(a)}setValue(a){this.__pendingValue=a}commit(){for(;(0,d.w)(this.__pendingValue);){let a=this.__pendingValue;this.__pendingValue=f.J,a(this)}if(this.__pendingValue===f.J)return;let b=this.__pendingValue,c=this.value,e=null==b||null!=c&&(b.capture!==c.capture||b.once!==c.once||b.passive!==c.passive);e&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),null!=b&&(null==c||e)&&(this.__options=o(b),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=b,this.__pendingValue=f.J}handleEvent(a){"function"==typeof this.value?this.value.call(this.eventContext||this.element,a):this.value.handleEvent(a)}}let o=a=>a&&(l?{capture:a.capture,passive:a.passive,once:a.once}:a.capture)},3122(a,b,c){c.d(b,{R:()=>TemplateInstance});var d=c(66921),e=c(60560);/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */ /**
 * @module lit-html
 */ /**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */ class TemplateInstance{constructor(a,b,c){this.__parts=[],this.template=a,this.processor=b,this.options=c}update(a){let b=0;for(let c of this.__parts)void 0!==c&&c.setValue(a[b]),b++;for(let d of this.__parts)void 0!==d&&d.commit()}_clone(){let a=d.eC?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),b=[],c=this.template.parts,f=document.createTreeWalker(a,133,null,!1),g=0,h=0,i,j=f.nextNode();for(;g<c.length;){if(i=c[g],!(0,e.pC)(i)){this.__parts.push(void 0),g++;continue}for(;h<i.index;)h++,"TEMPLATE"===j.nodeName&&(b.push(j),f.currentNode=j.content),null===(j=f.nextNode())&&(f.currentNode=b.pop(),j=f.nextNode());if("node"===i.type){let k=this.processor.handleTextExpression(this.options);k.insertAfterNode(j.previousSibling),this.__parts.push(k)}else this.__parts.push(...this.processor.handleAttributeExpressions(j,i.name,i.strings,this.options));g++}return d.eC&&(document.adoptNode(a),customElements.upgrade(a)),a}}},89823(a,b,c){c.d(b,{j:()=>TemplateResult}),c(66921);var d=c(60560);/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */ /**
 * @module lit-html
 */ let e=` ${d.Jw} `;class TemplateResult{constructor(a,b,c,d){this.strings=a,this.values=b,this.type=c,this.processor=d}getHTML(){let a=this.strings.length-1,b="",c=!1;for(let f=0;f<a;f++){let g=this.strings[f],h=g.lastIndexOf("<!--");c=(h> -1||c)&& -1===g.indexOf("-->",h+1);let i=d.W5.exec(g);null===i?b+=g+(c?e:d.N):b+=g.substr(0,i.index)+i[1]+i[2]+d.$E+i[3]+d.Jw}return b+this.strings[a]}getTemplateElement(){let a=document.createElement("template");return a.innerHTML=this.getHTML(),a}}},60560(a,b,c){c.d(b,{"$E":()=>g,IW:()=>j,Jw:()=>d,N:()=>e,W5:()=>k,YS:()=>Template,pC:()=>i});/* unused harmony export markerRegex */ /**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */ /**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */ let d=`{{lit-${String(Math.random()).slice(2)}}}`,e=`<!--${d}-->`,f=RegExp(`${d}|${e}`),g="$lit$";class Template{constructor(a,b){this.parts=[],this.element=b;let c=[],e=[],i=document.createTreeWalker(b.content,133,null,!1),l=0,m=-1,n=0,{strings:o,values:{length:p}}=a;for(;n<p;){let q=i.nextNode();if(null===q){i.currentNode=e.pop();continue}if(m++,1===q.nodeType){if(q.hasAttributes()){let r=q.attributes,{length:s}=r,t=0;for(let u=0;u<s;u++)h(r[u].name,g)&&t++;for(;t-- >0;){let v=o[n],w=k.exec(v)[2],x=w.toLowerCase()+g,y=q.getAttribute(x);q.removeAttribute(x);let z=y.split(f);this.parts.push({type:"attribute",index:m,name:w,strings:z}),n+=z.length-1}}"TEMPLATE"===q.tagName&&(e.push(q),i.currentNode=q.content)}else if(3===q.nodeType){let A=q.data;if(A.indexOf(d)>=0){let B=q.parentNode,C=A.split(f),D=C.length-1;for(let E=0;E<D;E++){let F,G=C[E];if(""===G)F=j();else{let H=k.exec(G);null!==H&&h(H[2],g)&&(G=G.slice(0,H.index)+H[1]+H[2].slice(0,-g.length)+H[3]),F=document.createTextNode(G)}B.insertBefore(F,q),this.parts.push({type:"node",index:++m})}""===C[D]?(B.insertBefore(j(),q),c.push(q)):q.data=C[D],n+=D}}else if(8===q.nodeType){if(q.data===d){let I=q.parentNode;(null===q.previousSibling||m===l)&&(m++,I.insertBefore(j(),q)),l=m,this.parts.push({type:"node",index:m}),null===q.nextSibling?q.data="":(c.push(q),m--),n++}else{let J=-1;for(;-1!==(J=q.data.indexOf(d,J+1));)this.parts.push({type:"node",index:-1}),n++}}}for(let K of c)K.parentNode.removeChild(K)}}let h=(a,b)=>{let c=a.length-b.length;return c>=0&&a.slice(c)===b},i=a=>-1!==a.index,j=()=>document.createComment(""),k=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/},36162(a,b,c){c.d(b,{"_l":()=>d._l,nt:()=>d.nt,IW:()=>i.IW,XM:()=>g.X,dy:()=>n,r4:()=>h.r4,sY:()=>m,V:()=>h.V});var d=c(28356);let e=new /**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */ /**
 * Creates Parts when a template is instantiated.
 */ class DefaultTemplateProcessor{handleAttributeExpressions(a,b,c,e){let f=b[0];if("."===f){let g=new d.m(a,b.slice(1),c);return g.parts}if("@"===f)return[new d.K1(a,b.slice(1),e.eventContext)];if("?"===f)return[new d.JG(a,b.slice(1),c)];let h=new d.QG(a,b,c);return h.parts}handleTextExpression(a){return new d.nt(a)}};var f=c(89823),g=c(13695),h=c(66921);c(31301);var i=c(60560);/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */ /**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */ function j(a){let b=k.get(a.type);void 0===b&&(b={stringsArray:new WeakMap,keyString:new Map},k.set(a.type,b));let c=b.stringsArray.get(a.strings);if(void 0!==c)return c;let d=a.strings.join(i.Jw);return void 0===(c=b.keyString.get(d))&&(c=new i.YS(a,a.getTemplateElement()),b.keyString.set(d,c)),b.stringsArray.set(a.strings,c),c}let k=new Map,l=new WeakMap,m=(a,b,c)=>{let e=l.get(b);void 0===e&&((0,h.r4)(b,b.firstChild),l.set(b,e=new d.nt(Object.assign({templateFactory:j},c))),e.appendInto(b)),e.setValue(a),e.commit()};c(3122),/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */ /**
 *
 * Main lit-html module.
 *
 * Main exports:
 *
 * -  [[html]]
 * -  [[svg]]
 * -  [[render]]
 *
 * @module lit-html
 * @preferred
 */ /**
 * Do not remove this comment; it keeps typedoc from misplacing the module
 * docs.
 */ // TODO(justinfagnani): remove line when we get NodePart moving methods
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.1.2");let n=(a,...b)=>new f.j(a,b,"html",e)}}])
//# sourceMappingURL=vendors-node_modules_lit-html_lit-html_js-4a94a393c1fd.js.map