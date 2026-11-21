import { painter, seeded, grain, pine, crescent } from './ink.js';

export const summit = {
  title: 'The Polar Observatory', tab: 'Observatory', region: 'Northglass Summit', difficulty: 'Hard', seconds: 140,
  targets: [
    ['Missing star', 93, 57, 22],
    ['Aurora arch', 484, 66, 39],
    ['Hut window', 100, 267, 23],
    ['Tower stripe', 193, 187, 22],
    ['Dome seam', 334, 194, 23],
    ['Scope angle', 398, 147, 22],
    ['Sled cargo', 492, 338, 22],
    ['Trail marker', 207, 340, 21],
    ['Tracks in the snow', 352, 407, 25],
    ['Roof vent', 552, 233, 22],
  ],
  draw: drawSummit,
};

function aurora(ctx, ink) {
  const halo = ctx.createRadialGradient(340, 71, 10, 340, 71, 270);
  halo.addColorStop(0, '#48bbad4a');
  halo.addColorStop(.58, '#367b9c29');
  halo.addColorStop(1, '#367b9c00');
  ink.box(0,0,640,225,halo);

  const curtain = ctx.createLinearGradient(0,0,0,160);
  curtain.addColorStop(0,'#b494ea00');
  curtain.addColorStop(.35,'#ab95da41');
  curtain.addColorStop(.66,'#5bd4b19b');
  curtain.addColorStop(1,'#8bf4c884');
  ctx.beginPath();
  ctx.moveTo(-35,117);
  ctx.bezierCurveTo(112,154,192,23,312,48);
  ctx.bezierCurveTo(433,73,512,117,675,30);
  ctx.lineTo(675,-12);
  ctx.bezierCurveTo(513,82,432,32,312,4);
  ctx.bezierCurveTo(193,-20,114,104,-35,76);
  ctx.closePath();
  ctx.fillStyle=curtain;
  ctx.fill();

  const strands = seeded(2781);
  for (let i=0; i<124; i++) {
    const t=(i+strands()*.6)/124, x=t*676-18;
    const y=81+Math.sin(t*Math.PI*2.7+.78)*28+Math.cos(t*Math.PI*5.3)*10-t*23;
    const length=12+strands()*35;
    const fade=ctx.createLinearGradient(x,y-length,x,y);
    fade.addColorStop(0,'#a99bd100');
    fade.addColorStop(.46,i%4 ? '#6fe4c021' : '#cdb6e43c');
    fade.addColorStop(1,'#bcffda66');
    ctx.beginPath();
    ctx.moveTo(x+length*.25,y-length);
    ctx.quadraticCurveTo(x+4,y-length*.4,x,y);
    ctx.strokeStyle=fade;
    ctx.lineWidth=1.1+strands()*1.4;
    ctx.stroke();
  }
  for (let band=0;band<5;band++) {
    const drop=band*6;
    ctx.beginPath();
    ctx.moveTo(-24,120+drop);
    ctx.bezierCurveTo(105,153+drop,190,27+drop,313,49+drop);
    ctx.bezierCurveTo(430,69+drop,532,116+drop,661,44+drop);
    ctx.strokeStyle=band===0 ? '#9bffcf95' : '#8de5c129';
    ctx.lineWidth=band===0 ? 1.6 : 4;
    ctx.stroke();
  }
}

function cabinSiding(ink,x,y,width,rows) {
  for (let row=0;row<rows;row++) {
    const line=y+row*7;
    ink.beam([[x,line],[x+width,line]],'#324e6673',1);
    ink.beam([[x+3,line+1.6],[x+width-4,line+1.6]],'#efbfbe38',.7);
  }
}

