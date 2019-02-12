import courses from '../data/courses';
import State from './State';

export default function () {
  let percentage= State.percentageEachApp();
  const MenuIcons = document.getElementById('MenuCourseInPage');
  let links = [];
  for (let key in courses) {
    let Figure = document.createElement('figure'),
      Link = document.createElement('a'),
      Image = document.createElement('img'),
      NameApp = document.createElement('p'),
      PercentageText = document.createElement('span');
    Image.setAttribute('src', courses[key].icon2);
    Link.setAttribute('data-appid', key);
    Link.setAttribute('class', 'Menu-courseLink');
    Link.setAttribute('href', '#');
    NameApp.innerText = courses[key].name;
    PercentageText.innerText =  percentage[key]+"%";
    NameApp.setAttribute('class', 'centertext');
    Link.appendChild(Image);
    Figure.appendChild(Link);
    Figure.appendChild(NameApp);
    Figure.appendChild(PercentageText);
    MenuIcons.appendChild(Figure);
    links.push(Link);
  }

  return links;
}
