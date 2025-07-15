window.addEventListener('DOMContentLoaded', (event) => {
    function update(fore, back, isBack=false) {
        const c = Color.of(isBack ? back : fore);
        const C = c.contrast(Color.of(isBack ? fore : back));
        const figs = 2;
        contrast.textContent = C.toFixed(figs);
        const Lc = APCA.calc(fore, back, figs);
        lc.textContent = Lc;
        area.style[(isBack ? 'backgroundColor' : 'color')] = c.code;
        const i = Color.threshold.APCA.findIndex(a=>a < Lc);
        msg.textContent = Color.threshold.msg[i];
        msg.style.color = i < 3 ? 'green' : 'red';
//        warnWCAG.style.display = C < 4.5 ? 'inline-block' : 'none';
    }
    const [fore,back,contrast,lc,text,area,msg,warnWCAG,warnAPCA] = 'fore back contrast lc text area msg warnWCAG warnAPCA'.split(' ').map(n=>document.querySelector(`[name="${n}"]`));
    fore.addEventListener('input', (e)=>update(e.target.value, back.value, false));
    back.addEventListener('input', (e)=>update(fore.value, e.target.value, true));
    text.addEventListener('input', (e)=>area.textContent = e.target.value);
    [fore,back,text].map(el=>el.dispatchEvent(new Event('input')));
    fore.focus();


    
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

