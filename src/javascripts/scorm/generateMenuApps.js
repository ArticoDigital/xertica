import courses from '../data/courses';

export default function () {
  const MenuIcons = document.getElementById('MenuIcons');
  let links = [];
  for (let key in courses) {
    let Figure = document.createElement('figure'),
      Link = document.createElement('a'),
      Image = document.createElement('img');
    Image.setAttribute('src', courses[key].icon);
    Link.setAttribute('data-idapp', key);
    Link.setAttribute('class', 'linkApp');
    Link.appendChild(Image);
    Figure.appendChild(Link);
    MenuIcons.appendChild(Figure);
    links.push(Link);
  }

  return links;
}



