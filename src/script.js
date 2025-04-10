document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");
  const [one, two, three, four] = document.querySelectorAll('.page');
  const [submitOne, submitTwoBack, submitTwoNext, submitThreeBack, submitThreeNext, submitFinal] = document.querySelectorAll(".submit");
  const addElem = document.querySelector(".addElem");
  const removeElem = document.querySelector(".removeElem");
  const totalAreaContainer = document.querySelector(".totalAreaContainer");
  
  submitOne.addEventListener("click", (event)=>{
  	event.preventDefault();
      if(form.checkValidity()){
      	one.style.opacity = 0;
          one.style.zIndex = 0;
          two.style.opacity = 1;
          two.style.zIndex = 999;
      }
      else console.log(form.reportValidity());
  });
  
  let start = 2;
  
  addElem.addEventListener("click", ()=>{
  	const areaContainer = document.createElement("div");
      areaContainer.className = "areaContainer";
      
      const label = document.createElement("label");
      label.for = "skill" + start;
      label.innerText = "Skill " + start + " :";
  	
      const textarea = document.createElement("textarea");
      textarea.id = "skill" + start;
      textarea.name = "skill_" + start;
      textarea.className = "area";
      
      areaContainer.appendChild(label);
      areaContainer.appendChild(textarea);
      
      totalAreaContainer.appendChild(areaContainer);
      start++;
 });
 
 removeElem.addEventListener("click", ()=>{
 	if(start > 2){
 	   totalAreaContainer.removeChild(totalAreaContainer.lastChild);
        start--
    }
});

submitTwoNext.addEventListener("click", ()=>{
	two.style.opacity = 0;
	two.style.zIndex = 0;
	three.style.opacity = 1;
	three.style.zIndex = 0;
});

submitTwoBack.addEventListener("click", ()=>{
	two.style.opacity = 0;
	two.style.zIndex = 0;
	one.style.opacity = 1;
	one.style.zIndex = 999;
});
});


