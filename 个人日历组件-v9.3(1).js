// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: magic;
// ===== v9.3 优化版 =====
// 0. 新增昼夜深浅自动切换：跟随系统深色外观（Device.isUsingDarkAppearance），
//    系统切深色时组件自动换深色配色；毛玻璃背景模式保持原有逻辑不变。
// 1. 天气新增降水概率：概率 >=30% 时在低温下方显示 💧xx%
// 2. 「宜」按日常相关词优先排序并截断到 12 项，冷门事项不再铺满
// 3. 除夕进度条标注百分比：奔向团圆 · xx%
// 4. 天气条绿色降低饱和（搜索 green= 可找到那行常量；原值 #284d43，改一处即可还原）
// 5. 组件内定位超时 8s -> 12s；定位占位名去掉写死的「中国」
// 未改动：头部身份区与整体坐标（避免盲改错位）、天气时区 Asia/Shanghai（与新加坡同为 UTC+8）
const wnlAlmanac=(()=>{
 let offset=0;
 const U=Array.from("5effffffgfggfggfgfgfffef5feffffgfgfggfggfgfffffe5ffeffgffggfggfgfgffffff5fffffffgfgfgggfgfffffff6effffffgfggfggfgfgfffef5feffffgfgfggfggfgfffffe5ffeffgffgfgggfgfgffffff5fffffffgfgfgggfgfffffff6effffffgfggfggfgfgfffef5feffffgfgfggfggfgfffffe5ffeffgffgfgggfgfgffffff5fffffffgfgfgggfgfffffff6effffffgfggfggfgfgffeff5efffffgfgfggfggffgffffe5feffffgfgfgggfgfgffffff5fffegfffggfggfggfffffff5fffffffgfggfggfgffgfeff5efffffgffgggfggffgffffe5feffffgfgfgggfgfgfffffe5fffegfffggfggfggfffffff5fffffffgfggfggfgffgfeff5effffffgfgggfggffgfffef5feffffgfgfgggfgfgfffffe5ffeffgffggfggfggfffffff5fffffffgfggfggfgffgfeff5effffffgfgggfggffgfffef5feffffgfgfggfggfgfffffe5ffeffgffggfggfggfffffff5fffffffgfggfggfgfffffff5effffffgfggfggfgfgfffef5feffffgfgfggfggfgfffffe5ffeffgffggfggfgfgffffff5fffffffgfgfgggfgfffffff5effffffgfggfggfgfgfffef5feffffgfgfggfggfgfffffe5ffeffgffgfgggfgfgffffff5fffffffgfgfgggfgfffffff5effffffgfggfggfgfgfffef5feffffgfgfggfggfgfffffe5ffeffgffgfgggfgfgffffff5fffffffgfgfgggfgfffffff5effffffgfggfggfgfgfffef5feffffgfgfggfggfgfffffe5ffeffgffgfgggfgfgffffff5ffffffffggfgggfgfffffff5effffffgfggfggfgffgfeff5efffffgfgfggfggffgffffe5feffffgfgfgggfgfgffffff5fffegfffggfggfggfffffff4fffffffgfggfggfgffgfeff5effffffgfgggfggffgffffe5feffffgfgfgggfgfgffffff5fffegfffggfggfggfffffff4fffffffgfggfggfgffgfeff5effffffgfgggfggffgfffef5feffffgfgfggfggfgfffffe5fffefgffggfggfggfffffff4fffffffgfggfggfgffgfeff5effffffgfggfggfgfgfffef5feffffgfgfggfggfgfffffe5ffeffgffggfggfgfgffffff4fffffffgfgfgggfgfffffff5effffffgfggfggfgfgfffef5feffffgfgfggfggfgfffffe5ffeffgffggfggfgfgffffff4fffffffgfgfgggfgfffffff5effffffgfggfggfgfgfffef5feffffgfgfggfggfgfffffe5ffeffgffgfgggfgfgffffff4fffffffgfgfgggfgfffffff5effffffgfggfggfgfgfffef5feffffgfgfggfggfgfffffe5ffeffgffgfgggfgfgffffff4ffffffffggfgggfgfffffff5effffffgfggfggfgfgfffef5feffffgfgfggfggffgffffe5ffefffgfgfgggfgfgffffff4ffffffffggfggfggfffffff5effffffgfggfggfgffgffef5efffffgffgggfggffgffffe5ffefffgfgfgggfgfgffffff4ffffffffggfggfggfffffff5effffffgfggfggfgffgfeff5effffffgfgggfggffgffffe5feffffgfgfggfggfgffffff4fffegfffggfggfggfffffff4fffffffgfggfggfgffgfeff5effffffgfggfgggffgfffef5feffffgfgfggfggfgfffffe4fffefgffggfggfgfgffffff4fffffffgfgfgggfgffgfeff5effffffgfggfggfgfgfffef5feffffgfgfggfggfgfffffe4ffeffgffggfggfgfgffffff4fffffffgfgfgggfgfffffff5effffffgfggfggfgfgfffef5feffffgfgfggfggfgfffffe4ffeffgffgfgggfgfgffffff4fffffffgfgfgggfgfffffff5effffffgfggfggfgfgfffef5feffffgfgfggfggfgfffffe4ffeffgffgfgggfgfgffffff4fffffffgfgfgggfgfffffff5effffffgfggfggfgfgfffef5feffffgfgfggfggfgfffffe4ffeffgffgfgggfgfgffffff4ffffffffggfggfggfffffff5effffffgfggfggfgfgfffef5feffffgfgfggfggffgffffe4ffefffgfgfgggfgfgffffff4ffffffffggfggfggfffffff5effffffgfggfggfgffgffef5feffffgffgggfggffgffffe4ffefffgfgfggfggfgffffff4ffffffffggfggfggfffffff5effffffgfggfggfgffgfeff5effffffgfgggfggffgffffe4feffffgfgfggfggfgffffff4fffegfffggfggfggfffffff4fffffffgfgfgggfgffgfeff5effffffgfggfggfgfgffffe4feffffgfgfggfggfgfffffe4fffefgffggfggfgfgffffff4fffffffgfgfgggfgffgfeff5effffffgfggfggfgfgfffef4feffffgfgfggfggfgfffffe4ffeffgffgfgggfgfgffffff4fffffffgfgfgggfgfffffff5effffffgfggfggfgfgfffef4feffffgfgfggfggfgfffffe4ffeffgffgfgggfgfgffffff4fffffffgfgfgggfgfffffff5effffffgfggfggfgfgfffef4feffffgfgfggfggfgfffffe4ffeffgffgfgggfgfgffffff4ffffffffggfggfggfffffff5effffffgfggfggfgfgfffef4feffffgfgfggfggfgfffffe4ffeffgffgfgggfgfgffffff4ffffffffggfggfggfffffff5effffffgfggfggfgfgfffef4feffffgffgggfggffgffffe4ffefffgfgfgggfgfgffffff4ffffffffggfggfggfffffff5effffffgfggfggfgffgffef4fefffffgfgggfggffgffffe4ffefffgfgfggfggfgffffff4ffffffffggfggfggfffffff5effffffgfgfgggfgffgfeff4effffffgfggfggfgfgffffe4feffffgfgfggfggfgffffff4fffefgffggfggfgfgffffff4fffffffgfgfgggfgffgfeff4effffffgfggfggfgfgffffe4feffffgfgfggfggfgffffff4fffefgffgfgggfgfgffffff4fffffffgfgfgggfgffgfeff4effffffgfggfggfgfgfffef4feffffgfgfggfggfgfffffe4fffefgffgfgggfgfgffffff4fffffffgfgfgggfgfffffff4effffffgfggfggfgfgfffef4feffffgfgfggfggfgfffffe4ffeffgffgfgggfgfgffffff4fffffffgfgfgggfgfffffff4effffffgfggfggfgfgfffef4feffffgfgfggfggfgfffffe4ffeffgffgfgggfgfgffffff4ffffffffggfggfggfffffff4effffffgfggfggfgfgfffef4feffffgffgggfggffgffffe4ffeffgffgfgggfgfgffffff4ffffffffggfggfggfffffff4effffffgfggfggfgffgffef4feffffgffgggfggffgffffe4ffefffgfgfggfggfgffffff4ffffffffggfggfggfffffff4effffffgfggfggfgffgffef4fefffffgfggfgggffgffffe4ffefffgfgfggfggfgffffff4ffffffffggfggfggfffffff4effffffgfgfgggfgffgfeff4fefffffgfggfggfgfgffffe4feffffgfgfggfggfgffffff4fffefgffggfggfgfgffffff3fffffffgfgfgggfgffgfeff4effffffgfggfggfgfgffffe4feffffgfgfggfggfgffffff4fffefgffgfgggfgfgffffff3fffffffgfgfgggfgffgfeff4effffffgfggfggfgfgfffef4feffffgfgfggfggfgfffffe4fffefgffgfgggfgfgffffff3fffffffgfgfgggfgfffffff4effffffgfggfggfgfgfffef4feffffgfgfggfggfgfffffe4ffeffgffgfgggfgfgffffff3fffffffgfgfggfggfffffff4effffffgfggfggfgfgfffef4feffffgfgfggfggfgfffffe4ffeffgffgfgggfgfgffffff", (value,index)=>offset=(index%24?offset:0)+parseInt(value,36));
 const z={
  "solar2lunar":function(e,t,n){var base=JSON.parse(JSON.stringify(z.solar2lunarBase(e,t,n))),r=z.toGanZhiYear2(e,base.cMonth-1,n,base.lYear);return base.gzYear2=r,base;},
  "leapMonth":function(e){return 15&z.lunarInfo[e-1900];},
  "getYJ":function(e,t,n,r){var o=z.solar2lunar(e,t,n),l=z.getYJSqlFields(new Date(e,t,n)),c=r[l[1]+"-"+l[0]];return(o.is4jue||o.is4li)&&(c={y:"-",j:"大事勿用 结婚 动手术 搬家 开工开业 建房 出行上任 安葬"}),c;},
  "getLunarHourIndex":function(e){return(Math.floor(e/2)+e%2)%12;},
  "getStemsBranchHourAsString":function(e,t){e=new Date(e);var n=z.getLunarHourIndex(t);return z.formatStemsBranchString(z.getStemBranchHour(e,n));},
  "cxInfoOfDateTime":function(e,t){var n=z.branchIndexOfSolar(e,t),r=z.chongIndexOfDateTime(n),o=z.shaDirectionOfDateTime(n);try{return"冲"+z.ANIMAL[r]+"煞"+z.CompassNames[o].replace("正","");}catch(e){return"";}},
  "compassCNOfDate":function(e,t){var n=z.getStemBranchHour(e,t)%10,r=z.caiCompassValueOfStemIndex(n),o=z.xiCompassValueOfStemIndex(n),l=z.fuCompassValueOfStemIndex(n);return"喜神"+z.CompassNames[o]+" 财神"+z.CompassNames[r]+" 福神"+z.CompassNames[l];},
  "jixiongStatusOfDateTime":function(e,t){var n=z.JXStatusUnknown,r=z.getStemsBranchDay(e)%12;if(r>-1&&r<60){var o=0;0==r||6==r?o=8:1==r||7==r?o=10:2==r||8==r?o=0:3==r||9==r?o=2:4==r||10==r?o=4:5!=r&&11!=r||(o=6);var l=z.getLunarHourIndex(t)-o;l<0&&(l+=12),n=0==l||1==l||4==l||5==l||7==l||10==l?z.JXStatusJi:z.JXStatusXiong;}return z.getJXName(n);},
  "JXStatusUnknown":-1,
  "getStemsBranchDay":function(e){var t=z.getIntervalDays(z.BASE_STEMS_DATE,e);return t>0?(6*parseInt((t+9)%10)-5*parseInt((t+3)%12)+60)%60:-1;},
  "JXStatusJi":0,
  "JXStatusXiong":1,
  "getJXName":function(e){return e<0||e>z.JXNames.length?"":z.JXNames[e];},
  "JXNames":["吉","凶"],
  "getIntervalDays":function(e,t){var n=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate()),r=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate());return Math.floor((r-n)/864e5);},
  "BASE_STEMS_DATE":new Date(1899,1,4,0,0,0,0),
  "getStemBranchHour":function(e,t){var n=z.getIntervalDays(z.BASE_STEMS_DATE,e),dt=parseInt((n+9)%10);return(6*((t+2*(dt>4?dt-5:dt))%10)-5*t+60)%60;},
  "caiCompassValueOfStemIndex":function(e){var t=z.CompassUnknown;switch(e){case 0:t=z.CompassNortheast;break;case 1:t=z.CompassSouthwest;break;case 2:case 3:t=z.CompassWest;break;case 4:case 5:t=z.CompassNorth;break;case 6:case 7:t=z.CompassEast;break;case 8:case 9:t=z.CompassSouth;}return t;},
  "xiCompassValueOfStemIndex":function(e){var t=z.CompassUnknown;switch(e){case 0:case 5:t=z.CompassNortheast;break;case 1:case 6:t=z.CompassNorthwest;break;case 2:case 7:t=z.CompassSouthwest;break;case 3:case 8:t=z.CompassSouth;break;case 4:case 9:t=z.CompassSoutheast;}return t;},
  "fuCompassValueOfStemIndex":function(e){var t=z.CompassUnknown;switch(e){case 0:case 1:t=z.CompassSoutheast;break;case 2:case 3:t=z.CompassEast;break;case 4:t=z.CompassNorth;break;case 5:t=z.CompassSouth;break;case 6:case 7:t=z.CompassSouthwest;break;case 8:t=z.CompassNorthwest;break;case 9:t=z.CompassWest;}return t;},
  "CompassNames":["正北","东北","正东","东南","正南","西南","正西","西北"],
  "CompassUnknown":-1,
  "CompassSoutheast":3,
  "CompassEast":2,
  "CompassNorth":0,
  "CompassSouth":4,
  "CompassSouthwest":5,
  "CompassNorthwest":7,
  "CompassWest":6,
  "CompassNortheast":1,
  "branchIndexOfSolar":function(e,t){return-2==t?z.getBranchDay(e):z.getStemBranchHour(e,t)%12;},
  "chongIndexOfDateTime":function(e){var t=-1;switch(e){case 0:t=6;break;case 1:t=7;break;case 2:t=8;break;case 3:t=9;break;case 4:t=10;break;case 5:t=11;break;case 6:t=0;break;case 7:t=1;break;case 8:t=2;break;case 9:t=3;break;case 10:t=4;break;case 11:t=5;}return t;},
  "shaDirectionOfDateTime":function(e){var t=z.CompassUnknown;switch(e){case 0:case 4:case 8:t=z.CompassSouth;break;case 1:case 5:case 9:t=z.CompassEast;break;case 2:case 6:case 10:t=z.CompassNorth;break;case 3:case 7:case 11:t=z.CompassWest;}return t;},
  "ANIMAL":["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"],
  "getBranchDay":function(e){var t=z.getIntervalDays(z.BASE_STEMS_DATE,e);return t>0?Math.floor((t+3)%12):0;},
  "formatStemsBranchString":function(e){return e<0?"":z.Gan[e%10]+z.Zhi[e%12];},
  "Gan":["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"],
  "Zhi":["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"],
  "getYJSqlFields":function(e){var t=["-1","-1"],n=z.twentyFourTermdaysOf(e);if(2==n.length){var a=n[0],b=n[1],r=Math.floor(a%2==0?a/2:a/2+1);b>0&&a%2==0&&(r+=1);var o=new Date(1901,0,1),l=Math.abs(z.getIntervalDays(o,e));t[0]=(15+l)%60+"",t[1]=Math.floor(Math.abs((5+l-r)%12))+"";}return t;},
  "twentyFourTermdaysOf":function(e){try{for(var t=e.getFullYear()-1900,n=z.dayOfYear(e)-1,r=0,o=0,i=0;i<24;i++){var l=U[24*t+i];if(l>n){r=i,o=0;break;}if(l==n){r=i,o=1;break;}}return[r+24*t-24,o];}catch(e){return null;}},
  "dayOfYear":function(e){e=new Date(e);for(var t=new Array(31,28,31,30,31,30,31,31,30,31,30,31),n=e.getDate(),r=e.getMonth(),o=e.getFullYear(),l=0,i=0;i<r;i++)l+=t[i];return l+=n,(r>1&&o%4==0&&o%100!=0||o%400==0)&&(l+=1),l;},
  "lunarInfo":[19416,19168,42352,21717,53856,55632,91476,22176,39632,21970,19168,42422,42192,53840,119381,46400,54944,44450,38320,84343,18800,42160,46261,27216,27968,109396,11104,38256,21234,18800,25958,54432,59984,28309,23248,11104,100067,37600,116951,51536,54432,120998,46416,22176,107956,9680,37584,53938,43344,46423,27808,46416,86869,19872,42416,83315,21168,43432,59728,27296,44710,43856,19296,43748,42352,21088,62051,55632,23383,22176,38608,19925,19152,42192,54484,53840,54616,46400,46752,103846,38320,18864,43380,42160,45690,27216,27968,44870,43872,38256,19189,18800,25776,29859,59984,27480,23232,43872,38613,37600,51552,55636,54432,55888,30034,22176,43959,9680,37584,51893,43344,46240,47780,44368,21977,19360,42416,86390,21168,43312,31060,27296,44368,23378,19296,42726,42208,53856,60005,54576,23200,30371,38608,19195,19152,42192,118966,53840,54560,56645,46496,22224,21938,18864,42359,42160,43600,111189,27936,44448,84835,37744,18936,18800,25776,92326,59984,27424,108228,43744,41696,53987,51552,54615,54432,55888,23893,22176,42704,21972,21200,43448,43344,46240,46758,44368,21920,43940,42416,21168,45683,26928,29495,27296,44368,84821,19296,42352,21732,53600,59752,54560,55968,92838,22224,19168,43476,41680,53584,62034,54560],
  "solar2lunarBase":function(e,t,n){if(e<1900||e>2100)return-1;if(1900==e&&0==t&&n<31)return-1;var i,r,o=new Date(),l=0;e=(o=e?new Date(e,parseInt(t),n):new Date()).getFullYear(),t=o.getMonth(),n=o.getDate(),t++;var c=(Date.UTC(o.getFullYear(),o.getMonth(),o.getDate())-Date.UTC(1900,0,31))/864e5;for(i=1900;i<2101&&c>0;i++)c-=l=z.lYearDays(i);c<0&&(c+=l,i--);var d=new Date(),f=!1;d.getFullYear()==e&&d.getMonth()+1==t&&d.getDate()==n&&(f=!0);var h=o.getDay(),v=z.nStr1[h],m=i;r=z.leapMonth(i);var y=!1;for(i=1;i<13&&c>0;i++)r>0&&i==r+1&&0==y?(--i,y=!0,l=z.leapDays(m)):l=z.monthDays(m,i),1==y&&i==r+1&&(y=!1),c-=l;0==c&&r>0&&i==r+1&&(y?y=!1:(y=!0,--i)),c<0&&(c+=l,--i);var w=i,S=c+1,Y=t-1,x=z.toGanZhiYear(e,t-1,n),J=z.getTerm(e,2*t-1),_=z.getTerm(e,2*t),E=z.toGanZhi(12*(e-1900)+t+11);n>=J&&(E=z.toGanZhi(12*(e-1900)+t+12));var C=!1,T=null;J===n&&(C=!0,T=z.solarTerm[2*t-2]),_===n&&(C=!0,T=z.solarTerm[2*t-1]);var k=!1,j=!1;J-1===n&&-1!=[2,8,14,20].indexOf(2*t-2)&&(k=!0),_-1===n&&-1!=[5,11,17,23].indexOf(2*t-1)&&(j=!0);var O=Date.UTC(e,Y,1,0,0,0,0)/864e5+25567+10,L=z.toGanZhi(O+n-1),D=z.toAstro(t,n);return{lYear:m,lMonth:w,lDay:S,Animal:z.getAnimal(t<2||2===t&&n<z.getTerm(e,3)?e-1:e),Animal2:z.getAnimal(m),IMonthCn:(y?"闰":"")+z.toChinaMonth(w),IDayCn:z.toChinaDay(S),cYear:e,cMonth:t,cDay:n,gzYear:x,gzMonth:E,gzDay:L,isToday:f,isLeap:y,nWeek:h,ncWeek:"星期"+v,isTerm:C,Term:T,is4jue:k,is4li:j,astro:D};},
  "toGanZhiYear2":function(e,t,n,r){var o=z.toGanZhiYear(e,t,n),l=z.lunar2solarBase(e,1,1,0),c=new Date(l.cYear,l.cMonth-1,l.cDay),d=z.getTermTime(e,3),f=z.solar2lunarBase(d.getFullYear(),d.getMonth(),d.getDate()),h=new Date(d.getTime()-864e5),v=z.solar2lunarBase(h.getFullYear(),h.getMonth(),h.getDate()),m=new Date(e,t,n);return c.getTime()>=d.getTime()?m.getTime()>=d.getTime()&&m.getTime()<c.getTime()&&(o=v.gzYear):m.getTime()>=c.getTime()&&m.getTime()<=d.getTime()&&(o=f.gzYear),o;},
  "toGanZhiYear":function(e,t,n){var r="";r=t<2?z.cyclical(e-1900+36-1):z.cyclical(e-1900+36);var o=z.getTerm(e,3);return 1===t&&n>=o&&(r=z.cyclical(e-1900+36)),r;},
  "lunar2solarBase":function(e,t,n,r){r=!!r;var o=z.leapMonth(e);if(r&&o!=t)return-1;if(2100==e&&12==t&&n>1||1900==e&&1==t&&n<31)return-1;var l=z.monthDays(e,t),c=l;if(r&&(c=z.leapDays(e,t)),e<1900||e>2100||n>c)return-1;for(var d=0,i=1900;i<e;i++)d+=z.lYearDays(i);var f=0,h=!1;for(i=1;i<t;i++)f=z.leapMonth(e),h||f<=i&&f>0&&(d+=z.leapDays(e),h=!0),d+=z.monthDays(e,i);r&&(d+=l);var v=Date.UTC(1900,1,30,0,0,0),m=new Date(864e5*(d+n-31)+v),y=m.getUTCFullYear(),w=m.getUTCMonth(),S=m.getUTCDate();return z.solar2lunarBase(y,w,S);},
  "getTermTime":function(e,t){var n=z.getOffsetByTerm(e,t-1);return z.getDateObjByOffset(e,n);},
  "getOffsetByTerm":function(e,t){return t<0?-1:U[24*(e-1900)+t];},
  "getDateObjByOffset":function(e,t){var n=new Date(e,0,1,0,0,0,0);return n.setDate(n.getDate()+t),n;},
  "monthDays":function(e,t){return t>12||t<1?-1:z.lunarInfo[e-1900]&65536>>t?30:29;},
  "leapDays":function(e){return z.leapMonth(e)?65536&z.lunarInfo[e-1900]?30:29:0;},
  "lYearDays":function(e){var i,t=348;for(i=32768;i>8;i>>=1)t+=z.lunarInfo[e-1900]&i?1:0;return t+z.leapDays(e);},
  "cyclical":function(e){return z.Gan[e%10]+z.Zhi[e%12];},
  "getTerm":function(e,t){var n=z.getOffsetByTerm(e,t-1);return z.getDateObjByOffset(e,n).getDate();},
  "nStr1":["日","一","二","三","四","五","六","七","八","九","十"],
  "toGanZhi":function(e){return z.Gan[e%10]+z.Zhi[e%12];},
  "solarTerm":["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"],
  "toAstro":function(e,t){return"摩羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手摩羯".substr(2*e-(t<[20,19,21,20,21,22,23,23,23,24,23,22][e-1]?2:0),2)+"座";},
  "getAnimal":function(e){var t=(e-1900)%12;return z.Animals[t];},
  "toChinaMonth":function(e){if(e>12||e<1)return-1;var s=z.nStr3[e-1];return s+="月";},
  "toChinaDay":function(e){var s;switch(e){case 10:s="初十";break;case 20:s="二十";break;case 30:s="三十";break;default:s=z.nStr2[Math.floor(e/10)],s+=z.nStr1[e%10];}return s;},
  "nStr2":["初","十","廿","卅"],
  "nStr3":["正","二","三","四","五","六","七","八","九","十","冬","腊"],
  "Animals":["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"]
 };
 return {calendar:z};
})();

