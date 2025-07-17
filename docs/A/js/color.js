(function(){
class ColorScheme {
    static MESSAGES = [
        '人には不可視とすべき',
        '非字が満たすべき',
        '字が満たすべき',
        '見出しなど大きく太い字が満たすべき',
        '非本文が満たすべき',
        '本文が満たすべき',
        '本文に推奨する',
    ];
    constructor(back, fore=null, weight=400) {
        this._ = {}
        this._.back = Color.of(back);
        if (!Color.is(this._.back)) {throw new TypeError(`第一引数はColorインスタンスかそれを生成できる値であるべきです。`)}
        this._.fore = Color.of(fore);
        this._.fore = Color.is(this._.fore) ? this._.fore : this.back.mono;
        this._.weight = this.isWeight(weight) ? weight : 400;
    }
    get back() {return this._.back}
//    set back(v) {this._.back=Color.toColor(v)}
    set back(v) {this._.back=Color.of(v)}
    get fore() {return this._.fore}
//    set fore(v) {this._.fore=Color.toColor(v)}
    set fore(v) {this._.fore=Color.of(v)}
    get weight() {return this._.weight}
    set weight(v) {if (this.isWeight(v)) {this._.weight=v}}
    get lc() {return APCA.calc(this._.fore, this._.back)}
    get c() {return WCAG.contrast(this._.fore, this._.back)}
    get minSize() {return MinFontSize.get(this.lc, this.weight)}
    get swapped() {return new ColorScheme(this.fore, this.back, this.weight)}
    swap() {const tmp = this.back; this.back = this.fore; this.fore = tmp;}
    isWeight(v) {return Number.isSafeInteger(v) && [...Array(9)].map((_,i)=>(i+1)*100).some(x=>x===v)}
    get isDark() {return this.lc < 0}
    get level() {return Math.min(ColorScheme.MESSAGES.length-1, Math.floor(Math.abs(this.lc)/15))}
    get threshold() {return this.level * 15}
    get message() {return ColorScheme.MESSAGES[this.level]}
    update(back, fore, weight) {
        this.back = back ?? this.back;
        this.fore = fore ?? this.fore;
        this.weight = weight ?? this.weight;
    }
}
class MinFontSize {
    static _fontMatrixAscend = [
        ['Lc',100,200,300,400,500,600,700,800,900],
        [0,999,999,999,999,999,999,999,999,999],
        [10,999,999,999,999,999,999,999,999,999],
        [15,777,777,777,777,777,777,777,777,777],
        [20,777,777,777,777,777,777,777,777,777],
        [25,777,777,777,120,120,108,96,96,96],
        [30,777,777,120,108,108,96,72,72,72],
        [35,777,120,108,96,72,60,48,48,48],
        [40,120,108,96,60,48,42,32,32,32],
        [45,108,96,72,42,32,28,24,24,24],
        [50,96,72,60,32,28,24,21,21,21],
        [55,80,60,48,28,24,21,18,18,18],
        [60,72,48,42,24,21,18,16,16,18],
        [65,68,46,32,21.75,19,17,15,16,18],
        [70,64,44,28,19.5,18,16,14.5,16,18],
        [75,60,42,24,18,16,15,14,16,18],
        [80,56,38.25,23,17.25,15.81,14.81,14,16,18],
        [85,52,34.5,22,16.5,15.625,14.625,14,16,18],
        [90,48,32,21,16,15.5,14.5,14,16,18],
        [95,45,28,19.5,15.5,15,14,13.5,16,18],
        [100,42,26.5,18.5,15,14.5,13.5,13,16,18],
        [105,39,25,18,14.5,14,13,12,16,18],
        [110,36,24,18,14,13,12,11,16,18],
        [115,34.5,22.5,17.25,12.5,11.875,11.25,10.625,14.5,16.5],
        [120,33,21,16.5,11,10.75,10.5,10.25,13,15],
        [125,32,20,16,10,10,10,10,12,14],
    ];
    // [100,200,300,400,500,600,700,800,900].some(v=>v===weight)
    static isWeight(v) {return Number.isSafeInteger(v) && [...Array(9)].map((_,i)=>(i+1)*100).some(x=>x===v)}
    static get(lc, weight) {
        const LC = Math.abs(lc);
        const table = this._fontMatrixAscend.slice(1);
        const i = table.reverse().findIndex(v=>v[0] <= LC);
        if (this.isWeight(weight)) {return table[i][Math.round(weight/100)]}//指定weight該当size返却
        else {return table[i]}// weight 100〜900までの9つのsizeを配列で返す
    }
}
class RGBAInt {//[R,G,B(,A)]
    static is(v) {return Array.isArray(v) && (3===v.length || 4===v.length) && v.every(n=>this.#isN(n))}
    static #isN(n) {return Number.isSafeInteger(n) && 0<=n && n<=255}
    constructor(nums) {
        this._ = {nums:[...nums], hasAlpha:(4===nums.length && this.#isN(nums[3]))}
        if (3===nums.length) {this._.nums.push(255)}
        if (!RGBAInt.is(this._.nums)){throw new TypeError(`引数は[R,G,B(,A)]であるべきです。各値は0〜255迄のNumber型整数値です。:${nums}`)}
    }
    get R() {return this._.nums[0]}
    get G() {return this._.nums[1]}
    get B() {return this._.nums[2]}
    get A() {return this._.nums[3]}
    set R(v) {if(this.#isN(v)){this._.nums[0]=v}}
    set G(v) {if(this.#isN(v)){this._.nums[1]=v}}
    set B(v) {if(this.#isN(v)){this._.nums[2]=v}}
    set A(v) {if(this.#isN(v)){this._.nums[3]=v}else if(-1===v || null===v){this._.nums[3]=255;this._.hasAlpha=false;}}
    get nums() {return [...this._.nums]}
    set nums(v) {
        if (RGBAInt.is(v)) {
            v.map((V,i)=>this._.nums[i]=V);
        }
    }
    get hasAlpha() {return this._.hasAlpha}
}
class RGBAStr extends RGBAInt {//#RGB(A), #RRGGBB(AA)
    static is(code) {return this.#isStr(code) && !!code.match(/^#([0-9a-fA-F]{3}){1,2}([0-9a-fA-F]{2})?$/);}
    static #isStr(v){return ('string'===typeof v || v instanceof String)}
    static #throw(v) {throw new TypeError(`引数は#RGB(A)か#RRGGBB(AA)であるべきです。RGBA各値は16進数0〜Fです。`)}
    static toNums(code) {
        if (!this.is(code)) {this.#throw()}
        const CODE = code.slice(1);
             if ([3,4].some(l=>l===CODE.length)) {return [...CODE].map(c=>parseInt(c,16)*16);}//#RGB(A)
        else if ([6,8].some(l=>l===CODE.length)) {return CODE.match(/.{2}/g).map(c=>parseInt(c,16));}//#RRGGBB(AA)
        else {this.#throw()}
    }
    constructor(v) {super(RGBAInt.is(v) ? v : RGBAStr.toNums(v))}
}
class Color extends RGBAStr {
    static is(v) {return (v instanceof Color) || RGBAStr.is(v) || RGBAInt.is(v)}
    static of(v) {
             if (v instanceof Color) {return v}
        else if (RGBAInt.is(v) || RGBAStr.is(v)){return new Color(v)}
        else {throw new TypeError(`引数は[R,G,B(,A)]か#R(R)G(G)B(B)(A(A))であるべきです。`)}
    }
    constructor(numsOrCode, isShortCode=false) {
        super(numsOrCode);
        this._.isShortCode = isShortCode;
    }
    get nums() {return this.hasAlpha ? [...this._.nums] : this._.nums.slice(0,3)}
    get code() {
        const nums = this.hasAlpha ? this.nums : this.nums.slice(0,3)
        const isShortable = nums.every(n=>0===(n%16));
        const strs = nums.map(n=>n.toString(16).padStart(((isShortable && this._.isShortCode) ? 1 : 2), '0'));
        return `#${strs.join('')}`
    }
    get reversal() {// 反転色
        const nums = [255 - this.R, 255 - this.G, 255 - this.B];
        if (this.hasAlpha) {nums.push(255-this.A)}
        return new Color(nums);
    }
    get complementary() {// 補色(彩度や明度は同値で色相のみ変わる)
        const max = Math.max(this.R, this.G, this.B),
              min =  Math.min(this.R, this.G, this.B);
        const complement = max + min;
        const nums = [complement - this.R, complement - this.G, complement - this.B];
        if (this.hasAlpha) {nums.push(this.A)}
        return new Color(nums);
    }
    get mono() {//モノトーン（白／黒）を返す
        const colors = [[0,0,0],[255,255,255]].map(nums=>new Color(nums));
        return colors.sort((a,b)=>WCAG.contrast(this, b) - WCAG.contrast(this, a))[0];
    }
}
// https://www.google.co.jp/search?q=js+%E8%89%B2+%E3%82%B3%E3%83%B3%E3%83%88%E3%83%A9%E3%82%B9%E3%83%88%E5%B7%AE+%E7%AE%97%E5%87%BA
class WCAG {
    static contrast(color1, color2) {//返却値1〜21。4.5以上ならOK(WCAG AA) 白黒なら21。
        color1 = Color.of(color1)
        color2 = Color.of(color2)
//        color1 = Color.toColor(color1)
//        color2 = Color.toColor(color2)
        if (!(color2 instanceof Color)) {color2=this}
        const lum1 = this.luminance(color1);
        const lum2 = this.luminance(color2);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
    }
    static luminance(color) {//輝度？ contrastの内部関数
//        const c = Color.toColor(color);
        const c = Color.of(color);
        //const [R,G,B] = 'R G B'.split(' ').map(n=>c._[n]/255);
        const [R,G,B] = 'R G B'.split(' ').map(n=>c[n]/255);
        const a = [R, G, B].map((v) => {
            return v <= 0.03928
            ? v / 12.92
            : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }
}
// https://github.com/Myndex/apca-w3/blob/master/src/apca-w3.js#L430
// https://github.com/Myndex/colorparsley/blob/master/src/colorparsley.js
const SA98G = {
    mainTRC: 2.4, // 2.4 exponent for emulating actual monitor perception
    // For reverseAPCA
    get mainTRCencode() { return 1 / this.mainTRC },
    // sRGB coefficients
    sRco: 0.2126729, 
    sGco: 0.7151522, 
    sBco: 0.0721750, 
    // G-4g constants for use with 2.4 exponent
    normBG: 0.56, 
    normTXT: 0.57,
    revTXT: 0.62,
    revBG: 0.65,
    // G-4g Clamps and Scalers
    blkThrs: 0.022,
    blkClmp: 1.414, 
    scaleBoW: 1.14,
    scaleWoB: 1.14,
    loBoWoffset: 0.027,
    loWoBoffset: 0.027,
    deltaYmin: 0.0005,
    loClip: 0.1,
    ///// MAGIC NUMBERS for UNCLAMP, for use with 0.022 & 1.414 /////
    // Magic Numbers for reverseAPCA
    mFactor: 1.94685544331710,
    get mFactInv() { return 1 / this.mFactor},
    mOffsetIn: 0.03873938165714010,
    mExpAdj: 0.2833433964208690,
    get mExp() { return this.mExpAdj / this.blkClmp},
    mOffsetOut: 0.3128657958707580,
}
class APCA {
    // LC(Luminance Contrast) 
    static calc(fore, back, places = -1, round = true) {
        const backClr = Color.of(back);
        let foreClr = Color.of(fore);
//        const backClr = Color.toColor(back);
//        let foreClr = Color.toColor(fore);
        //const hasAlpha = (foreClr._.A === -1 || foreClr._.A === 255) ? false : true;
        const hasAlpha = (foreClr.A === -1 || foreClr.A === 255) ? false : true;
        if (hasAlpha) { foreClr = Color.of(this._alphaBlend( foreClr, backClr, round)); };
        console.log(foreClr, fore);
        console.log(foreClr.nums);
        return this._APCAcontrast( this._sRGBtoY(foreClr.nums.splice(0,3)), this._sRGBtoY(backClr.nums.splice(0,3)), places)
    }
    static _alphaBlend (rgbaFG=[0,0,0,1.0], rgbBG=[0,0,0], round = true ) {
        rgbaFG[3] = Math.max(Math.min(rgbaFG[3], 255), 0.0); // clamp alpha 0-1
        let compBlend = 255 - rgbaFG[3];
        let rgbOut = [0,0,0,255];
        for (let i=0;i<3;i++) {
            rgbOut[i] = rgbBG[i] * compBlend + rgbaFG[i] * rgbaFG[3];
            if (round) rgbOut[i] = Math.min(Math.round(rgbOut[i]),255);
        };
        return rgbOut;
    }
    static _sRGBtoY (rgb = [0,0,0]) {
        function simpleExp (chan) { return Math.pow(chan/255.0, SA98G.mainTRC); };
        return SA98G.sRco * simpleExp(rgb[0]) +
               SA98G.sGco * simpleExp(rgb[1]) +
               SA98G.sBco * simpleExp(rgb[2]);
    }
    static _APCAcontrast (txtY,bgY,places = -1) {// Lc 0〜106 / 0〜108
        const icp = [0.0,1.1];     // input range clamp / input error check
        if(isNaN(txtY)||isNaN(bgY)||Math.min(txtY,bgY)<icp[0]||
            Math.max(txtY,bgY)>icp[1]){
            return 0.0;  // return zero on error
        };
        let SAPC = 0.0;            // For raw SAPC values
        let outputContrast = 0.0; // For weighted final values
        let polCat = 'BoW';      // Alternate Polarity Indicator. N normal R reverse
        txtY = (txtY > SA98G.blkThrs) ? txtY :
        txtY + Math.pow(SA98G.blkThrs - txtY, SA98G.blkClmp);
        bgY = (bgY > SA98G.blkThrs) ? bgY :
        bgY + Math.pow(SA98G.blkThrs - bgY, SA98G.blkClmp);
        if ( Math.abs(bgY - txtY) < SA98G.deltaYmin ) { return 0.0; }
        if ( bgY > txtY ) {  // For normal polarity, black text on white (BoW)
            SAPC = ( Math.pow(bgY, SA98G.normBG) - 
            Math.pow(txtY, SA98G.normTXT) ) * SA98G.scaleBoW;
            outputContrast = (SAPC < SA98G.loClip) ? 0.0 : SAPC - SA98G.loBoWoffset;
        } else {
            polCat = 'WoB';
            SAPC = ( Math.pow(bgY, SA98G.revBG) - 
            Math.pow(txtY, SA98G.revTXT) ) * SA98G.scaleWoB;
            outputContrast = (SAPC > -SA98G.loClip) ? 0.0 : SAPC + SA98G.loWoBoffset;
        }
        if(places < 0 ) {return outputContrast * 100.0;}
        else if(places == 0 ){return  Math.round(Math.abs(outputContrast)*100.0)+'<sub>'+polCat+'</sub>';}
        else if(Number.isInteger(places)){return  (outputContrast * 100.0).toFixed(places);}
        else { return 0.0 }
    }
    // MAIN FONT LOOKUP May 28 2022 EXPANDED
    // Sorted by Lc Value
    // First row is standard weights 100-900
    // First column is font size in px
    // All other values are the Lc contrast 
    // 999 = too low. 777 = non-text and spot text only
    static _fontMatrixAscend = [
        ['Lc',100,200,300,400,500,600,700,800,900],
        [0,999,999,999,999,999,999,999,999,999],
        [10,999,999,999,999,999,999,999,999,999],
        [15,777,777,777,777,777,777,777,777,777],
        [20,777,777,777,777,777,777,777,777,777],
        [25,777,777,777,120,120,108,96,96,96],
        [30,777,777,120,108,108,96,72,72,72],
        [35,777,120,108,96,72,60,48,48,48],
        [40,120,108,96,60,48,42,32,32,32],
        [45,108,96,72,42,32,28,24,24,24],
        [50,96,72,60,32,28,24,21,21,21],
        [55,80,60,48,28,24,21,18,18,18],
        [60,72,48,42,24,21,18,16,16,18],
        [65,68,46,32,21.75,19,17,15,16,18],
        [70,64,44,28,19.5,18,16,14.5,16,18],
        [75,60,42,24,18,16,15,14,16,18],
        [80,56,38.25,23,17.25,15.81,14.81,14,16,18],
        [85,52,34.5,22,16.5,15.625,14.625,14,16,18],
        [90,48,32,21,16,15.5,14.5,14,16,18],
        [95,45,28,19.5,15.5,15,14,13.5,16,18],
        [100,42,26.5,18.5,15,14.5,13.5,13,16,18],
        [105,39,25,18,14.5,14,13,12,16,18],
        [110,36,24,18,14,13,12,11,16,18],
        [115,34.5,22.5,17.25,12.5,11.875,11.25,10.625,14.5,16.5],
        [120,33,21,16.5,11,10.75,10.5,10.25,13,15],
        [125,32,20,16,10,10,10,10,12,14],
    ];
    static getFontSize(fore, back, weight=-1) {//最低限必要なフォントサイズを取得する
        const lc = Math.abs(this.calc(fore, back));
        const table = this._fontMatrixAscend.slice(1);
        const i = table.reverse().findIndex(v=>v[0] <= lc);
        if ([100,200,300,400,500,600,700,800,900].some(v=>v===weight)) {return table[i][Math.round(weight/100)]}//指定weight該当size返却
        else {return table[i]}// weight 100〜900までの9つのsizeを配列で返す
    }
}
window.ColorScheme = ColorScheme;
window.Color = Color;
window.APCA = APCA;
})();

