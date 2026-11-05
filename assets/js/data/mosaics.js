// mosaics.js — Pixel-art sprites in the AWS community style.
// Legend:  o orange · p purple · k pink · g green · b blue · i ink · w white · . empty
//          x = "accent" pixel, replaced by the element's data-color (e.g. data-color="k")
// Usage in HTML:
//   <div class="mosaic mosaic--tr" data-mosaic="heart" aria-hidden="true"></div>
//   <div class="mosaic mosaic--sm mosaic--bl" data-mosaic="sparkle" data-color="g" aria-hidden="true"></div>
// Every row of a sprite must have the same length.

export default {
  /* ---- Decorative patterns ---- */
  flower: ['oo.p.oo', 'o.pkp.o', '.p.k.p.', 'pkkgkkp', '.p.k.p.', 'o.pkp.o', 'oo.p.oo'],
  star: ['...b...', '..bgb..', '.b.k.b.', 'bgkokgb', '.b.k.b.', '..bgb..', '...b...'],
  stairs: ['g......', 'gg.....', '.gb....', '..bb...', '...bk..', '....kk.', '.....ko'],
  bolt: ['....pp.', '...pp..', '..pk...', '.kkkkk.', '...kp..', '..pp...', '.pp....'],

  /* ---- Icons ---- */
  heart: ['.ii.ii.', 'ikkikki', 'ikkkkki', 'ikkwkki', '.ikkki.', '..iki..', '...i...'],
  cloud: ['.......', '..bbb..', '.bwwwb.', 'bwwwwwb', 'bwwwwwb', '.bbbbb.', '.......'],
  chat: ['bbbbbbb', 'bwwwwwb', 'bwiwiwb', 'bwwwwwb', 'bbbbbbb', '.bb....', '.b.....'],
  smile: ['.kkkkk.', 'k.....k', 'k.k.k.k', 'k.....k', 'kk...kk', 'k.kkk.k', '.kkkkk.'],
  bulb: ['..ooo..', '.ooooo.', '.oowoo.', '.ooooo.', '..ooo..', '..iii..', '..iii..', '...i...'],
  trophy: ['ooooooo', 'o.ooo.o', '.ooooo.', '..ooo..', '...o...', '..www..', '.wwwww.'],
  rocket: ['...w...', '..www..', '..wbw..', '..www..', '.owwwo.', '.o.w.o.', '..o.o..'],
  flag: ['i......', 'igggg..', 'iggggg.', 'igggg..', 'i......', 'i......', 'ii.....'],
  mic: ['..ppp..', '..ppp..', '..ppp..', 'p.ppp.p', '.p...p.', '..ppp..', '...p...', '.ppppp.'],
  clock: ['.bbbbb.', 'b..w..b', 'b..w..b', 'b..ww.b', 'b.....b', 'b.....b', '.bbbbb.'],

  /* ---- Tiny accents (use with data-color) ---- */
  sparkle: ['..x..', '..x..', 'xx.xx', '..x..', '..x..'],
  dots: ['x.x', '.x.', 'x.x'],
};
