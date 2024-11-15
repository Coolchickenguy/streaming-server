var S={MEDIA_PLAY_REQUEST:"mediaplayrequest",MEDIA_PAUSE_REQUEST:"mediapauserequest",MEDIA_MUTE_REQUEST:"mediamuterequest",MEDIA_UNMUTE_REQUEST:"mediaunmuterequest",MEDIA_VOLUME_REQUEST:"mediavolumerequest",MEDIA_SEEK_REQUEST:"mediaseekrequest",MEDIA_AIRPLAY_REQUEST:"mediaairplayrequest",MEDIA_ENTER_FULLSCREEN_REQUEST:"mediaenterfullscreenrequest",MEDIA_EXIT_FULLSCREEN_REQUEST:"mediaexitfullscreenrequest",MEDIA_PREVIEW_REQUEST:"mediapreviewrequest",MEDIA_ENTER_PIP_REQUEST:"mediaenterpiprequest",MEDIA_EXIT_PIP_REQUEST:"mediaexitpiprequest",MEDIA_ENTER_CAST_REQUEST:"mediaentercastrequest",MEDIA_EXIT_CAST_REQUEST:"mediaexitcastrequest",MEDIA_SHOW_TEXT_TRACKS_REQUEST:"mediashowtexttracksrequest",MEDIA_HIDE_TEXT_TRACKS_REQUEST:"mediahidetexttracksrequest",MEDIA_SHOW_SUBTITLES_REQUEST:"mediashowsubtitlesrequest",MEDIA_DISABLE_SUBTITLES_REQUEST:"mediadisablesubtitlesrequest",MEDIA_TOGGLE_SUBTITLES_REQUEST:"mediatogglesubtitlesrequest",MEDIA_PLAYBACK_RATE_REQUEST:"mediaplaybackraterequest",MEDIA_RENDITION_REQUEST:"mediarenditionrequest",MEDIA_AUDIO_TRACK_REQUEST:"mediaaudiotrackrequest",MEDIA_SEEK_TO_LIVE_REQUEST:"mediaseektoliverequest",REGISTER_MEDIA_STATE_RECEIVER:"registermediastatereceiver",UNREGISTER_MEDIA_STATE_RECEIVER:"unregistermediastatereceiver"},P={MEDIA_CHROME_ATTRIBUTES:"mediachromeattributes",MEDIA_CONTROLLER:"mediacontroller"},fa={MEDIA_AIRPLAY_UNAVAILABLE:"mediaAirplayUnavailable",MEDIA_FULLSCREEN_UNAVAILABLE:"mediaFullscreenUnavailable",MEDIA_PIP_UNAVAILABLE:"mediaPipUnavailable",MEDIA_CAST_UNAVAILABLE:"mediaCastUnavailable",MEDIA_RENDITION_UNAVAILABLE:"mediaRenditionUnavailable",MEDIA_AUDIO_TRACK_UNAVAILABLE:"mediaAudioTrackUnavailable",MEDIA_WIDTH:"mediaWidth",MEDIA_HEIGHT:"mediaHeight",MEDIA_PAUSED:"mediaPaused",MEDIA_HAS_PLAYED:"mediaHasPlayed",MEDIA_ENDED:"mediaEnded",MEDIA_MUTED:"mediaMuted",MEDIA_VOLUME_LEVEL:"mediaVolumeLevel",MEDIA_VOLUME:"mediaVolume",MEDIA_VOLUME_UNAVAILABLE:"mediaVolumeUnavailable",MEDIA_IS_PIP:"mediaIsPip",MEDIA_IS_CASTING:"mediaIsCasting",MEDIA_IS_AIRPLAYING:"mediaIsAirplaying",MEDIA_SUBTITLES_LIST:"mediaSubtitlesList",MEDIA_SUBTITLES_SHOWING:"mediaSubtitlesShowing",MEDIA_IS_FULLSCREEN:"mediaIsFullscreen",MEDIA_PLAYBACK_RATE:"mediaPlaybackRate",MEDIA_CURRENT_TIME:"mediaCurrentTime",MEDIA_DURATION:"mediaDuration",MEDIA_SEEKABLE:"mediaSeekable",MEDIA_PREVIEW_TIME:"mediaPreviewTime",MEDIA_PREVIEW_IMAGE:"mediaPreviewImage",MEDIA_PREVIEW_COORDS:"mediaPreviewCoords",MEDIA_PREVIEW_CHAPTER:"mediaPreviewChapter",MEDIA_LOADING:"mediaLoading",MEDIA_BUFFERED:"mediaBuffered",MEDIA_STREAM_TYPE:"mediaStreamType",MEDIA_TARGET_LIVE_WINDOW:"mediaTargetLiveWindow",MEDIA_TIME_IS_LIVE:"mediaTimeIsLive",MEDIA_RENDITION_LIST:"mediaRenditionList",MEDIA_RENDITION_SELECTED:"mediaRenditionSelected",MEDIA_AUDIO_TRACK_LIST:"mediaAudioTrackList",MEDIA_AUDIO_TRACK_ENABLED:"mediaAudioTrackEnabled",MEDIA_CHAPTERS_CUES:"mediaChaptersCues"},hi=Object.entries(fa),n=hi.reduce((e,[t,i])=>(e[t]=i.toLowerCase(),e),{}),Ta={USER_INACTIVE:"userinactivechange",BREAKPOINTS_CHANGE:"breakpointchange",BREAKPOINTS_COMPUTED:"breakpointscomputed"},mi=hi.reduce((e,[t,i])=>(e[t]=i.toLowerCase(),e),{...Ta}),za=Object.entries(mi).reduce((e,[t,i])=>{let a=n[t];return a&&(e[i]=a),e},{userinactivechange:"userinactive"}),Xa=Object.entries(n).reduce((e,[t,i])=>{let a=mi[t];return a&&(e[i]=a),e},{userinactive:"userinactivechange"}),pt={SUBTITLES:"subtitles",CAPTIONS:"captions",DESCRIPTIONS:"descriptions",CHAPTERS:"chapters",METADATA:"metadata"};var pi=class{addEventListener(){}removeEventListener(){}dispatchEvent(){return!0}},Ei=class extends pi{},ci=class extends Ei{constructor(){super(...arguments),this.role=null}},Sa=class{observe(){}unobserve(){}disconnect(){}},vi={createElement:function(){return new me.HTMLElement},createElementNS:function(){return new me.HTMLElement},addEventListener(){},removeEventListener(){},dispatchEvent(e){return!1}},me={ResizeObserver:Sa,document:vi,Node:Ei,Element:ci,HTMLElement:class extends ci{constructor(){super(...arguments),this.innerHTML=""}get content(){return new me.DocumentFragment}},DocumentFragment:class extends pi{},customElements:{get:function(){},define:function(){},whenDefined:function(){}},localStorage:{getItem(e){return null},setItem(e,t){},removeItem(e){}},CustomEvent:function(){},getComputedStyle:function(){},navigator:{languages:[],get userAgent(){return""}},matchMedia(e){return{matches:!1,media:e}}},Ai=typeof window>"u"||typeof window.customElements>"u",bi=Object.keys(me).every(e=>e in globalThis),r=Ai&&!bi?me:globalThis,u=Ai&&!bi?vi:globalThis.document;function gi({anchor:e,floating:t,placement:i}){let a=ka({anchor:e,floating:t}),{x:s,y:o}=Ma(a,i);return{x:s,y:o}}function ka({anchor:e,floating:t}){return{anchor:Ia(e,t.offsetParent),floating:{x:0,y:0,width:t.offsetWidth,height:t.offsetHeight}}}function Ia(e,t){var i;let a=e.getBoundingClientRect(),s=(i=t?.getBoundingClientRect())!=null?i:{x:0,y:0};return{x:a.x-s.x,y:a.y-s.y,width:a.width,height:a.height}}function Ma({anchor:e,floating:t},i){let a=ya(i)==="x"?"y":"x",s=a==="y"?"height":"width",o=fi(i),d=e.x+e.width/2-t.width/2,c=e.y+e.height/2-t.height/2,Q=e[s]/2-t[s]/2,g;switch(o){case"top":g={x:d,y:e.y-t.height};break;case"bottom":g={x:d,y:e.y+e.height};break;case"right":g={x:e.x+e.width,y:c};break;case"left":g={x:e.x-t.width,y:c};break;default:g={x:e.x,y:e.y}}switch(i.split("-")[1]){case"start":g[a]-=Q;break;case"end":g[a]+=Q;break}return g}function fi(e){return e.split("-")[0]}function ya(e){return["top","bottom"].includes(fi(e))?"y":"x"}var Ti=new WeakMap,Et=e=>{let t=Ti.get(e);return t||Ti.set(e,t=new Set),t},Si=new r.ResizeObserver(e=>{for(let t of e)for(let i of Et(t.target))i(t)});function ce(e,t){Et(e).add(t),Si.observe(e)}function pe(e,t){let i=Et(e);i.delete(t),i.size||Si.unobserve(e)}var F=class extends Event{constructor({action:e="auto",relatedTarget:t,...i}){super("invoke",i),this.action=e,this.relatedTarget=t}},ki=class extends Event{constructor({newState:e,oldState:t,...i}){super("toggle",i),this.newState=e,this.oldState=t}};function p(e){var t;return(t=De(e))!=null?t:xe(e,"media-controller")}function De(e){var t;let{MEDIA_CONTROLLER:i}=P,a=e.getAttribute(i);if(a)return(t=V(e))==null?void 0:t.getElementById(a)}var Z=(e,t)=>!e||!t?!1:e?.contains(t)?!0:Z(e,t.getRootNode().host),xe=(e,t)=>e?e.closest(t)||xe(e.getRootNode().host,t):null;function vt(e=document){var t;let i=e?.activeElement;return i?(t=vt(i.shadowRoot))!=null?t:i:null}function V(e){var t;let i=(t=e?.getRootNode)==null?void 0:t.call(e);return i instanceof ShadowRoot||i instanceof Document?i:null}function Ii(e,t){return _a(e,a=>a===t)||At(e,t)}function _a(e,t){var i,a;let s;for(s of(i=e.querySelectorAll("style:not([media])"))!=null?i:[]){let o;try{o=(a=s.sheet)==null?void 0:a.cssRules}catch{continue}for(let d of o??[])if(t(d.selectorText))return d}}function At(e,t){var i,a;let s=(i=e.querySelectorAll("style:not([media])"))!=null?i:[],o=s?.[s.length-1];return o?.sheet?(o?.sheet.insertRule(`${t}{}`,o.sheet.cssRules.length),(a=o.sheet.cssRules)==null?void 0:a[o.sheet.cssRules.length-1]):(console.warn("Media Chrome: No style sheet found on style tag of",e),{style:{setProperty:()=>{},removeProperty:()=>"",getPropertyValue:()=>""}})}function k(e,t,i=Number.NaN){let a=e.getAttribute(t);return a!=null?+a:i}function _(e,t,i){let a=+i;if(i==null||Number.isNaN(a)){e.hasAttribute(t)&&e.removeAttribute(t);return}k(e,t,void 0)!==a&&e.setAttribute(t,`${a}`)}function I(e,t,i=null){var a;return(a=e.getAttribute(t))!=null?a:i}function C(e,t,i){if(i==null){e.hasAttribute(t)&&e.removeAttribute(t);return}let a=`${i}`;I(e,t,void 0)!==a&&e.setAttribute(t,a)}var Lt=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},l=(e,t,i)=>(Lt(e,t,"read from private field"),i?i.call(e):t.get(e)),h=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},L=(e,t,i,a)=>(Lt(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),m=(e,t,i)=>(Lt(e,t,"access private method"),i),R,Y,W,Ne,Ue,$,Ae,bt,Mi,Be,Pe,gt,ft,yi,Tt,_i,St,Ci,j,z,X,be,We,Rt,kt,Li,wt,Ri,It,wi,Dt,Di,Mt,xi,yt,Ni,Ee,He,_t,Ui,ve,Ke,Oe,Ct;function w({type:e,text:t,value:i,checked:a}){let s=u.createElement("media-chrome-menu-item");s.type=e??"",s.part.add("menu-item"),e&&s.part.add(e),s.value=i,s.checked=a;let o=u.createElement("span");return o.textContent=t,s.append(o),s}function M(e,t){let i=e.querySelector(`:scope > [slot="${t}"]`);if(i?.nodeName=="SLOT"&&(i=i.assignedElements({flatten:!0})[0]),i)return i=i.cloneNode(!0),i;let a=e.shadowRoot.querySelector(`[name="${t}"] > svg`);return a?a.cloneNode(!0):""}var Pi=u.createElement("template");Pi.innerHTML=`
  <style>
    :host {
      font: var(--media-font,
        var(--media-font-weight, normal)
        var(--media-font-size, 14px) /
        var(--media-text-content-height, var(--media-control-height, 24px))
        var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
      color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
      background: var(--media-menu-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .8))));
      border-radius: var(--media-menu-border-radius);
      border: var(--media-menu-border, none);
      display: var(--media-menu-display, inline-flex);
      transition: var(--media-menu-transition-in,
        visibility 0s,
        opacity .2s ease-out,
        transform .15s ease-out,
        left .2s ease-in-out,
        min-width .2s ease-in-out,
        min-height .2s ease-in-out
      ) !important;
      
      visibility: var(--media-menu-visibility, visible);
      opacity: var(--media-menu-opacity, 1);
      max-height: var(--media-menu-max-height, var(--_menu-max-height, 300px));
      transform: var(--media-menu-transform-in, translateY(0) scale(1));
      flex-direction: column;
      
      min-height: 0;
      position: relative;
      bottom: var(--_menu-bottom);
      box-sizing: border-box;
    }

    :host([hidden]) {
      transition: var(--media-menu-transition-out,
        visibility .15s ease-in,
        opacity .15s ease-in,
        transform .15s ease-in
      ) !important;
      visibility: var(--media-menu-hidden-visibility, hidden);
      opacity: var(--media-menu-hidden-opacity, 0);
      max-height: var(--media-menu-hidden-max-height,
        var(--media-menu-max-height, var(--_menu-max-height, 300px)));
      transform: var(--media-menu-transform-out, translateY(2px) scale(.99));
      pointer-events: none;
    }

    :host([slot="submenu"]) {
      background: none;
      width: 100%;
      min-height: 100%;
      position: absolute;
      bottom: 0;
      right: -100%;
    }

    #container {
      display: flex;
      flex-direction: column;
      min-height: 0;
      transition: transform .2s ease-out;
      transform: translate(0, 0);
    }

    #container.has-expanded {
      transition: transform .2s ease-in;
      transform: translate(-100%, 0);
    }

    button {
      background: none;
      color: inherit;
      border: none;
      padding: 0;
      font: inherit;
      outline: inherit;
      display: inline-flex;
      align-items: center;
    }

    slot[name="header"][hidden] {
      display: none;
    }

    slot[name="header"] > *,
    slot[name="header"]::slotted(*) {
      padding: .4em .7em;
      border-bottom: 1px solid rgb(255 255 255 / .25);
      cursor: default;
    }

    slot[name="header"] > button[part~="back"],
    slot[name="header"]::slotted(button[part~="back"]) {
      cursor: pointer;
    }

    svg[part~="back"] {
      height: var(--media-menu-icon-height, var(--media-control-height, 24px));
      fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
      display: block;
      margin-right: .5ch;
    }

    slot:not([name]) {
      gap: var(--media-menu-gap);
      flex-direction: var(--media-menu-flex-direction, column);
      overflow: var(--media-menu-overflow, hidden auto);
      display: flex;
      min-height: 0;
    }

    :host([role="menu"]) slot:not([name]) {
      padding-block: .4em;
    }

    slot:not([name])::slotted([role="menu"]) {
      background: none;
    }

    media-chrome-menu-item > span {
      margin-right: .5ch;
      max-width: var(--media-menu-item-max-width);
      text-overflow: ellipsis;
      overflow: hidden;
    }
  </style>
  <style id="layout-row" media="width:0">

    slot[name="header"] > *,
    slot[name="header"]::slotted(*) {
      padding: .4em .5em;
    }

    slot:not([name]) {
      gap: var(--media-menu-gap, .25em);
      flex-direction: var(--media-menu-flex-direction, row);
      padding-inline: .5em;
    }

    media-chrome-menu-item {
      padding: .3em .5em;
    }

    media-chrome-menu-item[aria-checked="true"] {
      background: var(--media-menu-item-checked-background, rgb(255 255 255 / .2));
    }

    
    media-chrome-menu-item::part(checked-indicator) {
      display: var(--media-menu-item-checked-indicator-display, none);
    }
  </style>
  <div id="container">
    <slot name="header" hidden>
      <button part="back button" aria-label="Back to previous menu">
        <slot name="back-icon">
          <svg aria-hidden="true" viewBox="0 0 20 24" part="back indicator">
            <path d="m11.88 17.585.742-.669-4.2-4.665 4.2-4.666-.743-.669-4.803 5.335 4.803 5.334Z"/>
          </svg>
        </slot>
        <slot name="title"></slot>
      </button>
    </slot>
    <slot></slot>
  </div>
  <slot name="checked-indicator" hidden></slot>
`;var q={STYLE:"style",HIDDEN:"hidden",DISABLED:"disabled",ANCHOR:"anchor"},A=class extends r.HTMLElement{constructor(){super(),h(this,bt),h(this,Pe),h(this,ft),h(this,Tt),h(this,St),h(this,X),h(this,We),h(this,kt),h(this,wt),h(this,It),h(this,Dt),h(this,Mt),h(this,yt),h(this,Ee),h(this,_t),h(this,ve),h(this,Oe),h(this,R,null),h(this,Y,null),h(this,W,null),h(this,Ne,new Set),h(this,Ue,void 0),h(this,$,!1),h(this,Ae,null),h(this,Be,()=>{let e=l(this,Ne),t=new Set(this.items);for(let i of e)t.has(i)||this.dispatchEvent(new CustomEvent("removemenuitem",{detail:i}));for(let i of t)e.has(i)||this.dispatchEvent(new CustomEvent("addmenuitem",{detail:i}));L(this,Ne,t)}),h(this,j,()=>{m(this,X,be).call(this),m(this,We,Rt).call(this,!1)}),h(this,z,()=>{m(this,X,be).call(this)}),this.shadowRoot||(this.attachShadow({mode:"open"}),this.nativeEl=this.constructor.template.content.cloneNode(!0),this.shadowRoot.append(this.nativeEl)),this.container=this.shadowRoot.querySelector("#container"),this.defaultSlot=this.shadowRoot.querySelector("slot:not([name])"),this.shadowRoot.addEventListener("slotchange",this),L(this,Ue,new MutationObserver(l(this,Be))),l(this,Ue).observe(this.defaultSlot,{childList:!0})}static get observedAttributes(){return[q.DISABLED,q.HIDDEN,q.STYLE,q.ANCHOR,P.MEDIA_CONTROLLER]}static formatMenuItemText(e){return e}enable(){this.addEventListener("click",this),this.addEventListener("focusout",this),this.addEventListener("keydown",this),this.addEventListener("invoke",this),this.addEventListener("toggle",this)}disable(){this.removeEventListener("click",this),this.removeEventListener("focusout",this),this.removeEventListener("keyup",this),this.removeEventListener("invoke",this),this.removeEventListener("toggle",this)}handleEvent(e){switch(e.type){case"slotchange":m(this,bt,Mi).call(this,e);break;case"invoke":m(this,ft,yi).call(this,e);break;case"click":m(this,kt,Li).call(this,e);break;case"toggle":m(this,It,wi).call(this,e);break;case"focusout":m(this,Mt,xi).call(this,e);break;case"keydown":m(this,yt,Ni).call(this,e);break}}connectedCallback(){var e,t;L(this,Ae,At(this.shadowRoot,":host")),m(this,Pe,gt).call(this),this.hasAttribute("disabled")||this.enable(),this.role||(this.role="menu"),L(this,R,De(this)),(t=(e=l(this,R))==null?void 0:e.associateElement)==null||t.call(e,this),this.hidden||(ce(ge(this),l(this,j)),ce(this,l(this,z)))}disconnectedCallback(){var e,t;pe(ge(this),l(this,j)),pe(this,l(this,z)),this.disable(),(t=(e=l(this,R))==null?void 0:e.unassociateElement)==null||t.call(e,this),L(this,R,null)}attributeChangedCallback(e,t,i){var a,s,o,d;e===q.HIDDEN&&i!==t?(l(this,$)||L(this,$,!0),this.hidden?m(this,St,Ci).call(this):m(this,Tt,_i).call(this),this.dispatchEvent(new ki({oldState:this.hidden?"open":"closed",newState:this.hidden?"closed":"open",bubbles:!0}))):e===P.MEDIA_CONTROLLER?(t&&((s=(a=l(this,R))==null?void 0:a.unassociateElement)==null||s.call(a,this),L(this,R,null)),i&&this.isConnected&&(L(this,R,De(this)),(d=(o=l(this,R))==null?void 0:o.associateElement)==null||d.call(o,this))):e===q.DISABLED&&i!==t?i==null?this.enable():this.disable():e===q.STYLE&&i!==t&&m(this,Pe,gt).call(this)}formatMenuItemText(e,t){return this.constructor.formatMenuItemText(e,t)}get anchor(){return this.getAttribute("anchor")}set anchor(e){this.setAttribute("anchor",`${e}`)}get anchorElement(){var e;return this.anchor?(e=V(this))==null?void 0:e.querySelector(`#${this.anchor}`):null}get items(){return this.defaultSlot.assignedElements({flatten:!0}).filter(Ca)}get radioGroupItems(){return this.items.filter(e=>e.role==="menuitemradio")}get checkedItems(){return this.items.filter(e=>e.checked)}get value(){var e,t;return(t=(e=this.checkedItems[0])==null?void 0:e.value)!=null?t:""}set value(e){let t=this.items.find(i=>i.value===e);t&&m(this,Oe,Ct).call(this,t)}focus(){if(L(this,Y,vt()),this.items.length){m(this,ve,Ke).call(this,this.items[0]),this.items[0].focus();return}this.querySelector('[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]')?.focus()}handleSelect(e){var t;let i=m(this,Ee,He).call(this,e);i&&(m(this,Oe,Ct).call(this,i,i.type==="checkbox"),l(this,W)&&!this.hidden&&((t=l(this,Y))==null||t.focus(),this.hidden=!0))}get keysUsed(){return["Enter","Escape","Tab"," ","ArrowDown","ArrowUp","Home","End"]}handleMove(e){var t,i;let{key:a}=e,s=this.items,o=(i=(t=m(this,Ee,He).call(this,e))!=null?t:m(this,_t,Ui).call(this))!=null?i:s[0],d=s.indexOf(o),c=Math.max(0,d);a==="ArrowDown"?c++:a==="ArrowUp"?c--:e.key==="Home"?c=0:e.key==="End"&&(c=s.length-1),c<0&&(c=s.length-1),c>s.length-1&&(c=0),m(this,ve,Ke).call(this,s[c]),s[c].focus()}};R=new WeakMap;Y=new WeakMap;W=new WeakMap;Ne=new WeakMap;Ue=new WeakMap;$=new WeakMap;Ae=new WeakMap;bt=new WeakSet;Mi=function(e){let t=e.target;for(let i of t.assignedNodes({flatten:!0}))i.nodeType===3&&i.textContent.trim()===""&&i.remove();if(["header","title"].includes(t.name)){let i=this.shadowRoot.querySelector('slot[name="header"]');i.hidden=t.assignedNodes().length===0}t.name||l(this,Be).call(this)};Be=new WeakMap;Pe=new WeakSet;gt=function(){var e;let t=this.shadowRoot.querySelector("#layout-row"),i=(e=getComputedStyle(this).getPropertyValue("--media-menu-layout"))==null?void 0:e.trim();t.setAttribute("media",i==="row"?"":"width:0")};ft=new WeakSet;yi=function(e){L(this,W,e.relatedTarget),Z(this,e.relatedTarget)||(this.hidden=!this.hidden)};Tt=new WeakSet;_i=function(){var e;(e=l(this,W))==null||e.setAttribute("aria-expanded","true"),this.addEventListener("transitionend",()=>this.focus(),{once:!0}),ce(ge(this),l(this,j)),ce(this,l(this,z))};St=new WeakSet;Ci=function(){var e;(e=l(this,W))==null||e.setAttribute("aria-expanded","false"),pe(ge(this),l(this,j)),pe(this,l(this,z))};j=new WeakMap;z=new WeakMap;X=new WeakSet;be=function(e){if(this.hasAttribute("mediacontroller")&&!this.anchor||this.hidden||!this.anchorElement)return;let{x:t,y:i}=gi({anchor:this.anchorElement,floating:this,placement:"top-start"});e??(e=this.offsetWidth);let a=ge(this).getBoundingClientRect(),s=a.width-t-e,o=a.height-i-this.offsetHeight,{style:d}=l(this,Ae);d.setProperty("position","absolute"),d.setProperty("right",`${Math.max(0,s)}px`),d.setProperty("--_menu-bottom",`${o}px`);let c=getComputedStyle(this),Q=d.getPropertyValue("--_menu-bottom")===c.bottom?o:parseFloat(c.bottom),g=a.height-Q-parseFloat(c.marginBottom);this.style.setProperty("--_menu-max-height",`${g}px`)};We=new WeakSet;Rt=function(e){let t=this.querySelector('[role="menuitem"][aria-haspopup][aria-expanded="true"]'),i=t?.querySelector('[role="menu"]'),{style:a}=l(this,Ae);if(e||a.setProperty("--media-menu-transition-in","none"),i){let s=i.offsetHeight,o=Math.max(i.offsetWidth,t.offsetWidth);this.style.setProperty("min-width",`${o}px`),this.style.setProperty("min-height",`${s}px`),m(this,X,be).call(this,o)}else this.style.removeProperty("min-width"),this.style.removeProperty("min-height"),m(this,X,be).call(this);a.removeProperty("--media-menu-transition-in")};kt=new WeakSet;Li=function(e){var t;if(e.stopPropagation(),e.composedPath().includes(l(this,wt,Ri))){(t=l(this,Y))==null||t.focus(),this.hidden=!0;return}let i=m(this,Ee,He).call(this,e);!i||i.hasAttribute("disabled")||(m(this,ve,Ke).call(this,i),this.handleSelect(e))};wt=new WeakSet;Ri=function(){var e;return(e=this.shadowRoot.querySelector('slot[name="header"]').assignedElements({flatten:!0}))==null?void 0:e.find(t=>t.matches('button[part~="back"]'))};It=new WeakSet;wi=function(e){if(e.target===this)return;m(this,Dt,Di).call(this);let t=Array.from(this.querySelectorAll('[role="menuitem"][aria-haspopup]'));for(let i of t)i.invokeTargetElement!=e.target&&e.newState=="open"&&i.getAttribute("aria-expanded")=="true"&&!i.invokeTargetElement.hidden&&i.invokeTargetElement.dispatchEvent(new F({relatedTarget:i}));for(let i of t)i.setAttribute("aria-expanded",`${!i.submenuElement.hidden}`);m(this,We,Rt).call(this,!0)};Dt=new WeakSet;Di=function(){let e=this.querySelector('[role="menuitem"] > [role="menu"]:not([hidden])');this.container.classList.toggle("has-expanded",!!e)};Mt=new WeakSet;xi=function(e){var t;Z(this,e.relatedTarget)||(l(this,$)&&((t=l(this,Y))==null||t.focus()),l(this,W)&&l(this,W)!==e.relatedTarget&&!this.hidden&&(this.hidden=!0))};yt=new WeakSet;Ni=function(e){var t,i,a,s,o;let{key:d,ctrlKey:c,altKey:Q,metaKey:g}=e;if(!(c||Q||g)&&this.keysUsed.includes(d))if(e.preventDefault(),e.stopPropagation(),d==="Tab"){if(l(this,$)){this.hidden=!0;return}e.shiftKey?(i=(t=this.previousElementSibling)==null?void 0:t.focus)==null||i.call(t):(s=(a=this.nextElementSibling)==null?void 0:a.focus)==null||s.call(a),this.blur()}else d==="Escape"?((o=l(this,Y))==null||o.focus(),l(this,$)&&(this.hidden=!0)):d==="Enter"||d===" "?this.handleSelect(e):this.handleMove(e)};Ee=new WeakSet;He=function(e){return e.composedPath().find(t=>["menuitemradio","menuitemcheckbox"].includes(t.role))};_t=new WeakSet;Ui=function(){return this.items.find(e=>e.tabIndex===0)};ve=new WeakSet;Ke=function(e){for(let t of this.items)t.tabIndex=t===e?0:-1};Oe=new WeakSet;Ct=function(e,t){let i=[...this.checkedItems];e.type==="radio"&&this.radioGroupItems.forEach(a=>a.checked=!1),t?e.checked=!e.checked:e.checked=!0,this.checkedItems.some((a,s)=>a!=i[s])&&this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))};A.template=Pi;function Ca(e){return["menuitem","menuitemradio","menuitemcheckbox"].includes(e?.role)}function ge(e){var t;return(t=e.getAttribute("bounds")?xe(e,`#${e.getAttribute("bounds")}`):p(e)||e.parentElement)!=null?t:e}r.customElements.get("media-chrome-menu")||r.customElements.define("media-chrome-menu",A);var Bt=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},x=(e,t,i)=>(Bt(e,t,"read from private field"),i?i.call(e):t.get(e)),O=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},xt=(e,t,i,a)=>(Bt(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),D=(e,t,i)=>(Bt(e,t,"access private method"),i),Ve,Te,Nt,Oi,Wt,Bi,Ht,Wi,N,J,Se,Ut,Hi,qe,Pt,Ki=u.createElement("template");Ki.innerHTML=`
  <style>
    :host {
      transition: var(--media-menu-item-transition,
        background .15s linear,
        opacity .2s ease-in-out
      );
      outline: var(--media-menu-item-outline, 0);
      outline-offset: var(--media-menu-item-outline-offset, -1px);
      cursor: pointer;
      display: flex;
      align-items: center;
      align-self: stretch;
      justify-self: stretch;
      white-space: nowrap;
      white-space-collapse: collapse;
      text-wrap: nowrap;
      padding: .4em .8em .4em 1em;
    }

    :host(:focus-visible) {
      box-shadow: var(--media-menu-item-focus-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
      outline: var(--media-menu-item-hover-outline, 0);
      outline-offset: var(--media-menu-item-hover-outline-offset,  var(--media-menu-item-outline-offset, -1px));
    }

    :host(:hover) {
      cursor: pointer;
      background: var(--media-menu-item-hover-background, rgb(92 92 102 / .5));
      outline: var(--media-menu-item-hover-outline);
      outline-offset: var(--media-menu-item-hover-outline-offset,  var(--media-menu-item-outline-offset, -1px));
    }

    :host([aria-checked="true"]) {
      background: var(--media-menu-item-checked-background);
    }

    :host([hidden]) {
      display: none;
    }

    :host([disabled]) {
      pointer-events: none;
      color: rgba(255, 255, 255, .3);
    }

    slot:not([name]) {
      width: 100%;
    }

    slot:not([name="submenu"]) {
      display: inline-flex;
      align-items: center;
      transition: inherit;
      opacity: var(--media-menu-item-opacity, 1);
    }

    slot[name="description"] {
      justify-content: end;
    }

    slot[name="description"] > span {
      display: inline-block;
      margin-inline: 1em .2em;
      max-width: var(--media-menu-item-description-max-width, 100px);
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: .8em;
      font-weight: 400;
      text-align: right;
      position: relative;
      top: .04em;
    }

    slot[name="checked-indicator"] {
      display: none;
    }

    :host(:is([role="menuitemradio"],[role="menuitemcheckbox"])) slot[name="checked-indicator"] {
      display: var(--media-menu-item-checked-indicator-display, inline-block);
    }

    
    svg, img, ::slotted(svg), ::slotted(img) {
      height: var(--media-menu-item-icon-height, var(--media-control-height, 24px));
      fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
      display: block;
    }

    
    [part~="indicator"],
    ::slotted([part~="indicator"]) {
      fill: var(--media-menu-item-indicator-fill,
        var(--media-icon-color, var(--media-primary-color, rgb(238 238 238))));
      height: var(--media-menu-item-indicator-height, 1.25em);
      margin-right: .5ch;
    }

    [part~="checked-indicator"] {
      visibility: hidden;
    }

    :host([aria-checked="true"]) [part~="checked-indicator"] {
      visibility: visible;
    }
  </style>
  <slot name="checked-indicator">
    <svg aria-hidden="true" viewBox="0 1 24 24" part="checked-indicator indicator">
      <path d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
    </svg>
  </slot>
  <slot name="prefix"></slot>
  <slot></slot>
  <slot name="description"></slot>
  <slot name="suffix"></slot>
  <slot name="submenu"></slot>
`;var f={TYPE:"type",VALUE:"value",CHECKED:"checked",DISABLED:"disabled"},ee=class extends r.HTMLElement{constructor(){super(),O(this,Nt),O(this,Wt),O(this,Ht),O(this,J),O(this,Ut),O(this,qe),O(this,Ve,!1),O(this,Te,void 0),O(this,N,()=>{var e,t;this.setAttribute("submenusize",`${this.submenuElement.items.length}`);let i=this.shadowRoot.querySelector('slot[name="description"]'),a=(e=this.submenuElement.checkedItems)==null?void 0:e[0],s=(t=a?.dataset.description)!=null?t:a?.text,o=u.createElement("span");o.textContent=s??"",i.replaceChildren(o)}),this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.append(this.constructor.template.content.cloneNode(!0))),this.shadowRoot.addEventListener("slotchange",this)}static get observedAttributes(){return[f.TYPE,f.DISABLED,f.CHECKED,f.VALUE]}enable(){this.hasAttribute("tabindex")||this.setAttribute("tabindex","-1"),fe(this)&&!this.hasAttribute("aria-checked")&&this.setAttribute("aria-checked","false"),this.addEventListener("click",this),this.addEventListener("keydown",this)}disable(){this.removeAttribute("tabindex"),this.removeEventListener("click",this),this.removeEventListener("keydown",this),this.removeEventListener("keyup",this)}handleEvent(e){switch(e.type){case"slotchange":D(this,Nt,Oi).call(this,e);break;case"click":this.handleClick(e);break;case"keydown":D(this,Ut,Hi).call(this,e);break;case"keyup":D(this,J,Se).call(this,e);break}}attributeChangedCallback(e,t,i){e===f.CHECKED&&fe(this)&&!x(this,Ve)?this.setAttribute("aria-checked",i!=null?"true":"false"):e===f.TYPE&&i!==t?this.role="menuitem"+i:e===f.DISABLED&&i!==t&&(i==null?this.enable():this.disable())}connectedCallback(){this.hasAttribute(f.DISABLED)||this.enable(),this.role="menuitem"+this.type,xt(this,Te,Ot(this,this.parentNode)),D(this,qe,Pt).call(this)}disconnectedCallback(){this.disable(),D(this,qe,Pt).call(this),xt(this,Te,null)}get invokeTarget(){return this.getAttribute("invoketarget")}set invokeTarget(e){this.setAttribute("invoketarget",`${e}`)}get invokeTargetElement(){var e;return this.invokeTarget?(e=V(this))==null?void 0:e.querySelector(`#${this.invokeTarget}`):this.submenuElement}get submenuElement(){return this.shadowRoot.querySelector('slot[name="submenu"]').assignedElements({flatten:!0})[0]}get type(){var e;return(e=this.getAttribute(f.TYPE))!=null?e:""}set type(e){this.setAttribute(f.TYPE,`${e}`)}get value(){var e;return(e=this.getAttribute(f.VALUE))!=null?e:this.text}set value(e){this.setAttribute(f.VALUE,e)}get text(){var e;return((e=this.textContent)!=null?e:"").trim()}get checked(){if(fe(this))return this.getAttribute("aria-checked")==="true"}set checked(e){fe(this)&&(xt(this,Ve,!0),this.setAttribute("aria-checked",e?"true":"false"),e?this.part.add("checked"):this.part.remove("checked"))}handleClick(e){fe(this)||this.invokeTargetElement&&Z(this,e.target)&&this.invokeTargetElement.dispatchEvent(new F({relatedTarget:this}))}get keysUsed(){return["Enter"," "]}};Ve=new WeakMap;Te=new WeakMap;Nt=new WeakSet;Oi=function(e){let t=e.target;if(!t?.name)for(let i of t.assignedNodes({flatten:!0}))i instanceof Text&&i.textContent.trim()===""&&i.remove();t.name==="submenu"&&(this.submenuElement?D(this,Wt,Bi).call(this):D(this,Ht,Wi).call(this))};Wt=new WeakSet;Bi=async function(){this.setAttribute("aria-haspopup","menu"),this.setAttribute("aria-expanded",`${!this.submenuElement.hidden}`),this.submenuElement.addEventListener("change",x(this,N)),this.submenuElement.addEventListener("addmenuitem",x(this,N)),this.submenuElement.addEventListener("removemenuitem",x(this,N)),x(this,N).call(this)};Ht=new WeakSet;Wi=function(){this.removeAttribute("aria-haspopup"),this.removeAttribute("aria-expanded"),this.submenuElement.removeEventListener("change",x(this,N)),this.submenuElement.removeEventListener("addmenuitem",x(this,N)),this.submenuElement.removeEventListener("removemenuitem",x(this,N)),x(this,N).call(this)};N=new WeakMap;J=new WeakSet;Se=function(e){let{key:t}=e;if(!this.keysUsed.includes(t)){this.removeEventListener("keyup",D(this,J,Se));return}this.handleClick(e)};Ut=new WeakSet;Hi=function(e){let{metaKey:t,altKey:i,key:a}=e;if(t||i||!this.keysUsed.includes(a)){this.removeEventListener("keyup",D(this,J,Se));return}this.addEventListener("keyup",D(this,J,Se),{once:!0})};qe=new WeakSet;Pt=function(){var e;let t=(e=x(this,Te))==null?void 0:e.radioGroupItems;if(!t)return;let i=t.filter(a=>a.getAttribute("aria-checked")==="true").pop();i||(i=t[0]);for(let a of t)a.setAttribute("aria-checked","false");i?.setAttribute("aria-checked","true")};ee.template=Ki;function fe(e){return e.type==="radio"||e.type==="checkbox"}function Ot(e,t){if(!e)return null;let{host:i}=e.getRootNode();return!t&&i?Ot(e,i):t?.items?t:Ot(t,t?.parentNode)}r.customElements.get("media-chrome-menu-item")||r.customElements.define("media-chrome-menu-item",ee);var Vi=u.createElement("template");Vi.innerHTML=A.template.innerHTML+`
  <style>
    :host {
      background: var(--media-settings-menu-background,
        var(--media-menu-background,
        var(--media-control-background,
        var(--media-secondary-color, rgb(20 20 30 / .8)))));
      min-width: var(--media-settings-menu-min-width, 170px);
      border-radius: 2px 2px 0 0;
      overflow: hidden;
    }

    :host([role="menu"]) {
      
      justify-content: end;
    }

    slot:not([name]) {
      justify-content: var(--media-settings-menu-justify-content);
      flex-direction: var(--media-settings-menu-flex-direction, column);
      overflow: visible;
    }

    #container.has-expanded {
      --media-settings-menu-item-opacity: 0;
    }
  </style>
`;var Kt=class extends A{get anchorElement(){return this.anchor!=="auto"?super.anchorElement:p(this).querySelector("media-settings-menu-button")}};Kt.template=Vi;r.customElements.get("media-settings-menu")||r.customElements.define("media-settings-menu",Kt);var qi,Ye=u.createElement("template");Ye.innerHTML=ee.template.innerHTML+`
  <style>
    slot:not([name="submenu"]) {
      opacity: var(--media-settings-menu-item-opacity, var(--media-menu-item-opacity));
    }

    :host([aria-expanded="true"]:hover) {
      background: transparent;
    }
  </style>
`;(qi=Ye.content)!=null&&qi.querySelector&&(Ye.content.querySelector('slot[name="suffix"]').innerHTML=`
    <svg aria-hidden="true" viewBox="0 0 20 24">
      <path d="m8.12 17.585-.742-.669 4.2-4.665-4.2-4.666.743-.669 4.803 5.335-4.803 5.334Z"/>
    </svg>
  `);var Vt=class extends ee{};Vt.template=Ye;r.customElements.get("media-settings-menu-item")||r.customElements.define("media-settings-menu-item",Vt);var Yt=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},E=(e,t,i)=>(Yt(e,t,"read from private field"),i?i.call(e):t.get(e)),te=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},$e=(e,t,i,a)=>(Yt(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),La=(e,t,i)=>(Yt(e,t,"access private method"),i),U,ae,H,ie,Qe,qt,Yi,Ge={TOOLTIP_PLACEMENT:"tooltipplacement"},$i=u.createElement("template");$i.innerHTML=`
<style>
  :host {
    position: relative;
    font: var(--media-font,
      var(--media-font-weight, bold)
      var(--media-font-size, 14px) /
      var(--media-text-content-height, var(--media-control-height, 24px))
      var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
    color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
    background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
    padding: var(--media-button-padding, var(--media-control-padding, 10px));
    justify-content: var(--media-button-justify-content, center);
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    box-sizing: border-box;
    transition: background .15s linear;
    pointer-events: auto;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  
  :host(:focus-visible) {
    box-shadow: inset 0 0 0 2px rgb(27 127 204 / .9);
    outline: 0;
  }
  
  :host(:where(:focus)) {
    box-shadow: none;
    outline: 0;
  }

  :host(:hover) {
    background: var(--media-control-hover-background, rgba(50 50 70 / .7));
  }

  svg, img, ::slotted(svg), ::slotted(img) {
    width: var(--media-button-icon-width);
    height: var(--media-button-icon-height, var(--media-control-height, 24px));
    transform: var(--media-button-icon-transform);
    transition: var(--media-button-icon-transition);
    fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
    vertical-align: middle;
    max-width: 100%;
    max-height: 100%;
    min-width: 100%;
  }

  media-tooltip {
    
    max-width: 0;
    overflow-x: clip;
    opacity: 0;
    transition: opacity .3s, max-width 0s 9s;
  }

  :host(:hover) media-tooltip,
  :host(:focus-visible) media-tooltip {
    max-width: 100vw;
    opacity: 1;
    transition: opacity .3s;
  }

  :host([notooltip]) slot[name="tooltip"] {
    display: none;
  }
</style>

<slot name="tooltip">
  <media-tooltip part="tooltip" aria-hidden="true">
    <slot name="tooltip-content"></slot>
  </media-tooltip>
</slot>
`;var ke=class extends r.HTMLElement{constructor(e={}){var t;if(super(),te(this,qt),te(this,U,void 0),this.preventClick=!1,this.tooltipEl=null,this.tooltipContent="",te(this,ae,i=>{this.preventClick||this.handleClick(i),setTimeout(E(this,H),0)}),te(this,H,()=>{var i,a;(a=(i=this.tooltipEl)==null?void 0:i.updateXOffset)==null||a.call(i)}),te(this,ie,i=>{let{key:a}=i;if(!this.keysUsed.includes(a)){this.removeEventListener("keyup",E(this,ie));return}this.preventClick||this.handleClick(i)}),te(this,Qe,i=>{let{metaKey:a,altKey:s,key:o}=i;if(a||s||!this.keysUsed.includes(o)){this.removeEventListener("keyup",E(this,ie));return}this.addEventListener("keyup",E(this,ie),{once:!0})}),!this.shadowRoot){this.attachShadow({mode:"open"});let i=$i.content.cloneNode(!0);this.nativeEl=i;let a=e.slotTemplate;a||(a=u.createElement("template"),a.innerHTML=`<slot>${e.defaultContent||""}</slot>`),e.tooltipContent&&(i.querySelector('slot[name="tooltip-content"]').innerHTML=(t=e.tooltipContent)!=null?t:"",this.tooltipContent=e.tooltipContent),this.nativeEl.appendChild(a.content.cloneNode(!0)),this.shadowRoot.appendChild(i)}this.tooltipEl=this.shadowRoot.querySelector("media-tooltip")}static get observedAttributes(){return["disabled",Ge.TOOLTIP_PLACEMENT,P.MEDIA_CONTROLLER]}enable(){this.addEventListener("click",E(this,ae)),this.addEventListener("keydown",E(this,Qe)),this.tabIndex=0}disable(){this.removeEventListener("click",E(this,ae)),this.removeEventListener("keydown",E(this,Qe)),this.removeEventListener("keyup",E(this,ie)),this.tabIndex=-1}attributeChangedCallback(e,t,i){var a,s,o,d,c;e===P.MEDIA_CONTROLLER?(t&&((s=(a=E(this,U))==null?void 0:a.unassociateElement)==null||s.call(a,this),$e(this,U,null)),i&&this.isConnected&&($e(this,U,(o=this.getRootNode())==null?void 0:o.getElementById(i)),(c=(d=E(this,U))==null?void 0:d.associateElement)==null||c.call(d,this))):e==="disabled"&&i!==t?i==null?this.enable():this.disable():e===Ge.TOOLTIP_PLACEMENT&&this.tooltipEl&&i!==t&&(this.tooltipEl.placement=i),E(this,H).call(this)}connectedCallback(){var e,t,i;let{style:a}=Ii(this.shadowRoot,":host");a.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),this.hasAttribute("disabled")||this.enable(),this.setAttribute("role","button");let s=this.getAttribute(P.MEDIA_CONTROLLER);s&&($e(this,U,(e=this.getRootNode())==null?void 0:e.getElementById(s)),(i=(t=E(this,U))==null?void 0:t.associateElement)==null||i.call(t,this)),r.customElements.whenDefined("media-tooltip").then(()=>La(this,qt,Yi).call(this))}disconnectedCallback(){var e,t;this.disable(),(t=(e=E(this,U))==null?void 0:e.unassociateElement)==null||t.call(e,this),$e(this,U,null),this.removeEventListener("mouseenter",E(this,H)),this.removeEventListener("focus",E(this,H)),this.removeEventListener("click",E(this,ae))}get keysUsed(){return["Enter"," "]}get tooltipPlacement(){return I(this,Ge.TOOLTIP_PLACEMENT)}set tooltipPlacement(e){C(this,Ge.TOOLTIP_PLACEMENT,e)}handleClick(e){}};U=new WeakMap;ae=new WeakMap;H=new WeakMap;ie=new WeakMap;Qe=new WeakMap;qt=new WeakSet;Yi=function(){this.addEventListener("mouseenter",E(this,H)),this.addEventListener("focus",E(this,H)),this.addEventListener("click",E(this,ae));let e=this.tooltipPlacement;e&&this.tooltipEl&&(this.tooltipEl.placement=e)};r.customElements.get("media-chrome-button")||r.customElements.define("media-chrome-button",ke);var y=class extends ke{connectedCallback(){super.connectedCallback(),this.invokeTargetElement&&this.setAttribute("aria-haspopup","menu")}get invokeTarget(){return this.getAttribute("invoketarget")}set invokeTarget(e){this.setAttribute("invoketarget",`${e}`)}get invokeTargetElement(){var e;return this.invokeTarget?(e=V(this))==null?void 0:e.querySelector(`#${this.invokeTarget}`):null}handleClick(){var e;(e=this.invokeTargetElement)==null||e.dispatchEvent(new F({relatedTarget:this}))}};r.customElements.get("media-chrome-menu-button")||r.customElements.define("media-chrome-menu-button",y);var T={ENTER_AIRPLAY:"Start airplay",EXIT_AIRPLAY:"Stop airplay",AUDIO_TRACK_MENU:"Audio",CAPTIONS:"Captions",ENABLE_CAPTIONS:"Enable captions",DISABLE_CAPTIONS:"Disable captions",START_CAST:"Start casting",STOP_CAST:"Stop casting",ENTER_FULLSCREEN:"Enter fullscreen mode",EXIT_FULLSCREEN:"Exit fullscreen mode",MUTE:"Mute",UNMUTE:"Unmute",ENTER_PIP:"Enter picture in picture mode",EXIT_PIP:"Enter picture in picture mode",PLAY:"Play",PAUSE:"Pause",PLAYBACK_RATE:"Playback rate",RENDITIONS:"Quality",SEEK_BACKWARD:"Seek backward",SEEK_FORWARD:"Seek forward",SETTINGS:"Settings"},b={AUDIO_PLAYER:()=>"audio player",VIDEO_PLAYER:()=>"video player",VOLUME:()=>"volume",SEEK:()=>"seek",CLOSED_CAPTIONS:()=>"closed captions",PLAYBACK_RATE:({playbackRate:e=1}={})=>`current playback rate ${e}`,PLAYBACK_TIME:()=>"playback time",MEDIA_LOADING:()=>"media loading",SETTINGS:()=>"settings",AUDIO_TRACKS:()=>"audio tracks",QUALITY:()=>"quality"},Ra={PLAY:()=>"play",PAUSE:()=>"pause",MUTE:()=>"mute",UNMUTE:()=>"unmute",ENTER_AIRPLAY:()=>"start airplay",EXIT_AIRPLAY:()=>"stop airplay",ENTER_CAST:()=>"start casting",EXIT_CAST:()=>"stop casting",ENTER_FULLSCREEN:()=>"enter fullscreen mode",EXIT_FULLSCREEN:()=>"exit fullscreen mode",ENTER_PIP:()=>"enter picture in picture mode",EXIT_PIP:()=>"exit picture in picture mode",SEEK_FORWARD_N_SECS:({seekOffset:e=30}={})=>`seek forward ${e} seconds`,SEEK_BACK_N_SECS:({seekOffset:e=30}={})=>`seek back ${e} seconds`,SEEK_LIVE:()=>"seek to live",PLAYING_LIVE:()=>"playing live"},Fs={...b,...Ra};var Gi=u.createElement("template");Gi.innerHTML=`
  <style>
    :host([aria-expanded="true"]) slot[name=tooltip] {
      display: none;
    }
  </style>
  <slot name="icon">
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4.5 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
    </svg>
  </slot>
`;var Qi=class extends y{static get observedAttributes(){return[...super.observedAttributes,"target"]}constructor(){super({slotTemplate:Gi,tooltipContent:T.SETTINGS})}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",b.SETTINGS())}get invokeTargetElement(){return this.invokeTarget!=null?super.invokeTargetElement:p(this).querySelector("media-settings-menu")}};r.customElements.get("media-settings-menu-button")||r.customElements.define("media-settings-menu-button",Qi);function Fi(e){return e?.split(/\s+/).map(wa)}function wa(e){if(e){let[t,i,a]=e.split(":");return{id:t,width:+i,height:+a}}}function Zi(e){return e?.split(/\s+/).map(Da)}function Da(e){if(e){let[t,i,a,s]=e.split(":");return{id:t,kind:i,language:a,label:s}}}var Ft=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ji=(e,t,i)=>(Ft(e,t,"read from private field"),i?i.call(e):t.get(e)),Fe=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},$t=(e,t,i,a)=>(Ft(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),Ze=(e,t,i)=>(Ft(e,t,"access private method"),i),Ie,Xe,je,Gt,ze,Qt,zi=class extends A{constructor(){super(...arguments),Fe(this,je),Fe(this,ze),Fe(this,Ie,[]),Fe(this,Xe,void 0)}static get observedAttributes(){return[...super.observedAttributes,n.MEDIA_AUDIO_TRACK_LIST,n.MEDIA_AUDIO_TRACK_ENABLED,n.MEDIA_AUDIO_TRACK_UNAVAILABLE]}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===n.MEDIA_AUDIO_TRACK_ENABLED&&t!==i?this.value=i:e===n.MEDIA_AUDIO_TRACK_LIST&&t!==i&&($t(this,Ie,Zi(i??"")),Ze(this,je,Gt).call(this))}connectedCallback(){super.connectedCallback(),this.addEventListener("change",Ze(this,ze,Qt))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",Ze(this,ze,Qt))}get anchorElement(){var e;return this.anchor!=="auto"?super.anchorElement:(e=p(this))==null?void 0:e.querySelector("media-audio-track-menu-button")}get mediaAudioTrackList(){return ji(this,Ie)}set mediaAudioTrackList(e){$t(this,Ie,e),Ze(this,je,Gt).call(this)}get mediaAudioTrackEnabled(){var e;return(e=I(this,n.MEDIA_AUDIO_TRACK_ENABLED))!=null?e:""}set mediaAudioTrackEnabled(e){C(this,n.MEDIA_AUDIO_TRACK_ENABLED,e)}};Ie=new WeakMap;Xe=new WeakMap;je=new WeakSet;Gt=function(){if(ji(this,Xe)===JSON.stringify(this.mediaAudioTrackList))return;$t(this,Xe,JSON.stringify(this.mediaAudioTrackList));let e=this.mediaAudioTrackList;this.defaultSlot.textContent="";for(let t of e){let i=this.formatMenuItemText(t.label,t),a=w({type:"radio",text:i,value:`${t.id}`,checked:t.enabled});a.prepend(M(this,"checked-indicator")),this.defaultSlot.append(a)}};ze=new WeakSet;Qt=function(){if(this.value==null)return;let e=new r.CustomEvent(S.MEDIA_AUDIO_TRACK_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(e)};r.customElements.get("media-audio-track-menu")||r.customElements.define("media-audio-track-menu",zi);var xa=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M11 17H9.5V7H11v10Zm-3-3H6.5v-4H8v4Zm6-5h-1.5v6H14V9Zm3 7h-1.5V8H17v8Z"/>
  <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-2 0a8 8 0 1 0-16 0 8 8 0 0 0 16 0Z"/>
</svg>`,Xi=u.createElement("template");Xi.innerHTML=`
  <style>
    :host([aria-expanded="true"]) slot[name=tooltip] {
      display: none;
    }
  </style>
  <slot name="icon">${xa}</slot>
`;var Ji=class extends y{static get observedAttributes(){return[...super.observedAttributes,n.MEDIA_AUDIO_TRACK_ENABLED,n.MEDIA_AUDIO_TRACK_UNAVAILABLE]}constructor(){super({slotTemplate:Xi,tooltipContent:T.AUDIO_TRACK_MENU})}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",b.AUDIO_TRACKS())}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i)}get invokeTargetElement(){var e;return this.invokeTarget!=null?super.invokeTargetElement:(e=p(this))==null?void 0:e.querySelector("media-audio-track-menu")}get mediaAudioTrackEnabled(){var e;return(e=I(this,n.MEDIA_AUDIO_TRACK_ENABLED))!=null?e:""}set mediaAudioTrackEnabled(e){C(this,n.MEDIA_AUDIO_TRACK_ENABLED,e)}};r.customElements.get("media-audio-track-menu-button")||r.customElements.define("media-audio-track-menu-button",Ji);var Na=(e="")=>e.split(/\s+/),Ua=(e="")=>{let[t,i,a]=e.split(":"),s=a?decodeURIComponent(a):void 0;return{kind:t==="cc"?pt.CAPTIONS:pt.SUBTITLES,language:i,label:s}},Je=(e="",t={})=>Na(e).map(i=>{let a=Ua(i);return{...t,...a}});var et=({kind:e,label:t,language:i}={kind:"subtitles"})=>t?`${e==="captions"?"cc":"sb"}:${i}:${encodeURIComponent(t)}`:i,tt=(e=[])=>Array.prototype.map.call(e,et).join(" ");var ea=e=>{var t;return!!((t=e.mediaSubtitlesShowing)!=null&&t.length)||e.hasAttribute(n.MEDIA_SUBTITLES_SHOWING)};var Jt=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},Pa=(e,t,i)=>(Jt(e,t,"read from private field"),i?i.call(e):t.get(e)),Zt=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},Oa=(e,t,i,a)=>(Jt(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),jt=(e,t,i)=>(Jt(e,t,"access private method"),i),at,zt,aa,it,Xt,Ba=`
  <svg aria-hidden="true" viewBox="0 0 26 24" part="captions-indicator indicator">
    <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
  </svg>`,sa=u.createElement("template");sa.innerHTML=A.template.innerHTML+`
  <slot name="captions-indicator" hidden>${Ba}</slot>`;var ei=class extends A{constructor(){super(...arguments),Zt(this,zt),Zt(this,it),Zt(this,at,void 0)}static get observedAttributes(){return[...super.observedAttributes,n.MEDIA_SUBTITLES_LIST,n.MEDIA_SUBTITLES_SHOWING]}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===n.MEDIA_SUBTITLES_LIST&&t!==i?jt(this,zt,aa).call(this):e===n.MEDIA_SUBTITLES_SHOWING&&t!==i&&(this.value=i)}connectedCallback(){super.connectedCallback(),this.addEventListener("change",jt(this,it,Xt))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",jt(this,it,Xt))}get anchorElement(){return this.anchor!=="auto"?super.anchorElement:p(this).querySelector("media-captions-menu-button")}get mediaSubtitlesList(){return ta(this,n.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){ia(this,n.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return ta(this,n.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){ia(this,n.MEDIA_SUBTITLES_SHOWING,e)}};at=new WeakMap;zt=new WeakSet;aa=function(){var e;if(Pa(this,at)===JSON.stringify(this.mediaSubtitlesList))return;Oa(this,at,JSON.stringify(this.mediaSubtitlesList)),this.defaultSlot.textContent="";let t=!this.value,i=w({type:"radio",text:this.formatMenuItemText("Off"),value:"off",checked:t});i.prepend(M(this,"checked-indicator")),this.defaultSlot.append(i);let a=this.mediaSubtitlesList;for(let s of a){let o=w({type:"radio",text:this.formatMenuItemText(s.label,s),value:et(s),checked:this.value==et(s)});o.prepend(M(this,"checked-indicator")),((e=s.kind)!=null?e:"subs")==="captions"&&o.append(M(this,"captions-indicator")),this.defaultSlot.append(o)}};it=new WeakSet;Xt=function(){let e=this.mediaSubtitlesShowing,t=this.getAttribute(n.MEDIA_SUBTITLES_SHOWING),i=this.value!==t;if(e?.length&&i&&this.dispatchEvent(new r.CustomEvent(S.MEDIA_DISABLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0,detail:e})),!this.value||!i)return;let a=new r.CustomEvent(S.MEDIA_SHOW_SUBTITLES_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(a)};ei.template=sa;var ta=(e,t)=>{let i=e.getAttribute(t);return i?Je(i):[]},ia=(e,t,i)=>{if(!i?.length){e.removeAttribute(t);return}let a=tt(i);e.getAttribute(t)!==a&&e.setAttribute(t,a)};r.customElements.get("media-captions-menu")||r.customElements.define("media-captions-menu",ei);var Wa=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},Ha=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},Ka=(e,t,i,a)=>(Wa(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),ti,Va=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,qa=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`,la=u.createElement("template");la.innerHTML=`
  <style>
    :host([aria-checked="true"]) slot[name=off] {
      display: none !important;
    }

    
    :host(:not([aria-checked="true"])) slot[name=on] {
      display: none !important;
    }

    :host([aria-expanded="true"]) slot[name=tooltip] {
      display: none;
    }
  </style>

  <slot name="icon">
    <slot name="on">${Va}</slot>
    <slot name="off">${qa}</slot>
  </slot>
`;var na=e=>{e.setAttribute("aria-checked",ea(e).toString())},da=class extends y{constructor(e={}){super({slotTemplate:la,tooltipContent:T.CAPTIONS,...e}),Ha(this,ti,void 0),Ka(this,ti,!1)}static get observedAttributes(){return[...super.observedAttributes,n.MEDIA_SUBTITLES_LIST,n.MEDIA_SUBTITLES_SHOWING]}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",b.CLOSED_CAPTIONS()),na(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===n.MEDIA_SUBTITLES_SHOWING&&na(this)}get invokeTargetElement(){var e;return this.invokeTarget!=null?super.invokeTargetElement:(e=p(this))==null?void 0:e.querySelector("media-captions-menu")}get mediaSubtitlesList(){return ra(this,n.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){oa(this,n.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return ra(this,n.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){oa(this,n.MEDIA_SUBTITLES_SHOWING,e)}};ti=new WeakMap;var ra=(e,t)=>{let i=e.getAttribute(t);return i?Je(i):[]},oa=(e,t,i)=>{if(!i?.length){e.removeAttribute(t);return}let a=tt(i);e.getAttribute(t)!==a&&e.setAttribute(t,a)};r.customElements.get("media-captions-menu-button")||r.customElements.define("media-captions-menu-button",da);var ua=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},v=(e,t,i)=>(ua(e,t,"read from private field"),i?i.call(e):t.get(e)),Me=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},st=(e,t,i,a)=>(ua(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),se,ne,nt,G,B,K,re=class{constructor(e,t,{defaultValue:i}={defaultValue:void 0}){Me(this,B),Me(this,se,void 0),Me(this,ne,void 0),Me(this,nt,void 0),Me(this,G,new Set),st(this,se,e),st(this,ne,t),st(this,nt,new Set(i))}[Symbol.iterator](){return v(this,B,K).values()}get length(){return v(this,B,K).size}get value(){var e;return(e=[...v(this,B,K)].join(" "))!=null?e:""}set value(e){var t;e!==this.value&&(st(this,G,new Set),this.add(...(t=e?.split(" "))!=null?t:[]))}toString(){return this.value}item(e){return[...v(this,B,K)][e]}values(){return v(this,B,K).values()}forEach(e,t){v(this,B,K).forEach(e,t)}add(...e){var t,i;e.forEach(a=>v(this,G).add(a)),!(this.value===""&&!((t=v(this,se))!=null&&t.hasAttribute(`${v(this,ne)}`)))&&((i=v(this,se))==null||i.setAttribute(`${v(this,ne)}`,`${this.value}`))}remove(...e){var t;e.forEach(i=>v(this,G).delete(i)),(t=v(this,se))==null||t.setAttribute(`${v(this,ne)}`,`${this.value}`)}contains(e){return v(this,B,K).has(e)}toggle(e,t){return typeof t<"u"?t?(this.add(e),!0):(this.remove(e),!1):this.contains(e)?(this.remove(e),!1):(this.add(e),!0)}replace(e,t){return this.remove(e),this.add(t),e===t}};se=new WeakMap;ne=new WeakMap;nt=new WeakMap;G=new WeakMap;B=new WeakSet;K=function(){return v(this,G).size?v(this,G):v(this,nt)};var Ya=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},rt=(e,t,i)=>(Ya(e,t,"read from private field"),i?i.call(e):t.get(e)),$a=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},oe,ii={RATES:"rates"},ai=[1,1.2,1.5,1.7,2],le=1,ha=u.createElement("template");ha.innerHTML=`
  <style>
    :host {
      min-width: 5ch;
      padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
    }
  </style>
  <slot name="icon"></slot>
`;var Ga=class extends ke{constructor(e={}){super({slotTemplate:ha,tooltipContent:T.PLAYBACK_RATE,...e}),$a(this,oe,new re(this,ii.RATES,{defaultValue:ai})),this.container=this.shadowRoot.querySelector('slot[name="icon"]'),this.container.innerHTML=`${le}x`}static get observedAttributes(){return[...super.observedAttributes,n.MEDIA_PLAYBACK_RATE,ii.RATES]}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===ii.RATES&&(rt(this,oe).value=i),e===n.MEDIA_PLAYBACK_RATE){let a=i?+i:Number.NaN,s=Number.isNaN(a)?le:a;this.container.innerHTML=`${s}x`,this.setAttribute("aria-label",b.PLAYBACK_RATE({playbackRate:s}))}}get rates(){return rt(this,oe)}set rates(e){e?Array.isArray(e)&&(rt(this,oe).value=e.join(" ")):rt(this,oe).value=""}get mediaPlaybackRate(){return k(this,n.MEDIA_PLAYBACK_RATE,le)}set mediaPlaybackRate(e){_(this,n.MEDIA_PLAYBACK_RATE,e)}handleClick(){var e,t;let i=Array.from(this.rates.values(),o=>+o).sort((o,d)=>o-d),a=(t=(e=i.find(o=>o>this.mediaPlaybackRate))!=null?e:i[0])!=null?t:le,s=new r.CustomEvent(S.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:a});this.dispatchEvent(s)}};oe=new WeakMap;r.customElements.get("media-playback-rate-button")||r.customElements.define("media-playback-rate-button",Ga);var ma=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ot=(e,t,i)=>(ma(e,t,"read from private field"),i?i.call(e):t.get(e)),si=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},ye=(e,t,i)=>(ma(e,t,"access private method"),i),de,_e,lt,dt,ri,ni={RATES:"rates"},ca=class extends A{constructor(){super(),si(this,_e),si(this,dt),si(this,de,new re(this,ni.RATES,{defaultValue:ai})),ye(this,_e,lt).call(this)}static get observedAttributes(){return[...super.observedAttributes,n.MEDIA_PLAYBACK_RATE,ni.RATES]}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===n.MEDIA_PLAYBACK_RATE&&t!=i?this.value=i:e===ni.RATES&&t!=i&&(ot(this,de).value=i,ye(this,_e,lt).call(this))}connectedCallback(){super.connectedCallback(),this.addEventListener("change",ye(this,dt,ri))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",ye(this,dt,ri))}get anchorElement(){return this.anchor!=="auto"?super.anchorElement:p(this).querySelector("media-playback-rate-menu-button")}get rates(){return ot(this,de)}set rates(e){e?Array.isArray(e)&&(ot(this,de).value=e.join(" ")):ot(this,de).value="",ye(this,_e,lt).call(this)}get mediaPlaybackRate(){return k(this,n.MEDIA_PLAYBACK_RATE,le)}set mediaPlaybackRate(e){_(this,n.MEDIA_PLAYBACK_RATE,e)}};de=new WeakMap;_e=new WeakSet;lt=function(){this.defaultSlot.textContent="";for(let e of this.rates){let t=w({type:"radio",text:this.formatMenuItemText(`${e}x`,e),value:e,checked:this.mediaPlaybackRate==e});t.prepend(M(this,"checked-indicator")),this.defaultSlot.append(t)}};dt=new WeakSet;ri=function(){if(!this.value)return;let e=new r.CustomEvent(S.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(e)};r.customElements.get("media-playback-rate-menu")||r.customElements.define("media-playback-rate-menu",ca);var Qa=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ut=(e,t,i)=>(Qa(e,t,"read from private field"),i?i.call(e):t.get(e)),Fa=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},ue,oi={RATES:"rates"},Za=[1,1.2,1.5,1.7,2],li=1,pa=u.createElement("template");pa.innerHTML=`
  <style>
    :host {
      min-width: 5ch;
      padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
    }
    
    :host([aria-expanded="true"]) slot[name=tooltip] {
      display: none;
    }
  </style>
  <slot name="icon"></slot>
`;var Ea=class extends y{constructor(e={}){super({slotTemplate:pa,tooltipContent:T.PLAYBACK_RATE,...e}),Fa(this,ue,new re(this,oi.RATES,{defaultValue:Za})),this.container=this.shadowRoot.querySelector('slot[name="icon"]'),this.container.innerHTML=`${li}x`}static get observedAttributes(){return[...super.observedAttributes,n.MEDIA_PLAYBACK_RATE,oi.RATES]}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===oi.RATES&&(ut(this,ue).value=i),e===n.MEDIA_PLAYBACK_RATE){let a=i?+i:Number.NaN,s=Number.isNaN(a)?li:a;this.container.innerHTML=`${s}x`,this.setAttribute("aria-label",b.PLAYBACK_RATE({playbackRate:s}))}}get invokeTargetElement(){return this.invokeTarget!=null?super.invokeTargetElement:p(this).querySelector("media-playback-rate-menu")}get rates(){return ut(this,ue)}set rates(e){e?Array.isArray(e)&&(ut(this,ue).value=e.join(" ")):ut(this,ue).value=""}get mediaPlaybackRate(){return k(this,n.MEDIA_PLAYBACK_RATE,li)}set mediaPlaybackRate(e){_(this,n.MEDIA_PLAYBACK_RATE,e)}};ue=new WeakMap;r.customElements.get("media-playback-rate-menu-button")||r.customElements.define("media-playback-rate-menu-button",Ea);var ui=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},Le=(e,t,i)=>(ui(e,t,"read from private field"),i?i.call(e):t.get(e)),ht=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},va=(e,t,i,a)=>(ui(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),Ce=(e,t,i)=>(ui(e,t,"access private method"),i),Re,he,we,mt,ct,di,Aa=class extends A{constructor(){super(...arguments),ht(this,we),ht(this,ct),ht(this,Re,[]),ht(this,he,{})}static get observedAttributes(){return[...super.observedAttributes,n.MEDIA_RENDITION_LIST,n.MEDIA_RENDITION_SELECTED,n.MEDIA_RENDITION_UNAVAILABLE,n.MEDIA_HEIGHT]}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===n.MEDIA_RENDITION_SELECTED&&t!==i?this.value=i??"auto":e===n.MEDIA_RENDITION_LIST&&t!==i?(va(this,Re,Fi(i)),Ce(this,we,mt).call(this)):e===n.MEDIA_HEIGHT&&t!==i&&Ce(this,we,mt).call(this)}connectedCallback(){super.connectedCallback(),this.addEventListener("change",Ce(this,ct,di))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",Ce(this,ct,di))}get anchorElement(){return this.anchor!=="auto"?super.anchorElement:p(this).querySelector("media-rendition-menu-button")}get mediaRenditionList(){return Le(this,Re)}set mediaRenditionList(e){va(this,Re,e),Ce(this,we,mt).call(this)}get mediaRenditionSelected(){return I(this,n.MEDIA_RENDITION_SELECTED)}set mediaRenditionSelected(e){C(this,n.MEDIA_RENDITION_SELECTED,e)}get mediaHeight(){return k(this,n.MEDIA_HEIGHT)}set mediaHeight(e){_(this,n.MEDIA_HEIGHT,e)}};Re=new WeakMap;he=new WeakMap;we=new WeakSet;mt=function(){if(Le(this,he).mediaRenditionList===JSON.stringify(this.mediaRenditionList)&&Le(this,he).mediaHeight===this.mediaHeight)return;Le(this,he).mediaRenditionList=JSON.stringify(this.mediaRenditionList),Le(this,he).mediaHeight=this.mediaHeight;let e=this.mediaRenditionList.sort((s,o)=>o.height-s.height);for(let s of e)s.selected=s.id===this.mediaRenditionSelected;this.defaultSlot.textContent="";let t=!this.mediaRenditionSelected;for(let s of e){let o=this.formatMenuItemText(`${Math.min(s.width,s.height)}p`,s),d=w({type:"radio",text:o,value:`${s.id}`,checked:s.selected&&!t});d.prepend(M(this,"checked-indicator")),this.defaultSlot.append(d)}let i=w({type:"radio",text:this.formatMenuItemText("Auto"),value:"auto",checked:t}),a=this.mediaHeight>0?`Auto (${this.mediaHeight}p)`:"Auto";i.dataset.description=a,i.prepend(M(this,"checked-indicator")),this.defaultSlot.append(i)};ct=new WeakSet;di=function(){if(this.value==null)return;let e=new r.CustomEvent(S.MEDIA_RENDITION_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(e)};r.customElements.get("media-rendition-menu")||r.customElements.define("media-rendition-menu",Aa);var ja=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M13.5 2.5h2v6h-2v-2h-11v-2h11v-2Zm4 2h4v2h-4v-2Zm-12 4h2v6h-2v-2h-3v-2h3v-2Zm4 2h12v2h-12v-2Zm1 4h2v6h-2v-2h-8v-2h8v-2Zm4 2h7v2h-7v-2Z" />
</svg>`,ba=u.createElement("template");ba.innerHTML=`
  <style>
    :host([aria-expanded="true"]) slot[name=tooltip] {
      display: none;
    }
  </style>
  <slot name="icon">${ja}</slot>
`;var ga=class extends y{static get observedAttributes(){return[...super.observedAttributes,n.MEDIA_RENDITION_SELECTED,n.MEDIA_RENDITION_UNAVAILABLE,n.MEDIA_HEIGHT]}constructor(){super({slotTemplate:ba,tooltipContent:T.RENDITIONS})}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",b.QUALITY())}get invokeTargetElement(){return this.invokeTarget!=null?super.invokeTargetElement:p(this).querySelector("media-rendition-menu")}get mediaRenditionSelected(){return I(this,n.MEDIA_RENDITION_SELECTED)}set mediaRenditionSelected(e){C(this,n.MEDIA_RENDITION_SELECTED,e)}get mediaHeight(){return k(this,n.MEDIA_HEIGHT)}set mediaHeight(e){_(this,n.MEDIA_HEIGHT,e)}};r.customElements.get("media-rendition-menu-button")||r.customElements.define("media-rendition-menu-button",ga);export{zi as MediaAudioTrackMenu,Ji as MediaAudioTrackMenuButton,ei as MediaCaptionsMenu,da as MediaCaptionsMenuButton,A as MediaChromeMenu,ee as MediaChromeMenuItem,ca as MediaPlaybackRateMenu,Ea as MediaPlaybackRateMenuButton,Aa as MediaRenditionMenu,ga as MediaRenditionMenuButton,Kt as MediaSettingsMenu,Qi as MediaSettingsMenuButton,Vt as MediaSettingsMenuItem};
