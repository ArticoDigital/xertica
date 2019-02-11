import State from './State';
import courses from '../data/courses';


export default function () {
  const app = State.getLastAppIndex(),
    page = State.getLastPageIndex(),
    course = courses[app].videos[page];

  document.getElementById('Course-title').innerText = course.name;
  document.getElementById('Course-back').innerText = courseBack(app, page);
  document.getElementById('Course-after').innerText = courseAfter(app, page);
  document.getElementById('Course-video')
    .setAttribute('href', course.src);
  document.getElementById('Course-content').innerHTML = course.content;

}

function courseBack(app, page) {
  return (courses[app].videos[page - 1]) ? console.log(courses[app].videos[page - 1]) : '';
}

function courseAfter(app, page) {
  return (courses[app].videos[page + 1]) ? console.log(courses[app].videos[page + 1]) : '';

}


