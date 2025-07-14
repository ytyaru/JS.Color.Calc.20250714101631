window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    const author = 'ytyaru';
    van.add(document.querySelector('main'), 
        van.tags.h1(van.tags.a({href:`https://github.com/${author}/JS.Color.Calc.20250714101631/`}, 'Color.Calc')),
        van.tags.p('反転色、補色、輝度、コントラスト差を算出する（ライト／ダークモード、背景色／文字色などの算出）'),
//        van.tags.p('Calculate inverted colors, complementary colors, brightness, contrast difference (calculation of light/dark mode, background/text colors, etc.)'),
    );
    van.add(document.querySelector('footer'),  new Footer('ytyaru', '../').make());

    const a = new Assertion();
    a.t(Type.isCls(Color));
    a.t(()=>{
        const black = new Color([0,0,0]);
        console.log(black, black.code, black.reversal, black.complementary)
        return black.nums.every(n=>0===n) && '#000000'===black.code;
    });
    a.t(true);
    a.f(false);
    a.e(TypeError, `msg`, ()=>{throw new TypeError(`msg`)});
    a.fin();
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

