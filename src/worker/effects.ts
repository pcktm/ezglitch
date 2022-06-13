import bloomVideo from '../assets/vid/bloom.mp4'
import jiggleVideo from '../assets/vid/jiggle.mp4'
import pulseVideo from '../assets/vid/random.mp4'
import reverseVideo from '../assets/vid/reverse.mp4'

export const Reverse: Effect = {
  name: "reverse",
  displayName: "Reverse",
  usesInterval: false,
  usesCount: false,
  backgroundVideo: reverseVideo,
  async apply(table: Frame[], options: GlitchFormData): Promise<Frame[]> {
    const t = table;
    t.reverse();
    return t;
  }
}

export const Bloom: Effect = {
  name: "bloom",
  displayName: "Bloom",
  usesInterval: true,
  usesCount: true,
  backgroundVideo: bloomVideo,
  async apply(table: Frame[], options: GlitchFormData): Promise<Frame[]> {
    if(!(options.count && options.interval)) throw new Error("Malformed options");
    const a = table.slice(0, options.interval);
    for (let i = 0; i < options.count; i++) {
      a.push(table[options.interval]);
    }
    return a.concat(table.slice(options.interval));
  }
}

export const Shuffle: Effect = {
  name: "shuffle",
  displayName: "Shuffle",
  usesInterval: false,
  usesCount: false,
  backgroundVideo: jiggleVideo,
  async apply(table: Frame[], options: GlitchFormData): Promise<Frame[]> {
    let final = table;
    for (let i = final.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [final[i], final[j]] = [final[j], final[i]];
    }
    return final;
  }
}

export const Pulse: Effect = {
  name: "pulse",
  displayName: "Pulse",
  usesInterval: true,
  usesCount: true,
  backgroundVideo: pulseVideo,
  async apply(table: Frame[], options: GlitchFormData): Promise<Frame[]> {
    if(!(options.count && options.interval)) throw new Error("Malformed options");
    let final: Frame[] = [];
    let index = 0;
    for (const frame of table) {
      final.push(frame);
      if (index % options.interval === 0) {
        for (let j = 0; j < options.count; j++) {
          final.push(frame);
        }
      }
      index++;
    }
    return final;
  }
}

const effects = [Bloom, Pulse, Reverse, Shuffle,];
export default effects;