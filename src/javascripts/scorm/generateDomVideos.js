import State from './State';
import courses from '../data/courses';


export default function () {

  const app = State.getCurrentApp(),
    page = State.getLastPageCurrentApp(),
    course = courses[app].videos[page];

  document.getElementById('Course-title').innerText = course.name;
  document.getElementById('Course-back').innerText = courseBack(app, page);
  document.getElementById('Course-after').innerText = courseAfter(app, page);
  document.getElementById('Course-video')
    .setAttribute('src', course.src);
  document.getElementById('Course-content').innerHTML = course.content;
}

function courseBack(app, page) {
  return courses[app].videos[parseInt(page) - 1] ? courses[app].videos[parseInt(page) - 1].name : '';
}

function courseAfter(app, page) {
  return courses[app].videos[parseInt(page) + 1] ? courses[app].videos[parseInt(page) + 1].name : '';

}
