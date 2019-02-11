import State from './State';
import courses from '../data/courses';

const app = State.getLastAppIndex(),
  page = State.getLastPageIndex(),
  course = courses[app].videos[page];

export default function () {

  if (courses[app].videos[page + 1]) {
    console.log(courses[app].videos[page + 1]);
  }

  document.getElementById('Course-title').innerText = course.name;
  document.getElementById('Course-back').innerText = courseBack();
  document.getElementById('Course-after').innerText = courseAfter();
  document.getElementById('Course-video')
    .setAttribute('href', course.src);
  document.getElementById('Course-content').innerHTML = course.content;

}

function courseBack() {
  return (courses[app].videos[page - 1]) ? console.log(courses[app].videos[page - 1]) : '';
}

function courseAfter() {
  return (courses[app].videos[page + 1]) ? console.log(courses[app].videos[page + 1]) : '';

}


