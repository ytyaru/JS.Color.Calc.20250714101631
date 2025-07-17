window.addEventListener('DOMContentLoaded', (event) => {
    const scheme = new ColorScheme('#fff', '#000', 400);
    const SCHEME = new ColorScheme('#fff', '#000', 400);
    function update(foreV, backV, isBack=false) {
        console.log(foreV, backV, isBack)
        scheme.fore = foreV;
        scheme.back = backV;
        scheme.weight = Number(weight.value);
        console.log(mono.checked , isBack)
        if (mono.checked && isBack) {
            fore.disabled = false;
            fore.value = scheme.back.mono.code;
            scheme.fore = fore.value;
            fore.disabled = true;
        }
        console.log(Number(minLc.value) <= scheme.level, minLc.value , scheme.level);
        if (Number(minLc.value) <= scheme.level) {
            SCHEME.fore = scheme.fore;
            SCHEME.back = scheme.back;
            SCHEME.weight = scheme.weight;
            const figs = 2;
            lc.textContent = scheme.lc.toFixed(figs);
            contrast.textContent = scheme.c.toFixed(figs);
            msg.textContent = `${scheme.level}(${scheme.threshold}≦): ${scheme.message}`;
            msg.style.color = (scheme.level < 2) ? 'red' : (scheme.level < 5 ? '#888800' : 'green');
            area.style.color = scheme.fore.code;
            area.style.backgroundColor = scheme.back.code;
            minLcOver.style.display = 'none';
        }
        else {
            scheme.fore = SCHEME.fore;
            scheme.back = SCHEME.back;
            scheme.weight = SCHEME.weight;
            minLcOver.style.display = 'inline';
        }
        /*
        const figs = 2;
        lc.textContent = scheme.lc.toFixed(figs);
        contrast.textContent = scheme.c.toFixed(figs);
        msg.textContent = `${scheme.level}(${scheme.threshold}≦): ${scheme.message}`;
        msg.style.color = (scheme.level < 2) ? 'red' : (scheme.level < 5 ? '#888800' : 'green');
//        msg.style.color = 3 < scheme.level ? 'green' : 'red';
        */
        if (resize.checked) {
            const minSize = scheme.minSize;
            if ('number'===typeof minSize && ![777,999].some(v=>v===minSize)) {
                size.value = minSize;
                size.min = minSize;
                area.style.fontSize = `${minSize}px`;
                area.style.height = `${minSize}px`;
            }
        }
        /*
        if (minLc.value <= scheme.level) {
            SCHEME.fore = scheme.fore;
            SCHEME.back = scheme.back;
            SCHEME.weight = scheme.weight;
            area.style.color = scheme.fore.code;
            area.style.backgroundColor = scheme.back.code;
        }
        */
    }
    const [fore,back,contrast,lc,text,area,msg,warnWCAG,warnAPCA,mono,size,weight,resize,minLc,minLcOver] = 'fore back contrast lc text area msg warnWCAG warnAPCA mono size weight resize minLc minLcOver'.split(' ').map(n=>document.querySelector(`[name="${n}"]`));
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
        }
    });
    minLc.addEventListener('input', (e)=>update(fore.value, back.value, false));
    [fore,back,text].map(el=>el.dispatchEvent(new Event('input')));
    back.focus();
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

