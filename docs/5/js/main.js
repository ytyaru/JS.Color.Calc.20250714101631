window.addEventListener('DOMContentLoaded', (event) => {
    function update(foreV, backV, isBack=false) {
        const c = Color.of(isBack ? backV : foreV);
        let C = c.contrast(Color.of(isBack ? foreV : back));
        const figs = 2;
        if (mono.checked && isBack) {
            fore.disabled=false;
            foreV = c.mono.code;
            fore.value = foreV;
            console.log(mono.checked , isBack, c.mono.code, fore.value);fore.disabled=true;area.style.color = fore.value
            C = c.contrast(Color.of(isBack ? foreV : back));
        }
        contrast.textContent = C.toFixed(figs);
        //const Lc = APCA.calc(foreV, backV, figs);
        const Lc = Math.abs(APCA.calc(foreV, backV, figs));
        lc.textContent = Lc;
        area.style[(isBack ? 'backgroundColor' : 'color')] = c.code;
        const i = Color.threshold.APCA.findIndex(a=>a < Lc);
        msg.textContent = Color.threshold.msg[i];
        msg.style.color = i < 3 ? 'green' : 'red';
//        warnWCAG.style.display = C < 4.5 ? 'inline-block' : 'none';
//        console.log(mono.checked , isBack, c.mono.code)
//        if (mono.checked && isBack) {fore.disabled=false;fore.value = c.mono.code;console.log(mono.checked , isBack, c.mono.code, fore.value);fore.disabled=true;area.style.color = fore.value}
    }
    const [fore,back,contrast,lc,text,area,msg,warnWCAG,warnAPCA,mono] = 'fore back contrast lc text area msg warnWCAG warnAPCA mono'.split(' ').map(n=>document.querySelector(`[name="${n}"]`));
    fore.addEventListener('input', (e)=>update(e.target.value, back.value, false));
    back.addEventListener('input', (e)=>update(fore.value, e.target.value, true));
    text.addEventListener('input', (e)=>area.textContent = e.target.value);
    //mono.addEventListener('input', (e)=>fore.disabled = e.target.checked);
    mono.addEventListener('input', (e)=>{
        fore.disabled = e.target.checked;
        update(fore.value, back.value, true)
    });
    [fore,back,text].map(el=>el.dispatchEvent(new Event('input')));
    fore.focus();


    
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

