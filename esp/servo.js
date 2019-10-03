//range 0.5 - 2.5 ms
const pos = p => analogWrite(D0, (0.5 + 2*p) * 50 / 1000, {freq:50});

function inTime(start,end,time,cb,step) {
  pos(start);
  step = step || 20;
  let begin = getTime(); 
  let interval;
    
  function cycle() { 
    
    let ct = getTime();
    
    if (ct >= begin + time/1000) {      
      pos(end);
      if (cb) cb();
      return;
    }
    let np = start+((end-start)*((ct-begin)/(time/1000)));
    
    pos(np);
    setTimeout(cycle,step);
  }
  
  return cycle();
}

pos(1.0);
setTimeout(()=>inTime(1.0,0,10000,()=>digitalWrite(2,0)),5000);

//setTimeout(()=>digitalWrite(D0,0),3000);