function birthdayMatches(date){
 const b=preferences.birth;
 if(b.calendar==='solar')return date.getUTCMonth()+1===b.month&&date.getUTCDate()===b.day;
 const l=wnlAlmanac.calendar.solar2lunar(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate());
 return l.lMonth===b.month&&l.lDay===b.day&&!!l.isLeap===!!b.leap;
}
function birthdayCountdown(dateString=shanghaiDate()){
 const today=Date.parse(dateString+'T00:00:00Z');
 // Leap-month birthdays use the same regular lunar month in years without that leap month.
 function match(stamp){const d=new Date(stamp),b=preferences.birth;
 if(b.calendar==='solar'&&b.month===2&&b.day===29&&new Date(Date.UTC(d.getUTCFullYear(),2,0)).getUTCDate()===28)return d.getUTCMonth()===1&&d.getUTCDate()===28;
 if(b.calendar==='lunar'&&b.leap){const l=wnlAlmanac.calendar.solar2lunar(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate());return l.lMonth===b.month&&l.lDay===b.day&&!!l.isLeap===(wnlAlmanac.calendar.leapMonth(l.lYear)===b.month)}
 return birthdayMatches(d);}
 let days,elapsed;
 for(let i=0;i<800;i++)if(match(today+i*86400000)){days=i;break}
 for(let i=1;i<800;i++)if(match(today-i*86400000)){elapsed=i;break}
 if(days===undefined||elapsed===undefined)throw Error('生日日期超出日历支持范围');
 return {days,progress:days===0?1:elapsed/(elapsed+days)};
}

function newYearsEveProgress(dateString=shanghaiDate()){
 const [y,m,d]=dateString.split('-').map(Number),today=Date.UTC(y,m-1,d),dayMs=86400000;
 const eves=[];
 for(let year=y-1;year<=y+2;year++){
  for(let offset=0;offset<65;offset++){
   const stamp=Date.UTC(year,0,1)+offset*dayMs,date=new Date(stamp);
   const lunar=wnlAlmanac.calendar.solar2lunar(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate());
   if(lunar.lMonth===1&&lunar.lDay===1&&!lunar.isLeap){eves.push(stamp-dayMs);break;}
  }
 }
 const next=eves.find(stamp=>stamp>=today),previous=eves.filter(stamp=>stamp<next).pop();
 return {days:Math.round((next-today)/dayMs),percent:Math.max(0,Math.min(100,(today-previous)/(next-previous)*100)),date:new Date(next).toISOString().slice(0,10)};
}


function shanghaiDate(){const f=new DateFormatter();f.timeZone='Asia/Shanghai';f.dateFormat='yyyy-MM-dd';return f.string(new Date())}
const fm=FileManager.local();

const settingsPath=fm.joinPath(fm.documentsDirectory(),'haoye-profile-v1.json'),avatarPath=fm.joinPath(fm.documentsDirectory(),'haoye-avatar.png');
let preferences={name:'聊聊哇哇',mbti:'INTP',birth:{year:1995,month:3,day:4,calendar:'lunar',leap:false}};
try{const saved=JSON.parse(fm.readString(settingsPath));if(saved.name&&saved.birth){birthSolar(saved.birth);preferences={...preferences,...saved,mbti:normalizeMBTI(saved.mbti===undefined?'INTP':saved.mbti)}}}catch(_){}
const backgroundPath=fm.joinPath(fm.documentsDirectory(),'haoye-background-glass-v1.png');
const backgroundMetaPath=fm.joinPath(fm.documentsDirectory(),'haoye-background-glass-tone-v1.json');
function savePreferences(next){fm.writeString(settingsPath,JSON.stringify(next));preferences=next}
function normalizeMBTI(value){const mbti=String(value??'').normalize('NFKC').trim().toUpperCase();if(mbti&&!/^[EI][NS][TF][JP](?:-[AT])?$/.test(mbti))throw Error('请输入有效 MBTI，例如 INTP、ENFP 或 INFJ-T；留空可隐藏');return mbti}
async function message(title,body){const a=new Alert();a.title=title;a.message=body;a.addAction('好');await a.presentAlert()}
function birthSolar(b){
 if(!b||![b.year,b.month,b.day].every(Number.isSafeInteger)||!['solar','lunar'].includes(b.calendar)||b.year<1901||b.year>2098||b.month<1||b.month>12||b.day<1||b.day>31)throw Error('年份请输入1901—2098，月份和日期请填写有效数字');
 if(b.calendar==='solar'){const d=new Date(Date.UTC(b.year,b.month-1,b.day));if(d.getUTCMonth()+1!==b.month||d.getUTCDate()!==b.day)throw Error('这个公历日期不存在');return d}
 for(let i=0;i<430;i++){const d=new Date(Date.UTC(b.year,0,1)+i*86400000),l=wnlAlmanac.calendar.solar2lunar(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate());if(l.lYear===b.year&&l.lMonth===b.month&&l.lDay===b.day&&!!l.isLeap===b.leap)return d}
 throw Error('这个农历日期不存在，请检查月份、日期与闰月');
}
function zodiacFor(b){const d=birthSolar(b),v=(d.getUTCMonth()+1)*100+d.getUTCDate(),limits=[120,219,321,420,521,622,723,823,923,1024,1123,1222],names=['摩羯座','水瓶座','双鱼座','白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座'],slugs=['capricorn','aquarius','pisces','aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn'];let i=limits.findIndex(x=>v<x);if(i<0)i=12;return {name:names[i],slug:slugs[i]}}
// 仅在手机相册选图时处理一次；组件刷新直接读取已模糊的本地图片。
function boxBlurRGBA(data,width,height,radius,passes=3){
 if(width<1||height<1||data.length!==width*height*4)throw Error('图片像素数据无效');
 const r=Math.max(0,Math.floor(radius)),divisor=r*2+1;
 let src=new Uint8ClampedArray(data),tmp=new Uint8ClampedArray(data.length),out=new Uint8ClampedArray(data.length);
 if(r===0)return src;
 for(let pass=0;pass<passes;pass++){
  for(let y=0;y<height;y++)for(let channel=0;channel<4;channel++){
   let sum=0;for(let k=-r;k<=r;k++)sum+=src[(y*width+Math.max(0,Math.min(width-1,k)))*4+channel];
   for(let x=0;x<width;x++){tmp[(y*width+x)*4+channel]=sum/divisor;sum+=src[(y*width+Math.min(width-1,x+r+1))*4+channel]-src[(y*width+Math.max(0,x-r))*4+channel]}
  }
  for(let x=0;x<width;x++)for(let channel=0;channel<4;channel++){
   let sum=0;for(let k=-r;k<=r;k++)sum+=tmp[(Math.max(0,Math.min(height-1,k))*width+x)*4+channel];
   for(let y=0;y<height;y++){out[(y*width+x)*4+channel]=sum/divisor;sum+=tmp[(Math.min(height-1,y+r+1)*width+x)*4+channel]-tmp[(Math.max(0,y-r)*width+x)*4+channel]}
  }
  const previous=src;src=out;out=previous;
 }
 return src;
}
function processFrostedPhoto(dataURL,blurPixels){
 const img=new Image();
 img.onload=()=>{try{
  const width=720,height=752,canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const context=canvas.getContext('2d');context.fillStyle='#ffffff';context.fillRect(0,0,width,height);
  const scale=Math.max(width/img.width,height/img.height),drawWidth=img.width*scale,drawHeight=img.height*scale;
  context.drawImage(img,(width-drawWidth)/2,(height-drawHeight)/2,drawWidth,drawHeight);
  const pixels=context.getImageData(0,0,width,height);pixels.data.set(blurPixels(pixels.data,width,height,36,3));context.putImageData(pixels,0,0);
  let luminance=0,count=0;for(let i=0;i<pixels.data.length;i+=256){luminance+=pixels.data[i]*.2126+pixels.data[i+1]*.7152+pixels.data[i+2]*.0722;count++}
  completion(JSON.stringify({png:canvas.toDataURL('image/png').split(',')[1],luminance:Math.round(luminance/Math.max(1,count))}));
 }catch(_){completion('')}};
 img.onerror=()=>completion('');img.src=dataURL;
}
async function selectFrostedBackground(){
 try{
  const photo=await Photos.fromLibrary(),web=new WebView();
  const dataURL='data:image/png;base64,'+Data.fromPNG(photo).toBase64String();
  await web.loadHTML('<html><body></body></html>');
  const script='('+processFrostedPhoto.toString()+')('+JSON.stringify(dataURL)+','+boxBlurRGBA.toString()+');';
  const encoded=await web.evaluateJavaScript(script,true);if(!encoded)throw Error('照片处理失败，请换一张图片重试');
  const material=JSON.parse(encoded);if(!material||typeof material.png!=='string'||!material.png)throw Error('背景处理结果无效');
  const image=Image.fromData(Data.fromBase64String(material.png));if(!image)throw Error('无法读取处理后的图片');
  // 先写临时文件，避免取消选图或处理失败时覆盖已有背景。
  const temporary=backgroundPath+'.pending.png',backup=backgroundPath+'.previous.png';
  fm.writeImage(temporary,image);
  let hadPrevious=false;
  try{
   if(fm.fileExists(backup))fm.remove(backup);
   if(fm.fileExists(backgroundPath)){fm.move(backgroundPath,backup);hadPrevious=true}
   fm.move(temporary,backgroundPath);
  }catch(e){if(hadPrevious&&!fm.fileExists(backgroundPath)&&fm.fileExists(backup))fm.move(backup,backgroundPath);throw e}
  try{if(fm.fileExists(backup))fm.remove(backup)}catch(_){}
  try{fm.writeString(backgroundMetaPath,JSON.stringify({luminance:material.luminance}))}catch(_){}
  await message('背景已保存','已生成通透灰毛玻璃背景。返回菜单选择“预览大号组件”查看，可用“毛玻璃浓度”调节清透程度。');
 }catch(e){await message('背景未更换','未选择照片，或照片处理失败。'+(e&&e.message?'\n'+e.message:''))}
 finally{try{const temporary=backgroundPath+'.pending.png';if(fm.fileExists(temporary))fm.remove(temporary)}catch(_){}}
}
async function chooseGlassStrength(){
 const alert=new Alert();alert.title='毛玻璃浓度';alert.message='照片只保存在 Scriptable 本地。灰色材质层越浓，文字越清楚。';
 alert.addAction('轻透 · 更明显的背景色');alert.addAction('标准 · 推荐');alert.addAction('浓雾 · 更突出文字');alert.addCancelAction('取消');
 const choice=await alert.presentSheet();if(choice<0)return;
 try{savePreferences({...preferences,glassStyle:['light','standard','dense'][choice]});await message('毛玻璃浓度已保存','返回菜单预览，或等待桌面组件刷新。')}catch(e){await message('设置未保存',String(e.message||e))}
}
async function removeFrostedBackground(){
 try{if(fm.fileExists(backgroundPath))fm.remove(backgroundPath);try{if(fm.fileExists(backgroundMetaPath))fm.remove(backgroundMetaPath)}catch(_){}await message('已恢复奶白背景','再次选择背景图片即可启用照片毛玻璃效果。')}catch(e){await message('背景未清除',String(e.message||e))}
}

