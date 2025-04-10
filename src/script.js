document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".form");
    const [one, two, three, four, five] = document.querySelectorAll('.page');
    const [submitOne, submitTwoBack, submitTwoNext, submitThreeBack, submitThreeNext, submitFourBack, submitFourNext, submitFiveBack, submitFinal] = document.querySelectorAll(".submit");
    const addel = document.querySelectorAll(".addElem");
    const remel= document.querySelectorAll(".removeElem");
    const tac = document.querySelectorAll(".totalAreaContainer");
    
    let vars = {
    	var0: 2,
        var1: 2,
        var2: 2,
        var3: 2,
    }
    
  let word = "";
    
  addel.forEach((elem, index)=> {
  	elem.addEventListener("click", ()=>{
  	    if(index === 0) word = "Skill";
          else if(index === 1) word = "Research";
          else if(index === 2) word = "Executive";
          else word = "Activity";
  	     const areaContainer = document.createElement("div");
           areaContainer.className = "areaContainer";
        
           const label = document.createElement("label");
           label.for = word + vars["var" + index] ;
           label.innerText = word + " " + vars["var" + index] + " :";
        
           const textarea = document.createElement("textarea");
           textarea.id = word + vars["var" + index] ;
           textarea.name = word + "_" + vars["var" + index] ;
           textarea.className = "area";
        
           areaContainer.appendChild(label);
           areaContainer.appendChild(textarea);
        
           tac[index].appendChild(areaContainer);
           vars["var" + index]++
      });
  });
  
  remel.forEach((elem, index) =>{
  	elem.addEventListener("click", ()=>{
          if(vars["var" + index] > 2){
          	tac[index].removeChild(tac[index].lastChild);
              vars["var" + index] --;
          }
      });
  });
  
  const transitionPage = (hide, show) =>{
    	hide.style.opacity = 0;
        hide.style.zIndex = 0;
        show.style.opacity = 1;
        show.style.zIndex = 999;
  };
  
  submitOne.addEventListener("click", ()=>{
        if(form.checkValidity()){
            transitionPage(one, two);
        } else console.log(form.reportValidity());
    });

    submitTwoNext.addEventListener("click", ()=>{
        transitionPage(two, three);
    });

    submitTwoBack.addEventListener("click", ()=>{
    	transitionPage(two, one);
    });
    
    submitThreeNext.addEventListener("click", ()=>{
        transitionPage(three, four);
    });

    submitThreeBack.addEventListener("click", ()=>{
         transitionPage(three, two);
    });
    
    submitFourNext.addEventListener("click", ()=>{
        transitionPage(four, five);
    });

    submitFourBack.addEventListener("click", ()=>{
        transitionPage(four, three);
    });

    submitFiveBack.addEventListener("click", ()=>{
         transitionPage(five, four);
    });
});