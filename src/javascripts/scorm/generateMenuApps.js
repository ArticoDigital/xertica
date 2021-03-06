import courses from '../data/courses';
import State from './State';

export default function () {
  let percentage= State.percentageEachApp();
  const MenuIcons = document.getElementById('MenuIcons');
  let links = [];
  for (let key in courses) {
    let Figure = document.createElement('figure'),
      Link = document.createElement('a'),
      Image = document.createElement('img'),
      PercentageText = document.createElement('span');

    PercentageText.innerText =  percentage[key]+"%";
    Image.setAttribute('src', courses[key].icon);
    Link.setAttribute('data-idapp', key);
    Link.setAttribute('class', 'linkApp');
    Link.setAttribute('href', '#');
    Link.appendChild(Image);
    Figure.appendChild(Link);
    Figure.appendChild(PercentageText);
    MenuIcons.appendChild(Figure);
    links.push(Link);
  }

  return links;
}



