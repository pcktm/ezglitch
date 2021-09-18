type needleType = string | Uint8Array | ArrayBuffer;
type haystackType = ArrayBuffer | Uint8Array;

// Implementation of Boyer-Moore substring search ported from page 772 of
// Algorithms Fourth Edition (Sedgewick, Wayne)
// http://algs4.cs.princeton.edu/53substring/BoyerMoore.java.html

export class BoyerMoore {
  private search: ((txtBuffer: needleType, start?: number, end?: number) => number );
  private skip: number;

  constructor(needle: needleType) {
    [this.search, this.skip] = this.boyerMoore(needle);
  }

  public findIndex(haystack: haystackType): number {
    return this.search(haystack);
  }

  public findIndexes(haystack: haystackType): number[] {
    const indexes: number[] = [];
    for (let i = this.search(haystack); i !== -1; i = this.search(haystack, i + this.skip)) {
      indexes.push(i);
    }
    return indexes;
  }

  private asUint8Array(input: Uint8Array | string | ArrayBuffer): Uint8Array {
    if (input instanceof Uint8Array) {
      return input;
    } else if (typeof(input) === 'string') {
      // This naive transform only supports ASCII patterns. UTF-8 support
      // not necessary for the intended use case here.
      const uint8Array: Uint8Array = new Uint8Array(input.length);
      for (let i = 0; i < input.length; i++) {
        const charCode = input.charCodeAt(i);
        if (charCode > 127) {
          throw new TypeError('Only ASCII patterns are supported');
        }
        uint8Array[i] = charCode;
      }
      return uint8Array;
    } else {
      // Assume that it's already something that can be coerced.
      return new Uint8Array(input);
    }
  }

  private boyerMoore(patternBuffer: needleType): [((txtBuffer: needleType, start?: number, end?: number) => number ), number] {
    const pattern = this.asUint8Array(patternBuffer);
    const M: number = pattern.length;
    if (M === 0) {
      throw new TypeError('patternBuffer must be at least 1 byte long');
    }
    // radix
    const radix: number = 256;
    const rightmost_positions: Int32Array = new Int32Array(radix);
    // position of the rightmost occurrence of the byte c in the pattern
    for (let c: number = 0; c < radix; c++) {
      // -1 for bytes not in pattern
      rightmost_positions[c] = -1;
    }
    for (let j = 0; j < M; j++) {
      // rightmost position for bytes in pattern
      rightmost_positions[pattern[j]] = j;
    }

    const boyerMooreSearch = (txtBuffer: needleType, start: number = 0, end?: number): number => {
      // Return offset of first match, -1 if no match.
      const text = this.asUint8Array(txtBuffer);

      if (end === undefined) {
        end = text.length;
      }
      const pat = pattern;
      const right = rightmost_positions;
      const lastIndex = end - pat.length;
      const lastPatIndex = pat.length - 1;
      let skip;
      for (let i = start; i <= lastIndex; i += skip) {
        skip = 0;
        for (let j = lastPatIndex; j >= 0; j--) {
          const char: number = text[i + j];
          if (pat[j] !== char) {
            skip = Math.max(1, j - right[char]);
            break;
          }
        }
        if (skip === 0) {
          return i;
        }
      }
      return -1;
    }

    return [boyerMooreSearch, pattern.byteLength];
  }
}