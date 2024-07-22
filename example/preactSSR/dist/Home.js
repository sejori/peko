(()=>{var O,m,ee,ce,x,Q,te,R,q,I,A,pe,N={},ne=[],fe=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,B=Array.isArray;function w(t,e){for(var o in e)t[o]=e[o];return t}function oe(t){var e=t.parentNode;e&&e.removeChild(t)}function z(t,e,o){var _,i,n,l={};for(n in e)n=="key"?_=e[n]:n=="ref"?i=e[n]:l[n]=e[n];if(arguments.length>2&&(l.children=arguments.length>3?O.call(arguments,2):o),typeof t=="function"&&t.defaultProps!=null)for(n in t.defaultProps)l[n]===void 0&&(l[n]=t.defaultProps[n]);return D(t,l,_,i,null)}function D(t,e,o,_,i){var n={type:t,props:e,key:o,ref:_,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:i??++ee,__i:-1,__u:0};return i==null&&m.vnode!=null&&m.vnode(n),n}function G(t){return t.children}function T(t,e){this.props=t,this.context=e}function C(t,e){if(e==null)return t.__?C(t.__,t.__i+1):null;for(var o;e<t.__k.length;e++)if((o=t.__k[e])!=null&&o.__e!=null)return o.__e;return typeof t.type=="function"?C(t):null}function re(t){var e,o;if((t=t.__)!=null&&t.__c!=null){for(t.__e=t.__c.base=null,e=0;e<t.__k.length;e++)if((o=t.__k[e])!=null&&o.__e!=null){t.__e=t.__c.base=o.__e;break}return re(t)}}function X(t){(!t.__d&&(t.__d=!0)&&x.push(t)&&!H.__r++||Q!==m.debounceRendering)&&((Q=m.debounceRendering)||te)(H)}function H(){var t,e,o,_,i,n,l,u;for(x.sort(R);t=x.shift();)t.__d&&(e=x.length,_=void 0,n=(i=(o=t).__v).__e,l=[],u=[],o.__P&&((_=w({},i)).__v=i.__v+1,m.vnode&&m.vnode(_),le(o.__P,_,i,o.__n,o.__P.namespaceURI,32&i.__u?[n]:null,l,n??C(i),!!(32&i.__u),u),_.__v=i.__v,_.__.__k[_.__i]=_,me(l,_,u),_.__e!=n&&re(_)),x.length>e&&x.sort(R));H.__r=0}function _e(t,e,o,_,i,n,l,u,a,s,p){var r,f,c,g,y,v=_&&_.__k||ne,h=e.length;for(o.__d=a,he(o,e,v),a=o.__d,r=0;r<h;r++)(c=o.__k[r])!=null&&typeof c!="boolean"&&typeof c!="function"&&(f=c.__i===-1?N:v[c.__i]||N,c.__i=r,le(t,c,f,i,n,l,u,a,s,p),g=c.__e,c.ref&&f.ref!=c.ref&&(f.ref&&J(f.ref,null,c),p.push(c.ref,c.__c||g,c)),y==null&&g!=null&&(y=g),65536&c.__u||f.__k===c.__k?(a&&typeof c.type=="string"&&!t.contains(a)&&(a=C(f)),a=ie(c,a,t)):typeof c.type=="function"&&c.__d!==void 0?a=c.__d:g&&(a=g.nextSibling),c.__d=void 0,c.__u&=-196609);o.__d=a,o.__e=y}function he(t,e,o){var _,i,n,l,u,a=e.length,s=o.length,p=s,r=0;for(t.__k=[],_=0;_<a;_++)l=_+r,(i=t.__k[_]=(i=e[_])==null||typeof i=="boolean"||typeof i=="function"?null:typeof i=="string"||typeof i=="number"||typeof i=="bigint"||i.constructor==String?D(null,i,null,null,null):B(i)?D(G,{children:i},null,null,null):i.constructor===void 0&&i.__b>0?D(i.type,i.props,i.key,i.ref?i.ref:null,i.__v):i)!=null?(i.__=t,i.__b=t.__b+1,u=de(i,o,l,p),i.__i=u,n=null,u!==-1&&(p--,(n=o[u])&&(n.__u|=131072)),n==null||n.__v===null?(u==-1&&r--,typeof i.type!="function"&&(i.__u|=65536)):u!==l&&(u==l-1?r=u-l:u==l+1?r++:u>l?p>a-l?r+=u-l:r--:u<l&&r++,u!==_+r&&(i.__u|=65536))):(n=o[l])&&n.key==null&&n.__e&&!(131072&n.__u)&&(n.__e==t.__d&&(t.__d=C(n)),j(n,n,!1),o[l]=null,p--);if(p)for(_=0;_<s;_++)(n=o[_])!=null&&!(131072&n.__u)&&(n.__e==t.__d&&(t.__d=C(n)),j(n,n))}function ie(t,e,o){var _,i;if(typeof t.type=="function"){for(_=t.__k,i=0;_&&i<_.length;i++)_[i]&&(_[i].__=t,e=ie(_[i],e,o));return e}t.__e!=e&&(o.insertBefore(t.__e,e||null),e=t.__e);do e=e&&e.nextSibling;while(e!=null&&e.nodeType===8);return e}function de(t,e,o,_){var i=t.key,n=t.type,l=o-1,u=o+1,a=e[o];if(a===null||a&&i==a.key&&n===a.type&&!(131072&a.__u))return o;if(_>(a!=null&&!(131072&a.__u)?1:0))for(;l>=0||u<e.length;){if(l>=0){if((a=e[l])&&!(131072&a.__u)&&i==a.key&&n===a.type)return l;l--}if(u<e.length){if((a=e[u])&&!(131072&a.__u)&&i==a.key&&n===a.type)return u;u++}}return-1}function Y(t,e,o){e[0]==="-"?t.setProperty(e,o??""):t[e]=o==null?"":typeof o!="number"||fe.test(e)?o:o+"px"}function U(t,e,o,_,i){var n;e:if(e==="style")if(typeof o=="string")t.style.cssText=o;else{if(typeof _=="string"&&(t.style.cssText=_=""),_)for(e in _)o&&e in o||Y(t.style,e,"");if(o)for(e in o)_&&o[e]===_[e]||Y(t.style,e,o[e])}else if(e[0]==="o"&&e[1]==="n")n=e!==(e=e.replace(/(PointerCapture)$|Capture$/i,"$1")),e=e.toLowerCase()in t||e==="onFocusOut"||e==="onFocusIn"?e.toLowerCase().slice(2):e.slice(2),t.l||(t.l={}),t.l[e+n]=o,o?_?o.u=_.u:(o.u=q,t.addEventListener(e,n?A:I,n)):t.removeEventListener(e,n?A:I,n);else{if(i=="http://www.w3.org/2000/svg")e=e.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(e!="width"&&e!="height"&&e!="href"&&e!="list"&&e!="form"&&e!="tabIndex"&&e!="download"&&e!="rowSpan"&&e!="colSpan"&&e!="role"&&e!="popover"&&e in t)try{t[e]=o??"";break e}catch{}typeof o=="function"||(o==null||o===!1&&e[4]!=="-"?t.removeAttribute(e):t.setAttribute(e,e=="popover"&&o==1?"":o))}}function Z(t){return function(e){if(this.l){var o=this.l[e.type+t];if(e.t==null)e.t=q++;else if(e.t<o.u)return;return o(m.event?m.event(e):e)}}}function le(t,e,o,_,i,n,l,u,a,s){var p,r,f,c,g,y,v,h,d,S,k,L,P,K,$,F,b=e.type;if(e.constructor!==void 0)return null;128&o.__u&&(a=!!(32&o.__u),n=[u=e.__e=o.__e]),(p=m.__b)&&p(e);e:if(typeof b=="function")try{if(h=e.props,d="prototype"in b&&b.prototype.render,S=(p=b.contextType)&&_[p.__c],k=p?S?S.props.value:p.__:_,o.__c?v=(r=e.__c=o.__c).__=r.__E:(d?e.__c=r=new b(h,k):(e.__c=r=new T(h,k),r.constructor=b,r.render=ve),S&&S.sub(r),r.props=h,r.state||(r.state={}),r.context=k,r.__n=_,f=r.__d=!0,r.__h=[],r._sb=[]),d&&r.__s==null&&(r.__s=r.state),d&&b.getDerivedStateFromProps!=null&&(r.__s==r.state&&(r.__s=w({},r.__s)),w(r.__s,b.getDerivedStateFromProps(h,r.__s))),c=r.props,g=r.state,r.__v=e,f)d&&b.getDerivedStateFromProps==null&&r.componentWillMount!=null&&r.componentWillMount(),d&&r.componentDidMount!=null&&r.__h.push(r.componentDidMount);else{if(d&&b.getDerivedStateFromProps==null&&h!==c&&r.componentWillReceiveProps!=null&&r.componentWillReceiveProps(h,k),!r.__e&&(r.shouldComponentUpdate!=null&&r.shouldComponentUpdate(h,r.__s,k)===!1||e.__v===o.__v)){for(e.__v!==o.__v&&(r.props=h,r.state=r.__s,r.__d=!1),e.__e=o.__e,e.__k=o.__k,e.__k.forEach(function(M){M&&(M.__=e)}),L=0;L<r._sb.length;L++)r.__h.push(r._sb[L]);r._sb=[],r.__h.length&&l.push(r);break e}r.componentWillUpdate!=null&&r.componentWillUpdate(h,r.__s,k),d&&r.componentDidUpdate!=null&&r.__h.push(function(){r.componentDidUpdate(c,g,y)})}if(r.context=k,r.props=h,r.__P=t,r.__e=!1,P=m.__r,K=0,d){for(r.state=r.__s,r.__d=!1,P&&P(e),p=r.render(r.props,r.state,r.context),$=0;$<r._sb.length;$++)r.__h.push(r._sb[$]);r._sb=[]}else do r.__d=!1,P&&P(e),p=r.render(r.props,r.state,r.context),r.state=r.__s;while(r.__d&&++K<25);r.state=r.__s,r.getChildContext!=null&&(_=w(w({},_),r.getChildContext())),d&&!f&&r.getSnapshotBeforeUpdate!=null&&(y=r.getSnapshotBeforeUpdate(c,g)),_e(t,B(F=p!=null&&p.type===G&&p.key==null?p.props.children:p)?F:[F],e,o,_,i,n,l,u,a,s),r.base=e.__e,e.__u&=-161,r.__h.length&&l.push(r),v&&(r.__E=r.__=null)}catch(M){e.__v=null,a||n!=null?(e.__e=u,e.__u|=a?160:32,n[n.indexOf(u)]=null):(e.__e=o.__e,e.__k=o.__k),m.__e(M,e,o)}else n==null&&e.__v===o.__v?(e.__k=o.__k,e.__e=o.__e):e.__e=ge(o.__e,e,o,_,i,n,l,a,s);(p=m.diffed)&&p(e)}function me(t,e,o){e.__d=void 0;for(var _=0;_<o.length;_++)J(o[_],o[++_],o[++_]);m.__c&&m.__c(e,t),t.some(function(i){try{t=i.__h,i.__h=[],t.some(function(n){n.call(i)})}catch(n){m.__e(n,i.__v)}})}function ge(t,e,o,_,i,n,l,u,a){var s,p,r,f,c,g,y,v=o.props,h=e.props,d=e.type;if(d==="svg"?i="http://www.w3.org/2000/svg":d==="math"?i="http://www.w3.org/1998/Math/MathML":i||(i="http://www.w3.org/1999/xhtml"),n!=null){for(s=0;s<n.length;s++)if((c=n[s])&&"setAttribute"in c==!!d&&(d?c.localName===d:c.nodeType===3)){t=c,n[s]=null;break}}if(t==null){if(d===null)return document.createTextNode(h);t=document.createElementNS(i,d,h.is&&h),n=null,u=!1}if(d===null)v===h||u&&t.data===h||(t.data=h);else{if(n=n&&O.call(t.childNodes),v=o.props||N,!u&&n!=null)for(v={},s=0;s<t.attributes.length;s++)v[(c=t.attributes[s]).name]=c.value;for(s in v)if(c=v[s],s!="children"){if(s=="dangerouslySetInnerHTML")r=c;else if(s!=="key"&&!(s in h)){if(s=="value"&&"defaultValue"in h||s=="checked"&&"defaultChecked"in h)continue;U(t,s,null,c,i)}}for(s in h)c=h[s],s=="children"?f=c:s=="dangerouslySetInnerHTML"?p=c:s=="value"?g=c:s=="checked"?y=c:s==="key"||u&&typeof c!="function"||v[s]===c||U(t,s,c,v[s],i);if(p)u||r&&(p.__html===r.__html||p.__html===t.innerHTML)||(t.innerHTML=p.__html),e.__k=[];else if(r&&(t.innerHTML=""),_e(t,B(f)?f:[f],e,o,_,d==="foreignObject"?"http://www.w3.org/1999/xhtml":i,n,l,n?n[0]:o.__k&&C(o,0),u,a),n!=null)for(s=n.length;s--;)n[s]!=null&&oe(n[s]);u||(s="value",g!==void 0&&(g!==t[s]||d==="progress"&&!g||d==="option"&&g!==v[s])&&U(t,s,g,v[s],i),s="checked",y!==void 0&&y!==t[s]&&U(t,s,y,v[s],i))}return t}function J(t,e,o){try{typeof t=="function"?t(e):t.current=e}catch(_){m.__e(_,o)}}function j(t,e,o){var _,i;if(m.unmount&&m.unmount(t),(_=t.ref)&&(_.current&&_.current!==t.__e||J(_,null,e)),(_=t.__c)!=null){if(_.componentWillUnmount)try{_.componentWillUnmount()}catch(n){m.__e(n,e)}_.base=_.__P=null}if(_=t.__k)for(i=0;i<_.length;i++)_[i]&&j(_[i],e,o||typeof t.type!="function");o||t.__e==null||oe(t.__e),t.__c=t.__=t.__e=t.__d=void 0}function ve(t,e,o){return this.constructor(t,o)}O=ne.slice,m={__e:function(t,e,o,_){for(var i,n,l;e=e.__;)if((i=e.__c)&&!i.__)try{if((n=i.constructor)&&n.getDerivedStateFromError!=null&&(i.setState(n.getDerivedStateFromError(t)),l=i.__d),i.componentDidCatch!=null&&(i.componentDidCatch(t,_||{}),l=i.__d),l)return i.__E=i}catch(u){t=u}throw t}},ee=0,ce=function(t){return t!=null&&t.constructor==null},T.prototype.setState=function(t,e){var o;o=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=w({},this.state),typeof t=="function"&&(t=t(w({},o),this.props)),t&&w(o,t),t!=null&&this.__v&&(e&&this._sb.push(e),X(this))},T.prototype.forceUpdate=function(t){this.__v&&(this.__e=!0,t&&this.__h.push(t),X(this))},T.prototype.render=G,x=[],te=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,R=function(t,e){return t.__v.__b-e.__v.__b},H.__r=0,q=0,I=Z(!1),A=Z(!0),pe=0;var ae=function(t,e,o,_){var i;e[0]=0;for(var n=1;n<e.length;n++){var l=e[n++],u=e[n]?(e[0]|=l?1:2,o[e[n++]]):e[++n];l===3?_[0]=u:l===4?_[1]=Object.assign(_[1]||{},u):l===5?(_[1]=_[1]||{})[e[++n]]=u:l===6?_[1][e[++n]]+=u+"":l?(i=t.apply(u,ae(t,u,o,["",null])),_.push(i),u[0]?e[0]|=2:(e[n-2]=0,e[n]=i)):_.push(u)}return _},se=new Map;function ue(t){var e=se.get(this);return e||(e=new Map,se.set(this,e)),(e=ae(this,e.get(t)||(e.set(t,e=function(o){for(var _,i,n=1,l="",u="",a=[0],s=function(f){n===1&&(f||(l=l.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?a.push(0,f,l):n===3&&(f||l)?(a.push(3,f,l),n=2):n===2&&l==="..."&&f?a.push(4,f,0):n===2&&l&&!f?a.push(5,0,!0,l):n>=5&&((l||!f&&n===5)&&(a.push(n,0,l,i),n=6),f&&(a.push(n,f,0,i),n=6)),l=""},p=0;p<o.length;p++){p&&(n===1&&s(),s(p));for(var r=0;r<o[p].length;r++)_=o[p][r],n===1?_==="<"?(s(),a=[a],n=3):l+=_:n===4?l==="--"&&_===">"?(n=1,l=""):l=_+l[0]:u?_===u?u="":l+=_:_==='"'||_==="'"?u=_:_===">"?(s(),n=1):n&&(_==="="?(n=5,i=l,l=""):_==="/"&&(n<5||o[p][r+1]===">")?(s(),n===3&&(a=a[0]),n=a,(a=a[0]).push(2,0,n),n=0):_===" "||_==="	"||_===`
`||_==="\r"?(s(),n=2):l+=_),n===3&&l==="!--"&&(n=4,a=a[0])}return s(),a}(t)),e),arguments,[])).length>1?e:e[0]}var W=ue.bind(z);var ye=({navColor:t,navLink:e,children:o})=>W`
    <nav style=${be(t)}>
      <div class="container align-center">
        <img
          height="200px"
          width="1000px"
          style="max-width:100%; margin: 1rem;"
          src="https://raw.githubusercontent.com/sejori/peko/main/example/preactSSR/assets/logo_dark_alpha.webp"
          alt="peko-logo"
        />
        <h1 style="text-align: center;">
          Featherweight <a href="/${e}" style=${ke}>apps</a>
        </h1>
        <h2 style="text-align: center;">on the edge 🐣⚡</h2>
      </div>
    </nav>
    <main style="padding: 1rem;" class="container">${o}</main>
    <footer style=${we}>
      <div class="container row">
        <a style=${E} href="https://github.com/sebringrose/peko">
          <img
            src="https://raw.githubusercontent.com/edent/SuperTinyIcons/master/images/svg/github.svg"
            width="100"
            height="100"
            alt="GitHub"
          />
          Source repo
        </a>
        <a
          class="align-center"
          style=${E}
          href="https://doc.deno.land/https://deno.land/x/peko/mod.ts"
        >
          <img
            src="https://raw.githubusercontent.com/denolib/high-res-deno-logo/master/deno_hr_circle.svg"
            width="100"
            height="100"
            alt="Deno"
          />
          API docs
        </a>
      </div>
      <div class="container row">
        <a style=${E} href="/">Home</a>
        <a style=${E} href="/about">About</a>
      </div>
      <p style="margin: 10px; text-align: center">
        Made by <a href="https://thesebsite.com">Sejori</a>
      </p>
    </footer>
  `,be=t=>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  background-color: ${t};
  padding-bottom: 20px;
`,ke=`
  color: white;
`,we=`
  padding-top: 20px;
`,E=`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  padding: 0px 5px;
  margin-bottom: 1rem;
`,V=ye;var xe=()=>W`
    <${V} navLink="about" navColor="#101727">
      <h2>Features</h2>
      <ul>
        <li>Simple and familiar syntax, supports any modern JS/TS environment.</li>
        <li>Library of request <a href="#handlers">handlers</a>, <a href="#middleware">middleware</a> and <a href="#utils">utils</a>.</li>
        <li>Cascades <a target="_blank" href="https://github.com/sebringrose/peko/blob/main/server.ts">Request Context</a> through middleware stack for data flow and post-response operations.</li>
        <li>100% TypeScript complete with tests.</li>
      </ul>

      <h2>Guides</h2>
      <ol>
        <li><a href="https://github.com/sebringrose/peko/blob/main/react.md">How to build a full-stack React application with Peko and Deno</a></li>
        <li>Want to build a lightweight HTML or Preact app? Check out the <a href="https://github.com/sebringrose/peko/blob/main/examples">examples</a>!</li>
      </ol>

      <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
        <div>
          <h2 id="handlers">Handlers</h2>
          <ul>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/handlers/ssr.ts">Server-side render</a></li>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/handlers/file.ts">Static files</a></li>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/handlers/sse.ts">Server-sent events</a></li>
          </ul>
        </div>

        <div>
          <h2 id="middleware">Middleware</h2>
          <ul>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/middleware/authenticator.ts">JWT verifying</a></li>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/middleware/cacher.ts">Response caching</a></li>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/middleware/logger.ts">Request logging</a></li>
          </ul>
        </div>

        <div>
          <h2 id="utils">Utils</h2>
          <ul>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/utils/Crypto.ts">Crypto - JWT/hashing</a></li>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/utils/Profiler.ts">Profiler</a></li>
          </ul>
        </div>
      </div>
    </${V}>
  `,Re=xe;})();
//# sourceMappingURL=Home.js.map
