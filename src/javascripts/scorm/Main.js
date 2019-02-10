import State from './State';
import generateMenuApps from './generateMenuApps';
import generateMenuVideos from './generateMenuVideos';

export default class {

  constructor() {

    State.setTemplate(document.getElementById('MainContainer'));
    this.generatetemplate = State.getGenerateTemplate();
    this.generatetemplate.loadTemplate();

    const links = generateMenuApps();
    this.clickLinkApp(links);

  }

  clickLinkApp(links) {
    const _self = this;
    links.forEach(function (item) {
      item.addEventListener('click', function () {
        const idApp = item.dataset.idapp;
        State.setLastAppIndex(idApp);
        _self.generatetemplate.loadTemplate(idApp);
        const links = generateMenuVideos();
        _self.clickLinkVideos(links, _self);
      });
    });
  }

  clickLinkVideos(links, _self) {
    _self.generatetemplate.menuVideos();
    links.forEach(function (item) {
      item.addEventListener('click', function () {
        _self.generatetemplate.loadTemplate();

        //item.addEventListener('click', this.loadTemplateVideo.bind(this, key));
      });
    });

  }
}

