

let nFindAPITries = 0;
let API = null;
let maxTries = 500;

let SCORM_TRUE = "true";
let SCORM_FALSE = "false";
let SCORM_NO_ERROR = "0";

let terminateCalled = false;


let initialized = false;


function ScanForAPI(win) {
  while ((win.API_1484_11 == null) && (win.parent != null)
  && (win.parent != win))
  {
    nFindAPITries++;
    if (nFindAPITries > maxTries)
    {
      return null;
    }
    win = win.parent;
  }
  return win.API_1484_11;
}

function GetAPI(win) {
  if ((win.parent != null) && (win.parent != win))
  {
    API = ScanForAPI(win.parent);
  }
  if ((API == null) && (win.opener != null))
  {
    API = ScanForAPI(win.opener);
  }
}

function ScormProcessInitialize(){
  let result;

  GetAPI(window);

  if (API == null){
    alert("ERROR - No se logró establecer conexión con el LMS .\n\nSus resultados y navegación no serán guardados.");
    return;
  }

  result = API.Initialize("");

  if (result == SCORM_FALSE){
    let errorNumber = API.GetLastError();
    let errorString = API.GetErrorString(errorNumber);
    let diagnostic = API.GetDiagnostic(errorNumber);

    let errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;

    alert("Error - No hay comunicación con el LMS.\n\nSus datos de navegación no serán guardados.\n\n" + errorDescription);
    return;
  }

  initialized = true;
}

function ScormProcessTerminate(){

  let result;

  //Don't terminate if we haven't initialized or if we've already terminated
  if (initialized == false || terminateCalled == true){return;}

  result = API.Terminate("");

  terminateCalled = true;

  if (result == SCORM_FALSE){
    let errorNumber = API.GetLastError();
    let errorString = API.GetErrorString(errorNumber);
    let diagnostic = API.GetDiagnostic(errorNumber);

    let errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;

    alert("Error - No se logró terminar la comunicación con el LMS.\n\n" + errorDescription);
    return;
  }
}

function ScormProcessGetValue(element, checkError){

  let result;

  if (initialized == false || terminateCalled == true){return;}

  result = API.GetValue(element);

  if (checkError == true && result == ""){

    let errorNumber = API.GetLastError();

    if (errorNumber != SCORM_NO_ERROR){
      let errorString = API.GetErrorString(errorNumber);
      let diagnostic = API.GetDiagnostic(errorNumber);

      let errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;

      alert("Error - No se logró obtener el valor del LMS.\n\n" + errorDescription);
      return "";
    }
  }

  return result;
}

function ScormProcessSetValue(element, value){

  let result;

  if (initialized == false || terminateCalled == true){return;}

  result = API.SetValue(element, value);

  if (result == SCORM_FALSE){
    let errorNumber = API.GetLastError();
    let errorString = API.GetErrorString(errorNumber);
    let diagnostic = API.GetDiagnostic(errorNumber);

    let errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;

    alert("Error - No se logró guardar el valor en el LMS.\n\n" + errorDescription);
    return;
  }

}

function ScormProcessCommit(){

  let result;

  result = API.Commit("");

  if (result == SCORM_FALSE){
    let errorNumber = API.GetLastError();
    let errorString = API.GetErrorString(errorNumber);
    let diagnostic = API.GetDiagnostic(errorNumber);

    let errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;

    alert("Error - No se logró invocar Commit.\n\n" + errorDescription);
    return;
  }
}

export {
  ScanForAPI, GetAPI, ScormProcessInitialize, ScormProcessTerminate,ScormProcessGetValue,ScormProcessSetValue,
  ScormProcessCommit,
}
