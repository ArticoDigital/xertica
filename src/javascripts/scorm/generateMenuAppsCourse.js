import State from './State';

export default function () {
  document.querySelectorAll('.Menu-courseLink').forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault()
      State.setLastAppIndex(item.dataset.idapp);
      State.setLastPageIndex()
    })
  })
}



