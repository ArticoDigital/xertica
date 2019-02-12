import State from './State';
import courses from '../data/courses';


export default function () {

  const app = State.getCurrentApp(),
    page = State.getLastPageCurrentApp(),
    course = courses[app].videos[page];

  document.getElementById('Course-title').innerText = course.name;
  const linkBack =  document.getElementById('linkBack');
  const linkAfter =  document.getElementById('linkAfter');

  document.getElementById('AppName').innerText = courses[app].name;
  document.getElementById('Icon2').setAttribute('src', courses[app].icon2);

  if (courses[app].videos[parseInt(page) - 1]) {

    linkBack.setAttribute('data-idvideo',parseInt(page) - 1)
    document.getElementById('Course-back').innerText =
      courses[app].videos[parseInt(page) - 1].name;

  } else {
    linkBack.classList.add('disabled')
  }

  if (courses[app].videos[parseInt(page) + 1]) {
    linkAfter.setAttribute('data-idvideo',parseInt(page) + 1)
    document.getElementById('Course-after').innerText =
      courses[app].videos[parseInt(page) + 1].name;

  } else {
    linkAfter.classList.add('disabled')
  }


  document.getElementById('Course-video')
    .setAttribute('src', course.src);
  document.getElementById('Course-content').innerHTML = course.content;
}

