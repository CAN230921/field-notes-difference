import { painter, seeded, grain, pine, crescent } from './ink.js';

export const summit = {
  title: 'The Polar Observatory', tab: 'Observatory', region: 'Northglass Summit', difficulty: 'Hard', seconds: 140,
  targets: [
    ['Missing star', 93, 57, 22],
    ['Aurora arch', 484, 66, 23],
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

function drawSummit(ctx, changed) {
  const ink = painter(ctx), { path, box, oval, sky, beam, label } = ink;
  const random = seeded(226);
  sky('#172340', '#527e83', 265);
  ctx.save();
  for (let ribbon=0;ribbon<13;ribbon++) {
    ctx.beginPath();
    ctx.moveTo(-24,110+ribbon*1.7);
    ctx.bezierCurveTo(137,151+ribbon*2,204,33+ribbon*3.4,318,50+ribbon*2);
    ctx.bezierCurveTo(412,67+ribbon*2,461,112+ribbon*2,660,45+ribbon*2);
    ctx.strokeStyle = ribbon<4 ? '#9fdfca27' : '#71d6a119';
    ctx.lineWidth=5;
    ctx.stroke();
  }
  ctx.restore();
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
  ctx.strokeStyle = '#b5fbdc79';
  ctx.lineWidth=2;
  ctx.stroke();
  crescent(ctx,566,75,22,'#e3e7cb');

  path([[0,218],[73,159],[112,183],[204,125],[270,190],[324,222],[419,177],[496,113],[549,179],
    [581,169],[640,209],[640,450],[0,450]], '#466985');
  path([[141,171],[204,125],[244,164],[205,154],[199,168],[186,154],[164,167]], '#9dbdc5');
  path([[414,184],[496,113],[549,179],[511,160],[506,151],[492,158],[479,151],[465,160]], '#b8cbd0');
  path([[0,225],[81,199],[166,215],[237,183],[307,217],[366,204],[426,200],[501,224],[640,195],[640,450],[0,450]], '#60869c');
  for (let i=0;i<49;i++) pine(ink, random()*640, 253+random()*37, 12+random()*39, i%2 ? '#36596f' : '#3b6276');
  path([[0,286],[112,272],[186,278],[260,263],[316,273],[389,263],[461,271],[532,260],[640,285],[640,450],[0,450]], '#bed2ce');
  path([[0,372],[100,330],[198,321],[320,355],[420,322],[545,302],[640,315],[640,450],[0,450]], '#aec1c3');
  path([[0,390],[104,362],[212,363],[298,377],[400,353],[567,334],[640,358],[640,450],[0,450]], '#d8e0d1');
  path([[0,424],[128,393],[270,407],[384,391],[506,394],[640,370],[640,450],[0,450]], '#c6d4cb');
  for (let i=0;i<81;i++) {
    const x=random()*640,y=292+random()*158,r=2+random()*15;
    beam([[x,y],[x+r*.35,y-1.4],[x+r,y]],i%3?'#60839536':'#f1eed2aa',1);
  }

  box(71,242,77,55,'#78595f','#435363',2);
  path([[59,245],[73,232],[87,226],[136,226],[157,247]],'#e4e1c6','#63798a',2);
  beam([[59,247],[157,247]],'#63778a',3);
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
  beam([[250,276],[419,276]],'#566d86',2);
  ctx.beginPath();
  ctx.ellipse(335,229,83,66,0,Math.PI,Math.PI*2);
  ctx.closePath();
  const dome = ctx.createLinearGradient(270,165,408,240);
  dome.addColorStop(0,'#f0dfb5'); dome.addColorStop(.55,'#c6cec0'); dome.addColorStop(1,'#7999a9');
  ctx.fillStyle=dome; ctx.fill(); ctx.strokeStyle='#4b607b'; ctx.lineWidth=2; ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(334,164);
  ctx.quadraticCurveTo(changed ? 311 : 361,193,350,228);
  ctx.strokeStyle='#788ea1'; ctx.lineWidth=2; ctx.stroke();
  path(changed ? [[377,163],[406,125],[417,132],[387,170]] : [[377,163],[416,139],[422,148],[383,173]],'#415b78','#2b455f',2);
  beam(changed ? [[405,126],[418,135]] : [[415,139],[423,150]], '#e6bd90', 3.1);
  box(242,229,185,10,'#5a728b','#435a72',1.5);
  box(322,248,26,39,'#445a75','#566e88',2);
  box(327,254,16,12,'#eeb27e');
  box(271,251,27,17,'#eac486','#50677e',2);
  box(373,251,27,17,'#efc28c','#50677e',2);
  for (const x of [284,386]) beam([[x,251],[x,268]],'#61788c',2);

  box(519,249,63,41,'#6b647b','#53617a',2);
  path([[508,252],[536,232],[563,235],[594,254]],'#dddccc','#596e85',2);
  box(531,257,19,14,'#e9bb87','#566582',1.5);
  box(562,259,12,31,'#526784');
  if (!changed) box(547,224,10,13,'#7e7787','#546883',1.5);

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
    pine(ink,x,y,h, '#2f536a');
    for (let i=0;i<4;i++) beam([[x,y-h*.83+i*h*.21],[x-h*.10-i*2,y-h*.65+i*h*.2]],'#b8c9c3',2);
  }
  label('NS  /  03', 18, 30, 11, '#dfecc6be', 'monospace');
  grain(ink, 520);
}
