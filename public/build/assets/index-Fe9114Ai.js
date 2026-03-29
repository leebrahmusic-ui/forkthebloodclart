import{r as h,c as Oe,j as i}from"./app-C1GJ_r9X.js";import{c as L}from"./utils-CDN07tui.js";import{c as De}from"./createLucideIcon-D19onEBw.js";import{C as Se}from"./clock-DfFuRFVI.js";const Ee=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]],We=De("calendar-days",Ee),me=6048e5,Te=864e5,oe=Symbol.for("constructDateFrom");function q(e,t){return typeof e=="function"?e(t):e&&typeof e=="object"&&oe in e?e[oe](t):e instanceof Date?new e.constructor(t):new Date(t)}function v(e,t){return q(t||e,e)}function G(e,t,a){const r=v(e,a?.in);if(isNaN(t))return q(e,NaN);if(!t)return r;const n=r.getDate(),o=q(e,r.getTime());o.setMonth(r.getMonth()+t+1,0);const s=o.getDate();return n>=s?o:(r.setFullYear(o.getFullYear(),o.getMonth(),n),r)}let Ye={};function B(){return Ye}function A(e,t){const a=B(),r=t?.weekStartsOn??t?.locale?.options?.weekStartsOn??a.weekStartsOn??a.locale?.options?.weekStartsOn??0,n=v(e,t?.in),o=n.getDay(),s=(o<r?7:0)+o-r;return n.setDate(n.getDate()-s),n.setHours(0,0,0,0),n}function Q(e,t){return A(e,{...t,weekStartsOn:1})}function fe(e,t){const a=v(e,t?.in),r=a.getFullYear(),n=q(a,0);n.setFullYear(r+1,0,4),n.setHours(0,0,0,0);const o=Q(n),s=q(a,0);s.setFullYear(r,0,4),s.setHours(0,0,0,0);const c=Q(s);return a.getTime()>=o.getTime()?r+1:a.getTime()>=c.getTime()?r:r-1}function se(e){const t=v(e),a=new Date(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds(),t.getMilliseconds()));return a.setUTCFullYear(t.getFullYear()),+e-+a}function Fe(e,...t){const a=q.bind(null,t.find(r=>typeof r=="object"));return t.map(a)}function z(e,t){const a=v(e,t?.in);return a.setHours(0,0,0,0),a}function Ce(e,t,a){const[r,n]=Fe(a?.in,e,t),o=z(r),s=z(n),c=+o-se(o),u=+s-se(s);return Math.round((c-u)/Te)}function Ae(e,t){const a=fe(e,t),r=q(e,0);return r.setFullYear(a,0,4),r.setHours(0,0,0,0),Q(r)}function _e(e){return e instanceof Date||typeof e=="object"&&Object.prototype.toString.call(e)==="[object Date]"}function $e(e){return!(!_e(e)&&typeof e!="number"||isNaN(+v(e)))}function He(e,t){const a=v(e,t?.in);return a.setFullYear(a.getFullYear(),0,1),a.setHours(0,0,0,0),a}const Le={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}},Qe=(e,t,a)=>{let r;const n=Le[e];return typeof n=="string"?r=n:t===1?r=n.one:r=n.other.replace("{{count}}",t.toString()),a?.addSuffix?a.comparison&&a.comparison>0?"in "+r:r+" ago":r};function V(e){return(t={})=>{const a=t.width?String(t.width):e.defaultWidth;return e.formats[a]||e.formats[e.defaultWidth]}}const Be={full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},Xe={full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},Ie={full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},Re={date:V({formats:Be,defaultWidth:"full"}),time:V({formats:Xe,defaultWidth:"full"}),dateTime:V({formats:Ie,defaultWidth:"full"})},Ge={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"},Ve=(e,t,a,r)=>Ge[e];function F(e){return(t,a)=>{const r=a?.context?String(a.context):"standalone";let n;if(r==="formatting"&&e.formattingValues){const s=e.defaultFormattingWidth||e.defaultWidth,c=a?.width?String(a.width):s;n=e.formattingValues[c]||e.formattingValues[s]}else{const s=e.defaultWidth,c=a?.width?String(a.width):e.defaultWidth;n=e.values[c]||e.values[s]}const o=e.argumentCallback?e.argumentCallback(t):t;return n[o]}}const ze={narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},Je={narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},Ke={narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},Ue={narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},Ze={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},et={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},tt=(e,t)=>{const a=Number(e),r=a%100;if(r>20||r<10)switch(r%10){case 1:return a+"st";case 2:return a+"nd";case 3:return a+"rd"}return a+"th"},at={ordinalNumber:tt,era:F({values:ze,defaultWidth:"wide"}),quarter:F({values:Je,defaultWidth:"wide",argumentCallback:e=>e-1}),month:F({values:Ke,defaultWidth:"wide"}),day:F({values:Ue,defaultWidth:"wide"}),dayPeriod:F({values:Ze,defaultWidth:"wide",formattingValues:et,defaultFormattingWidth:"wide"})};function C(e){return(t,a={})=>{const r=a.width,n=r&&e.matchPatterns[r]||e.matchPatterns[e.defaultMatchWidth],o=t.match(n);if(!o)return null;const s=o[0],c=r&&e.parsePatterns[r]||e.parsePatterns[e.defaultParseWidth],u=Array.isArray(c)?nt(c,g=>g.test(s)):rt(c,g=>g.test(s));let m;m=e.valueCallback?e.valueCallback(u):u,m=a.valueCallback?a.valueCallback(m):m;const f=t.slice(s.length);return{value:m,rest:f}}}function rt(e,t){for(const a in e)if(Object.prototype.hasOwnProperty.call(e,a)&&t(e[a]))return a}function nt(e,t){for(let a=0;a<e.length;a++)if(t(e[a]))return a}function ot(e){return(t,a={})=>{const r=t.match(e.matchPattern);if(!r)return null;const n=r[0],o=t.match(e.parsePattern);if(!o)return null;let s=e.valueCallback?e.valueCallback(o[0]):o[0];s=a.valueCallback?a.valueCallback(s):s;const c=t.slice(n.length);return{value:s,rest:c}}}const st=/^(\d+)(th|st|nd|rd)?/i,it=/\d+/i,lt={narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},ct={any:[/^b/i,/^(a|c)/i]},ut={narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},dt={any:[/1/i,/2/i,/3/i,/4/i]},mt={narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},ft={narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},ht={narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},bt={narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},gt={narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},pt={any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},yt={ordinalNumber:ot({matchPattern:st,parsePattern:it,valueCallback:e=>parseInt(e,10)}),era:C({matchPatterns:lt,defaultMatchWidth:"wide",parsePatterns:ct,defaultParseWidth:"any"}),quarter:C({matchPatterns:ut,defaultMatchWidth:"wide",parsePatterns:dt,defaultParseWidth:"any",valueCallback:e=>e+1}),month:C({matchPatterns:mt,defaultMatchWidth:"wide",parsePatterns:ft,defaultParseWidth:"any"}),day:C({matchPatterns:ht,defaultMatchWidth:"wide",parsePatterns:bt,defaultParseWidth:"any"}),dayPeriod:C({matchPatterns:gt,defaultMatchWidth:"any",parsePatterns:pt,defaultParseWidth:"any"})},xt={code:"en-US",formatDistance:Qe,formatLong:Re,formatRelative:Ve,localize:at,match:yt,options:{weekStartsOn:0,firstWeekContainsDate:1}};function wt(e,t){const a=v(e,t?.in);return Ce(a,He(a))+1}function kt(e,t){const a=v(e,t?.in),r=+Q(a)-+Ae(a);return Math.round(r/me)+1}function he(e,t){const a=v(e,t?.in),r=a.getFullYear(),n=B(),o=t?.firstWeekContainsDate??t?.locale?.options?.firstWeekContainsDate??n.firstWeekContainsDate??n.locale?.options?.firstWeekContainsDate??1,s=q(t?.in||e,0);s.setFullYear(r+1,0,o),s.setHours(0,0,0,0);const c=A(s,t),u=q(t?.in||e,0);u.setFullYear(r,0,o),u.setHours(0,0,0,0);const m=A(u,t);return+a>=+c?r+1:+a>=+m?r:r-1}function vt(e,t){const a=B(),r=t?.firstWeekContainsDate??t?.locale?.options?.firstWeekContainsDate??a.firstWeekContainsDate??a.locale?.options?.firstWeekContainsDate??1,n=he(e,t),o=q(t?.in||e,0);return o.setFullYear(n,0,r),o.setHours(0,0,0,0),A(o,t)}function qt(e,t){const a=v(e,t?.in),r=+A(a,t)-+vt(a,t);return Math.round(r/me)+1}function b(e,t){const a=e<0?"-":"",r=Math.abs(e).toString().padStart(t,"0");return a+r}const P={y(e,t){const a=e.getFullYear(),r=a>0?a:1-a;return b(t==="yy"?r%100:r,t.length)},M(e,t){const a=e.getMonth();return t==="M"?String(a+1):b(a+1,2)},d(e,t){return b(e.getDate(),t.length)},a(e,t){const a=e.getHours()/12>=1?"pm":"am";switch(t){case"a":case"aa":return a.toUpperCase();case"aaa":return a;case"aaaaa":return a[0];case"aaaa":default:return a==="am"?"a.m.":"p.m."}},h(e,t){return b(e.getHours()%12||12,t.length)},H(e,t){return b(e.getHours(),t.length)},m(e,t){return b(e.getMinutes(),t.length)},s(e,t){return b(e.getSeconds(),t.length)},S(e,t){const a=t.length,r=e.getMilliseconds(),n=Math.trunc(r*Math.pow(10,a-3));return b(n,t.length)}},T={midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},ie={G:function(e,t,a){const r=e.getFullYear()>0?1:0;switch(t){case"G":case"GG":case"GGG":return a.era(r,{width:"abbreviated"});case"GGGGG":return a.era(r,{width:"narrow"});case"GGGG":default:return a.era(r,{width:"wide"})}},y:function(e,t,a){if(t==="yo"){const r=e.getFullYear(),n=r>0?r:1-r;return a.ordinalNumber(n,{unit:"year"})}return P.y(e,t)},Y:function(e,t,a,r){const n=he(e,r),o=n>0?n:1-n;if(t==="YY"){const s=o%100;return b(s,2)}return t==="Yo"?a.ordinalNumber(o,{unit:"year"}):b(o,t.length)},R:function(e,t){const a=fe(e);return b(a,t.length)},u:function(e,t){const a=e.getFullYear();return b(a,t.length)},Q:function(e,t,a){const r=Math.ceil((e.getMonth()+1)/3);switch(t){case"Q":return String(r);case"QQ":return b(r,2);case"Qo":return a.ordinalNumber(r,{unit:"quarter"});case"QQQ":return a.quarter(r,{width:"abbreviated",context:"formatting"});case"QQQQQ":return a.quarter(r,{width:"narrow",context:"formatting"});case"QQQQ":default:return a.quarter(r,{width:"wide",context:"formatting"})}},q:function(e,t,a){const r=Math.ceil((e.getMonth()+1)/3);switch(t){case"q":return String(r);case"qq":return b(r,2);case"qo":return a.ordinalNumber(r,{unit:"quarter"});case"qqq":return a.quarter(r,{width:"abbreviated",context:"standalone"});case"qqqqq":return a.quarter(r,{width:"narrow",context:"standalone"});case"qqqq":default:return a.quarter(r,{width:"wide",context:"standalone"})}},M:function(e,t,a){const r=e.getMonth();switch(t){case"M":case"MM":return P.M(e,t);case"Mo":return a.ordinalNumber(r+1,{unit:"month"});case"MMM":return a.month(r,{width:"abbreviated",context:"formatting"});case"MMMMM":return a.month(r,{width:"narrow",context:"formatting"});case"MMMM":default:return a.month(r,{width:"wide",context:"formatting"})}},L:function(e,t,a){const r=e.getMonth();switch(t){case"L":return String(r+1);case"LL":return b(r+1,2);case"Lo":return a.ordinalNumber(r+1,{unit:"month"});case"LLL":return a.month(r,{width:"abbreviated",context:"standalone"});case"LLLLL":return a.month(r,{width:"narrow",context:"standalone"});case"LLLL":default:return a.month(r,{width:"wide",context:"standalone"})}},w:function(e,t,a,r){const n=qt(e,r);return t==="wo"?a.ordinalNumber(n,{unit:"week"}):b(n,t.length)},I:function(e,t,a){const r=kt(e);return t==="Io"?a.ordinalNumber(r,{unit:"week"}):b(r,t.length)},d:function(e,t,a){return t==="do"?a.ordinalNumber(e.getDate(),{unit:"date"}):P.d(e,t)},D:function(e,t,a){const r=wt(e);return t==="Do"?a.ordinalNumber(r,{unit:"dayOfYear"}):b(r,t.length)},E:function(e,t,a){const r=e.getDay();switch(t){case"E":case"EE":case"EEE":return a.day(r,{width:"abbreviated",context:"formatting"});case"EEEEE":return a.day(r,{width:"narrow",context:"formatting"});case"EEEEEE":return a.day(r,{width:"short",context:"formatting"});case"EEEE":default:return a.day(r,{width:"wide",context:"formatting"})}},e:function(e,t,a,r){const n=e.getDay(),o=(n-r.weekStartsOn+8)%7||7;switch(t){case"e":return String(o);case"ee":return b(o,2);case"eo":return a.ordinalNumber(o,{unit:"day"});case"eee":return a.day(n,{width:"abbreviated",context:"formatting"});case"eeeee":return a.day(n,{width:"narrow",context:"formatting"});case"eeeeee":return a.day(n,{width:"short",context:"formatting"});case"eeee":default:return a.day(n,{width:"wide",context:"formatting"})}},c:function(e,t,a,r){const n=e.getDay(),o=(n-r.weekStartsOn+8)%7||7;switch(t){case"c":return String(o);case"cc":return b(o,t.length);case"co":return a.ordinalNumber(o,{unit:"day"});case"ccc":return a.day(n,{width:"abbreviated",context:"standalone"});case"ccccc":return a.day(n,{width:"narrow",context:"standalone"});case"cccccc":return a.day(n,{width:"short",context:"standalone"});case"cccc":default:return a.day(n,{width:"wide",context:"standalone"})}},i:function(e,t,a){const r=e.getDay(),n=r===0?7:r;switch(t){case"i":return String(n);case"ii":return b(n,t.length);case"io":return a.ordinalNumber(n,{unit:"day"});case"iii":return a.day(r,{width:"abbreviated",context:"formatting"});case"iiiii":return a.day(r,{width:"narrow",context:"formatting"});case"iiiiii":return a.day(r,{width:"short",context:"formatting"});case"iiii":default:return a.day(r,{width:"wide",context:"formatting"})}},a:function(e,t,a){const n=e.getHours()/12>=1?"pm":"am";switch(t){case"a":case"aa":return a.dayPeriod(n,{width:"abbreviated",context:"formatting"});case"aaa":return a.dayPeriod(n,{width:"abbreviated",context:"formatting"}).toLowerCase();case"aaaaa":return a.dayPeriod(n,{width:"narrow",context:"formatting"});case"aaaa":default:return a.dayPeriod(n,{width:"wide",context:"formatting"})}},b:function(e,t,a){const r=e.getHours();let n;switch(r===12?n=T.noon:r===0?n=T.midnight:n=r/12>=1?"pm":"am",t){case"b":case"bb":return a.dayPeriod(n,{width:"abbreviated",context:"formatting"});case"bbb":return a.dayPeriod(n,{width:"abbreviated",context:"formatting"}).toLowerCase();case"bbbbb":return a.dayPeriod(n,{width:"narrow",context:"formatting"});case"bbbb":default:return a.dayPeriod(n,{width:"wide",context:"formatting"})}},B:function(e,t,a){const r=e.getHours();let n;switch(r>=17?n=T.evening:r>=12?n=T.afternoon:r>=4?n=T.morning:n=T.night,t){case"B":case"BB":case"BBB":return a.dayPeriod(n,{width:"abbreviated",context:"formatting"});case"BBBBB":return a.dayPeriod(n,{width:"narrow",context:"formatting"});case"BBBB":default:return a.dayPeriod(n,{width:"wide",context:"formatting"})}},h:function(e,t,a){if(t==="ho"){let r=e.getHours()%12;return r===0&&(r=12),a.ordinalNumber(r,{unit:"hour"})}return P.h(e,t)},H:function(e,t,a){return t==="Ho"?a.ordinalNumber(e.getHours(),{unit:"hour"}):P.H(e,t)},K:function(e,t,a){const r=e.getHours()%12;return t==="Ko"?a.ordinalNumber(r,{unit:"hour"}):b(r,t.length)},k:function(e,t,a){let r=e.getHours();return r===0&&(r=24),t==="ko"?a.ordinalNumber(r,{unit:"hour"}):b(r,t.length)},m:function(e,t,a){return t==="mo"?a.ordinalNumber(e.getMinutes(),{unit:"minute"}):P.m(e,t)},s:function(e,t,a){return t==="so"?a.ordinalNumber(e.getSeconds(),{unit:"second"}):P.s(e,t)},S:function(e,t){return P.S(e,t)},X:function(e,t,a){const r=e.getTimezoneOffset();if(r===0)return"Z";switch(t){case"X":return ce(r);case"XXXX":case"XX":return S(r);case"XXXXX":case"XXX":default:return S(r,":")}},x:function(e,t,a){const r=e.getTimezoneOffset();switch(t){case"x":return ce(r);case"xxxx":case"xx":return S(r);case"xxxxx":case"xxx":default:return S(r,":")}},O:function(e,t,a){const r=e.getTimezoneOffset();switch(t){case"O":case"OO":case"OOO":return"GMT"+le(r,":");case"OOOO":default:return"GMT"+S(r,":")}},z:function(e,t,a){const r=e.getTimezoneOffset();switch(t){case"z":case"zz":case"zzz":return"GMT"+le(r,":");case"zzzz":default:return"GMT"+S(r,":")}},t:function(e,t,a){const r=Math.trunc(+e/1e3);return b(r,t.length)},T:function(e,t,a){return b(+e,t.length)}};function le(e,t=""){const a=e>0?"-":"+",r=Math.abs(e),n=Math.trunc(r/60),o=r%60;return o===0?a+String(n):a+String(n)+t+b(o,2)}function ce(e,t){return e%60===0?(e>0?"-":"+")+b(Math.abs(e)/60,2):S(e,t)}function S(e,t=""){const a=e>0?"-":"+",r=Math.abs(e),n=b(Math.trunc(r/60),2),o=b(r%60,2);return a+n+t+o}const ue=(e,t)=>{switch(e){case"P":return t.date({width:"short"});case"PP":return t.date({width:"medium"});case"PPP":return t.date({width:"long"});case"PPPP":default:return t.date({width:"full"})}},be=(e,t)=>{switch(e){case"p":return t.time({width:"short"});case"pp":return t.time({width:"medium"});case"ppp":return t.time({width:"long"});case"pppp":default:return t.time({width:"full"})}},Mt=(e,t)=>{const a=e.match(/(P+)(p+)?/)||[],r=a[1],n=a[2];if(!n)return ue(e,t);let o;switch(r){case"P":o=t.dateTime({width:"short"});break;case"PP":o=t.dateTime({width:"medium"});break;case"PPP":o=t.dateTime({width:"long"});break;case"PPPP":default:o=t.dateTime({width:"full"});break}return o.replace("{{date}}",ue(r,t)).replace("{{time}}",be(n,t))},Nt={p:be,P:Mt},jt=/^D+$/,Pt=/^Y+$/,Ot=["D","DD","YY","YYYY"];function Dt(e){return jt.test(e)}function St(e){return Pt.test(e)}function Et(e,t,a){const r=Wt(e,t,a);if(console.warn(r),Ot.includes(e))throw new RangeError(r)}function Wt(e,t,a){const r=e[0]==="Y"?"years":"days of the month";return`Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${t}\`) for formatting ${r} to the input \`${a}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`}const Tt=/[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,Yt=/P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,Ft=/^'([^]*?)'?$/,Ct=/''/g,At=/[a-zA-Z]/;function k(e,t,a){const r=B(),n=r.locale??xt,o=r.firstWeekContainsDate??r.locale?.options?.firstWeekContainsDate??1,s=r.weekStartsOn??r.locale?.options?.weekStartsOn??0,c=v(e,a?.in);if(!$e(c))throw new RangeError("Invalid time value");let u=t.match(Yt).map(f=>{const g=f[0];if(g==="p"||g==="P"){const x=Nt[g];return x(f,n.formatLong)}return f}).join("").match(Tt).map(f=>{if(f==="''")return{isToken:!1,value:"'"};const g=f[0];if(g==="'")return{isToken:!1,value:_t(f)};if(ie[g])return{isToken:!0,value:f};if(g.match(At))throw new RangeError("Format string contains an unescaped latin alphabet character `"+g+"`");return{isToken:!1,value:f}});n.localize.preprocessor&&(u=n.localize.preprocessor(c,u));const m={firstWeekContainsDate:o,weekStartsOn:s,locale:n};return u.map(f=>{if(!f.isToken)return f.value;const g=f.value;(St(g)||Dt(g))&&Et(g,t,String(e));const x=ie[g[0]];return x(c,g,n.localize,m)}).join("")}function _t(e){const t=e.match(Ft);return t?t[1].replace(Ct,"'"):e}const Na=({type:e,value:t,onChange:a})=>{const r=h.useMemo(()=>e?typeof e=="string"?e:e.key||null:null,[e]),n=h.useMemo(()=>z(new Date),[]),o=h.useMemo(()=>G(n,2),[n]),[s,c]=h.useState(t?.date?new Date(t.date):null),[u,m]=h.useState(t?.time||null),[f,g]=h.useState(!1),[x,ee]=h.useState({}),[$,te]=h.useState(null),ae=h.useRef({date:null,time:null}),re=h.useMemo(()=>{const l=[k(n,"yyyy-MM"),k(G(n,1),"yyyy-MM"),k(G(n,2),"yyyy-MM")];return[...new Set(l)]},[n]),H=(l,d)=>{a?.({date:l?k(l,"yyyy-MM-dd"):null,time:d||null})};h.useEffect(()=>{if(!r)return;let l=!1;return g(!0),te(null),Promise.all(re.map(d=>Oe.get("/appointments/availability",{params:{type:r,month:d}}))).then(d=>{if(l)return;const p={};d.forEach(w=>{const W=w?.data?.data?.days||{};Object.entries(W).forEach(([Pe,ne])=>{p[Pe]=Array.isArray(ne)?ne:[]})}),ee(p)}).catch(()=>{l||(te("Unable to load availability. Please try again."),ee({}))}).finally(()=>{l||g(!1)}),()=>{l=!0}},[r,re]);const M=h.useMemo(()=>Object.entries(x).filter(([,l])=>Array.isArray(l)&&l.length>0).map(([l])=>{const d=new Date(`${l}T00:00:00`);return{key:l,date:d,label:k(d,"EEE d MMM"),sublabel:k(d,"MMMM yyyy")}}).filter(({date:l})=>Number.isNaN(l.getTime())?!1:l>=n&&l<=o).sort((l,d)=>l.date.getTime()-d.date.getTime()),[x,n,o]),ve=h.useMemo(()=>{const l=new Map;return M.forEach(d=>{const p=k(d.date,"yyyy-MM");l.has(p)||l.set(p,{key:p,label:k(d.date,"MMMM yyyy"),days:[]}),l.get(p).days.push(d)}),Array.from(l.values())},[M]),E=s?k(s,"yyyy-MM-dd"):null,I=E?x[E]||[]:[];h.useEffect(()=>{const l=t?.date||null,d=t?.time||null,p=ae.current;if(l!==p.date||d!==p.time){ae.current={date:l,time:d};const w=l?new Date(l):null;c(w),m(d||null)}},[t?.date,t?.time]),h.useEffect(()=>{if(!s&&M.length>0){const l=M[0].date;c(l),m(null),H(l,null)}},[M,s]),h.useEffect(()=>{E&&(M.some(l=>l.key===E)||(c(null),m(null),H(null,null)))},[M,E]);const qe=l=>{l&&(c(l),m(null),H(l,null))},Me=l=>{const d=String(l||"").trim();if(!d)return null;const p=d.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);if(!p)return null;let w=Number(p[1]);const W=(p[3]||"").toLowerCase();return W==="pm"&&w<12&&(w+=12),W==="am"&&w===12&&(w=0),Number.isFinite(w)?w:null},R=h.useMemo(()=>{const l={morning:[],afternoon:[],evening:[]};return I.forEach(d=>{const p=Me(d);if(p===null){l.afternoon.push(d);return}p<12?l.morning.push(d):p<17?l.afternoon.push(d):l.evening.push(d)}),l},[I]),Ne=[{key:"morning",title:"Morning",subtitle:"Before 12:00",slots:R.morning},{key:"afternoon",title:"Afternoon",subtitle:"12:00 – 17:00",slots:R.afternoon},{key:"evening",title:"Evening",subtitle:"After 17:00",slots:R.evening}],je=l=>{s&&(m(l),H(s,l))};return i.jsxs("div",{className:"w-full max-w-6xl rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden lg:min-h-[600px]",children:[i.jsxs("div",{className:"flex items-center justify-between px-4 lg:px-6 py-4 border-b border-slate-200",children:[i.jsxs("div",{children:[i.jsx("div",{className:"text-base font-semibold text-slate-900 line-clamp-1",children:"Select a date and time"}),i.jsx("div",{className:"text-sm text-slate-600 line-clamp-1",children:"Pick your preferred day, then choose a time window."})]}),r?i.jsx("span",{className:"inline-flex items-center rounded-full border text-center border-slate-200 bg-slate-50 px-3 py-1 text-[10px] lg:text-xs font-medium text-slate-700 whitespace-nowrap",children:String(r).replaceAll("_"," ").toUpperCase()}):i.jsx("span",{className:"inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800",children:"Select service type first"})]}),i.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 items-stretch h-full",children:[i.jsxs("div",{className:"border-b lg:border-b-0 lg:border-r border-slate-200 p-5 sm:p-6",children:[i.jsxs("div",{className:"mb-4 grid grid-cols-2 gap-2 text-xs",children:[i.jsx("div",{className:L("rounded-lg border px-3 py-2",s?"border-emerald-200 bg-emerald-50 text-emerald-800":"border-slate-200 bg-slate-50 text-slate-600"),children:i.jsx("p",{className:"font-semibold",children:"1) Choose a day"})}),i.jsx("div",{className:L("rounded-lg border px-3 py-2",u?"border-emerald-200 bg-emerald-50 text-emerald-800":"border-slate-200 bg-slate-50 text-slate-600"),children:i.jsx("p",{className:"font-semibold",children:"2) Choose a time"})})]}),i.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[i.jsx(We,{className:"h-4 w-4 text-slate-700"}),i.jsx("div",{className:"text-sm font-semibold text-slate-900",children:"Available dates"}),i.jsx("div",{className:"text-xs text-slate-500",children:"Next 2 months"})]}),i.jsx("div",{className:"rounded-lg border border-slate-200 bg-white p-3",children:f?i.jsxs("div",{className:"space-y-2",children:[i.jsx("div",{className:"h-10 rounded-lg bg-slate-100"}),i.jsx("div",{className:"h-10 rounded-lg bg-slate-100"}),i.jsx("div",{className:"h-10 rounded-lg bg-slate-100"})]}):$?i.jsx("div",{className:"rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800",children:$}):M.length===0?i.jsx("div",{className:"rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700",children:"No dates available right now. Please try again shortly."}):i.jsx(i.Fragment,{children:i.jsx("div",{className:"space-y-4 max-h-[320px] overflow-y-auto pr-1",children:ve.map(l=>i.jsxs("div",{children:[i.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500",children:l.label}),i.jsx("div",{className:"grid grid-cols-2 gap-2",children:l.days.map((d,p)=>{const w=E===d.key,W=d.key===M[0]?.key;return i.jsxs("button",{type:"button",onClick:()=>qe(d.date),className:L("w-full min-w-0 rounded-lg border px-3 py-2 text-left transition-all",w?"border-blue-600 bg-blue-50":"border-slate-200 hover:border-slate-300 hover:bg-slate-50"),"aria-pressed":w,children:[W&&p===0&&i.jsx("span",{className:"mb-1 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800",children:"Earliest"}),i.jsx("p",{className:"text-sm font-semibold text-slate-900 leading-tight whitespace-normal break-words",children:d.label}),i.jsx("p",{className:"text-xs text-slate-500 leading-tight whitespace-normal",children:k(d.date,"EEEE")})]},d.key)})})]},l.key))})})}),i.jsx("div",{className:"mt-2 rounded-lg border border-slate-200 bg-slate-50 p-4",children:s&&u?i.jsxs("div",{className:"text-sm text-slate-800",children:["Your chosen appointment:"," ",i.jsx("span",{className:"font-semibold text-slate-900",children:k(s,"EEEE do MMMM")})," ","at"," ",i.jsx("span",{className:"font-semibold text-slate-900",children:u})]}):i.jsx("div",{className:"text-sm text-slate-700",children:"Please select a date and time to continue."})})]}),i.jsxs("div",{className:"p-5 sm:p-6 flex flex-col max-h-[510px] overflow-y-auto",children:[i.jsxs("div",{className:"flex items-center justify-between gap-3 mb-3",children:[i.jsxs("div",{className:"flex items-center gap-2",children:[i.jsx(Se,{className:"h-4 w-4 text-slate-700"}),i.jsx("div",{className:"text-sm font-semibold text-slate-900",children:"Available times"})]}),s?i.jsx("div",{className:"text-xs text-slate-600",children:k(s,"EEEE, d MMM yyyy")}):i.jsx("div",{className:"text-xs text-slate-500",children:"No date selected"})]}),i.jsx("div",{className:"flex-1 min-h-0 overflow-y-auto pr-1",children:r?f?i.jsxs("div",{className:"space-y-3",children:[i.jsx("div",{className:"h-4 w-44 bg-slate-100 rounded"}),i.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[i.jsx("div",{className:"h-12 bg-slate-100 rounded-lg"}),i.jsx("div",{className:"h-12 bg-slate-100 rounded-lg"}),i.jsx("div",{className:"h-12 bg-slate-100 rounded-lg"}),i.jsx("div",{className:"h-12 bg-slate-100 rounded-lg"})]}),i.jsx("div",{className:"text-xs text-slate-500",children:"Loading availability…"})]}):$?i.jsxs("div",{className:"rounded-lg border border-rose-200 bg-rose-50 p-4",children:[i.jsx("div",{className:"text-sm font-medium text-rose-900",children:"Something went wrong"}),i.jsx("div",{className:"text-sm text-rose-800 mt-1",children:$})]}):s?I.length===0?i.jsxs("div",{className:"rounded-lg border border-slate-200 bg-white p-4",children:[i.jsx("div",{className:"text-sm font-medium text-slate-900",children:"No slots available"}),i.jsx("div",{className:"text-sm text-slate-600 mt-1",children:"Try another day to find an open slot."})]}):i.jsx("div",{className:"space-y-4",children:Ne.map(l=>l.slots.length?i.jsxs("div",{className:"rounded-lg border border-slate-200 bg-white p-3",children:[i.jsxs("div",{className:"mb-2 flex items-center justify-between",children:[i.jsx("p",{className:"text-sm font-semibold text-slate-900",children:l.title}),i.jsx("p",{className:"text-xs text-slate-500",children:l.subtitle})]}),i.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-2",children:l.slots.map(d=>{const p=u===d;return i.jsx("button",{type:"button",onClick:()=>je(d),"aria-pressed":p,className:L("rounded-lg border px-3 py-2 text-sm font-semibold transition-all",p?"border-blue-600 bg-blue-600 text-white":"border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"),children:d},`${l.key}-${d}`)})})]},l.key):null)}):i.jsxs("div",{className:"rounded-lg border border-slate-200 bg-white p-4",children:[i.jsx("div",{className:"text-sm font-medium text-slate-900",children:"Select a date"}),i.jsx("div",{className:"text-sm text-slate-600 mt-1",children:"Choose a date to see available time slots."})]}):i.jsxs("div",{className:"rounded-lg border border-slate-200 bg-white p-4",children:[i.jsx("div",{className:"text-sm font-medium text-slate-900",children:"Service type required"}),i.jsx("div",{className:"text-sm text-slate-600 mt-1",children:"Select a service type to load availability."})]})})]})]})]})};function ja({children:e}){return i.jsxs("div",{className:"quote-blue-skin",children:[i.jsx("style",{children:`
                .quote-blue-skin,
                .quote-blue-skin * {
                    color-scheme: light !important;
                    forced-color-adjust: none !important;
                }

                .quote-blue-skin {
                    --qb-base: #06263f;
                    --qb-mid: #0b3654;
                    --qb-deep: #114c73;
                    --qb-panel: #0b3654;
                    --qb-panel-dark: #114c73;
                    --qb-option: #114c73;
                    --qb-option-active: #0b3654;
                }

                .quote-blue-skin .quote-page-bg {
                    background: var(--qb-base) !important;
                    background-image: radial-gradient(circle at top, rgba(54, 193, 255, 0.22), rgba(255, 255, 255, 0.00) 45%), linear-gradient(180deg, var(--qb-mid) 0%, var(--qb-deep) 100%) !important;
                }

                .quote-blue-skin .page-header-clean:not(.page-header-blue) {
                    background: var(--qb-panel) !important;
                    border-color: rgba(255, 255, 255, 0.30) !important;
                    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.10) !important;
                }

                .quote-blue-skin .page-header-clean.page-header-blue {
                    background: transparent !important;
                    background-image: none !important;
                    border-color: transparent !important;
                    box-shadow: none !important;
                }

                .quote-blue-skin .quote-trust-card {
                    background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)), var(--qb-panel) !important;
                    border-color: rgba(255, 255, 255, 0.35) !important;
                    box-shadow: 0 8px 20px rgba(0, 65, 88, 0.14) !important;
                }

                .quote-blue-skin .quote-question-shell {
                    background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)), var(--qb-panel) !important;
                    border: 1px solid rgba(255, 255, 255, 0.35) !important;
                    box-shadow: 0 14px 34px rgba(0, 65, 88, 0.16) !important;
                }

                .quote-blue-skin .quote-question-shell .radial-highlight {
                    background: none !important;
                }

                .quote-blue-skin [class*="bg-white"],
                .quote-blue-skin [class*="bg-slate"],
                .quote-blue-skin [class*="bg-gray"] {
                    background-color: rgba(0, 96, 124, 0.28) !important;
                    background-image: none !important;
                    border-color: rgba(255, 255, 255, 0.35) !important;
                }

                .quote-blue-skin .quote-solid-popover {
                    background-color: #f8fafc !important;
                    background-image: none !important;
                    border-color: #cbd5e1 !important;
                    backdrop-filter: none !important;
                }

                .quote-blue-skin .quote-solid-popover,
                .quote-blue-skin .quote-solid-popover [class*="text-"],
                .quote-blue-skin .quote-solid-popover p,
                .quote-blue-skin .quote-solid-popover span,
                .quote-blue-skin .quote-solid-popover div {
                    color: #334155 !important;
                    -webkit-text-fill-color: #334155 !important;
                }

                .quote-blue-skin .quote-solid-popover a {
                    color: #1d4ed8 !important;
                    -webkit-text-fill-color: #1d4ed8 !important;
                }

                .quote-blue-skin .quote-solid-sidebar {
                    background-color: #f8fafc !important;
                    background-image: none !important;
                    border-color: #cbd5e1 !important;
                }

                .quote-blue-skin .quote-solid-sidebar [class*="bg-white"],
                .quote-blue-skin .quote-solid-sidebar [class*="bg-slate"],
                .quote-blue-skin .quote-solid-sidebar [class*="bg-gray"] {
                    background-color: #f8fafc !important;
                    background-image: none !important;
                    border-color: #cbd5e1 !important;
                }

                .quote-blue-skin .quote-solid-sidebar,
                .quote-blue-skin .quote-solid-sidebar [class*="text-"],
                .quote-blue-skin .quote-solid-sidebar h1,
                .quote-blue-skin .quote-solid-sidebar h2,
                .quote-blue-skin .quote-solid-sidebar h3,
                .quote-blue-skin .quote-solid-sidebar p,
                .quote-blue-skin .quote-solid-sidebar span,
                .quote-blue-skin .quote-solid-sidebar div {
                    color: #334155 !important;
                    -webkit-text-fill-color: #334155 !important;
                }

                .quote-blue-skin .option-card {
                    border-color: rgba(255, 255, 255, 0.32) !important;
                    box-shadow: 0 8px 18px rgba(0, 53, 72, 0.16) !important;
                }

                .quote-blue-skin .option-inactive {
                    background: var(--qb-option) !important;
                    color: #ffffff !important;
                }

                .quote-blue-skin .option-active {
                    background: var(--qb-option-active) !important;
                    border-color: rgba(255, 255, 255, 0.58) !important;
                    box-shadow: 0 10px 24px rgba(0, 53, 72, 0.28) !important;
                    color: #ffffff !important;
                }

                .quote-blue-skin .option-card,
                .quote-blue-skin .option-card *,
                .quote-blue-skin .option-inactive,
                .quote-blue-skin .option-active {
                    color: #ffffff !important;
                    -webkit-text-fill-color: #ffffff !important;
                }

                .quote-blue-skin .radial-dot-inactive {
                    background: rgba(255, 255, 255, 0.35) !important;
                }

                .quote-blue-skin .radial-dot-inactive .radial-dot-core {
                    background: #ffffff !important;
                }

                .quote-blue-skin input,
                .quote-blue-skin select,
                .quote-blue-skin textarea {
                    background: var(--qb-panel-dark) !important;
                    color: #ffffff !important;
                    border-color: rgba(255, 255, 255, 0.45) !important;
                }

                .quote-blue-skin input::placeholder,
                .quote-blue-skin textarea::placeholder {
                    color: rgba(255, 255, 255, 0.8) !important;
                    -webkit-text-fill-color: rgba(255, 255, 255, 0.8) !important;
                }

                .quote-blue-skin,
                .quote-blue-skin h1,
                .quote-blue-skin h2,
                .quote-blue-skin h3,
                .quote-blue-skin h4,
                .quote-blue-skin h5,
                .quote-blue-skin h6,
                .quote-blue-skin p,
                .quote-blue-skin span,
                .quote-blue-skin label,
                .quote-blue-skin a,
                .quote-blue-skin svg,
                .quote-blue-skin [class*="text-"] {
                    color: #ffffff !important;
                    -webkit-text-fill-color: #ffffff !important;
                }

                .quote-blue-skin [class*="text-muted"],
                .quote-blue-skin [class*="text-slate"],
                .quote-blue-skin [class*="text-gray"] {
                    color: #e8f8ff !important;
                    -webkit-text-fill-color: #e8f8ff !important;
                }

                @media (prefers-color-scheme: dark) {
                    .quote-blue-skin .quote-page-bg {
                        background: var(--qb-base) !important;
                        background-image: radial-gradient(circle at top, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.00) 44%), linear-gradient(180deg, var(--qb-mid) 0%, var(--qb-deep) 100%) !important;
                    }

                    .quote-blue-skin .page-header-clean:not(.page-header-blue),
                    .quote-blue-skin .quote-trust-card,
                    .quote-blue-skin .quote-question-shell {
                        background-color: var(--qb-panel) !important;
                    }

                    .quote-blue-skin .page-header-clean:not(.page-header-blue),
                    .quote-blue-skin .quote-trust-card,
                    .quote-blue-skin .quote-question-shell,
                    .quote-blue-skin .quote-question-shell [class*="bg-slate"],
                    .quote-blue-skin .quote-question-shell [class*="bg-gray"] {
                        border-color: rgba(255, 255, 255, 0.35) !important;
                    }

                    .quote-blue-skin,
                    .quote-blue-skin [class*="text-"] {
                        color: #ffffff !important;
                        -webkit-text-fill-color: #ffffff !important;
                    }

                    .quote-blue-skin .quote-solid-popover {
                        background-color: #f8fafc !important;
                        border-color: #cbd5e1 !important;
                    }

                    .quote-blue-skin .quote-solid-popover,
                    .quote-blue-skin .quote-solid-popover *,
                    .quote-blue-skin .quote-solid-popover [class*="text-"] {
                        color: #334155 !important;
                        -webkit-text-fill-color: #334155 !important;
                    }

                    .quote-blue-skin .quote-solid-popover a {
                        color: #1d4ed8 !important;
                        -webkit-text-fill-color: #1d4ed8 !important;
                    }

                    .quote-blue-skin .quote-solid-sidebar,
                    .quote-blue-skin .quote-solid-sidebar *,
                    .quote-blue-skin .quote-solid-sidebar [class*="text-"] {
                        color: #334155 !important;
                        -webkit-text-fill-color: #334155 !important;
                    }
                }
            `}),e]})}let $t={data:""},Ht=e=>{if(typeof window=="object"){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||$t},Lt=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,Qt=/\/\*[^]*?\*\/|  +/g,de=/\n+/g,O=(e,t)=>{let a="",r="",n="";for(let o in e){let s=e[o];o[0]=="@"?o[1]=="i"?a=o+" "+s+";":r+=o[1]=="f"?O(s,o):o+"{"+O(s,o[1]=="k"?"":t)+"}":typeof s=="object"?r+=O(s,t?t.replace(/([^,])+/g,c=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,u=>/&/.test(u)?u.replace(/&/g,c):c?c+" "+u:u)):o):s!=null&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),n+=O.p?O.p(o,s):o+":"+s+";")}return a+(t&&n?t+"{"+n+"}":n)+r},N={},ge=e=>{if(typeof e=="object"){let t="";for(let a in e)t+=a+ge(e[a]);return t}return e},Bt=(e,t,a,r,n)=>{let o=ge(e),s=N[o]||(N[o]=(u=>{let m=0,f=11;for(;m<u.length;)f=101*f+u.charCodeAt(m++)>>>0;return"go"+f})(o));if(!N[s]){let u=o!==e?e:(m=>{let f,g,x=[{}];for(;f=Lt.exec(m.replace(Qt,""));)f[4]?x.shift():f[3]?(g=f[3].replace(de," ").trim(),x.unshift(x[0][g]=x[0][g]||{})):x[0][f[1]]=f[2].replace(de," ").trim();return x[0]})(e);N[s]=O(n?{["@keyframes "+s]:u}:u,a?"":"."+s)}let c=a&&N.g?N.g:null;return a&&(N.g=N[s]),((u,m,f,g)=>{g?m.data=m.data.replace(g,u):m.data.indexOf(u)===-1&&(m.data=f?u+m.data:m.data+u)})(N[s],t,r,c),s},Xt=(e,t,a)=>e.reduce((r,n,o)=>{let s=t[o];if(s&&s.call){let c=s(a),u=c&&c.props&&c.props.className||/^go/.test(c)&&c;s=u?"."+u:c&&typeof c=="object"?c.props?"":O(c,""):c===!1?"":c}return r+n+(s??"")},"");function X(e){let t=this||{},a=e.call?e(t.p):e;return Bt(a.unshift?a.raw?Xt(a,[].slice.call(arguments,1),t.p):a.reduce((r,n)=>Object.assign(r,n&&n.call?n(t.p):n),{}):a,Ht(t.target),t.g,t.o,t.k)}let pe,J,K;X.bind({g:1});let j=X.bind({k:1});function It(e,t,a,r){O.p=t,pe=e,J=a,K=r}function D(e,t){let a=this||{};return function(){let r=arguments;function n(o,s){let c=Object.assign({},o),u=c.className||n.className;a.p=Object.assign({theme:J&&J()},c),a.o=/ *go\d+/.test(u),c.className=X.apply(a,r)+(u?" "+u:"");let m=e;return e[0]&&(m=c.as||e,delete c.as),K&&m[0]&&K(c),pe(m,c)}return n}}var Rt=e=>typeof e=="function",U=(e,t)=>Rt(e)?e(t):e,Gt=(()=>{let e=0;return()=>(++e).toString()})(),Vt=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),zt=20,ye="default",xe=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(s=>s.id===t.toast.id?{...s,...t.toast}:s)};case 2:let{toast:r}=t;return xe(e,{type:e.toasts.find(s=>s.id===r.id)?1:0,toast:r});case 3:let{toastId:n}=t;return{...e,toasts:e.toasts.map(s=>s.id===n||n===void 0?{...s,dismissed:!0,visible:!1}:s)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(s=>s.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(s=>({...s,pauseDuration:s.pauseDuration+o}))}}},Jt=[],Kt={toasts:[],pausedAt:void 0,settings:{toastLimit:zt}},Y={},we=(e,t=ye)=>{Y[t]=xe(Y[t]||Kt,e),Jt.forEach(([a,r])=>{a===t&&r(Y[t])})},ke=e=>Object.keys(Y).forEach(t=>we(e,t)),Ut=e=>Object.keys(Y).find(t=>Y[t].toasts.some(a=>a.id===e)),Z=(e=ye)=>t=>{we(t,e)},Zt=(e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:a?.id||Gt()}),_=e=>(t,a)=>{let r=Zt(t,e,a);return Z(r.toasterId||Ut(r.id))({type:2,toast:r}),r.id},y=(e,t)=>_("blank")(e,t);y.error=_("error");y.success=_("success");y.loading=_("loading");y.custom=_("custom");y.dismiss=(e,t)=>{let a={type:3,toastId:e};t?Z(t)(a):ke(a)};y.dismissAll=e=>y.dismiss(void 0,e);y.remove=(e,t)=>{let a={type:4,toastId:e};t?Z(t)(a):ke(a)};y.removeAll=e=>y.remove(void 0,e);y.promise=(e,t,a)=>{let r=y.loading(t.loading,{...a,...a?.loading});return typeof e=="function"&&(e=e()),e.then(n=>{let o=t.success?U(t.success,n):void 0;return o?y.success(o,{id:r,...a,...a?.success}):y.dismiss(r),n}).catch(n=>{let o=t.error?U(t.error,n):void 0;o?y.error(o,{id:r,...a,...a?.error}):y.dismiss(r)}),e};var ea=j`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,ta=j`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,aa=j`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,ra=D("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ea} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${ta} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${aa} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,na=j`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,oa=D("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${na} 1s linear infinite;
`,sa=j`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,ia=j`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,la=D("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${sa} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${ia} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,ca=D("div")`
  position: absolute;
`,ua=D("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,da=j`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ma=D("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${da} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,fa=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return t!==void 0?typeof t=="string"?h.createElement(ma,null,t):t:a==="blank"?null:h.createElement(ua,null,h.createElement(oa,{...r}),a!=="loading"&&h.createElement(ca,null,a==="error"?h.createElement(ra,{...r}):h.createElement(la,{...r})))},ha=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,ba=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,ga="0%{opacity:0;} 100%{opacity:1;}",pa="0%{opacity:1;} 100%{opacity:0;}",ya=D("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,xa=D("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,wa=(e,t)=>{let a=e.includes("top")?1:-1,[r,n]=Vt()?[ga,pa]:[ha(a),ba(a)];return{animation:t?`${j(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${j(n)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}};h.memo(({toast:e,position:t,style:a,children:r})=>{let n=e.height?wa(e.position||t||"top-center",e.visible):{opacity:0},o=h.createElement(fa,{toast:e}),s=h.createElement(xa,{...e.ariaProps},U(e.message,e));return h.createElement(ya,{className:e.className,style:{...n,...a,...e.style}},typeof r=="function"?r({icon:o,message:s}):h.createElement(h.Fragment,null,o,s))});It(h.createElement);X`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;export{Na as A,ja as B,y as n};
