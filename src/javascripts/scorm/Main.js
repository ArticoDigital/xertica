import State from './State';
import generateMenuApps from './generateMenuApps';
import generateMenuVideos from './generateMenuVideos';
import { ScormProcessInitialize, ScormProcessGetValue, ScormProcessSetValue, ScormProcessCommit } from './ScormFunction';

export default class {

  constructor() {
    /*
        ScormProcessInitialize();

        console.log(ScormProcessGetValue('cmi.completion_status', true));
        console.log(ScormProcessSetValue("cmi.completion_status", "incomplete"));
        console.log(ScormProcessGetValue("cmi.suspend_data", false));
        console.log(ScormProcessSetValue("cmi.suspend_data", 'algo'));

        console.log(ScormProcessCommit());
    */

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
        const idVideo = item.dataset.idvideo;
        State.setLastPageIndex(idVideo);
        _self.generatetemplate.loadTemplate(idVideo);
        const links = generateMenuVideos();
        _self.clickLinkVideos(links, _self);
        _self.generatetemplate.menuVideos();

      });
    });

  }
}

