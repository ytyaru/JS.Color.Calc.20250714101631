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
        console.log(foreV, backV, figs)
        const Lc = c.lc(foreV, backV, figs);
        lc.textContent = Lc;
        console.log(c.code);
        area.style[(isBack ? 'backgroundColor' : 'color')] = c.code;
        const i = Color.threshold.APCA.findIndex(a=>a < Lc);
        msg.textContent = Color.threshold.msg[i];
        msg.style.color = i < 3 ? 'green' : 'red';
        if (resize.checked) {
            /*
            const minSize = APCA.getFontSize(fore.value, back.value, weight.value);
            size.min = minSize;
            if (size.value < size.min) {size.value = size.min}
            */
            const minSize = APCA.getFontSize(foreV, backV, Number(weight.value));
            if ('number'===typeof minSize && ![777,999].some(v=>v===minSize)) {
                size.value = minSize;
                size.min = minSize;
                area.style.fontSize = `${minSize}px`;
                area.style.height = `${minSize}px`;
            }
        }
    }
    const [fore,back,contrast,lc,text,area,msg,warnWCAG,warnAPCA,mono,size,weight,resize] = 'fore back contrast lc text area msg warnWCAG warnAPCA mono size weight resize'.split(' ').map(n=>document.querySelector(`[name="${n}"]`));
    fore.addEventListener('input', (e)=>update(e.target.value, back.value, false));
    back.addEventListener('input', (e)=>update(fore.value, e.target.value, true));
    text.addEventListener('input', (e)=>area.textContent = e.target.value);
    mono.addEventListener('input', (e)=>{
        fore.disabled = e.target.checked;
        update(fore.value, back.value, true)
    });
    size.addEventListener('input', (e)=>area.style.fontSize = `${e.target.value}px`);
    weight.addEventListener('input', (e)=>area.style.fontWeight = `${e.target.value}`);
    resize.addEventListener('input', (e)=>{
        const minSize = APCA.getFontSize(fore.value, back.value, Number(weight.value));
        if ('number'===typeof minSize && ![777,999].some(v=>v===minSize)) {
            console.log(minSize);
            size.min = minSize;
            area.style.fontSize = `${minSize}px`
            area.style.height = `${minSize}px`;
            //if (size.value < size.min) {size.value = size.min}
        }
//        area.style.fontSize = `${e.target.value}px`;
    });
    [fore,back,text].map(el=>el.dispatchEvent(new Event('input')));
    back.focus();
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

