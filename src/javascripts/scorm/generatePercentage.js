import courses from '../data/courses';
import State from './State';

export default function () {

  const Pages = courses[State.getLastAppIndex()].videos;
  //const PagesVisited = State[State.getLastAppIndex()].visitedpages;
  let size = Object.keys(Pages).length;
  let percetageperpage=parseInt(100/size,10);
  const  PercentageUI = document.getElementById('PercentageUI');
 // let actualpercentage = PagesVisited*percetageperpage;
  let PagesVisited = 40;
  for (let key in Pages) {
    let mult=Number(key)+1;

    //<span class="gradient-1" data-per="7%"></span>
    let Span = document.createElement('span');
    Span.setAttribute('class', 'gradient-'+mult);
    //if (percetageperpage*mult==PagesVisited){
      Span.classList.add('active');
    //}
    Span.setAttribute('data-per', percetageperpage*mult+"%");
    PercentageUI.appendChild(Span);

  }

  return PagesVisited;

}

