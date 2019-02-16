import courses from '../data/courses';
import State from './State';

export default function () {

  const Videos = courses[State.getCurrentApp()].videos,
    NavUl = document.getElementById('NavUl');
  let links = [];

  for (let key in Videos) {
    let Li = document.createElement('li'),
      Link = document.createElement('a'),
      Span = document.createElement('span'),
      Span1 = document.createElement('span'),
      Span2 = document.createElement('span'),
      Div = document.createElement('div');

      Link.setAttribute('id','menu-video-'+key)
      Span.setAttribute('id','number-video-'+key)
      Li.setAttribute('class', 'row middle-items');


    Div.setAttribute('class', 'row Nav-border middle-items');
    if (State.visitedLink(key)) {
      Link.setAttribute('class', 'row middle-items visited');
      Span.setAttribute('class', 'Nav-number visited');
    } else {
      Link.setAttribute('class', 'row middle-items');
      Span.setAttribute('class', 'Nav-number');
    }
    Link.setAttribute('href', '#');

    Span.innerText = parseInt(key) + 1;
    Div.appendChild(Span);

    Span1.setAttribute('class', 'Nav-text');
    Span1.innerText = Videos[key].name;
    Div.appendChild(Span1);


    Span2.setAttribute('class', 'Nav-arrow');
    Span2.innerText = ' > ';

    Link.appendChild(Div);
    Link.appendChild(Span2);
    Link.setAttribute('data-idvideo', key);

    Li.appendChild(Link);
    NavUl.appendChild(Li);
    links.push(Link);

  }

  return links;

}

