// 反転色、補色、輝度、コントラスト差を取得する（コントラスト差4.5以上がアクシビリティ的な有効値である）
//https://simplesimples.com/web/markup/javascript/color_complement/
// Color.of('#000') -> '#FFF'
class Color {
    static of(...args) {// 16進数文字列(#RGB, #RRGGBB, #RGBA, #RRGGBBAA), 10進数値0〜255(R,G,B(,A))の形式に対応する A=0(透明),1
        args = [...args]
        let v = this.numsToCode(args);
        if (v) {return new Color(v)}
        v = this.codeToNums(...args);
        if (v) {return new Color(v, false, args[0].length-1)}
        return null;
    }
    static codeToNums(code) {
        if (!('string'===typeof code || code instanceof String)) {return null}
        const match = code.match(/^#([0-9a-fA-F]{3}){1,2}([0-9a-fA-F]{2})?$/);
        if (!match) {return null}
        const colStr = args[0].slice(1);
             if ([3,4].some(l=>l===colStr.length)) {return [...colStr].map(c=>parseInt(c,16)*256);}//#RGB(A)
        else if ([6,8].some(l=>l===colStr.length)) {return colStr.match(/.{2}/g).map(c=>parseInt(c,16));}//#RRGGBB(AA)
        else {return null}
    }
    static numsToCode(nums, isShort=false) {
        if (Array.isArray(nums) && 3===nums.length || 4===nums.length && nums.every(n=>0<=n && n<=255)) {
            const isShortable = nums.every(n=>0===(n%16));
            const strs = nums.map(n=>n.toString(16).padStart(((isShortable && isShort) ? 1 : 2), '0'));
            return `#${strs.join('')}`
        }
        else {return null}
    }
    static isNums(nums) {return (Array.isArray(nums) && 3===nums.length || 4===nums.length && nums.every(n=>Number.isSafeInteger(n) && 0<=n && n<=255))}
    static isCode(code) {return (('string'===typeof code || code instanceof String) && code.match(/^#([0-9a-fA-F]{3}){1,2}([0-9a-fA-F]{2})?$/));}
    static isColor(color) {return color instanceof Color;}
    static toColor(value) {
             if (this.isNums(value)) {return new Color(value)}
        else if (this.isCode(value)) {return new Color(this.codeToNums(value))}
        else if (this.isColor(value)) {return value}
        else {throw new TypeError(`引数は[R,G,B(,A)]か#R(R)G(G)B(B)(A(A))であるべきです。`)}
    }
    constructor(nums, isNums=false, figs=0) {
        if (!Color.numsToCode(nums)){throw new TypeError(`第一引数は0〜255の数が3〜4つある配列であるべきです。`)}
        if (3===nums.length) {nums.push(-1)}
        this._ = {R:nums[0], G:nums[1], B:nums[2], A:nums[3], isNums:false, figs:0}
        this.isNums = isNums;
        this.figs = figs;
        this._.nums = [this._.R, this._.G, this._.B];
        if (-1 < this._.A) {this._.nums.push(this._.A)}
    }
    get nums() {return [...this._.nums]}
    get code() {return Color.numsToCode(this._.nums, -Infinity===this.figs)}
    set nums(v) {
        if (Color.numsToCode(v, -Infinity===this.figs)) {
            v.map((V,i)=>this._.nums[i]=V);
            'R G B'.map((n,i)=>this._[n] = this._.nums[i]);
            if (4===v.length) {this._.A = this._.nums[3]}
        }
    }
    set code(v) {
        const nums = Coolor.codeToNums(v);
        if (nums) {this.nums = v;}
    }
    // 返却値の型（数列／文字列）
    get isNums() {return this._.isNums}
    set isNums(v) {this._.isNums = !!v}
    // 返却値が文字列の時の桁数（0:未設定(数列で生成された場合), -1:可能なら入力値に合わせる, -Infinity:可能なら短くする(#FFCCAA->#FCA), Infinity:可能な限り長くする(#FCA->#FFCCAA)）
    get figs() {return this._.figs}
    set figs(v) {if ([-2,-1,0,3,6,8].some(x=>x===v)){this._.figs=v}}
        
    // 反転色
    get reversal() {
        const nums = [255 - this._.R, 255 - this._.G, 255 - this._.B];
        if (-1 < this._.A) {nums.push(255-this._.A)}
        if (this._.isNums) {return nums}
        else {return Color.numsToCode(nums, -Infinity===this.figs)}
//        else {return `#${nums.map(n=>n.toString(16).padStart('0',2))}`}
    }
    // 補色(彩度や明度は同値で色相のみ変わる)
    get complementary() {
        const max = Math.max(this._.R, this._.G, this._.B),
              min =  Math.min(this._.R, this._.G, this._.B);
        const complement = max + min;
        const nums = [complement - this._.R, complement - this._.G, complement - this._.B];
        if (-1 < this._.A) {nums.push(this._.A)}
        if (this._.isNums) {return nums}
        else {return Color.numsToCode(nums, -Infinity===this.figs)}
        //else {return `#${nums.map(n=>n.toString(16).padStart('0',2))}`}
    }

    /*
    // 輝度
    //get luminance() {return (this._.R * 299 + this._.G * 587 + this._.B * 114) / 1000}
    get brightness() {return (this._.R * 299 + this._.G * 587 + this._.B * 114) / 1000}
    // コントラスト比 4.5以上ならアクセシビリティ的にOK(WCAG (Web Content Accessibility Guidelines) では、コントラスト比が4.5:1以上であることを推奨しています。)
    contrast(col1, col2) {
        if (!(col2 instanceof Color)) {col2=this}
        if ([col1, col2].every(c=>c instanceof Color)) {
            const L = [col1, col2].map(c=>c.brightness);
            return ((Math.max(...L) + 0.05) / (Math.min(...L) + 0.05)); // 0.05でゼロ除算回避
        }
        throw new TypeError(`引数は二つ共Colorインスタンスであるべきです。`);
    }
    */

    contrast(color1, color2) {//返却値1〜21。4.5以上ならOK(WCAG AA) 白黒なら21。
        if (!(color2 instanceof Color)) {color2=this}
        const lum1 = this.luminance(color1);
        const lum2 = this.luminance(color2);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
    }
    luminance(color) {
        if (!(color instanceof Color)) {color=this}
        const c = Color.toColor(color);
        const [R,G,B] = 'R G B'.split(' ').map(n=>c._[n]/255);
        const a = [R, G, B].map((v) => {
            return v <= 0.03928
            ? v / 12.92
            : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }
    /*
    codeToNums(code) {
        if (!('string'===typeof code || code instanceof String)) {return null}
        const match = code.match(/^#([0-9a-fA-F]{3}){1,2}([0-9a-fA-F]{2})?$/);
        if (!match) {return null}
        const colStr = args[0].slice(1);
             if (3===colStr.length) {return [...colStr].map(c=>parseInt(c,16)*256);}//#RGB
        else if (6===colStr.length) {return colStr.match(/.{2}/g).map(c=>parseInt(c,16));}//#RRGGBB
        else if (8===colStr.length) {return colStr.match(/.{2}/g).map(c=>parseInt(c,16));}//#RRGGBBAA
        else {return null}
    }
    numsToCode(nums) {
        if (!(Array.isArray(nums) && 3===nums.length || 4===nums.length)) {return `#${nums.map(n=>n.toString(16)).padStart('0',2)}`}
        else {return null}
    }
    isCode(code) {
//        const match = code.match(/^#([0-9A-Fa-f]{3})$|#([0-9A-Fa-f]{6})|#([0-9A-Fa-f]{8})/);
//        if (!code.startsWith('#')){return false}
        //const values = args[0].slice(1);
    }
    */
}

