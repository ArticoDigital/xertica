import GenerateTemplate from './GenerateTemplate';
import courses from '../data/courses';

export default class {

  constructor() {
    this.debug;
    this.unloaded;
    this.alertModule =[];
    this.pagesApp = [/*{app: 0 pages: [],videoview[],lastPage: 0},*/];
    this.currentApp = 0;
    this.generateTemplate = {};
  }

  static init() {
    this.debug=false;
    this.unloaded = false;
    this.alertModule =[];
    this.pagesApp = [];
    for (let key in  courses) {
      this.pagesApp.push({
        app: parseInt(key),
        pages: [],
        videoview: [],
        lastPage: 0
      });
    }
  }

  static stateToString(){
    const _progress = {
      pagesApp: this.pagesApp,
      currentApp: this.currentApp
    }
     return JSON.stringify(_progress);
  }
  

  static stringToState(progressString){
    const _progress = JSON.parse(progressString); 
    this.pagesApp = _progress.pagesApp;
    this.currentApp = _progress.currentApp;
  }
  

  
  static setPagesApp(app, page = 0, lastpage = 0) {
    const _self = this;
    this.currentApp = app;
    this.pagesApp.map(function (apps) {
      if (apps.app == app) {
        if(!apps.pages.includes(parseInt(page))){
            apps.pages.push(parseInt(page));
          }
          apps.lastPage = parseInt(lastpage);
      }
    });

}

  static setViewedVideoApp(app, page = 0, lastpage = 0) {
    const _self = this;
    this.currentApp = app;
    this.pagesApp.map(function (apps) {
      if (apps.app == app) {
        if(!apps.videoview.includes(parseInt(page))){
            apps.videoview.push(parseInt(page));
          }
      }
    });

  }

  static getLastPageCurrentApp() {

    const currentApp = this.currentApp;
    const app = this.pagesApp.find(function (apps) {
      return apps.app == currentApp;
    });


    return app.lastPage;
  }


  static getPagesApp() {
    return this.pagesApp;
  }

  static setCurrentApp(app) {
    this.currentApp = app;
  }

  static getCurrentApp() {
    return this.currentApp;
  }

  static setTemplate(el) {
    this.generateTemplate = new GenerateTemplate(el);
  }

  static getGenerateTemplate() {
    return this.generateTemplate;
  }

  static visitedLink(id) {
    const currentApp = this.currentApp;
    const app = this.pagesApp.find(function (apps) {
      return apps.app == currentApp;
    });
    return app.videoview.includes(parseInt(id));
  }

  static getPagesVisited() {
    const currentApp = this.currentApp;
    const app = this.pagesApp.find(function (apps) {
      return apps.app == currentApp;
    });
    return app.pages.length;
  }

  static getVideosViewed() {
    const currentApp = this.currentApp;
    const app = this.pagesApp.find(function (apps) {
      return apps.app == currentApp;
    });
    return app.videoview.length;
  }

  static isFinishedCourse() {
    
    //const Videos = courses[State.getCurrentApp()].videos;
    for (let key in  courses) {
      //let longitud = ;
      let longapp = Object.keys(courses[key].videos).length;
     
      if(this.pagesApp[key].videoview.length < longapp){
        return false;
      }
    }
    return true;
  }

  static isFinishedModule() {

    const currentApp = this.currentApp;
     let longapp = Object.keys(courses[currentApp].videos).length;
     
      if(this.pagesApp[currentApp].videoview.length == longapp){
        
        return true;
      }
    return false;
  }

  static percentageEachApp() {
    let totalPercentage = [];
    //const Videos = courses[State.getCurrentApp()].videos;
    for (let key in  courses) {
      let longapp = Object.keys(courses[key].videos).length;
      totalPercentage[key]=parseInt(this.pagesApp[key].videoview.length*100/longapp,10);
    }

    return totalPercentage;
  }


}
