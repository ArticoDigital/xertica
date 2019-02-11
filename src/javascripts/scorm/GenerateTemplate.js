import mainTemplate from '../templates/main';
import courseTemplate from '../templates/course';
import generateDomVideos from './generateDomVideos';


export default class {

  constructor(el) {
    this.el = el;
  }

  loadTemplate(page = null) {
    if (page) {
      this.el.innerHTML = courseTemplate;
      this.addElementsCourse();
      return;
    }
    this.el.innerHTML = mainTemplate;
    this.addElementsMain();
  }

  addElementsCourse() {
    generateDomVideos();
  }

  addElementsMain() {

  }

  menuVideos() {
    const Menu = document.getElementById('Menu'),
      MenuButton = document.getElementById('MenuButton'),
      MenuButtonCollapse = document.getElementById('MenuButtonCollapse');

    MenuButton.addEventListener('click', function () {
      document.getElementById('Menu')
        .classList
        .add('open');
    });

    MenuButtonCollapse.addEventListener('click', function (e) {
      e.preventDefault();
      Menu.classList.remove('open');
    });
  }

}
