window.addEventListener('DOMContentLoaded', (event) => {
    function update(fore, back, isBack=false) {
        const c = Color.of(isBack ? back : fore);
        const C = c.contrast(Color.of(isBack ? fore : back));
        contrast.textContent = C.toFixed(2);
        area.style[(isBack ? 'backgroundColor' : 'color')] = c.code;
        warn.style.display = C < 4.5 ? 'inline-block' : 'none';
    }
    const [fore,back,contrast,text,area,warn] = 'fore back contrast text area warn'.split(' ').map(n=>document.querySelector(`[name="${n}"]`));
    fore.addEventListener('input', (e)=>update(e.target.value, back.value, false));
    back.addEventListener('input', (e)=>update(fore.value, e.target.value, true));
    /*
    fore.addEventListener('input', (e)=>{
        const c = Color.of(e.target.value);
        const C = c.contrast(Color.of(back.value));
        contrast.textContent = C.toFixed(2);
        area.style.color = c.code;
        warn.style.display = C < 4.5 ? 'inline-block' : 'none';
    });
    back.addEventListener('input', (e)=>{
        const c = Color.of(e.target.value);
        const C = c.contrast(Color.of(fore.value));
        contrast.textContent = C.toFixed(2);
        area.style.backgroundColor = c.code;
        warn.style.display = C < 4.5 ? 'inline-block' : 'none';
    });
    */
    text.addEventListener('input', (e)=>{
        area.textContent = e.target.value;
    });
    [fore,back,text].map(el=>el.dispatchEvent(new Event('input')))
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

