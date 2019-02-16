import State from './State';
//import generateVideoListener from './generateVideoListener';
import generateMenuApps from './generateMenuApps';
import generateMenuVideos from './generateMenuVideos';
import generatePercentage from './generatePercentage';
import generateMenuAppsInnerPage from  './generateMenuAppsInnerPage';
import {
  ScormProcessInitialize,
  ScormProcessGetValue,
  ScormProcessSetValue,
  ScormProcessCommit,
  ScormProcessTerminate
} from './ScormFunction';

export default class {

  constructor() {

    State.setTemplate(document.getElementById('MainContainer'));
    State.init(); 

    window.addEventListener("beforeunload", this.BeforeClose);
    window.addEventListener("unload", this.BeforeClose);      
   
    
    if(!State.debug){

      ScormProcessInitialize();
        
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
          ScormProcessSetValue("cmi.success_status", "unknown");
          ScormProcessCommit();
          }else{
            suspend_data = ScormProcessGetValue("cmi.suspend_data", false);
            State.stringToState(suspend_data);
          }
      }

    this.generatetemplate = State.getGenerateTemplate();
    this.generatetemplate.loadTemplate();
    const links = generateMenuApps();
    this.clickLinkApp(links);
  }

  BeforeClose(event){
    if(!State.unloaded){
              ScormProcessSetValue("cmi.exit", "suspend");
              ScormProcessCommit();
              ScormProcessTerminate();
              State.unloaded = true;
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


        _self.generatetemplate.loadTemplate(idApp);
        const links = generateMenuVideos();
        let percentage = generatePercentage();
        let menuAppInnerPage = generateMenuAppsInnerPage();
        _self.clickLinkVideos(links, _self);
        _self.clickLinkAppCourse();
        _self.clickArrows();
        _self.clickLinkMainButton();
        //generateVideoListener();
          document.getElementById('MyVideo').addEventListener('ended',function() {
              _self.EndedVideo(_self);
          });
        
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


        _self.generatetemplate.loadTemplate(idVideo);
        const links = generateMenuVideos();
        _self.clickLinkVideos(links, _self);
        _self.generatetemplate.menuVideos();
        let percentage = generatePercentage();
        let menuAppInnerPage = generateMenuAppsInnerPage();
        _self.clickLinkAppCourse();
        _self.clickArrows();
        _self.clickLinkMainButton();
        //generateVideoListener();
        document.getElementById('MyVideo').addEventListener('ended',function() {
              _self.EndedVideo(_self);
          });
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
          let percentage = generatePercentage();
          let menuAppInnerPage = generateMenuAppsInnerPage();
          _self.clickLinkVideos(links, _self);
          _self.clickLinkAppCourse();
          _self.clickArrows();
          _self.clickLinkMainButton();
          //generateVideoListener();
           document.getElementById('MyVideo').addEventListener('ended',function() {
              _self.EndedVideo(_self);
          });
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


          _self.generatetemplate.loadTemplate(1);
          _self.generatetemplate.menuVideos();
          const links = generateMenuVideos();
          _self.clickLinkVideos(links, _self);
          let percentage = generatePercentage();
          let menuAppInnerPage = generateMenuAppsInnerPage();
          _self.clickLinkAppCourse();
          _self.clickArrows();
          _self.clickLinkMainButton();
          document.getElementById('MyVideo').addEventListener('ended',function() {
              _self.EndedVideo(_self);
          });
          
        });
      });


  }

  EndedVideo(_self) {
      
      State.setViewedVideoApp(State.getCurrentApp(),State.getLastPageCurrentApp(),State.getLastPageCurrentApp());
      let menulink = document.getElementById('menu-video-'+State.getLastPageCurrentApp());
      let numberlink = document.getElementById('number-video-'+State.getLastPageCurrentApp());
      menulink.classList.add('visited');
      numberlink.classList.add('visited');
      generatePercentage();
      let menuAppInnerPage = generateMenuAppsInnerPage();
      
      _self.clickLinkAppCourse();
      
      console.log(State.pagesApp)
      if(!State.debug){
          let suspend_data = State.stateToString();
          console.log(suspend_data);
          
          ScormProcessSetValue("cmi.suspend_data", suspend_data);
          ScormProcessCommit();
          if(State.isFinishedCourse()){
            console.log("scormcompleted");
            ScormProcessSetValue("cmi.completion_status", "completed");
            ScormProcessSetValue("cmi.success_status", "passed");
            ScormProcessCommit();
          }
      }
    }

  

}