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
    swal.fire("Aviso","Version 26feb",'warning');

      console.log("Constructor 26febrero");
     const _self=this;
     let loader = document.getElementById('loader-xertica');
     loader.classList.add('visible');
    setTimeout(function(){ 

      
    console.log("StateCreate");   
    State.setTemplate(document.getElementById('MainContainer'));
    State.init(); 
    //console.log("StateCreate");   

     if (window.addEventListener) {  // all browsers except IE before version 9
            window.addEventListener("beforeunload", _self.BeforeClose);
            window.addEventListener("unload", _self.BeforeClose);
        }
        else {
            if (window.attachEvent) {   // IE before version 9
                window.attachEvent("beforeunload", _self.BeforeClose);
                
            }
        }

       

    Scorm.initScormObj();
   
   //console.log(Scorm.pipwerks);
    let scormobj = Scorm.pipwerks.SCORM;
    console.log("SCORMOBJ");   
    console.log(scormobj);
    if(!State.debug){

      //ScormProcessInitialize();
      scormobj.version = "1.2";
      //alert(scormobj.version);
      let callSucceeded = scormobj.init();
      console.log("callSucceeded MAIN");
      console.log(callSucceeded);
      //let startTimeStamp = new Date();
      let suspend_data = "";
      //let completionStatus = ScormProcessGetValue("cmi.completion_status", true);
      if(callSucceeded){
            let lesson_location_init = scormobj.get("cmi.core.lesson_location");
             //alert("Lesson location: "+lesson_location_init);
             console.log("Conectado a LMS");
            if (lesson_location_init == "unknown" || lesson_location_init == "" || lesson_location_init == null) {  //Si es primera vez que accede lesson location es vacio
                //alert("Entro a generar suspend data");
                    //completionStatus = "incomplete";
                    suspend_data = State.stateToString();
                    console.log("Conectado a la lms 1a vez");
                    console.log(suspend_data);
                    scormobj.set("cmi.core.lesson_location", 1);
                    scormobj.set("cmi.suspend_data", suspend_data);
                    scormobj.save();
            }
            else {
                suspend_data = scormobj.get('cmi.suspend_data');
                State.stringToState(suspend_data);                
            }
          }else{

             
            console.log("No conectado");
            swal.fire("Aviso","No conectado, puede navegar pero no se guardará su progreso.",'warning');
            //console.log("GETTING SUSPEND DATA");
            //suspend_data = scormobj.get('cmi.suspend_data');
            //State.stringToState(suspend_data);  
            //console.log(suspend_data);
            //console.log("END GETTING SD");
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

    _self.generatetemplate = State.getGenerateTemplate();
    _self.generatetemplate.loadTemplate();
    const links = generateMenuApps();
    console.log("%%%%");
    console.log(links);
    _self.clickLinkApp(links);

    let loader = document.getElementById('loader-xertica');
     loader.classList.remove('visible');

  }, 2000);

   } 

  BeforeClose(event){
    if(!State.unloaded){
              let scormobj = Scorm.pipwerks.SCORM;
              scormobj.save();
              scormobj.quit(); 
              //swal.fire("Aviso","Desconectado de LMS",'warning');
              //ScormProcessSetValue("cmi.exit", "suspend");
              //ScormProcessCommit();
              //ScormProcessTerminate();
              State.unloaded = true;
           }
           //swal.fire("Aviso","Unladed true",'warning');
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
        _self.saveProgress();
          document.getElementById('MyVideo').addEventListener('ended',function() {
              _self.EndedVideo(_self);
          });
        
      });
    });
  }


  clickLinkMainButton(){
    const _self = this;
    let MainButton = document.getElementById('MainButton');
    let Icon2 = document.getElementById('Icon2');
    MainButton.addEventListener('click', function (e) {
        e.preventDefault();
        _self.generatetemplate.loadTemplate();
        const links = generateMenuApps();
        _self.clickLinkApp(links);
      });

    Icon2.addEventListener('click',function(e){
         if(!State.unloaded){
              let scormobj = Scorm.pipwerks.SCORM;
              scormobj.save();
              scormobj.quit(); 
              swal.fire("Aviso","Desconectado de LMS",'warning');
              //ScormProcessSetValue("cmi.exit", "suspend");
              //ScormProcessCommit();
              //ScormProcessTerminate();
              State.unloaded = true;
           }
           //swal.fire("Aviso","Unladed true",'warning');
           return null;
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
        _self.saveProgress();
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
          _self.saveProgress();
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
          _self.saveProgress();
          document.getElementById('MyVideo').addEventListener('ended',function() {
              _self.EndedVideo(_self);
          });
          
        });
      });


  }


  saveProgress(){
    if(!State.debug){
          let suspend_data = State.stateToString();
          console.log("Called saveProgress");
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

            swal.fire("¡Felicitaciones!","Obeserva este contenido para finalizar el módulo.",'success');
          }

          if(State.isFinishedCourse()){
            console.log("scormcompleted");
            swal.fire("¡Felicitaciones!","Observando este contenido habrás visto todo el contenido de este nivel.",'success');
            scormobj.set("cmi.core.lesson_status", "completed");
            scormobj.save();
//            ScormProcessSetValue("cmi.completion_status", "completed");
            //ScormProcessSetValue("cmi.success_status", "passed");
            //ScormProcessCommit();
          }
      }
  }

  EndedVideo(_self) {
      
      State.setViewedVideoApp(State.getCurrentApp(),State.getLastPageCurrentApp(),State.getLastPageCurrentApp());
      /*let menulink = document.getElementById('menu-video-'+State.getLastPageCurrentApp());
      let numberlink = document.getElementById('number-video-'+State.getLastPageCurrentApp());
      menulink.classList.add('visited');
      numberlink.classList.add('visited');
      generatePercentage();
      let menuAppInnerPage = generateMenuAppsInnerPage();
      
      _self.clickLinkAppCourse();
      swal.fire("Has visto la totalidad del video.","Continúa navegando el curso.",'success');
      */
      
      console.log(State.pagesApp);

      if(!State.debug){
          let suspend_data = State.stateToString();
          console.log(suspend_data);
          
          //ScormProcessSetValue("cmi.suspend_data", suspend_data);
          //ScormProcessCommit();
          let scormobj = Scorm.pipwerks.SCORM;
          scormobj.set("cmi.suspend_data", suspend_data);
          scormobj.save();
          
         /* if(State.isFinishedModule() && !State.alertModule.includes(parseInt(State.currentApp))){
//if(!this.alertModule.includes(parseInt(currentApp))){
            State.alertModule.push(parseInt(State.currentApp));
 //         }

            swal.fire("¡Felicitaciones!","Has visto el contenido de esta aplicación. Continúa navegando.",'success');
          }*/

          /*if(State.isFinishedCourse()){
            console.log("scormcompleted");
            swal.fire("¡Felicitaciones!","Has visto todo el contenido de este nivel.",'success');
            scormobj.set("cmi.core.lesson_status", "completed");
            scormobj.save();
//            ScormProcessSetValue("cmi.completion_status", "completed");
            //ScormProcessSetValue("cmi.success_status", "passed");
            //ScormProcessCommit();
          }*/
      }
    }

  

}