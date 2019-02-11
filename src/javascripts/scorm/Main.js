import State from './State';
import generateMenuApps from './generateMenuApps';
import generateMenuVideos from './generateMenuVideos';
import generatePercentage from './generatePercentage';
import {
  ScormProcessInitialize,
  ScormProcessGetValue,
  ScormProcessSetValue,
  ScormProcessCommit
} from './ScormFunction';


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
    State.init();
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
        State.setPagesApp(idApp);
        _self.generatetemplate.loadTemplate(idApp);
        const links = generateMenuVideos();
        let percentage = generatePercentage();
        _self.clickLinkVideos(links, _self);
        _self.clickLinkAppCourse();
      });
    });
  }

  clickLinkVideos(links, _self) {
    _self.generatetemplate.menuVideos();
    links.forEach(function (item) {

      item.addEventListener('click', function (e) {
        e.preventDefault();
        const idVideo = item.dataset.idvideo;
        State.setPagesApp(State.currentApp, idVideo, idVideo);
        _self.generatetemplate.loadTemplate(idVideo);
        const links = generateMenuVideos();
        _self.clickLinkVideos(links, _self);
        _self.generatetemplate.menuVideos();
        _self.clickLinkAppCourse();
      });
    });
  }

  clickLinkAppCourse() {
    const _self = this;
    document.querySelectorAll('.Menu-courseLink')
      .forEach(function (item) {
        item.addEventListener('click', function (e) {
          e.preventDefault();
          let idApp = item.dataset.appid;

          State.setCurrentApp(idApp);
          let lastpage = State.getLastPageCurrentApp();
          State.setPagesApp(idApp, lastpage, lastpage);
          _self.generatetemplate.loadTemplate(1);
          _self.generatetemplate.menuVideos();
          const links = generateMenuVideos();
          _self.clickLinkVideos(links, _self);
          _self.clickLinkAppCourse();
        });
      });
  }

}
