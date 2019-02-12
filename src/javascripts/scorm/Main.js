import State from './State';
import generateMenuApps from './generateMenuApps';
import generateMenuVideos from './generateMenuVideos';
import generatePercentage from './generatePercentage';
import generateMenuAppsInnerPage from  './generateMenuAppsInnerPage';
import {
  ScormProcessInitialize,
  ScormProcessGetValue,
  ScormProcessSetValue,
  ScormProcessCommit
} from './ScormFunction';

let debug=false;
let unloaded = false;



export default class {

  constructor() {
    window.addEventListener("beforeunload", this.myScript);
    window.addEventListener("unload", this.myScript);      
    

    if(!debug){

      ScormProcessInitialize();
        
      State.setTemplate(document.getElementById('MainContainer'));
      State.init();  

      let startTimeStamp = new Date();
      let suspend_data = "";
      let completionStatus = ScormProcessGetValue("cmi.completion_status", true);
      console.log(completionStatus);
        if (completionStatus == "unknown" || completionStatus == "" || completionStatus == null) {
          completionStatus = "incomplete";
          ScormProcessSetValue("cmi.completion_status", completionStatus);
          ScormProcessCommit();
          suspend_data = State.stateToString();
          console.log(suspend_data);
          ScormProcessSetValue("cmi.suspend_data", suspend_data);
          ScormProcessSetValue("cmi.location", 1);
          ScormProcessCommit();

          }else{
            suspend_data = ScormProcessGetValue("cmi.suspend_data", false);
            State.stringToState(suspend_data);
          }

        
      }else{
        State.setTemplate(document.getElementById('MainContainer'));
        State.init();  
      }

    this.generatetemplate = State.getGenerateTemplate();
    this.generatetemplate.loadTemplate();
    const links = generateMenuApps();
    this.clickLinkApp(links);
  }


  myScript(event){
    console.log("uNLOAD");
    if(!unloaded){
              ScormProcessSetValue("cmi.exit", "suspend");
              ScormProcessCommit();
              ScormProcessTerminate();
              unloaded = true;
           }
           return null;
    }
  
 
  clickLinkApp(links) {
    window.scrollTo(0, 0);
    const _self = this;


    links.forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        const idApp = item.dataset.idapp;
        State.setPagesApp(idApp);

        if(!debug){
        let suspend_data = State.stateToString();
        console.log(suspend_data);
        ScormProcessSetValue("cmi.suspend_data", suspend_data);
        ScormProcessCommit();}
        _self.isScormCompleted();

        _self.generatetemplate.loadTemplate(idApp);
        const links = generateMenuVideos();
        let percentage = generatePercentage();
        let menuAppInnerPage = generateMenuAppsInnerPage();
        _self.clickLinkVideos(links, _self);
        _self.clickLinkAppCourse();
        _self.clickArrows();
        _self.clickLinkMainButton();
      });
    });
  }

  clickLinkMainButton(){
    const _self = this;
    let MainButton = document.getElementById('MainButton');
    MainButton.addEventListener('click', function (e) {
        e.preventDefault();
        _self.generatetemplate.loadTemplate();
        const links = generateMenuApps();
        _self.clickLinkApp(links);
      });
  }

  clickLinkVideos(links, _self) {
    State.percentageEachApp();
    _self.generatetemplate.menuVideos();
    links.forEach(function (item) {

      item.addEventListener('click', function (e) {
        e.preventDefault();
        const idVideo = item.dataset.idvideo;
        State.setPagesApp(State.currentApp, idVideo, idVideo);


      if(!debug){
        let suspend_data = State.stateToString();
        console.log(suspend_data);
        ScormProcessSetValue("cmi.suspend_data", suspend_data);
        ScormProcessCommit();
      }
      _self.isScormCompleted();

        _self.generatetemplate.loadTemplate(idVideo);
        const links = generateMenuVideos();
        _self.clickLinkVideos(links, _self);
        _self.generatetemplate.menuVideos();
        let percentage = generatePercentage();
        let menuAppInnerPage = generateMenuAppsInnerPage();
        _self.clickLinkAppCourse();
        _self.clickArrows();
        _self.clickLinkMainButton();
      });
    });
  }

  clickLinkAppCourse() {
    window.scrollTo(0, 0);
    const _self = this;
    document.querySelectorAll('.Menu-courseLink')
      .forEach(function (item) {
        item.addEventListener('click', function (e) {
          e.preventDefault();
          let idApp = item.dataset.appid;

          State.setCurrentApp(idApp);
          let lastpage = State.getLastPageCurrentApp();
          State.setPagesApp(idApp, lastpage, lastpage);

        if(!debug){
          let suspend_data = State.stateToString();
        console.log(suspend_data);
        ScormProcessSetValue("cmi.suspend_data", suspend_data);
        ScormProcessCommit();
      }
     _self.isScormCompleted();


          _self.generatetemplate.loadTemplate(1);
          _self.generatetemplate.menuVideos();
          const links = generateMenuVideos();
          let percentage = generatePercentage();
          let menuAppInnerPage = generateMenuAppsInnerPage();
          _self.clickLinkVideos(links, _self);
          _self.clickLinkAppCourse();
          _self.clickArrows();
          _self.clickLinkMainButton();
        });
      });
  }

  clickArrows() {
    const _self = this;

    document.querySelectorAll('.Course-arrow')
      .forEach(function (item) {
        item.addEventListener('click', function () {
          const idVideo = item.dataset.idvideo;
          State.setPagesApp(State.currentApp, idVideo, idVideo);

      if(!debug){
          let suspend_data = State.stateToString();
        console.log(suspend_data);
        ScormProcessSetValue("cmi.suspend_data", suspend_data);
        ScormProcessCommit();
      }
      _self.isScormCompleted();

          _self.generatetemplate.loadTemplate(1);
          _self.generatetemplate.menuVideos();
          const links = generateMenuVideos();
          _self.clickLinkVideos(links, _self);
          let percentage = generatePercentage();
          let menuAppInnerPage = generateMenuAppsInnerPage();
          _self.clickLinkAppCourse();
          _self.clickArrows();
          _self.clickLinkMainButton();
        });
      });


  }

  isScormCompleted () {
    if(State.isFinishedCourse()){
      console.log("scormcompleted");
      ScormProcessSetValue("cmi.completion_status", "completed");
      if(!debug)
      ScormProcessCommit();
    }
  }


}
