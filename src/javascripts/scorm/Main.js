import State from './State';
//import generateVideoListener from './generateVideoListener';
import generateMenuApps from './generateMenuApps';
import generateMenuVideos from './generateMenuVideos';
import generatePercentage from './generatePercentage';
import generateMenuAppsInnerPage from  './generateMenuAppsInnerPage';
import Scorm from './ScormApiWrapper';
import swal from 'sweetalert2';
/*import {
  ScormProcessInitialize,
  ScormProcessGetValue,
  ScormProcessSetValue,
  ScormProcessCommit,
  ScormProcessTerminate
} from './ScormFunction';*/

export default class {

  constructor() {

    State.setTemplate(document.getElementById('MainContainer'));
    State.init(); 

    window.addEventListener("beforeunload", this.BeforeClose);
    window.addEventListener("unload", this.BeforeClose);   

    Scorm.initScormObj();
   
   //console.log(Scorm.pipwerks);
    let scormobj = Scorm.pipwerks.SCORM;
    console.log(scormobj);
    if(!State.debug){

      //ScormProcessInitialize();
      scormobj.version = "1.2";
      //alert(scormobj.version);
      let callSucceeded = scormobj.init();
      console.log("callSucceeded");
      console.log(callSucceeded);
      //let startTimeStamp = new Date();
      let suspend_data = "";
      //let completionStatus = ScormProcessGetValue("cmi.completion_status", true);
      if(callSucceeded){
            let lesson_location_init = scormobj.get("cmi.core.lesson_location");
             //alert("Lesson location: "+lesson_location_init);
            if (lesson_location_init == "unknown" || lesson_location_init == "" || lesson_location_init == null) {  //Si es primera vez que accede lesson location es vacio
                //alert("Entro a generar suspend data");
                    //completionStatus = "incomplete";
                    suspend_data = State.stateToString();
                    console.log(suspend_data);
                    scormobj.set("cmi.core.lesson_location", 1);
                    scormobj.set("cmi.suspend_data", suspend_data);
                    scormobj.save();
            }
            else {
                suspend_data = scormobj.get('cmi.suspend_data')
                State.stringToState(suspend_data);                
            }
          }else{
            swal.fire("Aviso","No conectado, puede navegar pero no se guardará su progreso.",'warning');
          }



        //if (completionStatus == "unknown" || completionStatus == "" || completionStatus == null) {
         // completionStatus = "incomplete";
         // ScormProcessSetValue("cmi.completion_status", completionStatus);
         // ScormProcessCommit();
         // suspend_data = State.stateToString();
         // console.log(suspend_data);
         // ScormProcessSetValue("cmi.suspend_data", suspend_data);
          //ScormProcessSetValue("cmi.success_status", "unknown");
          //ScormProcessCommit();
         // }else{
          //  suspend_data = ScormProcessGetValue("cmi.suspend_data", false);
           // State.stringToState(suspend_data);
          //}
      }

    this.generatetemplate = State.getGenerateTemplate();
    this.generatetemplate.loadTemplate();
    const links = generateMenuApps();
    this.clickLinkApp(links);
  }

  BeforeClose(event){
    if(!State.unloaded){
              let scormobj = Scorm.pipwerks.SCORM;
              scormobj.save();
              scormobj.quit(); 
              //ScormProcessSetValue("cmi.exit", "suspend");
              //ScormProcessCommit();
              //ScormProcessTerminate();
              State.unloaded = true;
           }
           return null;
    }
  
 
  clickLinkApp(links) {
    //window.scrollTo(0, 0);
    const _self = this;

    links.forEach(function (item) {
      item.addEventListener('click', function (e) {
        window.scrollTo(0, 0);
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
          window.scrollTo(0, 0);
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
      swal.fire("Has visto la totalidad del video.","Continúa navegando el curso.",'success');
      
      
      console.log(State.pagesApp)
      if(!State.debug){
          let suspend_data = State.stateToString();
          console.log(suspend_data);
          
          //ScormProcessSetValue("cmi.suspend_data", suspend_data);
          //ScormProcessCommit();
          let scormobj = Scorm.pipwerks.SCORM;
          scormobj.set("cmi.suspend_data", suspend_data);
          scormobj.save();
          if(State.isFinishedModule() && !State.alertModule.includes(parseInt(State.currentApp))){
//if(!this.alertModule.includes(parseInt(currentApp))){
            State.alertModule.push(parseInt(State.currentApp));
 //         }

            swal.fire("¡Felicitaciones!","Has visto el contenido de esta aplicación. Continúa navegando.",'success');
          }
          if(State.isFinishedCourse()){
            console.log("scormcompleted");
            swal.fire("¡Felicitaciones!","Has visto todo el contenido de este nivel.",'success');
            scormobj.set("cmi.core.lesson_status", "completed");
            scormobj.save();
//            ScormProcessSetValue("cmi.completion_status", "completed");
            //ScormProcessSetValue("cmi.success_status", "passed");
            //ScormProcessCommit();
          }
      }
    }

  

}