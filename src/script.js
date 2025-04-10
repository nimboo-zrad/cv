document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");
  const [one, two, three, four] = document.querySelectorAll('.page');
  const [submitOne, submitTwoBack, submitTwoNext, submitThreeBack, submitThreeNext, submitFinal] = document.querySelectorAll(".submit");
  const addElem = document.querySelector(".addElem");
  submitOne.addEventListener("click", (event)=>{
  	event.preventDefault();
      if(form.checkValidity()){
      	one.style.opacity = 0;
          two.style.opacity = 1;
      }
      else console.log(form.reportValidity());
  });
  
  addElem.addEventListener("click", ()=>{
  	const inputArea = document.createElement("input");
      inputArea.type = "textarea";
      inputArea.className = "area";
 });
});


