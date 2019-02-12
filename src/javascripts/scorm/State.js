import GenerateTemplate from './GenerateTemplate';
import courses from '../data/courses';

export default class {

  constructor() {
    this.pagesApp = [/*{app: 0 pages: [],lastPage: 0},*/];
    this.currentApp = 0;
    this.generateTemplate = {};
  }

  static init() {
    this.pagesApp = [];
    for (let key in  courses) {
      this.pagesApp.push({
        app: parseInt(key),
        pages: [],
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
    return app.pages.includes(parseInt(id));
  }

  static getPagesVisited() {
    const currentApp = this.currentApp;
    const app = this.pagesApp.find(function (apps) {
      return apps.app == currentApp;
    });
    return app.pages.length;
  }

  static isFinishedCourse() {
    
    //const Videos = courses[State.getCurrentApp()].videos;
    for (let key in  courses) {
      //let longitud = ;
      let longapp = Object.keys(courses[key].videos).length;
     
      if(this.pagesApp[key].pages.length < longapp){
        return false;
      }
    }
    return true;
  }

  static percentageEachApp() {
    let totalPercentage = [];
    //const Videos = courses[State.getCurrentApp()].videos;
    for (let key in  courses) {
      let longapp = Object.keys(courses[key].videos).length;
      totalPercentage[key]=parseInt(this.pagesApp[key].pages.length*100/longapp,10);
    }

    return totalPercentage;
  }


}
