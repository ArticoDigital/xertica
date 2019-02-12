import courses from '../data/courses';
import State from './State';

export default function () {

   const Pages = courses[State.getCurrentApp()].videos;
 
  const PagesVisited = State.getPagesVisited();
  let size = Object.keys(Pages).length;
  let percetageperpage=parseInt(100/size,10);
  let totalpercentage = parseInt(PagesVisited*100/size,10)
  const  PercentageUI = document.getElementById('PercentageUI');
  let actualpercentage = PagesVisited*percetageperpage;
  
  for (let key in Pages) {
    let mult=Number(key)+1;

    //<span class="gradient-1" data-per="7%"></span>
    let Span = document.createElement('span');
    Span.setAttribute('class', 'gradient-'+mult);
    if (percetageperpage*mult==actualpercentage){
      Span.classList.add('active');
    }
    //if (State.visitedLink(key)) {
      
    //}
    Span.setAttribute('data-per', totalpercentage+"%");
    PercentageUI.appendChild(Span);

  }

  return PagesVisited;

}

