

var nFindAPITries = 0;
var API = null;
var maxTries = 500;


export {
  ScanForAPI,GetAPI, ScormProcessInitialize, ScormProcessTerminate,ScormProcessGetValue,ScormProcessSetValue,
  ScormProcessCommit,
}
function ScanForAPI(win)
{
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

function GetAPI(win)
{
  if ((win.parent != null) && (win.parent != win))
  {
    API = ScanForAPI(win.parent);
  }
  if ((API == null) && (win.opener != null))
  {
    API = ScanForAPI(win.opener);
  }
}

var SCORM_TRUE = "true";
var SCORM_FALSE = "false";
var SCORM_NO_ERROR = "0";

var terminateCalled = false;

//Track whether or not we successfully initialized.
var initialized = false;

function ScormProcessInitialize(){
  var result;

  GetAPI(window);

  if (API == null){
    alert("ERROR - No se logró establecer conexión con el LMS .\n\nSus resultados y navegación no serán guardados.");
    return;
  }

  result = API.Initialize("");

  if (result == SCORM_FALSE){
    var errorNumber = API.GetLastError();
    var errorString = API.GetErrorString(errorNumber);
    var diagnostic = API.GetDiagnostic(errorNumber);

    var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;

    alert("Error - No hay comunicación con el LMS.\n\nSus datos de navegación no serán guardados.\n\n" + errorDescription);
    return;
  }

  initialized = true;
}

function ScormProcessTerminate(){

  var result;

  //Don't terminate if we haven't initialized or if we've already terminated
  if (initialized == false || terminateCalled == true){return;}

  result = API.Terminate("");

  terminateCalled = true;

  if (result == SCORM_FALSE){
    var errorNumber = API.GetLastError();
    var errorString = API.GetErrorString(errorNumber);
    var diagnostic = API.GetDiagnostic(errorNumber);

    var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;

    alert("Error - No se logró terminar la comunicación con el LMS.\n\n" + errorDescription);
    return;
  }
}

function ScormProcessGetValue(element, checkError){

  var result;

  if (initialized == false || terminateCalled == true){return;}

  result = API.GetValue(element);

  if (checkError == true && result == ""){

    var errorNumber = API.GetLastError();

    if (errorNumber != SCORM_NO_ERROR){
      var errorString = API.GetErrorString(errorNumber);
      var diagnostic = API.GetDiagnostic(errorNumber);

      var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;

      alert("Error - No se logró obtener el valor del LMS.\n\n" + errorDescription);
      return "";
    }
  }

  return result;
}

function ScormProcessSetValue(element, value){

  var result;

  if (initialized == false || terminateCalled == true){return;}

  result = API.SetValue(element, value);

  if (result == SCORM_FALSE){
    var errorNumber = API.GetLastError();
    var errorString = API.GetErrorString(errorNumber);
    var diagnostic = API.GetDiagnostic(errorNumber);

    var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;

    alert("Error - No se logró guardar el valor en el LMS.\n\n" + errorDescription);
    return;
  }

}

function ScormProcessCommit(){

  var result;

  result = API.Commit("");

  if (result == SCORM_FALSE){
    var errorNumber = API.GetLastError();
    var errorString = API.GetErrorString(errorNumber);
    var diagnostic = API.GetDiagnostic(errorNumber);

    var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;

    alert("Error - No se logró invocar Commit.\n\n" + errorDescription);
    return;
  }
}
