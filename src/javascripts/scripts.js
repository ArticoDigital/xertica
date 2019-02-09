//import { doStart } from './main';
//doStart();


const Menu = document.getElementById('Menu'),
  MenuButton = document.getElementById('MenuButton'),
  MenuButtonCollapse = document.getElementById('MenuButtonCollapse');

if (Menu) {
  MenuButton.addEventListener('click', function (e) {
    console.log('asdasd');
    e.preventDefault();
    Menu.classList.add('open');
  });
  MenuButtonCollapse.addEventListener('click', function (e) {
    e.preventDefault();
    Menu.classList.remove('open');
  });
}
