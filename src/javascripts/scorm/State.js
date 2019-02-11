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

  static setPagesApp(app, page = 0, lastpage = 0) {
    const _self = this;
    this.currentApp = app;
    this.pagesApp.map(function (apps) {
      if (apps.app == app) {
        apps.pages.push(parseInt(page));
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


}