function drawSummit(ctx, changed) {
  const ink = painter(ctx), { path, box, oval, sky, beam, label } = ink;
  const random = seeded(226);
  sky('#0e1636', '#466f89', 265);
  aurora(ctx, ink);
  for (let i=0;i<99;i++) {
    const x=random()*640, y=13+random()*171, r=.4+random()*1.15;
    oval(x,y,r,r,i%6 ? '#b3d1c6aa' : '#fff2d2');
  }
  const stars = [[67,85],[93,57],[126,62],[158,91],[180,70]];
  beam(stars,'#bac8d358',.75);
  for (const [x,y] of stars) {
    if (changed && x === 93) continue;
    oval(x,y,2.9,2.9,'#f7ecca');
    beam([[x-5,y],[x+5,y]],'#f4e9c4',1);
    beam([[x,y-5],[x,y+5]],'#f4e9c4',1);
  }
  ctx.beginPath();
  ctx.moveTo(445,78);
  ctx.quadraticCurveTo(481,changed ? 84 : 39,530,77);
  ctx.strokeStyle = '#caebcda4';
  ctx.lineWidth=2;
  ctx.stroke();
  crescent(ctx,566,75,22,'#e3e7cb');

  path([[0,218],[73,159],[112,183],[204,125],[270,190],[324,222],[419,177],[496,113],[549,179],
    [581,169],[640,209],[640,450],[0,450]], '#466985');
  path([[73,159],[70,179],[83,197],[54,208],[31,210]], '#7392ab');
  path([[204,125],[205,158],[176,184],[151,189],[96,214],[123,185]], '#6186a4');
  path([[496,113],[501,150],[479,180],[444,208],[403,216],[433,169]], '#6a91a8');
  path([[581,169],[584,189],[568,198],[559,220],[537,215]], '#7696ac');
  path([[141,171],[204,125],[244,164],[205,154],[199,168],[186,154],[164,167]], '#9dbdc5');
  path([[414,184],[496,113],[549,179],[511,160],[506,151],[492,158],[479,151],[465,160]], '#b8cbd0');
  path([[0,225],[81,199],[166,215],[237,183],[307,217],[366,204],[426,200],[501,224],[640,195],[640,450],[0,450]], '#60869c');
  for (let i=0;i<49;i++) pine(ink, random()*640, 253+random()*37, 12+random()*39, i%2 ? '#36596f' : '#3b6276');
  const snow = ctx.createLinearGradient(0,259,0,450);
  snow.addColorStop(0,'#bfddd4');
  snow.addColorStop(1,'#789fac');
  path([[0,286],[112,272],[186,278],[260,263],[316,273],[389,263],[461,271],[532,260],[640,285],[640,450],[0,450]], snow);
  path([[0,372],[100,330],[198,321],[320,355],[420,322],[545,302],[640,315],[640,450],[0,450]], '#a0bbcb');
  path([[0,390],[104,362],[212,363],[298,377],[400,353],[567,334],[640,358],[640,450],[0,450]], '#dce6da');
  path([[0,424],[128,393],[270,407],[384,391],[506,394],[640,370],[640,450],[0,450]], '#bdcfd1');
  path([[0,387],[104,360],[211,361],[300,374],[403,351],[568,332],[640,355],[640,358],[566,339],[400,356],[298,380],[209,366],[103,365],[0,393]],'#edf2da');
  path([[119,375],[165,364],[211,367],[264,385],[212,376],[169,376]],'#a5c0c4');
  path([[443,375],[493,357],[546,352],[588,360],[548,359],[496,365]],'#aac3c8');
  for (let i=0;i<81;i++) {
    const x=random()*640,y=292+random()*158,r=2+random()*15;
    beam([[x,y],[x+r*.35,y-1.4],[x+r,y]],i%3?'#60839536':'#f1eed2aa',1);
  }

  path([[84,294],[142,288],[180,305],[134,313],[70,305]],'#789aaa88');
  path([[540,288],[584,281],[630,303],[577,311],[525,300]],'#789aaa88');
  path([[267,279],[410,274],[501,309],[440,322],[270,307],[224,295]],'#6a8da291');
  box(71,242,77,55,'#78595f','#435363',2);
  cabinSiding(ink,73,251,73,6);
  path([[59,245],[73,232],[87,226],[136,226],[157,247]],'#e4e1c6','#63798a',2);
  beam([[59,247],[157,247]],'#63778a',3);
  beam([[69,240],[86,231],[133,231],[149,242]],'#fdf2ce',1.7);
  path([[85,294],[111,294],[136,311],[76,305]],'#f9b97831');
  box(88,254,changed ? 27 : 22,23,'#edb57d','#433d51',2);
  beam([[99,254],[99,276]],'#634d51',2);
  if (!changed) beam([[88,265],[110,265]],'#634d51',2);
  box(126,254,13,43,'#565368','#463c55',1.5);

  beam([[182,269],[193,140],[207,269]],'#425975',4);
  beam([[186,228],[202,228],[188,204],[198,204],[191,178],[195,178]],'#496482',2.2);
  box(188,172,11,30,'#cabda8','#4c6480',1.4);
  box(188,changed ? 191 : 180,11,4,'#bd7679');
  beam([[193,141],[193,125]],'#425975',2);
  oval(193,127,3,3, '#f3b580');

  oval(331,290,112,13,'#67869a');
  box(248,231,174,56,'#809aad','#4a627b',2);
  box(258,248,150,29,'#97b1bd');
  cabinSiding(ink,252,243,166,6);
  path([[268,280],[301,280],[337,303],[256,294]],'#f8bc7e26');
  path([[373,280],[402,279],[440,296],[374,292]],'#f8bc7e28');
  beam([[250,276],[419,276]],'#566d86',2);
  ctx.beginPath();
  ctx.ellipse(335,229,83,66,0,Math.PI,Math.PI*2);
  ctx.closePath();
  const dome = ctx.createLinearGradient(270,165,408,240);
  dome.addColorStop(0,'#f0dfb5'); dome.addColorStop(.55,'#c6cec0'); dome.addColorStop(1,'#7999a9');
  ctx.fillStyle=dome; ctx.fill(); ctx.strokeStyle='#4b607b'; ctx.lineWidth=2; ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(335,230,77,60,0,-2.82,-1.97);
  ctx.strokeStyle='#fff2c69d'; ctx.lineWidth=2.5; ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(360,170);
  ctx.quadraticCurveTo(393,181,397,222);
  ctx.strokeStyle='#7a92a87a'; ctx.lineWidth=1.4; ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(334,164);
  ctx.quadraticCurveTo(changed ? 311 : 361,193,350,228);
  ctx.strokeStyle='#788ea1'; ctx.lineWidth=2; ctx.stroke();
  path(changed ? [[377,163],[406,125],[417,132],[387,170]] : [[377,163],[416,139],[422,148],[383,173]],'#415b78','#2b455f',2);
  beam(changed ? [[405,126],[418,135]] : [[415,139],[423,150]], '#e6bd90', 3.1);
  box(242,229,185,10,'#5a728b','#435a72',1.5);
  beam([[247,228],[421,228]],'#e5ece0',2.4);
  for (let rivet=252;rivet<422;rivet+=13) oval(rivet,234,1.2,1.2,'#a2b6c1');
  box(322,248,26,39,'#445a75','#566e88',2);
  box(327,254,16,12,'#eeb27e');
  box(271,251,27,17,'#eac486','#50677e',2);
  box(373,251,27,17,'#efc28c','#50677e',2);
  for (const x of [284,386]) beam([[x,251],[x,268]],'#61788c',2);

  box(519,249,63,41,'#6b647b','#53617a',2);
  cabinSiding(ink,520,253,60,6);
  path([[508,252],[536,232],[563,235],[594,254]],'#dddccc','#596e85',2);
  box(531,257,19,14,'#e9bb87','#566582',1.5);
  box(562,259,12,31,'#526784');
  if (!changed) box(547,224,10,13,'#7e7787','#546883',1.5);
  beam([[516,247],[537,235],[563,238],[584,250]],'#f5ecd2',1.8);

  beam([[207,326],[207,355]],'#5c7583',3);
  path(changed ? [[200,327],[215,328],[220,334],[200,337]] : [[214,327],[199,328],[194,334],[214,337]],'#cd817d','#6b787e',1);
  beam([[457,356],[505,356],[520,348]],'#526d84',4);
  beam([[471,346],[471,356],[498,356],[499,347]],'#536d85',2);
  path([[460,342],[515,342],[509,349],[463,349]],'#957181','#4d6782',1.5);
  box(476,326,27,16,changed ? '#c48b75' : '#bb9f7e','#5b6e83',1.5);
  beam([[490,326],[490,341]],'#6c697f',2);
  for (const [i,[x,y]] of [[327,385],[343,397],[353,409],[367,422],[380,436]].entries()) {
    if (changed && i===2) continue;
    oval(x,y,4.6,2.3,'#7b98a6',null,1,.38);
    oval(x-8,y+6,4.5,2.1,'#89a0a6',null,1,.4);
  }
  for (const [x,y,h] of [[55,438,75],[17,450,107],[127,449,36],[594,426,77],[625,450,99]]) {
    path([[x-5,y-4],[x+8,y-4],[x+37,y+13],[x+1,y+9]],'#648c9c59');
    pine(ink,x,y,h, '#2f536a');
    for (let i=0;i<4;i++) {
      const row=y-h*.83+i*h*.19, spread=h*(.10+.036*i);
      path([[x,row-3],[x-spread,row+h*.20],[x-2,row+h*.12],[x+spread*.74,row+h*.16]],'#a8c9ca');
      beam([[x-spread,row+h*.20],[x-2,row+h*.12],[x+spread*.74,row+h*.16]],'#e5eadabd',1);
    }
  }
  label('NS  /  03', 18, 30, 11, '#dfecc6be', 'monospace');
  grain(ink, 520);
}