async function settingsMenu(){while(true){const a=new Alert();a.title='个人日历';a.message=preferences.name+' · '+zodiacFor(preferences.birth).name;a.addAction('预览大号组件');a.addAction('修改名称');a.addAction('设置出生日期');a.addAction('从相册选择头像');a.addAction('恢复默认头像');a.addAction('设置 MBTI');a.addAction('选择背景图片（毛玻璃）');a.addAction('毛玻璃浓度');a.addAction('恢复奶白背景');a.addCancelAction('取消');const action=await a.presentSheet();if(action<0)return false;if(action===0)return true;
 if(action===1){const n=new Alert();n.title='显示名称';n.message='建议2—8个字';n.addTextField('名称',preferences.name);n.addAction('保存');n.addCancelAction('取消');if(await n.presentAlert()===0){const value=String(n.textFieldValue(0)??'').trim();if(!value||Array.from(value).length>12)await message('名称未保存','请输入1—12个字');else{try{savePreferences({...preferences,name:value})}catch(e){await message('名称未保存',String(e.message||e))}}}}

 if(action===2){
  const c=new Alert();c.title='出生日期使用哪种历法？';c.addAction('公历');c.addAction('农历');c.addCancelAction('取消');
  const type=await c.presentSheet();if(type<0)continue;
  const b=preferences.birth,n=new Alert();n.title=type===0?'公历出生日期':'农历出生日期';n.message='输入数字年月日；农历初四填4。农历按出生年的公历日期匹配星座。';
  n.addTextField('出生年份',String(b.year));n.addTextField('月份',String(b.month));n.addTextField('日期',String(b.day));n.addAction(type===0?'保存':'下一步');n.addCancelAction('取消');
  if(await n.presentAlert()!==0)continue;
  try{
   // 在显示下一个弹窗前取出所有字段，避免旧 Alert 的字段被释放。
   const values=[0,1,2].map(i=>String(n.textFieldValue(i)??'').trim().replace(/[０-９]/g,ch=>String.fromCharCode(ch.charCodeAt(0)-65248)));
   if(values.some(v=>!/^\d+$/.test(v)))throw Error('年份、月份和日期不能为空，请填写整数年月日');
   const parts=values.map(Number);
   if(parts.some(v=>!Number.isSafeInteger(v)))throw Error('请输入有效的整数年月日');
   let leap=false;
   if(type===1){const l=new Alert();l.title='是否为闰月生日？';l.addAction('普通月份');l.addAction('闰月');l.addCancelAction('取消');const choice=await l.presentSheet();if(choice<0)continue;leap=choice===1}
   const birth={year:parts[0],month:parts[1],day:parts[2],calendar:type===0?'solar':'lunar',leap};
   birthSolar(birth);
   const zodiacName=zodiacFor(birth).name;
   // 写入成功后再替换内存中的资料，保存失败时保留原生日。
   savePreferences({...preferences,birth});
   await message('生日已保存','已匹配 '+zodiacName+'。'+(leap?'无对应闰月的年份按普通同月生日计算。':birth.month===2&&birth.day===29&&type===0?'平年按2月28日计算。':''));
  }catch(e){await message('日期未保存',String(e.message||e))}
 }
 if(action===3){try{const photo=await Photos.fromLibrary(),base64=Data.fromPNG(photo).toBase64String(),web=new WebView();await web.loadHTML('<html><body></body></html>');const png=await web.evaluateJavaScript(`const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.beginPath();x.arc(128,128,128,0,Math.PI*2);x.clip();const side=Math.min(img.width,img.height);x.drawImage(img,(img.width-side)/2,(img.height-side)/2,side,side,0,0,256,256);completion(c.toDataURL('image/png').split(',')[1])};img.onerror=()=>completion('');img.src='data:image/png;base64,${base64}';`,true);if(!png)throw Error('图片读取失败');fm.writeImage(avatarPath,Image.fromData(Data.fromBase64String(png)));await message('头像已保存','已居中裁剪为圆形，下次组件刷新时生效。')}catch(e){await message('未更换头像','未选择照片或照片读取失败，可重新选择。')}}
 if(action===4){try{if(fm.fileExists(avatarPath))fm.remove(avatarPath)}catch(e){await message('头像未清除',String(e.message||e))}}
 if(action===5){const n=new Alert();n.title='设置 MBTI';n.message='输入四字母类型，例如 INTP、ENFP；也支持 INFJ-T。留空则不显示。';n.addTextField('MBTI',preferences.mbti||'');n.addAction('保存');n.addCancelAction('取消');if(await n.presentAlert()!==0)continue;try{const mbti=normalizeMBTI(n.textFieldValue(0));savePreferences({...preferences,mbti});await message('MBTI 已保存',mbti||'已隐藏 MBTI')}catch(e){await message('MBTI 未保存',String(e.message||e))}}
 if(action===6)await selectFrostedBackground();
 if(action===7)await chooseGlassStrength();
 if(action===8)await removeFrostedBackground();
}}
if(!config.runsInWidget){if(!await settingsMenu()){Script.complete();return}}
const zodiac=zodiacFor(preferences.birth);
// 720条每日宜忌全部保留；重复活动名称合并为113个词条，运行时还原原表。
const wnlDailySeed=(()=>{
 const words=["安葬","祭祀","结婚","搬新房","动土","开业","出行","破土","祈福","安床","搬家","开光","作灶","入殓","合婚订婚","修造","打扫","栽种","上梁","交易","馀事勿取","出火","订盟","签订合同","移柩","拆卸","纳畜","求子","迁坟","会亲友","安门","除服","伐木","成服","沐浴","斋醮","掘井","成人礼","收养子女","纳财","起基","盖屋","买衣服","牧养","治病","理发","谢土","诸事不宜","行丧","房屋清洁","竖柱","修坟","结网","立碑","作梁","挂匾","塑绘","安香","坏垣","造畜稠","安机械","除虫","破屋","塞穴","开池","买房","打猎","铺路","求医","买车","开仓","造庙","合帐","放水","探病","造船","补垣","赴任","造桥","装修","-","定磉","求职入学","出货财","合寿木","教牛马","开生坟","诉讼","架马","造仓","造车器","打鱼","开厕","开渠","美甲浴足","针灸","开柱眼","安装器具","合嵴","筑堤","雕刻","普渡","断蚁","纳婿","习艺","酬神","问名","分居","割蜜","归岫","乘船","雇庸","归宁"];
 const rows="3.q.0.1n.c.w.1i/2.t.6.n.j.13.5.4.8.1.10.b.r;h.0/2.g.a.e.3.16.m.4.8.q.15.u.1.17.f.p.14.1l.2x.l.w.b.r.i.1e.1k.z.29;0.1.c.d/2.6.g.e.n.j.1t.5.m.4.h.9.1j.f.p.1l.l.b;2.0/e.n.j.m.4.1.7;1t.3.0.1c/2.6.g.e.m.4.8.h.9.2i.1.f.p.11.l.w.b.7.r.i;0.1z/2.a.n.3.5.4.8.1;3.q.15.0.u.c.d.22.w.i/2.6.19.e.m.4.h.9.1.21.12.b.2l;j.5.0.d/1b;3.16.9.0.u/2.6.1d.2a.1t.2b.4.8.h.1y.1.17.1w.18.2e.14.b.1h.7.r.i.1e.1a.z;1b/28;2.6.a.3.5.25.0.d.l.12/g.e.1t.m.4.8.h.9.q.u.1.f.1n.p.o.10.1s.1h.7.r.i.1e.1k;2.h.0.d/6.e.n.5.16.m.8.1o.y.q.1.2p.z;a.3.0.u.l/2.t.6.e.5.4.8.1.7.s;5.15.0.c/6.g.2a.e.3.2w.m.4.8.y.1.f.p.14.o.1l.x.v.w.10.r.i.1e.1k.1a.1z.z;4.8.0.d.7/2.6.a.e.n.3.5.q.17.l;a.3.4.q.0.u.d.22.w.i/2.6.n.j.5.8.9.1.p.b.r;1x.0.d.i.20/t.g.a.3.4.8.1.1w.18.2c.2e.1l.7.r.z;2.6.3.0.c.d.11.i/19.5.8.1.17.b.r;3.15.0.u.l/2.t.6.g.e.13.5.2b.m.4.1y.q.1.17.f.1s.b.7.2t.s.i.1e.z;k/1.1f.x.v.1h.s;5.2b.9.1y.0.u/2.6.a.e.3.m.8.1.1w.18.l;k/g;a.3.5.0/g.e.m.4.8.h.15.31.2g.f.14.x.v.2q.10.2o.7.i.z;2.19.h.0.c.d.1c.1z.26/a.n.j.3.13.5.4.8.9.q.1n.b.r;3.0.c.i/2.6.e.n.j.5.16.m.4.8.y.1.21.o.11.2p.x.v.b.7.s.r.1k;5.0.d.20/2.a.3.4.8.9.1.p.l.b.7.r.1a;3.9.0.d/2.t.6.e.n.j.13.5.25.m.4.h.o.v.12.7.s.1a;a.3.15.0.u.f.d.w/6.n.j.1t.5.4.8.h.9.q.1.2h.14.1f.b.7.s.r.29;5.u/2.6.a.e.3.4.8.1.1w.18;6.a.2f.h.0.1c.7/2.e.16.m.4.8.9.q.15.1.17.f.c.14.11.b.r.i.1i;28/2.6.e.n.j.5.16.m.4.8.h.9.21.o.x.v.10.2l.7;2.3.5.4.0.7/1.1f.o.k.x.v.s;9.0.c.d/2.e.3.25.m.8.y.q.1.p.o.l.s.1e.1a.z;t.19.3.0.u.f.c.d.w.i/2.6.g.n.j.5.4.8.1j.1.p.11.b.7.r.z;2.c/e.m.4.8.1.f.7.i;2.3.0.1c.20/t.2a.e.m.8.y.q.1.17.1n.18.2p.12.10.1s.r.z;3.0.c.d/6.e.n.j.13.5.16.m.8.y.1.o.11.v.r.1a.z;j.5.0.20/2.6.a.e.3.m.4.8.9.u.1.f.o.l.1h.7.i;8.0.1.c.d.22/2.6.a.n.j.3.5.h.9.1j.p.l.12.b;3.0.u/2.t.6.e.n.j.5.2w.m.4.8.h.1.2h.p.21.14.1f.2p.1s.b.2l.1h.7.s.r.1a;n.j.5.0/2.6.g.a.3.8.h.9.1.f.p.o.l.w.b.r.i;6.0.26/2.e.2w.m.9.y.q.15.1j.1.18.c.2p.l.w.10.b.i.1e.1k;3.15.u.f.d.w.i.1i/2.6.4.8.9.1.10.7.s.r;5.4.8.0.d.7.23/t.g.2a.1.2j.o.x.v.1g.s.1u;2.3.9.0.u.c.1f.1h/6.g.1t.5.4.8.h.1.14.b.r;a.3.0.d.l/6.2a.1t.13.5.4.8.h.q.1.17.p.14.2y.10.2l.7.s.r.z.29;2.6.a.3.25.15.0.d.l.12/g.4.8.h.9.q.1.o.10.b.7.1i;2.6.4.0.1c.1z/t.e.n.j.5.m.9.y.2g.u.1.17.1n.p.l.w.10.b.2o.i.1e.1k.z.1i;6.3.q.0.c.l.w/2.g.4.8.h.9.1.10.1s.b.7.s.r;e.j.5.4.u/6.g.a.3.8.q.15.2g.17.f.14.o.x.v.w.b.r.1a.1z;0.1.d.22/2.6.g.a.n.j.3.5.4.8.9.p.l.b.7.r.1a;3.5.15.22.l/2.t.6.g.19.e.2w.m.4.8.9.q.1.17.f.p.21.14.1f.x.v.1h.7.r.1e.z.2n.29;1b/g.k.1m;2a.3.15.0.c.1c/2.t.q.1.17.1w.18.21.2p.10.b.2l.1k;a.1t.3.q.15.0.d.w/2.t.6.g.8.h.9.1.o.x.v.12.b.r;2.5.4.0.10.1s/t.g.1.o.1p.x.v.2t.s.1u;9.0/2.6.g.a.n.j.3.13.5.8.h.1j.1.l.12.b.7.r.1a;a.3.0.u.1i/6.g.1d.19.4.8.y.1.p.14.o.11.2p.x.v.10.1s.1h.s.r.1a.z.29;2.6.a.3.25.0.d.12.2l/1t.4.8.h.9.1.f.p.b.7.r.i;2.6.0.d/t.y.1n.c.21.11.b.1k;2.a.3.1y/6.e.16.m.8.9.y.1j.1.1n.p.14.d.o.x.v.s.r.i.1e.z.20;2.6.3.4.h.b.7.2n/8.q.1.d.x.v.s.r.1a;2.3.5.c.b/e.m.4.9.0.f.2h.p.d.o.11.x.v.7.s;a.19.3.u.c.b/6.4.9.0.1.f.1n.2c.2e.d.o.24.7.s.1r.20;25.1p/2.6.a.3.16.9.0.1.c.7;6.8.9.0.1c.b/2.a.13.16.4.h.u.f.p.11.l.w.1r.i.2r.20;1b/0.d.o.k.24.x.v.1g.s.1r;2.3.10.b.z.2n/6.4.9.0.1.f.1n.p.14.d.o.24.l.7.1r.1i;j.5.9.b/2.a.3.16.4.1x.1o.0.1.2h.p.14.d.11.s;6.1t.5.2f.h.u.10.b/2.a.16.9.0.1.d.o.11.7.1r.20;3.c/6.e.m.8.0.d.o.1g.1h.7.z;2.5.8.h.9.0.10.b/6.a.3.4.u.f.2h.1n.14.24.12.1r.i;2.3.c.10/j.1x.8.9.1o.y.2i.0.1.d.o.1h.s.z.20;2.4.15.b.7/8.0.1.d.o.x.v.s.r.z;2.3.1.b/e.n.j.13.16.m.1x.9.1o.q.2g.0.2h.p.d.1f.o.11.24.x.v.w.1h.7.s.1r.2r.20;2.0.u.22.10.b/j.13.8.1.c.11.r.z;1y.10.b/2.6.a.3.4.8.h.9.0.1.f.c.p.l.7.r.1r;5.8.0.10.b/2.a.3.4.q.2g.17.f.c.14.11.24.1s.1r.23.29;k/0.1.d.o.x.v.7.s.1a;4.2f.10.b.7.i/2.8.0.1.d.24.x.v.2u.2t.1r.2r;3.5.8.9.1j.10.b/2.6.a.4.0.f.p.1f.w.1h.7;2.t.h.0.b.2n/1d.2m.19.y.1.c.d.11.24.7.s.1r;2.a.3.5.c.l.12.10.b/9.1.d.o.24.1s.7.s;2.8.0.1c.10.b/a.e.3.16.m.4.h.1y.y.q.2k.u.1.f.p.11.24.1r.2r.20;2.6.1t.3.4.h.18.b.7/n.j.16.9.0.d.o.x.v;2.6.3.4/n.j.16.8.9.1.d.o.x.2x.v.s.r.1a;2.6.a.3.u.1.l.b/n.j.4.h.9.q.0.17.f.p.d.w.i;2.e.u.10/16.8.9.0.1.1n.d.o.x.v.1h.7.s.1a.20;a.3.5.9.f.b.2l.i/2.n.j.2k.2j.2e.24.1r.1u;2.0/a.3.16.q.c;2.0.18.10.b.7/1x.y.1.d.o.24.x.v.1h.s.1r;4.7/2.a.3.8.1.c.z;3.5.4.8.b/2.g.1d.1o.y.q.2g.0.u.17.2c.1f.11.w.1h.s.1i;4.i/2.1o.0.1.d.7;1t.c.10.b.23/2.16.9.1n.d.o.7.20;3.0/6.19.y.24.1r;2.1t.3.5.4.h.b.7/j.13.8.y.0.1.1n.d.1f.o.2y.2d.1h.r.1a;2.6.a.3.4.c.10.b.2n/8.0.1.d.o.s.r;2.3.8.l/n.j.4.1o.0.f.d.11.7;5.2f.b/2.6.n.j.9.0.c.d.o.11.x.v.7.20;3.15.0.u.i.26/2.6.a.2i.2k.1.c.d.11.24.x.v.7.s.1r;6.8.h.0/2.e.16.4.u.f.1n.c.14.11.w.r.i.1e.2r.1i.20;2.3.5.15.b/0.1.d.o.x.v.2u.1g.7.s.1r;19.15.c.10.b.23/2.6.a.4.8.9.0.1.f.p.d.l.7.s.r;2.e.5.8.1.1f.z/6.a.3.4.y.0.f.11.7;2.t.h.u.10.b/g.1d.2m.19.16.9.1.1n.c.21.24.1r.2r;2.3.9.10.b/19.1t.0.1.d.o.x.v.7.1r;2.8.9.0.1c.10/4.h.2k.u.f.c.24.1s.1r.2r.1i;2.5.4.b.7/n.j.13.16.9.0.1n.d.1f.o.x.v.1h.s.1a;3.2f.l/16.1x.9.0.1.c.d.o.w.s.1i.20;2.6.1.10.i/16.4.1x.0.f.p.2c.d.1f.o.x.v.w.2q.2o.1h.7.s;2.5.h.22.10.b/n.j.16.9.0.1.d.11.24.x.v.1s.7.s.1r.1a;k/28;2.6.a.19.3.0.1c.l.12.10.b/4.h.9.u.f.1n.14.24.2r;2.a.3.5.u.b/1.k.1g.1r.1u;6.3.16.u.f.c.b.i/t.4.0.1.d.o.1s.7.1r.2r;5.8.9.1.b/2.6.g.a.3.4.2g.0.f.2c.2e.d.1f.o.11.w.2o.7;h.b/2.1d.2m.4.8.9.0.1.c.d.o.24.x.v.7.s.r;0.1f.10.b.1a/2.t.e.1t.9.1n.11.1p.1r;2.a.3.8.10.b/16.y.2k.f.11.2p.24.2u.2o.1r.2r.1i;3.4.f.7.z/j.y.0.1.d.1f.1p.x.v.12.s.1a;1b/g.1.k;2.6.a.3.4.1.c.7/g.n.j.q.0.d.o.w.b.i.1e;4.h.c.10/t.6.e.n.j.5.25.16.m.8.9.0.d.o.x.2x.v.b.1h.s.1e.1k;4.f.b.7/27.1.k;1b/k.1g.1r;4.15.7.z/6.k.30.2d;4.0/2.6.g.a.e.3.8.1;1t.4.h.9.10.7/2.6.g.a.e.3.13.m.8.q.0.1.d.s.r.i.1e;a.3.5.4.11.i.1e/6.y.1.d.x.v;2b.4.h.1y.0.1c.w.2l.7/6.9.2i.15.u.1.f.1n.2d.i;2.4.0.c/6.y.1.11.k.12;2.1d.a.3.4.2z.c.1l.l.10.26/1n.2d;k/g.1d.1.2d;a.3.4.1.7/t.e.n.0.d.o.s.i.1e;4.h.c.10/2.6.9.0.1.d.o.11;4.0.1c.22.b.7.1i/6.g.1.k.2d;1b/g.1d.k;4.2l.7.i.z/j.13.1;2.a.4.2f.0.c.w.10.7.1i/6.j.1.1n.30;5.4.9.1y.7.i/2.6.1d.13.25.y.q.1.11.2t;1b/6.1d.1.k;4.0.7.23.1z/2.t.a.e.n.j.1t.5.m.8.q.15.u.1.1w.18.21.1p.2q.r.i.1e;k/y.1;2.3.4.c.7.23/16.k.2d.20;2.4.0.1s/g.1.1n.k.2d.2n;2.a.3.8.1/t.13.16.d.x.v.20;a.3.4.8/2.t.6.j.5.0.1.o.11.x.v.2d.s.r.z;4.0.10.b.7/2.6.g.1d.16.9.1.11.12;2.6.3.4.2f.0/k.2u.1g.1r.1u;4.7.i/0.1.d.o.s;a.3.4.h.0.c.1c.w.7.i/2.6.j.13.16.2i.1.1n.11.2s.2d;4.c.7/2.6.q.0.1.d.s;1t.4.10.7/6.1d.y.0.1.k;0.1c/1n.c;2.5.4.0.7/6.g.27.11.k;3.4.k.7/2d;2.6.3.4.0.1c.7/t.g.1.1n.k.2d;2.6.3.4.1.10.2l/g.n.j.13.16.9.q.0.17.d.o.s.i.1e;2.4.14.10.7.29/t.6.n.j.13.1.11;1b/6.27.1n.k.2d;2.0/t.g.1.k.2u;1b/g.1.k;4.0.10.7/6.2i.15.1.f.1n.30.2d.1e;1t.4.9.10.7/6.g.a.13.8.q.15.0.u.1.17.d.b.s.r.i;2.t.3.4.f.7/6.1;4.0.2e.1c.w.1i/2.t.6.a.13.16.q.1.1n.11.i.1e;5.4.0.1c.7/6.y.1.k;k/0.d.o.x.v.s;4.0.7/t.g.1.k.2d;1b/n.j.13.16.w.1i;4.h.0.1f.22.10/2.t.n.j.16.1.11.12.20;0.w.b.7/6.1d.1.k.2d;0.7/k.2u.1g.1r;a.3.4.z/1.k.2u.2d;4.0.18.7/t.13.5.16.1x.1y.1o.q.1.17.1n.11.2d.1k;4.9.0.2c.2e/6.1d.13.16.q.u.1.1n.c.12;4.0.c.1f.1c/6.1d.j.8.y.1.2d.r;2.0.1c.w.2l.7/6.g.a.3.13.8.9.q.u.1.1n.b.r.i;1b/y.1.k;3.9.1y.c/2.t.6.1d.e.13.25.16.m.4.8.h.y.q.1.f.d.o.x.v.w.b.s.i.1e.1k;0.1c.w.z.1i/2.6.2a.e.n.j.3.m.4.8.2i.15.34.u.1.1w.f.18.14.1l.l.i.1e.1z;6.1.c.i/g.1d.a.e.n.j.3.13.16.m.4.y.0.f.p.1f.o.11.x.v.w.7.s;a.3.c.l.10/2.6.g.4.8.h.9.q.0.1.p.14.w.12.b.7.s.r.i.1a;2.h.0.c/1d.1.1r;6.e.n.5.0.c.1f/2.t.a.3.8.2i.15.u.1.18.14.l.10.1s.b.r.i.1e.z;a.3/2.6.e.m.4.8.0.1.7.i.z;0.2e.1c/2.6.g.a.n.j.3.13.4.8.h.9.q.1j.1.f.1n.p.l.12.b.r;3.5/2.8.0.1.18.7.z;2.6.a.3.5.25.2f.l.12.b/g.4.8.9.q.15.0.1.f.14.d.2q.7.r.i.1e;1b/6.25.y.1.k;2.4.h.c.10.1z.26/6.g.1d.a.3.9.1.f.1n.p.l.w.b.1i;5/2.a.2m.19.2a.e.3.25.16.m.8.y.0.1.18.p.d.1f.o.11.1l.b.7.s.1k.1a.z.1i;0.2e.1c.7/t.6.a.e.n.j.3.5.m.4.8.h.9.1o.q.2i.15.1.f.1n.14.1l.i;2.6.1t.1/g.a.n.j.3.5.4.h.9.q.0.1j.p.l.w.b.i.1i;2.q.c.10.b/6.a.n.3.5.4.8.0.1.7.z;2.0.u.c/1r;2.a.3.5.0.10/t.g.1d.19.h.y.1w.1n.18.z;2.9.c.22/6.n.j.3.5.4.h.0.u.1j.p.1f.o.12.b.7.i;c.1c.w.1i/2.t.6.2a.e.3.13.m.4.h.1o.2i.2k.u.1.17.f.p.14.11.1l.l.b.1k;28/2.a.n.j.3.5.4.8.h.q.1j.1.f.p.d.x.l.v.12.b.s.r;2.6.3.5.u/g.2m.19.y.0.1.d.o.11.7.s;0.c.1c.w.1i/2.6.g.1d.2m.19.4.9.1.21.1s.b.1k;2.4.1f.7/t.6.g.1d.a.3.5.16.1o.2i.1n.11.2s.1i;1t.9/2.6.g.a.3.4.h.q.0.f.p.x.l.v.12.10.b;0.1c.10.z.1i/2.t.6.g.1d.e.m.4.1x.8.h.1.17.1w.f.1n.18.p.14.1l.l.29;3.u.1.1a/e.n.j.13.5.m.4.y.0.21.14.1f.o.b.1h.7.s.1k.29;10/2.t.6.e.3.16.m.8.1.21.d.o.11.1l.1h.7.r.i.1a.z.20;2.0.c.10/g.2m.k.1p.1g.1r.1u;2.5.0/a.e.3.4.1w.18.b.i;4.9.1y.15.0.c/2.6.g.a.e.3.m.8.h.q.1.17.d.l.b.7.r;a.3.0/t.6.e.m.8.9.z;6.3.5.9.c/g.1d.4.1o.y.15.0.1.f.1n.18.p.2c.2e.14.d.o.1s.1h.7.s;2.5/e.m.4.8.0.1.f.7.i;0.c.1c.w.23.1z/2.6.g.1d.2m.e.5.4.9.15.1.1w.f.18.14.2q.i.29;2.3/19.2a.2w.y.12;1x.9.c/2.t.6.g.a.e.n.3.5.m.4.8.h.15.0.u.1j.1.1w.f.18.14.12.b.r;5.0/2.6.8.q.1.1w.18.i;6.e.5.m.q.0.1.c.22.1a/2.g.a.3.4.h.9.f.p.d.1f.x.l.v.12.b;2f.10/2.t.6.g.a.n.j.3.5.4.9.0.1j.1.p.l.b.7.s;2.0.u.1c/g.1d.y.1.17.1r;2.6.n.13.5.h.0.c/g.a.3.4.8.9.1.f.1n.p.l.w.b.r;6.5.9.0.c/2.a.e.3.m.4.8.2i.1.f.18;0.1c.w.1i/2.6.a.n.j.3.5.4.8.h.9.1j.1.p.l.b.r;2.6.e.3.c/g.1d.2a.y.1.17.18.1s.b.1k;2.t.6.a.3.25.c.12/g.1d.2m.19.y.0.1.d.o.7;0.1c.w.1z.2n.1i/2.6.a.e.3.m.4.8.1.f;2.e.4.0.c.1f.7.1z/6.g.a.8.9.q.1.p.l.w.b.r;e.5.9.0.2l.1z/2.t.6.1d.a.19.3.4.h.2i.15.31.u.f.1n.p.14.1l.l.2s.2q.b;2f.0.c.1c.w.1k/2.6.a.n.j.3.5.8.h.9.1j.1.p.l.r;6.15.0.1.22.i.1a/t.g.1d.a.2a.e.n.j.3.13.5.m.9.u.1j.1w.18.p.2c.2e.d.1f.1l.l.7.s;28/2.6.a.n.j.3.5.4.8.9.0.1j.1.p.d.x.l.v.12.b.7.s.r.i;1b/1d.k.1r;6.3.15.0.c.1f.26/g.1d.e.m.8.h.q.1.17.12.b.r;28/2.6.a.e.3.5.2g.0.1n.p.d.o.x.l.v.w.b.23.1z.26;0.c.1c.w.7.z/2.6.1d.a.e.n.13.5.m.4.8.h.9.1.f.1n.p.21.14.1l.10.1s.1e.23.29;6.5.1x.9.z/2.t.a.3.8.15.1.18.14.1l;2.6.a.3.25.h.c.12/g.4.9.u.1.f.p.14.d.1s.2l.7.s.i;0.u.1c.1z/6.g.a.e.3.5.4.h.9.2k.f.14.11.2s.2q.i;2.4.2f.0.c.1c.7.26/6.g.19.9.1.1n.p.l.w.2q.b.i;2.6.3.5.4.8.u.1f.i.1a/t.19.e.16.m.9.y.0.2e.o.11.x.v.s;2.a.3.u/t.19.24.1g.1r;2.3.4.8.l.7/t.6.g.e.n.j.5.m.9.1o.15.0.u.p.14.d.1f.o.x.v.w.1h.1v.s.i.1e;28/2.t.6.e.16.m.9.0.1.d.12.s;2.5.4.0.c/t.1x.8.9.1o.1.11.r;2.6.3.0/t.g.n.j.13.5.16.1y.1o.15.2h.p.11.w.b.i.1e.1k;3.4.8.15.22.7/2.t.6.e.5.9.0.1.o.x.v.1g.b.s.1k;5.0/t.e.m.9.1n.c;2.4.9.c.7.23/g.1d.e.5.8.1o.y.31.0.1.f.p.21.2c.2e.2p.24.x.l.v.2o.s.r.1r.i.1e.1a;4.8.7/2.6.5.9.0.d.s;3.5.4.8.9.1y.0.c.7.i/2.t.19.1x.h.y.17.24.b.1r.1k;1b/28;3.l.i.1a.z/t.g.a.2a.e.n.j.5.2b.m.9.1y.q.2k.0.17.14.d.2y.x.v.s;1b/28;2.3.5.4.8.l.7/t.e.m.h.1o.q.15.0.f.1n.14.d.1f.o.b.1h.s.i.1e.26;3.4.8.0.u.f.c.22.10.i/2.e.n.j.13.5.9.q.2j.24.1s;5.4.0.7/t.19.11.1p.1g.b.r;2.6.0.z/t.19.2a.e.n.j.13.5.16.1x.8.9.1o.2g.u.1.2h.11.b.2o.r.1k.1i.20;5.4.8.f.7.1a/2.t.6.g.e.j.m.9.q.0.17.d.o.x.v.12.s.r;4.2f.0.w.1r.i/t.12;2b.4.9.c.7/2.6.a.n.j.3.5.2g.0.1j.f.2c.2e.14.d.o.11.1l.x.l.v.w.b.2o.r;a.3.4.8.h.f.c.i/2.g.1d.19.5.9.0.17.d.o.b.s;5.4.8.0.1c/2.t.16.1x.h.q.17.11.24.1p.12.1r.1k;2.19.32.0.c.1c/6.a.n.j.3.5.9.1j.l.b.i;2.6.a.3.8/t.19.n.j.13.5.9.y.11.2d.1g;2.6.a.3.4.8.h.0.11.l.w.i/t.19.16.9.u.1g.b;2.a.3.8.l/t.1d.n.j.13.5.4.1x.h.9.0.1.17.1w.f.18.p.2c.2e.d.1l.12.s;3.4.8.f.c.10.i.1a/2.6.19.n.j.13.5.9.0.17.1f.1s.s;9.0.c.z/e.3.1y.1.2y.r.20;2.6.a.3.25.4.2f.0.1c.7.1a/n.j.13.5.9.15.f.14.b.i;2.4.7/t.5.9.0.1.s;2.6.4.h.0.f.w.1a.1i/e.16.9.2h.c.11.12.b.1r;4.7/2.6.a.e.3.5.0.1w.18.s;3.4.8.1.f.7.i.z/2.6.e.n.j.5.m.h.9.2i.17.p.14.d.o.x.v.b.s;5.0/t.6.a.e.3.m.f.i;2.4.0.c.1c.7.z/a.e.n.j.3.13.5.m.h.9.u.1j.f.p.l.12.b;5.4.7/t.0.b.s.2n;2.6.3.5.4.8.0.c.i.1a/t.19.1.17.1n.1g.1s.1k.1u;2.8/g.n.5.1o.0.b.s.i;3.4.2f.8.u.1j.c.10.1s.7.i.1i/2.6.n.j.13.h.9.0.14.d.o;a.n.j.3.5.4.0.2z.c.1l.l.w/2.t.9.17.b.r.1k.2n;a.3.h/t.19.n.j.13.5.9.2h.1g.b.2n;3.8.u.f.c.i.1a.z/2.t.6.19.e.5.h.9.17.d.o.b.s;5.4.0.c.1c/2.t.e.m.1x.1o.1.11.1g.12.r;1t.9/6.g.a.n.j.3.5.h.0.17.f.p.14.d.x.l.v.w.b.r.i;3.0.u.1c.7.z/6.g.1d.a.n.j.13.5.2b.8.h.9.1y.q.1.17.14.24.b.r.1r.1e;2.n.j.13.5.4.8.0.f.i/h.q.17.24.12.b.1r.1k;2.4.0.26/6.a.n.j.5.1o.l.i;2.6.a.3.8.9.c.l.i/t.19.n.j.13.5.0.d.o.b.s;2.5.8.0.z/t.16.1x.1o.1g.1r.1k;2.a.3.8.15.1.c.22.10.1a/g.19.n.j.5.h.9.0.1j.f.p.b;3.5.4.b/2.t.6.g.2a.e.n.j.13.2w.2b.m.1x.8.9.1y.q.0.1.d.1f.s.r;a.3.0.18.c/2.t.6.e.8.9.1o.15.u.1.17.f.14.11.b.i.1u;6.3.0.c/t.g.e.n.j.13.5.16.m.1x.h.9.1o.11.1g.b.i.1e.1k.20;1t.3.4.8.0.f.l.7.i/2.6.19.j.5.9.b.1r;1b/1t.17.k.1g.12.1r;e.m.4.9.7.1a/2.6.g.1d.a.3.13.5.8.h.15.0.1.f.2h.c.p.21.14.1l.24.l.b.1r.i.1e.23;28/2.6.n.j.16.0.17.1n.2e.d.o.11.x.v.12.2v.s.1k;4.8.0.1.c.1c.w.7.1a/t.6.g.a.e.3.m.1x.h.9.1o.q.f.p.1l.l.b.i;28/6.g.5.16.2k.1j.c.11.24.1s.b.1r.1k;2.3.u.i/27.8.1.d.o.1v;2.2a.j.3.5.0/g.27.1.1n.k.1v;18.c.w.1i/t.6.a.e.n.j.3.13.5.25.16.m.4.1x.8.9.1y.0.1.f.p.14.d.o.1l.x.v.12.i.1e.1a;2.e.3.m.10/0.1.k.x.v.1v;2.a.3.b/27.d.o.k.1v;8.0.u.1/g.c.k.1v;15.18.c.22/27.d.o.11.x.v.1v;3.h.9.2p/1.c.k.1v;1b/1d.y.0.d.o.k.1v.7.s;6.3.5.2f.f/2m.19.27.y.1.k.1v;1t.2b.4.h.1y.0.10.7/2.16.y.1.11.1g;2.8.h.0.u.w.26.1i/19.27.y.1.c.1v;2.a.3.5/y.d.o.x.v.1v.7;2.5/1.k.1v;2.1t.4.8.h.1.c.7/6.a.n.j.3.13.5.9.q.0.1j.d.o.b;2.a.3.0.10/1.1f.k.x.v.1v;k/g.27.1.1v;2.8.0.10/1.k.1v;3.h.15.c/2.0.1.2v;2.4.9.0.18/1.c.k.1v;2.a.8.9.15.1.w.1i/1d.y.0.d.x.v.1v.7;6.18.2c.z/2.1d.2m.19.27.y.1.c.1v;1b/g.1.k;2.4.0.u/6.a.e.16.m.y.q.17.i.1e;1b/27.y.1.k.1v;2.5.9.10/27.1.1n.k.1v;8.1.c.w.10.1a/2.6.a.n.j.3.5.4.h.9.f.p.l.b.i;3.4.u.f.7.i/1.d.o.k;a.3.h.18.10.1s.1z.2n/g.k.1v;8.0.u.1.k/c.1v;n.j.5.2b.h.1y.15.c/2.1t.27.8.1.11.1v;2.0/1.c.10.1v;8.9.0.1.w/2.6.a.19.e.n.j.5.16.4.h.q.1j.f.12.i;0.1c/2.1d.27.y.1;4.18.2l.7/2.1.1g.1u;2.8.k/27.y.1v;2.6.3.9/27.y.1.k.1v;k/1.1n.1g;0.c.1f.1c.22.w.1a.1z.1i/t.6.a.n.j.27.3.13.5.2b.16.4.1x.p.1l.12.1v;1b/k.1v;2.2b.1y.0.22.b.23/k.1v;6.8.h.q.0.u.17.1c.w.1i/g.c.1v;5.15.18.c/2.t.n.j.1t.13.1o.11;1b/g.27.1.k.1v;2.3.8.9.c/1d.a.y.0.1.1v.7;2.6.3.u.f.i/1d.2m.19.27.y.1.1v;2.5.4.0.f.7/27.1.1v;1b/27.y.c.k.1v;2.6.a.3.i.z/27.y.1.k.1v;1b/1n.k.1v;1y.15.1.26/t.6.a.e.n.j.27.3.13.5.4.2k.f.14.1l.l.1s.1v.1e.1z.29;1b/27.1.k;a.3.0.18.c.1z/2.t.16.1.11.1g.12.1v;1b/27.1.k.1v;3.4.9.c.b/2.1.d.o.x.v.2v;2.9.18/27.1.c.k.1g.1v.1u;t.a.5.4.q.0.f.14.d.1f.o.x.v.12.1h.7/2.6.b;6.h.7/2.2m.19.27.y.1.c.11.1v;k/2.1.2j.11.1p.1g.1u;2.1t.2f.8.h.0.u.18.w.1i/27.y.1.c.1v;5.1y.c.23.z/2.6.g.a.n.j.3.4.8.9.0.1.f.p.d.1l.x.l.v.12.b.7.r.1a;3.w/2.t.6.e.n.j.5.25.16.4.1x.0.1.f.d.o.1l.x.v.12.b.i.1k.z;1t.3.5.1.24.1r/0.d.k.x.v.7.s;18.c/t.a.e.3.25.16.m.4.8.9.0.1.f.p.14.d.o.1l.12.1a;1t.5.10.1z/t.6.a.e.m.4.8.9.1o.15.0.u.1.f.p.14.d.1l.l.b.7.i.1e.23.26.29;6.5.0.18/2.t.a.e.3.4.8.9.q.1.f.1l.12.b.i.1e.1k.z;4.1x.15.c.22/2.1t.27.1.11;h.w/2.t.e.n.j.3.13.16.8.9.0.1j.1.f.2h.21.d.o.2p.1l.r.1a.20;2.6.a.3.9/8.y.q.0.1.d.7.r.z;28/2.6.a.n.j.3.5.4.8.h.9.0.u.1j.1.p.l.12.b.7.r.i;1y.15.2g.c.b/2.6.a.e.n.3.4.8.0.1.7;2.1t.h.0.1f.1c.7/a.n.j.3.5.4.8.9.f.p.l.12.b.r;n.1t.5.c.26/2.6.a.e.3.m.4.8.1o.15.0.u.1.f.14.b.7.2t.i.1e.z.29;28/2.6.a.n.j.3.5.4.8.h.9.y.q.0.1.f.p.d.x.l.v.12.s.r;j.3.5.0.1/k.1p.1u;28/2.6.g.a.3.4.8.h.9.q.0.1.f.p.d.x.l.v.12.b.1h.r;e.5.m.1x.c.23.1z/2.6.a.2a.3.4.8.15.0.u.1.f.1n.14.11.1l.x.l.v.2s.10.b.7.r.i.1e;6.3.5.h.0.u.c.10/2.t.4.8.q.2k.1.17.2h.14.12.r;1t.15.u.c.22.2q.b/2.a.e.3.5.4.8.1o.0.f.d.o.x.v.w.7.r.1a.1z.z;w.1i/t.6.a.2a.n.3.16.m.1x.1o.0.u.1.p.21.14.d.o.x.v.b.1h.s.i.1e.1k.29.20;3.2b.4.1y/j.5.8.1o.q.2i.15.0.u.1.2e.14.2s.2q.b.1h.r.1a.z.29;28/2.6.g.a.n.j.3.5.4.8.9.0.u.1j.1.p.l.12.b.7.r.i.1a;5.c.w.1i/t.6.g.a.e.3.m.4.8.9.1o.15.0.1.f.p.14.d.1l.l.1h.7.z.29;2.19.h.c.1f.1c/3.4.8.9.q.1j.1.f.p.l.w.b.r.i;n.13.5.c/2.a.e.3.m.4.8.15.0.u.1.f.14.1l.l.b.7.2t.s.i.1e.1z.26;28/2.6.a.n.j.3.5.4.8.h.9.q.0.1j.1.f.p.d.x.l.v.12.b.r;2.a.3.15.1/0.d.o.1p.x.v.1g.1h.7.s;1t.h.10/2.6.a.n.j.3.5.8.9.0.1j.1.p.l.w.b.r;c.w.10.z/e.3.25.16.m.9.0.f.p.11.l.b.1k.1a;6.1t.5.2b.2f.h.0.18.1c/2.a.3.4.9.q.1.f.p.l.w.b.i;h.15.0.c/t.6.e.13.16.m.4.9.y.q.u.1j.f.p.21.1l.2x.l.w.12.b.i.1k.1z.z.20;4.0.1c.w/2.6.1d.a.3.13.8.9.u.1j.1.f.p.l.12.b.r;2.a.3/5.4.0.1.d.7.z;2.a.19.3.c/6.n.j.5.4.8.9.1o.15.0.1j.1.f.14.x.v.1h.7.s.z.29;c/2.6.a.e.3.5.m.4.8.0.1.7;2.1t.3.0.c.l/t.6.g.19.2a.e.n.j.13.5.m.4.8.h.q.1.17.2h.14.b.r;5.0/2.a.3.4.8.1.z;a.3.1.c.l.12.2l/t.13.4.8.h.2k.17.f.2h.b.r.z;a.3/0.d.o.x.v.7.s;1t.2f.h.10/2.6.a.e.n.j.13.m.4.8.9.0.1.f.p.1l.x.l.v.12.b.z;2.5/e.m.4.h.1o.q.0.17.f.p.d.o.x.l.v.7.r.1k.26.z;6.5.0.1c/2.t.a.e.1t.3.m.9.1o.15.1j.1.p.14.1l.l.29;1b/g.y;19.q.2c/2.a.e.n.3.5.m.8.1o.2i.0.1.7;2.6.1t.25.9.0.c.12/g.1d.j.13.4.8.q.1.b;2.4.7/a.3.8.1o.q.15.0.u.1.c.14.1l.l.b.s.r.i.1e.1k.z;28/2.6.a.n.j.3.4.8.h.9.q.0.1j.1.f.p.d.l.12.b.7.s.r;2.0.1f.1c.7/t.a.e.n.3.m.8.9.1o.1j.1.17.p.1l.l.2d.b.i.1e;2.a/6.g.4.h.9.q.0.1.f.p.14.d.x.l.v.w.12.b.7.r.1i;e.m.2f.2g.2l/2.6.a.n.3.5.4.8.1o.2i.0.1.f.1l.l.b.7;k/0.d.x.v.7.s;2.1t.0.10.23/t.6.a.e.n.3.13.5.m.4.8.15.u.1.f.14.1l.l.2d.7.i.1e;2.1t.5.c.w.1i/3.4.9.q.0.1j.1.p.d.l.b.7;2.0/1.k.2p.1g;4.h.15.c.b/6.a.e.n.j.3.5.m.8.9.2i.0.u.1.l.r.1a;25/2.g.a.e.3.16.m.4.8.h.9.0.f.p.21.1f.o.11.1l.b.1h.s.r.1e.1k.1a.z;2.3.b.i.z/g.y.0.1.o.k.7.1a;u/2.6.a.e.3.5.4.8.0.1.7;4.10.7/2.6.a.e.n.j.3.13.m.8.9.0.1j.1.f.p.d.x.l.v.12.b.s.r;1b/1d.y.k;2.a.3/g.e.4.8.0.1.7;2.j.3.5/0.1.d.o.k.1p.x.v.7;2.3.1.c/t.y.0.p.14.o.11.1p.x.v.b.s.1k;a.19.j.3.5.c.w.10/2.6.4.8.9.q.1.f.p.d.b.7.r.i;j.5.c.7/2.e.m.9.0.1.d.o.x.v.12.b.1h.s.1k;0.2e.1c.7/2.t.8.9.1.11.1p.w.12.10.2o.r.z.1i.1u;3.5.15.c/2.t.6.e.25.16.m.4.8.h.9.y.0.u.1.f.p.d.o.1p.w.7.i.1e.1a.z;3.5.z/2.6.a.e.4.8.0.1.f.7;n.5.9.c/1d.e.16.m.4.8.y.0.1.f.p.14.o.l.w.2o.i.1a.z.20;2.13.5.l/6.e.8.15.0.u.1.14.d.r.z.29;2.3.4.2g.f.p.l.w.2o.i/6.g.16.0.1.d.o.x.v.b.7.s.1k;2.5.0.2c/6.a.e.3.m.4.8.15.u.1.f.p.14.11.1l.l.1s.i.1e.z.29;2.a.j.3.5.h.u.c/g.2m.y.0.1.d.o.7.s;2.j.3.5/g.0.1.d.1p.1g.7.2t.1u;2.6.a.1t.3.9.1.c.l.12/g.4.0.p.14.1f.o.b.1h.7.s.i;5.2c.10.7/2.6.a.e.3.m.8.9.q.0.1.14.1l.1p.l.b.2v.r.i.1e.1z.z;2.a.3.5.4.h.2z.c.1l.l.10.7/g.9.q.0.f.p.d.b.s;6.0.1c.10.7/2.a.e.3.m.4.8.15.u.1.f.14.2p.1l.l.2q.r.i.z;6.3.5.h.0.u.c.10/2.a.4.8.9.1.f.12.b.r;3.5.4.15.b/2.t.6.2a.e.2w.m.0.17.d.o.1p.12.s;3.u/2.a.19.2a.25.16.4.8.2g.0.1.f.p.21.14.d.o.11.l.w.b.r.1k.1a.z.1i.29.20;5.4.10.1s/g.e.m.8.0.1.1w.2j.18.14.d.b.s.r.1a.23.z.29;28/2.t.g.16.4.8.9.2g.1.f.21.14.11.w.12.b.r.i.1e.1i.20;2.j.5.0.1c/y.1.2j.k.1p.1g.1u;2.a.1t.3.5.u.c.l.z/g.19.0.1.d.7;2.e.3.5.m/q.0.1.17.d.o.1p.x.v.7.s.1u;1b/g.k.1m;2.w.10.b.1i/t.n.j.13.5.2w.1x.8.h.1o.2k.0.1.17.1w.18.l.1g.1s.7.s.r.1z.z.1u;2.6.a.3.5.4.0.f.c.10.1s.7.i.23/g.2m.19.1.12.2n;6.5.0.1f/2.a.e.3.16.4.9.1.f.p.21.11.1l.1p.w.1g.12.b.i.1e.1k.1u;j.5.15.u.c.w.i/2.6.g.a.e.3.m.4.8.9.q.0.1.p.l.b.7.1a;5.4.h.c/2.g.a.e.3.16.m.8.9.0.u.1.2j.d.o.11.1l.1p.2x.l.w.s.20;j.13.5.9.15.c.i.23/2.6.g.a.3.8.h.0.1.l.w.b.7.r.1a;5.4.7/2.6.a.e.8.1.1w;n.5.2c.23/2.6.g.a.e.3.m.4.8.h.9.0.1j.1.f.p.d.o.l.12.b.7.r.1a;5.0/6.a.e.3.m.4.8.1.f;2.6.a.3.5.u.c.l.w.z/g.2m.8.9.y.0.1.d.o.7.s.1a;2.3/0.d.1p.1g.7;2.a.3.5.8.9.1.22.l/g.4.0.u.17.f.p.1f.o.b.7.1e;5.25/2.6.a.e.3.m.4.8.0.1.7;j.5.4.u.c.7/2.6.g.a.e.3.m.h.0.1.f.p.d.l.w.b;5.0/2.a.e.3.m.4.8.1.f;2.e.5.m.15.u.i.z/2m.19.y.0.d.1f.1p.x.v.1h.7.s.1a.1u;19.n.5.c/2.6.g.a.3.4.8.h.9.q.0.1.p.l.7.s.i;2.e.5.9.b/6.a.3.4.8.0.f.7.z;j.13.5.4.1j.w.10.7/g.3.8.9.q.0.u.1.f.p.l.b.s.r;a.3.15.2g/2.t.g.e.m.4.8.q.0.1.17.1w.18.d.1p.b.7.z;2.j.5.0.1f.1c/6.a.3.4.8.9.1.f.p.14.l.w.b.r;2.3.4.c.l.7.i/19.y.0.d.o.1p.s;1b/0.1.d.o.k.7.1r;2.3.5.9.1.22.i/y.0.d.1p.x.v.7.s;k/0.1.2e.d.o.x.v.7.s;5.4.7.1z/2.g.a.e.m.8.9.0.1.1w.18.d.o.1p.x.v.w.1g.b.1h.1k.1a.1i.1u;1b/g.1.k;5.4.15.7/2.6.a.19.3.16.y.0.1.21.d.o.1p.x.v.s.1u;3.5.16.9.c.i/2.4.0.d.o.7;2.3.9.c/g.1d.19.y.0.1.2j.d.1f.o.1p.x.v.1g.1h.s.1a.1u;4.7/g.1d.2m.0.1.2j.d.o.1p.x.v.s.1a.z.1u;5.b/2.a.e.3.4.0.1w.f.18.7;2.5.0.1c.s/y.1.2j.k.1p.1g.1u;a.3.2b.1y/1q.1.k.1m;1b/1q.1.k.1m;2.e.3.m.8.0/1q.18.k.1m;6.a.3.h/y.1q.1.k.1m;2.6.3.0.i/y.1q.1.k.1m;1b/g.1q.1.k.1m;a.3/1q.18.k.1m;1b/g.1q.k.1m;2.0/g.1d.19.y.1q.1.k.1m;1b/1q.1w.18.1m;5.8.0.z/g.y.1q.1.1w.18.k.1m;1b/g.1q.1.k.1m;2.a.3/y.1q.1.k.1m;1b/1q.k.1m;5.z/y.1q.k.1m;1b/1q.k.1m;2.5/g.y.1q.1.k.1m;1b/1q.k.1m;2.6.a.3.15.22/y.1q.1.k.1m;1b/1q.k.1m;3.5.0/g.1d.y.1q.1.1w.18.k.1m;1b/1q.1.18.k.1m;2.j.3.5.0/g.y.1q.1.1w.18.k.1m;1b/g.y.1q.k.1m;2.3/1q.1w.18.k.1m.1u;1b/1q.k.1m;0.1c/1q.18.k.1m;1b/1q.1.18.k.1m;1b/1q.k.1m;2.0/1q.1w.18.k.1m;1b/1q.1.1w.k.1m;5.4.7/g.1q.1.k.1m;1b/1q.1w;2.b/1q.1w.18.k.1m;1b/g.1.1w.18.k;0.b/g.y.1q.1.k.1m;1b/28;2.0/g.1q.k.1m;1b/y.1q.18.k.1m;a.3/1q.1w.18.k.1m;k/g.1q.1.1m;2.0/g.1q.1.1w.18.k.1m;1b/1q.18.k.1m;2.5.z/1q.1.k.1m;k/g.1d.1q.1.18.1m;2.a.3.5/1q.k.1m;1b/g.1q.1.k.1m;0.1c/g.y.1q.1.k.1m;1b/1q.k.1m;2.6/1q.1w.18.k.1m;1b/1q.k.1m;22.k/28;1b/g.1q.1.k.1m;2.0/1q.1.k.1m;1b/y.1q.1.k.1m;2.5.0/1q.k.1m;2.5/1q.1w.18.k.1m;1b/1q.1m;2.5/g.y.1q.1.1w.18.k.1m;1b/1q.1.k.1m;8.z/2.6.a.e.3.4.0.1.7.i;3.l/6.4.9.2k.1.f.1n.21.1g.10.1s.b.7.1k.z;8.1/2.6.a.e.3.5.4.0.7.i;19.4.c.10.1s.7/2.6.g.a.n.j.3.5.8.h.9.0.1.1l.l.w.b.r;15.11.10.26/2.6.g.j.3.5.m.9.1j.1.p.14.d.o.x.v.b.2o.7.1k.1a;2.e.3.m.8.0.z/t.13.1x.9.u.1.17.21.11.30.12.r.1u;15.18/6.g.a.e.25.16.m.4.8.h.9.q.0.1.f.p.d.o.11.x.v.w.b.7.s.i.1e.1k.z;5.0.u.c.26/6.19.9.2g.2k.1.d.1f.o.x.v.w.b.2o.1h.7.s.1k.1i.1u;3.9/2.6.e.m.0.d.o.x.v.b.1h.2v.s.1k;t.9.c.23/6.a.e.3.5.m.4.8.0.1.f.1l.l.7;2b.b/2.6.g.a.e.3.25.m.4.8.9.1o.0.1.2h.p.d.o.1l.12.1h.7.r.i.1a;2.3.0.1.c/y.2j.1p.1g.1u;28/2.t.6.g.a.3.4.8.h.9.q.u.1.17.f.p.l.12.b.r.i.1e;19.0.c.1c.26/2.6.j.16.8.1o.1.21.10.1s.b.r.1k.z.20;q.1.w/2.6.a.19.n.j.3.5.4.h.9.1j.f.p.l.b.1i;2.4.9.10.7/e.n.3.5.m.8.0.1j.1.1l.l.s.26;28/2.6.a.n.j.3.5.4.8.h.9.1j.f.p.d.x.l.v.w.12.b.7.r.i;2.3.5.8.0/t.e.n.j.13.m.h.q.17;0.22/2.6.g.a.n.j.3.13.5.4.h.9.q.1j.1.f.p.l.b;4.0.u.1c.x.7/19.n.j.13.9.21.11.l.1g.10.1s.1u;8.9.q.w/2.6.a.n.j.3.5.4.0.f.p.o.x.l.v.b.7.s;h.9.18.c/2.3.5.4.15.0.1.f.p.14.d.o.11.x.v.1s.7.1r.i;0.c.b.z/2.6.a.n.j.5.4.9.1.f.d.o.11.12.7;1b/28;n.5/2.a.e.3.m.4.8.h.9.2i.0.1j.1.f.p.d.x.l.v.12.b.7.r;5.u.c.10/2.6.1x.9.1o.1.18.d.1g.b.7.1r.1k;a.3.1.c.1a/2.6.2a.e.n.j.13.5.2b.m.4.h.1y.q.0.17.b.1h.7.s;m.4.9.1s.7/2.6.n.j.3.13.5.8.0.d.o.11.x.v.2s.2o.s.26.z;5.10.2l.23.26/2.6.a.19.e.3.m.4.h.9.q.0.1j.1.f.p.d.x.l.v.12.b.7.1i;6.8.0.c/2.t.e.13.m.4.9.f.p.14.2v.i.1e;2b.1y.15.i.23/2.t.6.g.a.2a.e.3.13.5.m.4.8.9.u.1.17.f.1n.14.2s.1s.1z;h.u.18.c.b/6.a.3.8.9.1o.1.o.11.1l.x.v.s.z;8.9.1.1a.1z/2.a.e.n.j.3.13.5.16.m.4.h.15.0.u.17.f.14.d.1l.x.l.v.10.1s.b.1h.7.1u;9.c/2.6.g.e.3.13.m.4.8.y.0.u.f.21.o.1l.b.7.r.i.1e.1k.1a.z;2.c.b/e.n.j.4.9.1o.0.o.1h.7;2.3.0/y.2j.1g;5.1x.c/2.6.g.a.e.3.m.4.8.h.9.q.0.1.p.1f.l.b.7.r.1a;5.b/2.e.m.8.0.1.d.7;8.1.22.1a.26/2.t.a.n.3.5.2b.1x.h.9.1y.1o.q.0.u.1j.17.p.d.o.1s.1h.7.s;4.7/2.6.a.e.3.5.m.8.0.1.s;5.1y.0.u/2.6.a.e.3.m.4.8.9.1.f.p.21.o.x.l.v.2q.12.10.b.7.r.i.1a;8.0/t.e.13.m.1o.17;2.3.4.1.f/1d.0.d.o.k.x.v.1h.7.s;19.h.u.c.1z.26/2a.j.m.4.8.1.f.21.14.11.w.1s.b.r.z;2.3.8.9.23/n.j.13.5.2b.h.1y.y.q.0.17.d.7.1u;2.9.c/6.a.3.4.8.0.1j.1.f.p.d.l.1s.b.7.s.r.i;x.v.b.1k.26/2.t.6.4.1.f.d.11.7;1b/1d.k.1r;2.5.c.z/1d.y.k;2.a.2f.h.u.c.26/n.j.13.5.4.1x.9.2k.1.f.21.1g.1s.7;8.1y.17.10.i/2.t.6.a.e.n.j.3.13.5.m.9.15.0.1j.c.p.14.d.o.1l.l.1h.7.s;1b/0.1.d.o.k.x.v.1g.s;2.0.c.23.1z.26/a.e.n.3.m.4.8.u.1.f.14.1l.l.1s.7.i.1e.29;6.19.0.u.c.w.i/2.t.e.13.q.17.1g.12.r;4.15.7.23/2.a.e.16.m.9.2g.2k.0.1.c.d.o.11.x.v.w.1g.1s.2o.s.1i.29.1u;h.u.18.c/4.8.9.2g.2k.1.d.11.x.v.w.1g.1s.r;2.8.9.1a.1z/t.1d.2a.e.16.m.h.q.0.1j.1.2h.p.d.1f.l.1g.10.1s.1h.7.r.1k;2.t.3.5.9.c.i/y.0.1.2c.2e.d.o.x.v.7.z;1z.1i/6.e.16.m.4.9.0.1.2j.c.d.o.11.1g.12.7.20.1u;8.0/1d.y.2j.k.1g.1r.1u;2.e.3.m.4.1y.q.2y.l.w.7/g.n.j.5.8.9.0.1j.1.f.b.r;2.0/e.5.4.8.q.1.1w.18;2.3.1.c.l/g.n.j.1t.5.4.h.9.0.1j.f.p.b.7.i;25/2.6.a.e.3.5.4.0.7.i;2.3.17.10/6.a.e.n.j.5.m.4.8.h.9.1o.q.0.1.f.p.o.l.12.b.7.2t.r.i;0.29/t.n.5.25.4.1x.9.1.p.14.11.12.b.i.1k;q.15.14.22.w.1i/2.6.a.e.n.j.3.5.m.4.8.h.9.2i.0.u.1j.1.f.p.d.x.v.b.1h.7.s;2.3.25.18/t.e.n.j.13.5.16.m.1x.8.9.1o.q.0.1.1n.d.o.11.x.v.s.i.1e.1a.2r.20;4.h.9.w.7.26.1i/2.6.g.a.3.8.q.1.d.1f.b.1h.r;w.7/0.d.o.k.x.v.1h.s;2.a.3.0.u/2j.1g.1r.1u;2.h.0.w/6.a.e.n.3.5.16.4.9.y.u.1j.1.p.14.1l.b.r.i.1e.1k;2.5.l/e.2b.m.8.1y.15.u.1.14.d.b.7.s.r.i.1e.1a.z.29;2.6.a.19.3.l/n.j.5.4.8.h.9.0.1.f.p.o.w.12.b.7;2.a.3.1.i.z/e.n.5.4.1o.0.1w.f.18.11.7;28/2.6.g.a.n.j.3.5.4.8.h.9.q.0.1j.f.p.d.o.12.b.r;e.m.1x.0.1c.22/2.a.n.j.3.5.4.8.9.2i.1.f.18.1l.1p.1g.b.2t.z.1u;2.6.a.q.0.1c.w.1h/n.j.3.5.4.h.9.1j.1.f.p.l.12.b;15.2g.2c.b.i/2.t.6.a.e.n.3.5.m.2i.0.1.7;6.a.3.25.2f.c/t.g.19.8.h.q.0.1.17.1f.b.1h.s.r;2.4.9.10.26/t.6.g.a.e.3.m.8.1o.q.15.u.1.17.1w.f.18.14.d.1f.o.1l.l.b.1h.s.1a.23.z.2n;k/0.1.d.1f.x.v.1h.7.s;k/0.1.d.o.x.v.1g.7;2.19.q.2g.0.17.1c.w.1i/a.n.j.3.5.4.8.9.1j.1.p.12.b.i;3.0.l.w/e.5.16.m.4.1x.9.1o.1.f.p.11.b.1k;2.a.3.0.10/6.g.n.j.5.4.8.h.9.q.1.17.b.7.i.1e;28/t.e.5.m.4.h.q.0.17.f.p.14.d.o.x.v.2s.12.7;q.2c.w.10/2.6.a.e.n.j.3.5.m.4.8.h.9.0.1j.1.f.p.d.l.12.b.7.r.1a;28/g.e.5.m.4.8.q.0.17.2h.21.2e.14.d.o.x.v.7.r;2.6.a.3.2f.q.0.l.12.7/n.j.13.5.4.8.h.9.1j.1.p.b;1y.11.w.1i/2.t.6.a.e.n.j.3.13.5.25.16.m.1x.8.9.0.1.f.p.d.1l.12.b.s.i.1k.1a.z;2.6.a.3.l.12/g.8.h.q.0.1.f.p.1f.w.b.1h.r;28/6.g.a.f.p.d.1f.o.x.v.1h.s.1k.1a.23.z;2.e.3.m.c/0.1.d.1f.x.v.1h.7.s.z;2.3.c.i/0.2j.d.o.x.v.1h.7;2.0.2c.1c.29/g.19.1x.8.h.y.1.17.18.10.1s.b.1h.r.z;1b/28;2.3.16.9.i/g.e.n.j.13.5.m.4.8.h.q.0.1.2h.14.12.1s.b.7.r;2.b/4.0.1w.18.d.7.i;3.5.2f.2c.10/2.t.e.m.8.15.0.u.1.1w.18.14.2p.x.v.1s.b.7.i.1e.z.2r;b.2n/2.a.e.3.m.4.8.0.1.1w.18.7;6.h.q.0.1c.w.1z.26/2.g.a.e.n.j.3.5.m.8.9.1j.1.l.12.b.r;u.z/2.6.a.e.3.5.m.4.8.0.1.7;2.a.3.5.l/t.e.m.4.8.1o.0.1.f.7;1b/g.k.1m;2.3.0.f.1c.1z/g.y.1.k.24.2u.1r;1b/0.d.o.x.v.1g.7;2.8.0.7/6.a.e.n.j.13.5.4.f.p.14.11.l.b.r.i.23;28/g.e.4.8.9.0.1.p.d.o.11.l.12.10.1s.b.7.r.i.1z;2.a.3.l/t.n.j.5.4.h.1o.15.2k.0.u.17.1w.f.1n.18.c.21.14.1s.b.1h.7.i.1e.29;2.a.3.q.1.22.l.w/n.j.13.5.4.h.9.0.f.p.d.x.v.7.i;2.5.h.2c/6.a.e.3.m.4.8.1o.0.1.f.p.14.d.o.x.l.v.7.1a.1z.z;6.h.c.2n/2.a.n.j.3.5.4.8.9.q.0.1.p.d.l.w.b;0.2c.1c/2.a.e.3.5.m.4.q.1j.17.f.2h.p.21.14.l.2s.1s.b.r.i.23;1t.q.0.1f.1c.w.1h.1i/2.6.a.3.5.9.1.f.p.l.b;2.a.3.5.l/t.g.2a.e.n.j.13.m.4.1x.8.h.q.0.1.17.14.d.1s.b.1h.7.r.z.29;1b/g.1d.k;2.5.w.1i/0.d.1f.o.x.v.1h.s;2.3/0.1.o.k.x.v.1g.7.1r.1a;2.0.w.1z/e.n.3.13.5.m.4.y.u.1.p.14.11.1l.l.b.r.i.1e.1k.20;2.a.3.0.c/h.y.1.1p;2.3/13.q.u.1.2j.k;4.0.7/2.6.a.e.3;6.3.0.10/1.k.1g;5.7/13.1.c.1p;6.q.0.1c.w.26.1i/2.t.a.n.j.16.4.1x.8.h.9.1.f.11.12.r.i.1e;a.3.c/2.t.16.1.d.o.11.1p.x.v.12.2v;2.5.2k.1s.7/t.a.19.13.1.11.1p;1b/1d.y.k;t.a.3.5.9.0.u.c.1c.l/1d.19.13.h.y.1.1p.1g.12.1u;9.1y.15.0/2.13.8.1.c.d.1p.x.v.b.1k.z.1u;2.5.0.7/t.6.a.e.3.4.8.1.f;5.0.c.1i/2.13.16.9.d.11.2v.20;2.0/g.1.k.1p;1b/g.k.1g;5.0.1f.10.7/1.c.k;5.1x.9.0.1f.1h.7.s/13.h.q.1.c.12;6.0.1c.10.7/2.t.e.n.13.5.16.m.9.1o.q.17.c.11;3.0.c.22.w.2l/2.t.19.1.d.o.12.2n;5.4.0.7/13.1.c.k.1p.1u;2.j.5.2b.9.0.c.1f/y.1.d.o.x.v.1g;5.0.7.z/1d.13.9.y.1.c.1p.1u;1b/g.1.k;3.0.2j.c.w/a.e.16.m.4.8.9.q.u.f.2h.p.14.11.1g.b.r.1k;1t.q.0.1n.c.2e.w.7.1i/2.19.11.12;2.9.k.1z/1;4.9.2g.0.1.f.1f.w.7/6.g.a.e.3.q.17.c.11.12.i.1e;1b/27.1.2j.k.1p;6.5.9.0.2e.1f.10.2l.7.23/j.13.h.q.1.17.c.11.1g.12;28/2.g.a.e.n.j.3.13.5.m.4.q.u.2z.17.f.p.14.l.b.1k;5.2b.h.1y.q.15.w.7.s.i/2.t.19.1.c.o.11.12;5.4.h.0/1.c.d.x.v.1u;2.3.5.9.1f.7/g.1d.y.k.1p.1r.1u;5.7/13.9.y.1.1p.1u;2.3.5.9.0.7/13.1.1p.z.1u;0.c.w.1i/e.n.j.13.5.16.m.1x.9.1o.y.q.1.2j.2h.11.1p.2x.1g.1s.r.20;3.15.0.1e/19.n.j.13.h.2j.1p.2d.1g.12;1b/g.k.1m;2.5.22/1.k.1p.1g;1b/h.1.k;5.2b.1y.0.7.s/2.t.6.g.a.2a.e.3.m.8.h.q.15.1.17.p.14.1l.l.b.i.1e.1k.z;4.0/e.m.8.1o.q.1.c;2.5.15.2c.1i/1.11.k.1p;1b/1.k.1r;2.e.m.4.9.0.7/1d.y.1.1p.1g.1u;2.3.q.0.u.1n.c.w.i.23.1i/1d.19.y;5.9.0.1f/2.t.e.13.16.m.1.c.11.2y.1p.12;2.q.0.17.c.1c.7.1i/6.g.a.33.4.8.9.u.1.14.12.b.i;13.5.0.7/2.19.h.11.1p.12.2n;1b/g.1q.k;5.4.0.1.22.z/h.k.1p.1u;1b/1.c.k;3.5.4.9.0/13.q.1.17.k.1p.12;2.6.a.19.3.4.2z.1l.l.7/g.n.j.13.q.1.12.b;3.5.4.u.f.b.7/2.1.1p;5.0.1f.1h/2.13.1.c;9.0.u.1f.7/t.g.d.o.k.1p.x.v.1u;2.j.5.4.q.0.2e.w.7.1i/1d.2m.19.9.1.c.2d.b;5.9/1.c.d.k.v;2.5.2f.q.0.17.1n.1c.w.1i/19.h.y.1.c.1g".split(";");
 const decode=value=>value.split(".").map(index=>words[parseInt(index,36)]).join(" ");
 const table={};
 rows.forEach((row,index)=>{const [ji,yi]=row.split("/");table[Math.floor(index/60)+"-"+index%60]={j:decode(ji),y:decode(yi)}});
 return table;
})();
function extractDailyTable(source){var match=/\b[A-Za-z_$][\w$]*\s*=\s*\{\s*"0-0"\s*:\s*\{/.exec(source);if(!match)throw Error('未找到每日宜忌表');var start=source.indexOf('{',match.index),depth=0,quoted=false,escape=false;for(var i=start;i<source.length;i++){var c=source[i];if(quoted){if(escape)escape=false;else if(c==='\\')escape=true;else if(c==='"')quoted=false;continue}if(c==='"')quoted=true;else if(c==='{')depth++;else if(c==='}'&&!--depth){var value=source.slice(start,i+1).replace(/([{,])\s*([yj])\s*:/g,'$1"$2":');var table=JSON.parse(value);if(Object.keys(table).length<100||!Object.values(table).every(v=>typeof v.y==='string'&&typeof v.j==='string'))throw Error('宜忌表无效');return table}}throw Error('宜忌表不完整')}
function dailyAdviceFor(dateString,table){
 const [year,month,day]=dateString.split('-').map(Number),calendar=wnlAlmanac.calendar;
 const item=calendar.getYJ(year,month-1,day,table);if(!item||typeof item.y!=='string'||typeof item.j!=='string')throw Error('当日宜忌数据缺失');
 const clean=value=>value.replace(/-/g,'无').replace(/\s+/g,' ').trim();
 let yi=clean(item.y),ji=clean(item.j);if(month===3&&day===12)ji=ji.replace(/栽种/g,'').replace(/\s+/g,' ').trim();
 const yiWords=yi.split(' ').filter(Boolean),yiPref=['出行','打扫','搬家','搬新房','入宅','移徙','开业','开市','交易','立券','会亲友','订婚','理发','沐浴','祈福','求医','治病','安床'];
 yi=[...yiWords.filter(w=>yiPref.some(k=>w.includes(k))),...yiWords.filter(w=>!yiPref.some(k=>w.includes(k)))].slice(0,12).join(' ');
 return {date:dateString,yi:yi||'无',ji:ji||'无',source:'https://mobile.51wnl-cq.com/huangli_tab_h5/?posId=BDSS&STIME='+dateString};
}
async function loadDailyAdvice(dateString){
 const path=fm.joinPath(fm.documentsDirectory(),'haoye-daily-almanac-v1.json');let cached=null;
 try{const saved=JSON.parse(fm.readString(path));if(saved.table&&Object.keys(saved.table).length>=100)cached=saved}catch(_){}
 if(cached&&cached.fetchedDate===dateString){try{return {...dailyAdviceFor(dateString,cached.table),offline:false}}catch(_){}}
 async function readTable(url){const req=new Request(url);req.timeoutInterval=10;return extractDailyTable(await req.loadString())}
 try{
  let table=null,bundleURL=cached&&cached.bundleURL;
  if(bundleURL&&/^https:\/\/mobile\.51wnl-cq\.com\/huangli_tab_h5\/_nuxt\/[a-zA-Z0-9._-]+\.js$/.test(bundleURL)){try{table=await readTable(bundleURL)}catch(_){}}
  if(!table){
   const pageURL='https://mobile.51wnl-cq.com/huangli_tab_h5/?posId=BDSS&STIME='+dateString,req=new Request(pageURL);req.timeoutInterval=10;
   const html=await req.loadString(),paths=[...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)].map(m=>m[1]).filter(p=>/^\/huangli_tab_h5\/_nuxt\/[a-zA-Z0-9._-]+\.js$/.test(p)).reverse();
   for(const path of paths){try{bundleURL='https://mobile.51wnl-cq.com'+path;table=await readTable(bundleURL);break}catch(_){}}
   if(!table)throw Error('网站每日宜忌表暂不可用');
  }
  const value=dailyAdviceFor(dateString,table);try{fm.writeString(path,JSON.stringify({fetchedDate:dateString,bundleURL,table}))}catch(_){}
  return {...value,offline:false};
 }catch(_){return {...dailyAdviceFor(dateString,cached?cached.table:wnlDailySeed),offline:true}}
}

async function loadLucky(){
 const path=fm.joinPath(fm.documentsDirectory(),'haoye-lucky-'+zodiac.slug+'.json');let cached=null;
 try{const value=JSON.parse(fm.readString(path));if(typeof value.color==='string'&&typeof value.number==='string'&&value.color.trim()&&value.number.trim())cached=value}catch(_){}
 if(cached&&fm.modificationDate(path)&&Date.now()-fm.modificationDate(path).getTime()<7*86400000)return cached;
 try{const req=new Request('https://m.xzw.com/astro/'+zodiac.slug+'/');req.timeoutInterval=12;const html=await req.loadString(),color=html.match(/<li[^>]*>\s*([^<]+)<span[^>]*>颜色<\/span>/),number=html.match(/<li[^>]*>\s*([^<]+)<span[^>]*>幸运号码<\/span>/);if(!color||!number)throw Error('来源格式变化');const value={color:color[1].trim(),number:number[1].trim()};try{fm.writeString(path,JSON.stringify(value))}catch(_){}return value}catch(_){return cached||{color:'待更新',number:'—'}}
}
const adviceDate=shanghaiDate();
const [lucky,result,dayAdvice]=await Promise.all([loadLucky(),weather(),loadDailyAdvice(adviceDate)]);
const luckyColors={'红色':'#d65359','粉色':'#ca7296','粉红色':'#ca7296','橘黄':'#c48535','橙色':'#c47b35','黄色':'#a78a2d','绿色':'#4e8864','蓝色':'#4b80b1','紫色':'#9166a6','白色':'#8b958d','黑色':'#333333','棕色':'#936f51','灰色':'#808985'};
function luckyPalette(value){
 const aliases={'红':'红色','粉':'粉色','粉红':'粉红色','橙':'橙色','橘':'橙色','橘色':'橙色','橘黄':'橙色','黄':'黄色','绿':'绿色','蓝':'蓝色','紫':'紫色','白':'白色','黑':'黑色','棕':'棕色','褐':'棕色','褐色':'棕色','咖啡':'咖啡色','灰':'灰色','金':'金色','银':'银色'};
 const extra={'咖啡色':'#795548','金色':'#aa8834','银色':'#8b949c','米色':'#b29d79','天蓝色':'#529bc2','浅蓝色':'#76a9c7','深蓝色':'#365d8b','淡绿色':'#82a57b','深绿色':'#35624c','桃红色':'#cc638b','玫瑰红':'#bf5976'};
 const palette=String(value||'').split(/[、，,\/／\s和及]+/).filter(Boolean).map(name=>{name=aliases[name]||name;return luckyColors[name]||extra[name]||null}).filter(Boolean);
 return [...new Set(palette.length?palette:['#87928a'])];
}

let luckyPaletteValues=luckyPalette(lucky.color),luckyInk=luckyPaletteValues[0];

function validWeather(value){const d=value&&value.daily;if(!d)return false;const keys=['time','weather_code','temperature_2m_max','temperature_2m_min','sunrise','sunset'];return keys.every(k=>Array.isArray(d[k])&&d[k].length>=7)&&d.time.slice(0,7).every(t=>typeof t==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(t))&&['weather_code','temperature_2m_max','temperature_2m_min'].every(k=>d[k].slice(0,7).every(Number.isFinite))&&['sunrise','sunset'].every(k=>d[k].slice(0,7).every(v=>typeof v==='string'&&/T\d{2}:\d{2}/.test(v)))}

// 用户选择约5公里定位精度：坐标先映射到5公里网格，再查询地址和天气。
function validPlace(value){return !!value&&value.gridKm===5&&Number.isFinite(value.latitude)&&Number.isFinite(value.longitude)&&Math.abs(value.latitude)<=90&&Math.abs(value.longitude)<=180&&typeof value.label==='string'&&value.label.length>0}
function readLocalJSON(path){try{return JSON.parse(fm.readString(path))}catch(_){return null}}
function saveLocalJSON(path,value){try{fm.writeString(path,JSON.stringify(value))}catch(_){}}
async function locationTimeout(task,milliseconds){let timer;try{return await Promise.race([task,new Promise((_,reject)=>{timer=Timer.schedule(milliseconds,false,()=>reject(Error('定位超时')))})])}finally{if(timer)timer.invalidate()}}
function coarseLocation(gps){
 if(!gps||!Number.isFinite(gps.latitude)||!Number.isFinite(gps.longitude)||Math.abs(gps.latitude)>90||Math.abs(gps.longitude)>180)throw Error('定位数据无效');
 const latitudeStep=5/111.32,latitude=Math.max(-90,Math.min(90,Math.round(gps.latitude/latitudeStep)*latitudeStep));
 const longitudeStep=5/(111.32*Math.max(.01,Math.cos(latitude*Math.PI/180))),longitude=Math.max(-180,Math.min(180,Math.round(gps.longitude/longitudeStep)*longitudeStep));
 return {latitude:Number(latitude.toFixed(5)),longitude:Number(longitude.toFixed(5)),gridKm:5};
}
function placeDistance(a,b){const radians=value=>value*Math.PI/180,dy=radians(a.latitude-b.latitude),dx=radians(a.longitude-b.longitude),h=Math.sin(dy/2)**2+Math.cos(radians(a.latitude))*Math.cos(radians(b.latitude))*Math.sin(dx/2)**2;return 6371*2*Math.asin(Math.sqrt(Math.min(1,h)))}
function geocodedLabel(address){
 const code=String(address.isoCountryCode||address.countryCode||'').toUpperCase(),country=code==='CN'?'中国':String(address.country||'中国');
 let area=String(address.subLocality||address.locality||address.subAdministrativeArea||address.administrativeArea||'').trim();
 if(area.length>2)area=area.replace(/(特别行政区|自治州|地区|市|区|县)$/,'');
 return area?country+'•'+area:'';
}
async function weatherPlace(){
 const path=fm.joinPath(fm.documentsDirectory(),'haoye-location-5km-v1.json'),saved=readLocalJSON(path),previous=validPlace(saved)?saved:null;
 if(previous&&previous.named&&Number.isFinite(previous.updatedAt)&&Date.now()-previous.updatedAt>=0&&Date.now()-previous.updatedAt<10*60000)return {...previous,stale:false};
 try{
  Location.setAccuracyToThreeKilometers();
  const gps=await locationTimeout(Location.current(),config.runsInWidget?12000:20000);
  // 以下仅使用模糊化坐标，原始GPS坐标不落盘，不传入逆地理编码或天气请求。
  const place={...coarseLocation(gps),label:'已定位',named:false,updatedAt:Date.now()};
  if(previous&&previous.named&&placeDistance(place,previous)<1){place.label=previous.label;place.named=true}
  else{try{const addresses=await locationTimeout(Location.reverseGeocode(place.latitude,place.longitude,'zh_CN'),6000),label=addresses&&addresses[0]&&geocodedLabel(addresses[0]);if(label){place.label=label;place.named=true}}catch(_){}}
  saveLocalJSON(path,place);return {...place,stale:false};
 }catch(_){return previous?{...previous,stale:true}:null}
}
async function weather(){
 const path=fm.joinPath(fm.documentsDirectory(),'haoye-weather-5km-v1.json'),saved=readLocalJSON(path),cached=saved&&validWeather(saved.data)&&validPlace(saved.place)?saved:null;
 const place=await weatherPlace();
 if(place){try{
  const req=new Request('https://api.open-meteo.com/v1/forecast?latitude='+place.latitude+'&longitude='+place.longitude+'&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=Asia%2FShanghai&forecast_days=7');req.timeoutInterval=15;
  const value=await req.loadJSON();if(!validWeather(value))throw Error('天气数据不完整');saveLocalJSON(path,{data:value,place,fetchedAt:Date.now()});return {data:value,place,stale:place.stale};
 }catch(_){}}
 // 天气缓存与地点成对回退，避免显示甲地名称、乙地天气。
 if(cached)return {data:cached.data,place:cached.place,stale:true};
 return {data:null,place,stale:true};
}
function hourRange(hour){const start=(2*Math.floor((hour+1)/2)+23)%24,pad=value=>String(value).padStart(2,'0');return pad(start)+':00 – '+pad((start+1)%24)+':59'}
function icon(code){return code===0?'sun.max.fill':code<=2?'cloud.sun.fill':code===3?'cloud.fill':code<=48?'cloud.fog.fill':code<=67?'cloud.rain.fill':code<=77?'cloud.snow.fill':code<=82?'cloud.heavyrain.fill':code<=86?'cloud.snow.fill':'cloud.bolt.rain.fill'}
const now=adviceDate,[year,month,day]=now.split('-').map(Number),date=new Date(year,month-1,day,12),cal=wnlAlmanac.calendar,lunar=cal.solar2lunar(year,month-1,day),birthday=birthdayCountdown(now),eve=newYearsEveProgress(now);
const hf=new DateFormatter();hf.timeZone='Asia/Shanghai';hf.dateFormat='H';const hour=Number(hf.string(new Date())),idx=cal.getLunarHourIndex(hour);

// 统一在 360 × 376 画布绘制，维持 Scriptable 大号组件的手机比例。
const ctx=new DrawContext();ctx.size=new Size(360,376);ctx.opaque=true;ctx.respectScreenScale=true;
let glassBackground=null;try{if(fm.fileExists(backgroundPath))glassBackground=fm.readImage(backgroundPath)}catch(_){}
const glassActive=!!glassBackground;
const darkMode=!glassActive&&Device.isUsingDarkAppearance(),darkUI=glassActive||darkMode;
if(darkUI){luckyPaletteValues=luckyPaletteValues.map(hex=>'#'+[0,2,4].map(i=>Math.round(parseInt(hex.slice(i+1,i+3),16)*.65+255*.35).toString(16).padStart(2,'0')).join(''));luckyInk=luckyPaletteValues[0]}
const ink=darkUI?'#f6f5ef':'#29362f',muted=darkUI?'#c3cec0':'#768273',paper=glassActive?'#fffefa':darkMode?'#1f2623':'#fffefa',green=glassActive?'#15322f':darkMode?'#274b3e':'#3a5a4e';
const uiTrack=darkMode?'#454f47':'#d9e0d3',uiCard=darkMode?'#2a332e':'#e3ede5',uiDivider=darkMode?'#3a453e':'#dfe4d9',uiBar=darkMode?'#454f47':'#dce2d6',uiPanel=darkMode?'#262d29':'#e4e9e4',uiText2=darkMode?'#b9c6b4':'#65745f',uiJi=darkUI?'#d5e2ca':'#647b5f',uiJiBg=darkMode?'#33413a':'#e2e9dc';
function rect(x,y,w,h,color,r=0,alpha=1){ctx.setFillColor(new Color(color,alpha));const p=new Path();p.addRoundedRect(new Rect(x,y,w,h),r,r);ctx.addPath(p);ctx.fillPath()}
function text(value,x,y,w,size,color=ink,bold=false,align='left',height=size*1.5){ctx.setFont(bold?Font.semiboldSystemFont(size):Font.systemFont(size));ctx.setTextColor(new Color(color));if(align==='right')ctx.setTextAlignedRight();else if(align==='center')ctx.setTextAlignedCenter();else ctx.setTextAlignedLeft();ctx.drawTextInRect(String(value),new Rect(x,y,w,height))}
function symbol(name,x,y,w,h){const sf=SFSymbol.named(name);if(!sf)return;sf.applyFont(Font.systemFont(w));ctx.drawImageInRect(sf.image,new Rect(x,y,w,h))}

// 以原生线条绘制图标，颜色不依赖 iOS 对 SF Symbols 的默认着色。
function strokePolyline(points,color,width=1){const path=new Path();points.forEach((point,index)=>{const p=new Point(point[0],point[1]);if(index===0)path.move(p);else path.addLine(p)});ctx.setStrokeColor(new Color(color));ctx.setLineWidth(width);ctx.addPath(path);ctx.strokePath()}
function drawRunner(x,y,color){
 ctx.setFillColor(new Color(color));ctx.fillEllipse(new Rect(x+9.5,y+.5,4,4));
 const lines=[[[9,6],[6.5,11]],[[9,6],[12,9],[16,9]],[[9,6],[5,6.5],[3.5,10]],[[6.5,11],[10.5,14],[9,18]],[[6.5,11],[4,16],[1,17]]];
 for(const line of lines){strokePolyline(line.map(p=>[x+p[0],y+p[1]]),color,1.7);for(const p of line){ctx.setFillColor(new Color(color));ctx.fillEllipse(new Rect(x+p[0]-.85,y+p[1]-.85,1.7,1.7))}}
}
function drawSunEvent(kind,x,y,w,h,color){
 const lines=[[[0,8.6],[12,8.6]],[[1.3,5.7],[2.3,6.1]],[[2.5,3.8],[3.3,4.6]],[[9.5,3.8],[8.7,4.6]],[[10.7,5.7],[9.7,6.1]],[[6,.2],[6,3.4]]];
 const arc=[];for(let i=0;i<=10;i++){const angle=Math.PI+i*Math.PI/10;arc.push([6+2.7*Math.cos(angle),8+2.7*Math.sin(angle)])}lines.push(arc);
 lines.push(kind==='sunrise'?[[4.5,1.7],[6,.2],[7.5,1.7]]:[[4.5,1.9],[6,3.4],[7.5,1.9]]);
 for(const line of lines)strokePolyline(line.map(p=>[x+p[0]*w/12,y+p[1]*h/10]),color,.85);
}
function paleInk(hex,alpha=.12){const mix=(a,b)=>Math.round(a*alpha+b*(1-alpha)).toString(16).padStart(2,'0');return '#'+[0,2,4].map(i=>mix(parseInt(hex.slice(i+1,i+3),16),parseInt(paper.slice(i+1,i+3),16))).join('')}

function textWidth(value,size){return Array.from(String(value)).reduce((sum,ch)=>sum+(/[\x00-\x7f]/.test(ch)?size*.6:size),0)}
function fitSize(value,width,size){return Math.min(size,width/Math.max(1,textWidth(value,1)))}
function luckyNumberText(value,x,y,size){const chars=Array.from(String(value)),step=size*.6;if(luckyPaletteValues.length===1){text(value,x,y,chars.length*step+3,size,luckyInk);return}for(let i=0;i<chars.length;i++){const color=luckyPaletteValues[Math.min(luckyPaletteValues.length-1,Math.floor(i*luckyPaletteValues.length/chars.length))];text(chars[i],x+i*step,y,step+3,size,color)}}

rect(0,0,360,376,paper);
if(glassActive){
 ctx.drawImageInRect(glassBackground,new Rect(0,0,360,376));
 let sourceLuminance=180;try{const saved=JSON.parse(fm.readString(backgroundMetaPath));if(Number.isFinite(saved.luminance))sourceLuminance=Math.max(0,Math.min(255,saved.luminance))}catch(_){}
 const style=({light:{base:.16,target:120},standard:{base:.22,target:112},dense:{base:.36,target:100}})[preferences.glassStyle]||{base:.22,target:112};
 const tintLuminance=53,adaptive=sourceLuminance>style.target?(sourceLuminance-style.target)/Math.max(1,sourceLuminance-tintLuminance):0;
 rect(0,0,360,376,'#2c3836',0,Math.min(.70,Math.max(style.base,adaptive)));
 for(let i=0;i<18;i++)rect(0,i*4,360,4,'#ffffff',0,.055*(1-i/18));
}
// 头像外圈表示生日周期，名字、MBTI 与右侧倒计时分栏。
for(let i=0;i<80;i++){const angle=-Math.PI/2+i*Math.PI*2/80;ctx.setFillColor(new Color(i/80<birthday.progress?luckyInk:uiTrack));ctx.fillEllipse(new Rect(35.65+25*Math.cos(angle)-.65,43+25*Math.sin(angle)-.65,1.3,1.3))}
ctx.setFillColor(new Color(uiCard,glassActive ? .24 : 1));ctx.fillEllipse(new Rect(13.65,21,44,44));
let hasAvatar=false;if(fm.fileExists(avatarPath)){try{ctx.drawImageInRect(fm.readImage(avatarPath),new Rect(13.65,21,44,44));hasAvatar=true}catch(_){}}
if(!hasAvatar)text('🐑',14.65,24,42,29,ink,false,'center');
text(preferences.name,72,23,172,fitSize(preferences.name,172,20),ink,true);
const identity=[preferences.mbti,zodiac.name].filter(Boolean).join(' · ');text(identity,72,48,172,fitSize(identity,172,11),muted);
text(birthday.days===0?'生日快乐':'距离生日',268,24,82,10,muted,false,'right');
if(birthday.days===0){text('🎂',287,39,62,27,luckyInk,false,'right')}else{const number=String(birthday.days),size=27;const x=337-textWidth(number,size);luckyNumberText(number,x,38,size);text('天',340,52,10,9,muted,false,'right')}

// 幸运信息独立成行；数值与进度线跟随幸运色。
const luckyRowY=64;
text('幸运色：',72,luckyRowY,40,10,muted);
text(lucky.color,112,luckyRowY,40,10,luckyInk,true);
const luckyNumberLabelX=112+Math.min(40,textWidth(lucky.color,10))+12;
text('幸运号：',luckyNumberLabelX,luckyRowY,40,10,muted);
text(lucky.number,luckyNumberLabelX+40,luckyRowY,60,10,luckyInk,true);

// 进度至宜忌区域统一上移，小人和进度线保持相对位置。
const calendarOffsetY=-8;
const progressDateOffsetY=calendarOffsetY-3;
const dashCount=47;
const dashWidth=4.5;
const dashHeight=1.25;
for(let i=0;i<dashCount;i++)rect(10+i*(340-dashWidth)/(dashCount-1),110+progressDateOffsetY+(2.5-dashHeight)/2,dashWidth,dashHeight,i/dashCount<eve.percent/100?luckyPaletteValues[i%luckyPaletteValues.length]:uiBar,dashHeight/2);
const runnerX=10+Math.min(.96,Math.max(.02,eve.percent/100))*340;
// 小人朝右，并跟随幸运色。
drawRunner(runnerX-8,90+progressDateOffsetY,luckyInk);
text('奔向团圆 · '+Math.round(eve.percent)+'%',10,116+progressDateOffsetY,120,9,muted);
if(eve.days===0){text('今天是除夕',244,116+progressDateOffsetY,106,9,luckyInk,false,'right')}else{const size=9,prefix='距除夕',number=String(eve.days),unitX=341,numberX=unitX-3-textWidth(number,size),labelWidth=textWidth(prefix,size);text(prefix,numberX-4-labelWidth,116+progressDateOffsetY,labelWidth+1,size,muted);luckyNumberText(number,numberX,116+progressDateOffsetY,size);text('天',unitX,116+progressDateOffsetY,9,size,muted,false,'right')}

// 日期与时辰：主要日期突出，次要信息使用统一字色。
text(String(day),10,137+progressDateOffsetY,65,43,ink);rect(76,143+progressDateOffsetY,1,34,uiDivider,0,glassActive ? .28 : 1);
const weekday=['星期日','星期一','星期二','星期三','星期四','星期五','星期六'][new Date(Date.UTC(year,month-1,day)).getUTCDay()];
text(weekday,89,142+progressDateOffsetY,160,15,ink,true);
text(lunar.IMonthCn+lunar.IDayCn+' · '+lunar.gzDay+'日',89,162+progressDateOffsetY,200,11,muted);

const hourLabel=cal.getStemsBranchHourAsString(date,hour)+'时';
text(hourLabel,10,193+calendarOffsetY,40,10,luckyInk,true);
text(hourRange(hour).replace(' – ','–'),18+textWidth(hourLabel,10),193+calendarOffsetY,100,10,muted);
text(cal.cxInfoOfDateTime(date,idx),203,193+calendarOffsetY,115,10,muted,false,'right');
const compass=cal.compassCNOfDate(date,idx).trim().split(/\s+/).join(' · ');
text(compass,10,207+calendarOffsetY,340,9,muted);
const fortune=cal.jixiongStatusOfDateTime(date,hour);
const fortuneIsLucky=fortune==='吉';
ctx.setFillColor(new Color(fortuneIsLucky?'#e8efe4':'#f6e8e5',darkUI ? .16 : 1));
ctx.fillEllipse(new Rect(328,189+calendarOffsetY,22,22));
text(fortune,328,193+calendarOffsetY,22,11,darkUI?(fortuneIsLucky?'#e1ebd8':'#f0b6b8'):(fortuneIsLucky?'#718b70':'#bd7371'),false,'center');

// 宜忌标签与正文对齐，每项最多两行，超长内容省略。 
const advicePanelY=231+calendarOffsetY;
rect(10,advicePanelY,340,48,uiPanel,9,glassActive ? .10 : 1);
function wrapAdvice(value,size,width){let line='',lines=[];for(const word of value.split(/\s+/)){const next=line?line+' '+word:word;if(line&&textWidth(next,size)>width){lines.push(line);line=word}else line=next}if(line)lines.push(line);return lines}
function drawAdvice(label,value,y,color,bg,maxLines){rect(17,y,14,14,bg,3,glassActive ? .15 : 1);text(label,17,y,14,9,color,true,'center');const size=8.5;let lines=wrapAdvice(value,size,305);if(lines.length>maxLines){lines=lines.slice(0,maxLines);const words=lines[maxLines-1].split(' ');while(words.length&&textWidth(words.join(' ')+'…',size)>305)words.pop();lines[maxLines-1]=words.join(' ')+'…'}text(lines.join('\n'),38,y,305,size,glassActive?'#e3e8df':uiText2,false,'left',20)}
drawAdvice('宜',dayAdvice.yi,advicePanelY+4,luckyInk,paleInk(luckyInk),2);
drawAdvice('忌',dayAdvice.ji,advicePanelY+26,uiJi,uiJiBg,2);

// 天气底栏：日出图标＋时间 / 居中地点 / 日落图标＋时间，与预览一致。
function drawWeatherFooter(daily,stale){
 const color='#c7d8c9',size=8;
 drawSunEvent('sunrise',100,353,12,10,color);
 text(daily.sunrise[0].slice(11,16),115,354,34,size,color);
 const fullLabel=result.place?result.place.label:'中国•未定位';let label=fullLabel,labelSize=fitSize(label,60,size);if(labelSize<7){labelSize=7;while(label&&textWidth(label+'…',labelSize)>60)label=Array.from(label).slice(0,-1).join('');label+='…'}text(label,150,354,60,labelSize,color,false,'center');
 drawSunEvent('sunset',215,353,12,10,color);
 text(daily.sunset[0].slice(11,16),230,354,34,size,color);
 if(stale)text('缓存',310,354,24,7,'#a8bfae',false,'right');
}
// 天气样式随背景切换，周几按北京时间的日期计算。
rect(10,281,340,85,green,12,glassActive ? .68 : 1);
const daily=result.data&&result.data.daily;
if(daily){
  for(let i=0;i<7;i++){
    const x=17+i*(340-14-36)/6;
    const isToday=daily.time[i]===now;
    if(glassActive)rect(x,286,36,62,isToday?'#edb0ab':'#ffffff',15,isToday ? .23 : .065);
    else if(isToday)rect(x,286,36,62,'#667b69',15);
    const dayOfWeek=new Date(daily.time[i]+'T12:00:00Z').getUTCDay();
    text(isToday?'今天':['周日','周一','周二','周三','周四','周五','周六'][dayOfWeek],x,291,36,8,'#c7d7c9',false,'center');
    symbol(icon(daily.weather_code[i]),x+10,302,16,12);
    text(Math.round(daily.temperature_2m_max[i])+'°',x,316,36,11,'#f2f5ec',true,'center');
    text(Math.round(daily.temperature_2m_min[i])+'°',x,330,36,9,'#c7d6c3',false,'center');
    const probability=daily.precipitation_probability_max?.[i];
    if(Number.isFinite(probability)&&probability>=30)text('💧'+Math.round(probability)+'%',x,341,36,6.5,'#9fc3e8',false,'center');
  }
  drawWeatherFooter(daily,result.stale);
}
else{text(result.place?result.place.label+' · 天气暂不可用':'请先在 Scriptable 中运行并允许定位',30,323,300,9,'#d7e4db',false,'center')}

// 直接设置整张背景图，避免 WidgetImage 的适应模式留下奶白空隙。
if(glassActive){const edge=new Path();edge.addRoundedRect(new Rect(.5,.5,359,375),28,28);ctx.setStrokeColor(new Color('#ffffff',.26));ctx.setLineWidth(.8);ctx.addPath(edge);ctx.strokePath()}
const widget=new ListWidget();widget.backgroundColor=new Color(glassActive?'#2c3836':paper);widget.setPadding(0,0,0,0);widget.backgroundImage=ctx.getImage();
const nextMidnight=Date.parse(now+'T00:00:00+08:00')+86400000;widget.refreshAfterDate=new Date(Math.min(Date.now()+((result.stale||dayAdvice.offline)?15:30)*60000,nextMidnight+5000));widget.url=URLScheme.forRunningScript();
Script.setWidget(widget);if(!config.runsInWidget)await widget.presentLarge();Script.complete();
