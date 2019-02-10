import GenerateTemplate from './GenerateTemplate';

export default class {

   constructor() {
    this.lastAppIndex = 0;
    this.lastPageIndex = 0;
    this.visitedPages = {};
    this.generateTemplate = {};
  }


  static setLastAppIndex(lastAppIndex) {
    this.lastAppIndex = lastAppIndex;
  }

  static getLastAppIndex() {
    return this.lastAppIndex;
  }

  static setLastPageIndex(lastPageIndex) {
    this.lastPageIndex = lastPageIndex;
  }

  static getLastPageIndex() {
    return this.lastPageIndex;
  }

  static setVisitedPages(visitedPages) {
    this.visitedPages = visitedPages;
  }

  static getVisitedPages() {
    return this.visitedPages;
  }

  static setTemplate(el) {
    this.generateTemplate = new GenerateTemplate(el) ;
  }

  static getGenerateTemplate() {
    return this.generateTemplate;
  }

}
