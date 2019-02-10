import mainTemplate from '../templates/main';
import courseTemplate from '../templates/course';


export default class {

  constructor(el) {
    this.el = el;
  }

  loadTemplate(page = null) {

    if (page) {
      this.el.innerHTML = courseTemplate;
      return 'video';
    }
    this.el.innerHTML = mainTemplate;
    return 'apps';
  }

  menuVideos(){
    const Menu = document.getElementById('Menu'),
      MenuButton = document.getElementById('MenuButton'),
      MenuButtonCollapse = document.getElementById('MenuButtonCollapse');

    MenuButton.addEventListener('click', function () {
      document.getElementById('Menu').classList.add('open');
    });

    MenuButtonCollapse.addEventListener('click', function (e) {
      e.preventDefault();
      Menu.classList.remove('open');
    });
  }

}
