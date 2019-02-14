import State from './State';
import generatePercentage from './generatePercentage';
import generateMenuAppsInnerPage from  './generateMenuAppsInnerPage';
import {
  ScormProcessInitialize,
  ScormProcessGetValue,
  ScormProcessSetValue,
  ScormProcessCommit
} from './ScormFunction';


export default function () {

    document.getElementById('MyVideo').addEventListener('ended',EndedVideo,false);
    function EndedVideo(e) {
        //alert("Terminpe");
      State.setViewedVideoApp(State.getCurrentApp(),State.getLastPageCurrentApp(),State.getLastPageCurrentApp());
      let menulink = document.getElementById('menu-video-'+State.getLastPageCurrentApp());
      let numberlink = document.getElementById('number-video-'+State.getLastPageCurrentApp());
      menulink.classList.add('visited');
      numberlink.classList.add('visited');
      generatePercentage();
      let menuAppInnerPage = generateMenuAppsInnerPage();
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
            if(!State.debug)
            ScormProcessCommit();
          }
      }
        //alert("Hola terminé");
    }
  }