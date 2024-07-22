(()=>{var Q,m,ct,Ft,E,st,ft,B,X,z,G,Rt,J={},pt=[],Ot=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,Y=Array.isArray;function C(e,t){for(var n in t)e[n]=t[n];return e}function ht(e){var t=e.parentNode;t&&t.removeChild(e)}function Z(e,t,n){var _,r,o,s={};for(o in t)o=="key"?_=t[o]:o=="ref"?r=t[o]:s[o]=t[o];if(arguments.length>2&&(s.children=arguments.length>3?Q.call(arguments,2):n),typeof e=="function"&&e.defaultProps!=null)for(o in e.defaultProps)s[o]===void 0&&(s[o]=e.defaultProps[o]);return A(e,s,_,r,null)}function A(e,t,n,_,r){var o={type:e,props:t,key:n,ref:_,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:r??++ct,__i:-1,__u:0};return r==null&&m.vnode!=null&&m.vnode(o),o}function tt(e){return e.children}function N(e,t){this.props=e,this.context=t}function $(e,t){if(t==null)return e.__?$(e.__,e.__i+1):null;for(var n;t<e.__k.length;t++)if((n=e.__k[t])!=null&&n.__e!=null)return n.__e;return typeof e.type=="function"?$(e):null}function dt(e){var t,n;if((e=e.__)!=null&&e.__c!=null){for(e.__e=e.__c.base=null,t=0;t<e.__k.length;t++)if((n=e.__k[t])!=null&&n.__e!=null){e.__e=e.__c.base=n.__e;break}return dt(e)}}function lt(e){(!e.__d&&(e.__d=!0)&&E.push(e)&&!M.__r++||st!==m.debounceRendering)&&((st=m.debounceRendering)||ft)(M)}function M(){var e,t,n,_,r,o,s,u;for(E.sort(B);e=E.shift();)e.__d&&(t=E.length,_=void 0,o=(r=(n=e).__v).__e,s=[],u=[],n.__P&&((_=C({},r)).__v=r.__v+1,m.vnode&&m.vnode(_),gt(n.__P,_,r,n.__n,n.__P.namespaceURI,32&r.__u?[o]:null,s,o??$(r),!!(32&r.__u),u),_.__v=r.__v,_.__.__k[_.__i]=_,qt(s,_,u),_.__e!=o&&dt(_)),E.length>t&&E.sort(B));M.__r=0}function mt(e,t,n,_,r,o,s,u,a,l,f){var i,p,c,y,k,b=_&&_.__k||pt,h=t.length;for(n.__d=a,Wt(n,t,b),a=n.__d,i=0;i<h;i++)(c=n.__k[i])!=null&&typeof c!="boolean"&&typeof c!="function"&&(p=c.__i===-1?J:b[c.__i]||J,c.__i=i,gt(e,c,p,r,o,s,u,a,l,f),y=c.__e,c.ref&&p.ref!=c.ref&&(p.ref&&et(p.ref,null,c),f.push(c.ref,c.__c||y,c)),k==null&&y!=null&&(k=y),65536&c.__u||p.__k===c.__k?(a&&typeof c.type=="string"&&!e.contains(a)&&(a=$(p)),a=vt(c,a,e)):typeof c.type=="function"&&c.__d!==void 0?a=c.__d:y&&(a=y.nextSibling),c.__d=void 0,c.__u&=-196609);n.__d=a,n.__e=k}function Wt(e,t,n){var _,r,o,s,u,a=t.length,l=n.length,f=l,i=0;for(e.__k=[],_=0;_<a;_++)s=_+i,(r=e.__k[_]=(r=t[_])==null||typeof r=="boolean"||typeof r=="function"?null:typeof r=="string"||typeof r=="number"||typeof r=="bigint"||r.constructor==String?A(null,r,null,null,null):Y(r)?A(tt,{children:r},null,null,null):r.constructor===void 0&&r.__b>0?A(r.type,r.props,r.key,r.ref?r.ref:null,r.__v):r)!=null?(r.__=e,r.__b=e.__b+1,u=jt(r,n,s,f),r.__i=u,o=null,u!==-1&&(f--,(o=n[u])&&(o.__u|=131072)),o==null||o.__v===null?(u==-1&&i--,typeof r.type!="function"&&(r.__u|=65536)):u!==s&&(u==s-1?i=u-s:u==s+1?i++:u>s?f>a-s?i+=u-s:i--:u<s&&i++,u!==_+i&&(r.__u|=65536))):(o=n[s])&&o.key==null&&o.__e&&!(131072&o.__u)&&(o.__e==e.__d&&(e.__d=$(o)),K(o,o,!1),n[s]=null,f--);if(f)for(_=0;_<l;_++)(o=n[_])!=null&&!(131072&o.__u)&&(o.__e==e.__d&&(e.__d=$(o)),K(o,o))}function vt(e,t,n){var _,r;if(typeof e.type=="function"){for(_=e.__k,r=0;_&&r<_.length;r++)_[r]&&(_[r].__=e,t=vt(_[r],t,n));return t}e.__e!=t&&(n.insertBefore(e.__e,t||null),t=e.__e);do t=t&&t.nextSibling;while(t!=null&&t.nodeType===8);return t}function jt(e,t,n,_){var r=e.key,o=e.type,s=n-1,u=n+1,a=t[n];if(a===null||a&&r==a.key&&o===a.type&&!(131072&a.__u))return n;if(_>(a!=null&&!(131072&a.__u)?1:0))for(;s>=0||u<t.length;){if(s>=0){if((a=t[s])&&!(131072&a.__u)&&r==a.key&&o===a.type)return s;s--}if(u<t.length){if((a=t[u])&&!(131072&a.__u)&&r==a.key&&o===a.type)return u;u++}}return-1}function at(e,t,n){t[0]==="-"?e.setProperty(t,n??""):e[t]=n==null?"":typeof n!="number"||Ot.test(t)?n:n+"px"}function U(e,t,n,_,r){var o;t:if(t==="style")if(typeof n=="string")e.style.cssText=n;else{if(typeof _=="string"&&(e.style.cssText=_=""),_)for(t in _)n&&t in n||at(e.style,t,"");if(n)for(t in n)_&&n[t]===_[t]||at(e.style,t,n[t])}else if(t[0]==="o"&&t[1]==="n")o=t!==(t=t.replace(/(PointerCapture)$|Capture$/i,"$1")),t=t.toLowerCase()in e||t==="onFocusOut"||t==="onFocusIn"?t.toLowerCase().slice(2):t.slice(2),e.l||(e.l={}),e.l[t+o]=n,n?_?n.u=_.u:(n.u=X,e.addEventListener(t,o?G:z,o)):e.removeEventListener(t,o?G:z,o);else{if(r=="http://www.w3.org/2000/svg")t=t.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(t!="width"&&t!="height"&&t!="href"&&t!="list"&&t!="form"&&t!="tabIndex"&&t!="download"&&t!="rowSpan"&&t!="colSpan"&&t!="role"&&t!="popover"&&t in e)try{e[t]=n??"";break t}catch{}typeof n=="function"||(n==null||n===!1&&t[4]!=="-"?e.removeAttribute(t):e.setAttribute(t,t=="popover"&&n==1?"":n))}}function ut(e){return function(t){if(this.l){var n=this.l[t.type+e];if(t.t==null)t.t=X++;else if(t.t<n.u)return;return n(m.event?m.event(t):t)}}}function gt(e,t,n,_,r,o,s,u,a,l){var f,i,p,c,y,k,b,h,d,L,S,D,P,it,I,V,w=t.type;if(t.constructor!==void 0)return null;128&n.__u&&(a=!!(32&n.__u),o=[u=t.__e=n.__e]),(f=m.__b)&&f(t);t:if(typeof w=="function")try{if(h=t.props,d="prototype"in w&&w.prototype.render,L=(f=w.contextType)&&_[f.__c],S=f?L?L.props.value:f.__:_,n.__c?b=(i=t.__c=n.__c).__=i.__E:(d?t.__c=i=new w(h,S):(t.__c=i=new N(h,S),i.constructor=w,i.render=Bt),L&&L.sub(i),i.props=h,i.state||(i.state={}),i.context=S,i.__n=_,p=i.__d=!0,i.__h=[],i._sb=[]),d&&i.__s==null&&(i.__s=i.state),d&&w.getDerivedStateFromProps!=null&&(i.__s==i.state&&(i.__s=C({},i.__s)),C(i.__s,w.getDerivedStateFromProps(h,i.__s))),c=i.props,y=i.state,i.__v=t,p)d&&w.getDerivedStateFromProps==null&&i.componentWillMount!=null&&i.componentWillMount(),d&&i.componentDidMount!=null&&i.__h.push(i.componentDidMount);else{if(d&&w.getDerivedStateFromProps==null&&h!==c&&i.componentWillReceiveProps!=null&&i.componentWillReceiveProps(h,S),!i.__e&&(i.shouldComponentUpdate!=null&&i.shouldComponentUpdate(h,i.__s,S)===!1||t.__v===n.__v)){for(t.__v!==n.__v&&(i.props=h,i.state=i.__s,i.__d=!1),t.__e=n.__e,t.__k=n.__k,t.__k.forEach(function(T){T&&(T.__=t)}),D=0;D<i._sb.length;D++)i.__h.push(i._sb[D]);i._sb=[],i.__h.length&&s.push(i);break t}i.componentWillUpdate!=null&&i.componentWillUpdate(h,i.__s,S),d&&i.componentDidUpdate!=null&&i.__h.push(function(){i.componentDidUpdate(c,y,k)})}if(i.context=S,i.props=h,i.__P=e,i.__e=!1,P=m.__r,it=0,d){for(i.state=i.__s,i.__d=!1,P&&P(t),f=i.render(i.props,i.state,i.context),I=0;I<i._sb.length;I++)i.__h.push(i._sb[I]);i._sb=[]}else do i.__d=!1,P&&P(t),f=i.render(i.props,i.state,i.context),i.state=i.__s;while(i.__d&&++it<25);i.state=i.__s,i.getChildContext!=null&&(_=C(C({},_),i.getChildContext())),d&&!p&&i.getSnapshotBeforeUpdate!=null&&(k=i.getSnapshotBeforeUpdate(c,y)),mt(e,Y(V=f!=null&&f.type===tt&&f.key==null?f.props.children:f)?V:[V],t,n,_,r,o,s,u,a,l),i.base=t.__e,t.__u&=-161,i.__h.length&&s.push(i),b&&(i.__E=i.__=null)}catch(T){t.__v=null,a||o!=null?(t.__e=u,t.__u|=a?160:32,o[o.indexOf(u)]=null):(t.__e=n.__e,t.__k=n.__k),m.__e(T,t,n)}else o==null&&t.__v===n.__v?(t.__k=n.__k,t.__e=n.__e):t.__e=Vt(n.__e,t,n,_,r,o,s,a,l);(f=m.diffed)&&f(t)}function qt(e,t,n){t.__d=void 0;for(var _=0;_<n.length;_++)et(n[_],n[++_],n[++_]);m.__c&&m.__c(t,e),e.some(function(r){try{e=r.__h,r.__h=[],e.some(function(o){o.call(r)})}catch(o){m.__e(o,r.__v)}})}function Vt(e,t,n,_,r,o,s,u,a){var l,f,i,p,c,y,k,b=n.props,h=t.props,d=t.type;if(d==="svg"?r="http://www.w3.org/2000/svg":d==="math"?r="http://www.w3.org/1998/Math/MathML":r||(r="http://www.w3.org/1999/xhtml"),o!=null){for(l=0;l<o.length;l++)if((c=o[l])&&"setAttribute"in c==!!d&&(d?c.localName===d:c.nodeType===3)){e=c,o[l]=null;break}}if(e==null){if(d===null)return document.createTextNode(h);e=document.createElementNS(r,d,h.is&&h),o=null,u=!1}if(d===null)b===h||u&&e.data===h||(e.data=h);else{if(o=o&&Q.call(e.childNodes),b=n.props||J,!u&&o!=null)for(b={},l=0;l<e.attributes.length;l++)b[(c=e.attributes[l]).name]=c.value;for(l in b)if(c=b[l],l!="children"){if(l=="dangerouslySetInnerHTML")i=c;else if(l!=="key"&&!(l in h)){if(l=="value"&&"defaultValue"in h||l=="checked"&&"defaultChecked"in h)continue;U(e,l,null,c,r)}}for(l in h)c=h[l],l=="children"?p=c:l=="dangerouslySetInnerHTML"?f=c:l=="value"?y=c:l=="checked"?k=c:l==="key"||u&&typeof c!="function"||b[l]===c||U(e,l,c,b[l],r);if(f)u||i&&(f.__html===i.__html||f.__html===e.innerHTML)||(e.innerHTML=f.__html),t.__k=[];else if(i&&(e.innerHTML=""),mt(e,Y(p)?p:[p],t,n,_,d==="foreignObject"?"http://www.w3.org/1999/xhtml":r,o,s,o?o[0]:n.__k&&$(n,0),u,a),o!=null)for(l=o.length;l--;)o[l]!=null&&ht(o[l]);u||(l="value",y!==void 0&&(y!==e[l]||d==="progress"&&!y||d==="option"&&y!==b[l])&&U(e,l,y,b[l],r),l="checked",k!==void 0&&k!==e[l]&&U(e,l,k,b[l],r))}return e}function et(e,t,n){try{typeof e=="function"?e(t):e.current=t}catch(_){m.__e(_,n)}}function K(e,t,n){var _,r;if(m.unmount&&m.unmount(e),(_=e.ref)&&(_.current&&_.current!==e.__e||et(_,null,t)),(_=e.__c)!=null){if(_.componentWillUnmount)try{_.componentWillUnmount()}catch(o){m.__e(o,t)}_.base=_.__P=null}if(_=e.__k)for(r=0;r<_.length;r++)_[r]&&K(_[r],t,n||typeof e.type!="function");n||e.__e==null||ht(e.__e),e.__c=e.__=e.__e=e.__d=void 0}function Bt(e,t,n){return this.constructor(e,n)}Q=pt.slice,m={__e:function(e,t,n,_){for(var r,o,s;t=t.__;)if((r=t.__c)&&!r.__)try{if((o=r.constructor)&&o.getDerivedStateFromError!=null&&(r.setState(o.getDerivedStateFromError(e)),s=r.__d),r.componentDidCatch!=null&&(r.componentDidCatch(e,_||{}),s=r.__d),s)return r.__E=r}catch(u){e=u}throw e}},ct=0,Ft=function(e){return e!=null&&e.constructor==null},N.prototype.setState=function(e,t){var n;n=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=C({},this.state),typeof e=="function"&&(e=e(C({},n),this.props)),e&&C(n,e),e!=null&&this.__v&&(t&&this._sb.push(t),lt(this))},N.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),lt(this))},N.prototype.render=tt,E=[],ft=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,B=function(e,t){return e.__v.__b-t.__v.__b},M.__r=0,X=0,z=ut(!1),G=ut(!0),Rt=0;var bt=function(e,t,n,_){var r;t[0]=0;for(var o=1;o<t.length;o++){var s=t[o++],u=t[o]?(t[0]|=s?1:2,n[t[o++]]):t[++o];s===3?_[0]=u:s===4?_[1]=Object.assign(_[1]||{},u):s===5?(_[1]=_[1]||{})[t[++o]]=u:s===6?_[1][t[++o]]+=u+"":s?(r=e.apply(u,bt(e,u,n,["",null])),_.push(r),u[0]?t[0]|=2:(t[o-2]=0,t[o]=r)):_.push(u)}return _},yt=new Map;function kt(e){var t=yt.get(this);return t||(t=new Map,yt.set(this,t)),(t=bt(this,t.get(e)||(t.set(e,t=function(n){for(var _,r,o=1,s="",u="",a=[0],l=function(p){o===1&&(p||(s=s.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?a.push(0,p,s):o===3&&(p||s)?(a.push(3,p,s),o=2):o===2&&s==="..."&&p?a.push(4,p,0):o===2&&s&&!p?a.push(5,0,!0,s):o>=5&&((s||!p&&o===5)&&(a.push(o,0,s,r),o=6),p&&(a.push(o,p,0,r),o=6)),s=""},f=0;f<n.length;f++){f&&(o===1&&l(),l(f));for(var i=0;i<n[f].length;i++)_=n[f][i],o===1?_==="<"?(l(),a=[a],o=3):s+=_:o===4?s==="--"&&_===">"?(o=1,s=""):s=_+s[0]:u?_===u?u="":s+=_:_==='"'||_==="'"?u=_:_===">"?(l(),o=1):o&&(_==="="?(o=5,r=s,s=""):_==="/"&&(o<5||n[f][i+1]===">")?(l(),o===3&&(a=a[0]),o=a,(a=a[0]).push(2,0,o),o=0):_===" "||_==="	"||_===`
`||_==="\r"?(l(),o=2):s+=_),o===3&&s==="!--"&&(o=4,a=a[0])}return l(),a}(e)),t),arguments,[])).length>1?t:t[0]}var x=kt.bind(Z);var zt=({navColor:e,navLink:t,children:n})=>x`
    <nav style=${Gt(e)}>
      <div class="container align-center">
        <img
          height="200px"
          width="1000px"
          style="max-width:100%; margin: 1rem;"
          src="https://raw.githubusercontent.com/sejori/peko/main/example/preactSSR/assets/logo_dark_alpha.webp"
          alt="peko-logo"
        />
        <h1 style="text-align: center;">
          Featherweight <a href="/${t}" style=${Jt}>apps</a>
        </h1>
        <h2 style="text-align: center;">on the edge 🐣⚡</h2>
      </div>
    </nav>
    <main style="padding: 1rem;" class="container">${n}</main>
    <footer style=${Kt}>
      <div class="container row">
        <a style=${F} href="https://github.com/sebringrose/peko">
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
          style=${F}
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
        <a style=${F} href="/">Home</a>
        <a style=${F} href="/about">About</a>
      </div>
      <p style="margin: 10px; text-align: center">
        Made by <a href="https://thesebsite.com">Sejori</a>
      </p>
    </footer>
  `,Gt=e=>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  background-color: ${e};
  padding-bottom: 20px;
`,Jt=`
  color: white;
`,Kt=`
  padding-top: 20px;
`,F=`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  padding: 0px 5px;
  margin-bottom: 1rem;
`,nt=zt;var O,v,_t,wt,ot=0,Pt=[],g=m,xt=g.__b,St=g.__r,Ct=g.diffed,Et=g.__c,$t=g.unmount,Ht=g.__;function Nt(e,t){g.__h&&g.__h(v,e,ot||t),ot=0;var n=v.__H||(v.__H={__:[],__h:[]});return e>=n.__.length&&n.__.push({}),n.__[e]}function H(e){return ot=1,Qt(Dt,e)}function Qt(e,t,n){var _=Nt(O++,2);if(_.t=e,!_.__c&&(_.__=[n?n(t):Dt(void 0,t),function(u){var a=_.__N?_.__N[0]:_.__[0],l=_.t(a,u);a!==l&&(_.__N=[l,_.__[1]],_.__c.setState({}))}],_.__c=v,!v.u)){var r=function(u,a,l){if(!_.__c.__H)return!0;var f=_.__c.__H.__.filter(function(p){return!!p.__c});if(f.every(function(p){return!p.__N}))return!o||o.call(this,u,a,l);var i=!1;return f.forEach(function(p){if(p.__N){var c=p.__[0];p.__=p.__N,p.__N=void 0,c!==p.__[0]&&(i=!0)}}),!(!i&&_.__c.props===u)&&(!o||o.call(this,u,a,l))};v.u=!0;var o=v.shouldComponentUpdate,s=v.componentWillUpdate;v.componentWillUpdate=function(u,a,l){if(this.__e){var f=o;o=void 0,r(u,a,l),o=f}s&&s.call(this,u,a,l)},v.shouldComponentUpdate=r}return _.__N||_.__}function W(e,t){var n=Nt(O++,3);!g.__s&&Zt(n.__H,t)&&(n.__=e,n.i=t,v.__H.__h.push(n))}function Xt(){for(var e;e=Pt.shift();)if(e.__P&&e.__H)try{e.__H.__h.forEach(R),e.__H.__h.forEach(rt),e.__H.__h=[]}catch(t){e.__H.__h=[],g.__e(t,e.__v)}}g.__b=function(e){v=null,xt&&xt(e)},g.__=function(e,t){e&&t.__k&&t.__k.__m&&(e.__m=t.__k.__m),Ht&&Ht(e,t)},g.__r=function(e){St&&St(e),O=0;var t=(v=e.__c).__H;t&&(_t===v?(t.__h=[],v.__h=[],t.__.forEach(function(n){n.__N&&(n.__=n.__N),n.i=n.__N=void 0})):(t.__h.forEach(R),t.__h.forEach(rt),t.__h=[],O=0)),_t=v},g.diffed=function(e){Ct&&Ct(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&(Pt.push(t)!==1&&wt===g.requestAnimationFrame||((wt=g.requestAnimationFrame)||Yt)(Xt)),t.__H.__.forEach(function(n){n.i&&(n.__H=n.i),n.i=void 0})),_t=v=null},g.__c=function(e,t){t.some(function(n){try{n.__h.forEach(R),n.__h=n.__h.filter(function(_){return!_.__||rt(_)})}catch(_){t.some(function(r){r.__h&&(r.__h=[])}),t=[],g.__e(_,n.__v)}}),Et&&Et(e,t)},g.unmount=function(e){$t&&$t(e);var t,n=e.__c;n&&n.__H&&(n.__H.__.forEach(function(_){try{R(_)}catch(r){t=r}}),n.__H=void 0,t&&g.__e(t,n.__v))};var Lt=typeof requestAnimationFrame=="function";function Yt(e){var t,n=function(){clearTimeout(_),Lt&&cancelAnimationFrame(t),setTimeout(e)},_=setTimeout(n,100);Lt&&(t=requestAnimationFrame(n))}function R(e){var t=v,n=e.__c;typeof n=="function"&&(e.__c=void 0,n()),v=t}function rt(e){var t=v;e.__c=e.__(),v=t}function Zt(e,t){return!e||e.length!==t.length||t.some(function(n,_){return n!==e[_]})}function Dt(e,t){return typeof t=="function"?t(e):t}var te=({data:e})=>{let[t,n]=H(0),_=()=>{n(t+1)};return x`
    <div>
      <ul>
        ${e&&e.map(r=>x`
            <li>${r}: <button onClick=${_}>Click me</button></li>
          `)}
      </ul>
      <p>
        <strong>${t} ${t===1?"click":"clicks"} counted</strong>
      </p>
    </div>
  `},It=te;var j={dataArray:["Item 0","Item 1","Item 2"]},q={};Object.keys(j).forEach(e=>q[e]=[]);var Tt=e=>{if(typeof localStorage>"u")return H(j[e]);let[t,n]=H(ee(e));return q[e].push(n),W(()=>{try{ne(e,t)}catch(_){console.log(_)}return()=>q[e].filter(_=>_!==n)},[t]),[t,n]},Ut=()=>{let e=localStorage.getItem("localState");return e?{...j,...JSON.parse(e)}:j},ee=e=>{let t=Ut();if(t[e])return t[e];throw new Error(`Key "${e}" does not exist in localState. Make sure it is added to initialState in /src/hooks/localstate.js.`)},ne=(e,t)=>(q[e].forEach(n=>n(t)),localStorage.setItem("localState",JSON.stringify({...Ut(),[e]:t})));var _e=()=>{let[e,t]=Tt("dataArray"),[n,_]=H(0);return W(()=>{let r=new EventSource("/sse");return r.onmessage=o=>{let s=JSON.parse(o.data);_(s.detail),console.log(o)},r.onerror=o=>{r.close(),console.log(o)},document.body.addEventListener("unload",()=>r.close()),()=>r.close()},[]),x`
    <div style="margin: 2rem 0;">
      <p><strong>Latest random number from server: </strong> ${n}</p>

      <${It} data=${e} />

      <button
        style=${At}
        onClick=${()=>t(r=>[...r,`Item ${r.length}`])}
      >
        add item
      </button>
      <button
        style=${At}
        onClick=${()=>t(r=>r.slice(0,r.length-1))}
      >
        remove item
      </button>
    </div>
  `},At=`
    margin: 0.5rem;  
    padding: 0.5rem;
    font-size: 1rem;
`,Mt=_e;var oe=e=>x`
    <${nt} navLink="" navColor="blueviolet">
      <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
        <p style="margin:5px"><strong>Request time:</strong> ${e.request_time}</p>
        <p style="margin:5px"><strong>Hydration time:</strong> ${Date.now()}</p>
        <p style="margin:5px"><strong>Served from:</strong> ${e.DENO_REGION?e.DENO_REGION:"localhost"}</p>
      </div>

      <img src="/assets/lighthouse-score.png" alt="lighthouse-score" />

      <p>
        This website is appified with the Preact JavaScript library.
        It even uses localStorage to store state locally between page loads 🤯.
        Check out the 👉 <a href="https://github.com/sejori/peko/tree/main/example/preactSSR">source code here</a> 👈.
      </p>

      <${Mt} />
    </${nt}>
  `,Ne=oe;})();
//# sourceMappingURL=About.js.map
