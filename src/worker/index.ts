import save from 'save-file'
import {BoyerMoore} from '../utils/boyer-moore';
import {formatBytes} from '../utils'
import effects from './effects'

function log(line: string) {
  postMessage({type: 'log', value: line});
}

onmessage = async ({data}: {data: {cmd: string, data: GlitchFormData}}) => {
  console.debug(data);
  if(data.cmd === 'begin') {
    try {
      await glitchStart(data.data);
    } catch (e) {
      postMessage({type: 'error', value: String(e)});
      console.log(e);
    }
  } 
}

async function glitchStart(opt: GlitchFormData) {
  log("started in worker thread");
  if (!opt.file) return;
  const file = opt.file;
  const b = await file.arrayBuffer();

  const moviMarkerPos = new BoyerMoore("movi").findIndex(b);
  const idx1MarkerPos = new BoyerMoore("idx1").findIndex(b);

  if(moviMarkerPos === -1 || idx1MarkerPos === -1) {
    throw "not an avi file!";
  }

  log("movi marker pos: 0x" + moviMarkerPos.toString(16));
  log("idx1 marker pos: 0x" + idx1MarkerPos.toString(16));
  
  
  const hdrlBuffer = b.slice(0, moviMarkerPos);
  const moviBuffer = b.slice(moviMarkerPos, idx1MarkerPos);
  const idx1Buffer = b.slice(idx1MarkerPos);
  
  // construct frame table
  const iframes: Omit<Frame, 'size'>[] = new BoyerMoore(new Uint8Array([0x30, 0x31, 0x77, 0x62])).findIndexes(moviBuffer)
    .map(v => {return {type: 'audio', index: v}});
  const bframes: Omit<Frame, 'size'>[] = new BoyerMoore(new Uint8Array([0x30, 0x30, 0x64, 0x63])).findIndexes(moviBuffer)
    .map(v => {return {type: 'video', index: v}});
  
  const sorted = [...bframes];
  sorted.sort((a, b) => a.index - b.index);

  log("total frames: " + sorted.length)

  let maxFrameSize = 0;

  const table: Frame[] = sorted.map((frame, index, arr) => {
    let size = -1;
    if (index + 1 < arr.length)
      size = arr[index + 1].index - frame.index;
    else
      size = moviBuffer.byteLength - frame.index;
    maxFrameSize = Math.max(size, maxFrameSize);
    return {...frame, size}
  })
  
  let clean: Frame[] = [];

  if(opt.keepFirstFrame) {
    const ff = table.find(frame => frame.type === 'video');
    if (!ff) throw "This file has no video frames";
    clean.push(ff);
  }

  for (const frame of table) {
    if (frame.size < maxFrameSize * 0.7) clean.push(frame);
  }

  log(`killed ${table.length - clean.length} big frames`);

  // do effectz
  const effect = effects.find(({name}) => name === opt.effect);
  if (!effect) throw `Effect ${opt.effect} not found`;

  log('applying effect...')
  const final = await effect.apply(clean, opt);

  log('final frames amount: ' + final.length)

  if(final.length > 5000) postMessage({type: 'warning', value: "that's a lot of frames, may become unstable"});

  let expectedMoviSize = 4;
  final.forEach(frame => expectedMoviSize+=frame.size);

  let finalMovi = new Uint8Array(expectedMoviSize);
  finalMovi.set([0x6D, 0x6F, 0x76, 0x69]);

  let head = 4;

  log(`reconstructing movi buffer...`);

  for (const [index, frame] of final.entries()) {
    if(frame.index != 0 && frame.size != 0) {
      const data = moviBuffer.slice(frame.index, frame.index + frame.size);
      finalMovi.set(new Uint8Array(data), head);
      head += frame.size;
    }
  }
  
  let out = new Uint8Array(hdrlBuffer.byteLength + finalMovi.byteLength + idx1Buffer.byteLength); 
  out.set(new Uint8Array(hdrlBuffer));
  out.set(finalMovi, moviMarkerPos);
  out.set(new Uint8Array(idx1Buffer), hdrlBuffer.byteLength + finalMovi.byteLength);
  log('final size: ' + formatBytes(out.byteLength));
  postMessage({type: 'result', buffer: out})
}