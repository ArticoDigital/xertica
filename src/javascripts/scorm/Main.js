import State from './State';
import generateMenuApps from './generateMenuApps';
import generateMenuVideos from './generateMenuVideos';
<<<<<<< HEAD
import generatePercentage from './generatePercentage';
import {
  ScormProcessInitialize,
  ScormProcessGetValue,
  ScormProcessSetValue,
  ScormProcessCommit
} from './ScormFunction';
=======
import { ScormProcessInitialize, ScormProcessGetValue, ScormProcessSetValue, ScormProcessCommit } from './ScormFunction';
>>>>>>> 11f477c19dd5fd266f6f1b4d53da56cb8a3b60a1

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
    State.setLastPageIndex(0);

    this.generatetemplate = State.getGenerateTemplate();
    this.generatetemplate.loadTemplate();

    const links = generateMenuApps();
    this.clickLinkApp(links);

  }

  clickLinkApp(links) {
    const _self = this;
    links.forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        const idApp = item.dataset.idapp;
        State.setLastAppIndex(idApp);
        _self.generatetemplate.loadTemplate(idApp);
        const links = generateMenuVideos();
        let percentage= generatePercentage();
        _self.clickLinkVideos(links, _self);
      });
    });
  }

  clickLinkVideos(links, _self) {
    _self.generatetemplate.menuVideos();
    links.forEach(function (item) {
<<<<<<< HEAD
      item.addEventListener('click', function () {
        const idVideo = item.dataset.idvideo,
          links = generateMenuVideos();
=======
      item.addEventListener('click', function (e) {
        e.preventDefault();
        const idVideo = item.dataset.idvideo;
>>>>>>> 11f477c19dd5fd266f6f1b4d53da56cb8a3b60a1
        State.setLastPageIndex(idVideo);
        _self.generatetemplate.loadTemplate(idVideo);
        const links = generateMenuVideos();
        _self.clickLinkVideos(links, _self);
        _self.generatetemplate.menuVideos();

      });
    });

  }
}

