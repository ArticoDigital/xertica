import swal from 'sweetalert2';
import $ from 'jquery';
import { course } from './p1';

const debug = true;

let progress = {
  module: {
    id: 0,
    page: 0,
  },
  sawPercentage: [],
};


let total_pages; //Total de paginas del modulo actual
let total_pages_general; //Ultima pagina de cada modulo
let modulo;
let total_pages_mods = [6, 28, 30, 29]; /*-- Modificar éste valor de acuerdo al número total de páginas --*/
let posmenuinicial = [1, 7, 35, 65]; //Posiciones donde va cada menu.

let flagmsg = [0, 0, 0, 0]; //Lleva si ha mostrado o no el mensaje de final de modulo, para no mostrar mas de una vez por mod.
let total_pagers_bar = total_pages;
//var no_cero = 0;
//var slide = false;
let points = 0;
let show_finish_msg = false;
let processedUnload = false;

let intab = false; //evalua si esta en un tab
//var reachedEnd = false;

let vistapagina = false;
//bookmark  lleva la pagina actual
//var suspend_data = "paginas::1,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0::pos_evaluaciones::3,4,8,12,4::evaluaciones::0,0,0,0,0::porcentaje::20";
let completionStatus = 'Incomplete';
let suspend_data = '';
let separador = '::';
let suspend_data_visited = new Array();
let suspend_data_pos_eval;
let suspend_data_eval;
let suspend_data_porcentaje;
let activity_flag = false; //letiable que lleva true si esta en una actividad que no ha realizado el usuario
let array_menu; //menu lateral, paginas que debe ir
let lastclass = []; //Ultiima clase del estado del cono del menu
let button_pressed = false;


document.querySelector('#nextSlide')
  .addEventListener('click', next);

function next(e) {
  e.preventDefault();

}


function getJson(pagemodule) { //Para obtener la estructura y menus de cada modulo

  $.ajax({
    url: './structure' + pagemodule + '.json',
    async: false,
    dataType: 'json',
    success: function (data) {
      titulo = data.title;
      //hijos = data.slides;
      menu = data.thems;
      datapages = data.pages;
      array_menu = datapages;
      total_pages = total_pages_mods[data.modulo]; //CAntidad de pagnas del modulo actual
      total_pages_general = posmenuinicial[modulo] + total_pages_mods[modulo];
      fn_generarmenu(); //Para generar el menu de cada modulo

    }
  });
  //alert(total_pages_general);
}


function openmenu() {
  $('.menu')
    .animate({
      left: '0%'
    }, 500);
  $('.background-alpha')
    .animate({
      width: '100%'
    }, 300);

}

function closemenu() {
  $('.menu')
    .animate({
      left: '-389px'
    }, 500);
  $('.background-alpha')
    .animate({
      width: '0%'
    }, 300);
}


function goToPage(currentPage) {
  const numberApps = Object.keys(course);
  numberApps.forEach(function (e) {
    progress.sawPercentage[e] = 0;
  });

  console.log(progress.sawPercentage);
  document.querySelector('.content1').innerHTML = course[0].videos[1].name;
  document.querySelector('#Video')
    .setAttribute('src', 'https://drive.google.com/file/d/1CWurOZKJ110C04O1UU57yBrbD5ofD0ij/preview');
  ;
  console.log();

  //suspend_data_visited[currentPage]=1;
  let igp = currentPage;
  let no_cerogp = igp;
  if (igp <= 9) {
    igp = String('0' + igp);
  }

  //$('.content1').text('<article id=\"page_' + currentPage + '\" class=\"page\"></article>');

}

function evaluacion_arraypos_eval(pagina) {
  //alert(pagina);
  var paginatext = pagina.toString();
  var evalarraypos = suspend_data_pos_eval.indexOf(paginatext);
  return evalarraypos;
}


function doStart() {
  let startTimeStamp = new Date();
  if (debug) {
    page = 0;


    fn_first_suspend_data();
    suspend_data_to_arrays();
    goToPage(page);

  } else {

    //record the time that the learner started the SCO so that we can report the total time


    //initialize communication with the LMS
    ScormProcessInitialize();

    //it's a best practice to set the completion status to incomplete when
    //first launching the course (if the course is not already completed)
    var completionStatus = ScormProcessGetValue('cmi.completion_status', true);
    if (completionStatus == 'unknown' || completionStatus == '' || completionStatus == null) {
      completionStatus = 'Incomplete';
      ScormProcessSetValue('cmi.completion_status', 'incomplete');
      if (!debug) {
        ScormProcessCommit();
      }
    }

    if (completionStatus == 'completed') {
      $('.progress_bar .badged')
        .addClass('finished');
      $('.badged .badged_icon .badged_icon_on')
        .fadeIn('slow');
    }

    //see if the user stored a bookmark previously (don't check for errors
    //because cmi.location may not be initialized
    var bookmark = ScormProcessGetValue('cmi.location', false);
    var first_suspend_data = ScormProcessGetValue('cmi.suspend_data', false);

    //if there isn't a stored bookmark, start the user at the first page
    if (bookmark == '') {
      page = 0;
      continuarStart(first_suspend_data);
    } else {

      swal({
          title: 'Aviso',
          text: '¿Deseas iniciar desde el último lugar donde estuviste previamente?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: '¡Si!',
          cancelButtonText: 'No'
        },
        function (isConfirm) {
          if (isConfirm) {

            page = parseInt(bookmark, 10);
            modulo = getmodulepage(page); //asigna el numero de modulo de acuerdo a la pagina
            //modulo = $(this).data('page');

            getJson(modulo);
            continuarStart(first_suspend_data);
          } else {

            page = 0;
            continuarStart(first_suspend_data);
          }
        });

      /*if (confirm("Quieres iniciar desde el último lugar donde estuviste previamente?")) {
          page = parseInt(bookmark, 10);

      }
      else {
          page = 0;

      }
      */
    }

  }
}

function getmodulepage(bookmarkpage) {
  if (bookmarkpage > 0) {
    for (i = 0; i < posmenuinicial.length - 1; i++) {
      if (bookmarkpage >= posmenuinicial[i] && bookmarkpage < posmenuinicial[i + 1]) {
        return i;
      }
    }
    return posmenuinicial.length - 1;
  }
  return 0;
}

function fn_prev_slide() {
  //if (page <= (total_pages_general -1) && !button_pressed) {
  //alert(array_menu[0]);

  if (page > array_menu[0] && page > 0 && intab == false) {

    page -= 1;
    goToPage(page);


    $('.next_button')
      .removeClass('next_button_off');

    document.location.hash = 'pagina_' + page;


  }

}

function fn_next_slide() {
  if (page > 0 && intab == false) {
    //alert("fsdf");

    if (page < (total_pages_general - 1) && !button_pressed) {

      button_pressed = true;
      if (activity_flag == false) {
        page += 1;
        if (page == total_pages_general - 1) {
          //alert("ultima pagina->"+suspend_data_visited);
          var intervalosuma = suma(posmenuinicial[modulo], total_pages_general, suspend_data_visited);
          //alert(intervalosuma+"IGUALE/"+total_pages_mods[modulo])

          if (intervalosuma >= total_pages_mods[modulo] - 1) {
            goToPage(page);
          } else {
            page -= 1;
            swal({
                title: 'Importante',
                text: 'No has visto la totalidad del contenido del módulo, termina de ver todo el contenido para finalizar. Navega en el menú los items que no están en naranja.',
                type: 'warning',

                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Aceptar',
              },
              function (isConfirm) {
                if (isConfirm) {
                  $('.menu')
                    .animate({
                      left: '0%'
                    }, 500);
                  $('.menu_barrier')
                    .fadeIn('normal');
                }
              });
          }
        } else if (page < total_pages_general - 1) {

          goToPage(page);

        }


      } else {
        swal({
          title: 'Importante',
          text: 'Debes realizar esta actividad para continuar',
          timer: 3000,
          showConfirmButton: false
        });
        button_pressed = false;
      }
    } else {
      //alert("meni")
      page = 0;
      goToPage(page);

    }
  }
}

function fn_generarmenu() {
  $('#menuitems')
    .empty();
  $('#menuitems')
    .append('<div id="nombremodulo">' + titulo + '</div>');
  $('#titulomodulo #texto h1')
    .text(titulo);


  $('#menuitems')
    .append('<ul class="fa-ul" id="modulocontenido"></ul>');
  $.each(menu, function (k, v) {
    $('#modulocontenido')
      .append('<li><a href="javascript:void(0);" data-page="' + datapages[k] + '"><span class="fa-li"><i class="fas fa-check-circle" id="tema' + k + '"></i></span>' + menu[k] + '</a></li></p></li>');
  });

  for (i = 0; i < array_menu.length; i++) {

    lastclass[i] = 0;
  }
  menubehave(); //Agrega la funcioanlidad de los enlaces


}


function continuarStart(fstSD) {
  if (fstSD == '') {
    fn_first_suspend_data();
  } else {
    suspend_data = fstSD;
  }
  suspend_data_to_arrays();

  //secuenciainicial();
  goToPage(page);

}

function procesarPorcentajeSuspendData() {
  var pag_visitadas = suma(0, suspend_data_visited.length, suspend_data_visited);
  var porcentaje = (pag_visitadas / (suspend_data_visited.length));


  ScormProcessSetValue('cmi.progress_measure', porcentaje.toString());
  if (debug == false) {
    ScormProcessCommit();
    if (porcentaje == 1) {
      scormcompleted();
    }
  }

  suspend_data_porcentaje = parseInt(porcentaje * 100, 10);

}

function procesarCalificacion(numeroevaluacion, puntajeposible, puntajeobtenido) {
  //alert(numeroevaluacion+" "+ puntajeposible+" "+puntajeobtenido);
  var alertacalificion = '';
  if (puntajeobtenido > 0) {

    //Se debe tener en cuenta que se debe habilitar el boton continuar para el usuario si ha respondio.
    //Se debe mostrar la calificacion pocentual al usuario
    //Se debe enviar el resultado por el suspend_data.
    //Se debe actualizar el porcentaje de la calificacio total de acuerdo a la ponderacion
    var porcentaje = (puntajeobtenido / puntajeposible) * 100;
    var activity_porcentaje = parseInt(porcentaje, 10);
    alertacalificion = 'Para esta actividad has obtenido un puntaje de: ' + activity_porcentaje + '%.';

    if (activity_porcentaje > 60) {
      swal({
        title: '¡Bien!',
        text: alertacalificion,
        type: 'success',
        confirmButtonText: 'Aceptar'
      });
    } else {
      swal({
        title: '¡Intentalo de nuevo!',
        text: alertacalificion,
        type: 'error',
        confirmButtonText: 'Aceptar'
      });

    }

    var porcentajeprevio = parseInt(suspend_data_eval[numeroevaluacion - 1], 10);
    //alert(suspend_data_visited);
    if (activity_porcentaje > porcentajeprevio) {
      suspend_data_eval[numeroevaluacion - 1] = activity_porcentaje;
      suspend_data_visited[suspend_data_pos_eval[numeroevaluacion - 1]] = 1;
      //alert(suspend_data_visited);
      var score_ponderado = fn_calcular_score();
      score_ponderado = parseInt(score_ponderado, 10);
      setSuspendData();
      setScore(score_ponderado);
      setmenu_states();
      set_percentage();
    }
    activity_flag = false;
    $('.next_button')
      .removeClass('next_button_off');
  } else {
    swal({
      title: '¡Intentalo de nuevo!',
      text: 'Intentalo nuevamente para poder continuar.',
      type: 'error',
      confirmButtonText: 'Aceptar'
    });

  }


  /*var pag_visitadas=suma(0,suspend_data_visited.length);
  var porcentaje=(pag_visitadas/(total_pages+1))*100;
  suspend_data_porcentaje=parseInt(porcentaje,10);
  */
}

function fn_calcular_score() {

  var sumatotalscore = suma(0, suspend_data_eval.length, suspend_data_eval);
  //alert(sumatotalscore + " Total de los score");
  return sumatotalscore / suspend_data_eval.length;
}

function fn_first_suspend_data() {
  if (suspend_data == '') {
    suspend_data_visited[0] = 1;
    for (var j = 1; j <= suma(0, total_pages_mods.length, total_pages_mods); j++) {
      suspend_data_visited[j] = 0; //Paginas visitadas en 1.
    }
    //alert(suspend_data_visited);
    suspend_data_pos_eval = [33, 63, 92]; //Posicion de las evaluaciones
    suspend_data_eval = [0, 0, 0]; //Calificacion de las evaluaciones
    suspend_data_porcentaje = 0; //Porcentaje navegado del curso

  }
  arrays_to_suspend_data();

}

function arrays_to_suspend_data() {
  var string_SD_visited = suspend_data_visited.toString();
  var string_SD_pos_eval = suspend_data_pos_eval.toString();
  var string_SD_eval = suspend_data_eval.toString();
  suspend_data = 'paginas' + separador + string_SD_visited;
  suspend_data += separador + 'pag_evaluaciones' + separador + string_SD_pos_eval;
  suspend_data += separador + 'calificacion_evaluaciones' + separador + string_SD_eval;
  suspend_data += separador + 'porcentaje_visto' + separador + suspend_data_porcentaje;
  console.log(suspend_data);
}

function suspend_data_to_arrays() { //Convertir string a arreglo.
  //Forma con un solo arreglo, toma el sisppend data y lo convierte a datos array para manipular dentro del curso.
  //var suspend_data = "paginas::1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1::pos_evaluaciones::3,4,8,12,4::evaluaciones::0,0,0,0,0::porcentaje::20";
  var arreglo = suspend_data.split(separador);
  suspend_data_visited = arreglo[1].split(','); //Tomar cada posicion de datos (impares) y la conviertir en arreglo. ejemplo datos de evaluaciones
  suspend_data_pos_eval = arreglo[3].split(',');
  suspend_data_eval = arreglo[5].split(',');
  suspend_data_porcentaje = arreglo[7].split(',');

  //alert("LONG SUSPEND DATA ARRAY: "+ suspend_data_visited.length);
  //document.getElementById("demo2").innerHTML = evaluaciones[0]; //Valor de evaluacion 1.

}

function setSuspendData() {

  arrays_to_suspend_data();
  ScormProcessSetValue('cmi.suspend_data', suspend_data);
  if (!debug) {
    ScormProcessCommit();
  }
}

function setmenu_states() {
  var star1 = 'naranja';
  var star2 = 'fa-star-half-o';
  var star3 = 'fa-star-o';
  var hand = 'fa-hand-o-left';


  //$('#menu'+nommenu).addClass('fa-star-half-o');
  var ini = 0;
  var fin = 0;
  for (var i = 0; i < array_menu.length; i++) {
    ini = array_menu[i];
    if ((i + 1) >= array_menu.length) {
      fin = total_pages_general;
    } else {
      fin = array_menu[i + 1];
    }
    //alert(suspend_data_visited);
    var intervalosuma = suma(ini, fin, suspend_data_visited);
    var diferencia = fin - ini;

    //alert("ini:"+ini+" fin:"+fin);
    //alert("Suma de vector:"+intervalosuma +" DIFERENCIAinten: "+diferencia);
    //alert(lastclass);
    $('#tema' + i)
      .removeClass(lastclass[i]);

    if (intervalosuma > 0) {
      if (intervalosuma == diferencia) {
        $('#tema' + i)
          .addClass(star1);
        lastclass[i] = star1;
      } else {
        $('#tema' + i)
          .addClass(star2);
        lastclass[i] = star2;
      }
    } else {
      $('#tema' + i)
        .addClass(star3);
      lastclass[i] = star3;
    }

    //$('#menu'+i).addClass('fa-star-half-o');

  }
  //$('#menu'+nommenu).addClass('fa-hand-o-left');

}

function set_percentage() {
  //$('#menu'+nommenu).addClass('fa-star-half-o');
  var ini = posmenuinicial[modulo];
  var fin = total_pages_general;

  var intervalosuma = suma(ini, fin, suspend_data_visited);
  var diferencia = fin - ini;
  /*
            alert("modulo"+modulo+" array_menu " +array_menu);
            alert("ini:"+ini+" fin:"+fin);
            alert("Suma de vector:"+intervalosuma +" DIFERENCIAinten: "+diferencia);
            var suspend_data_eval_number=parseInt(suspend_data_eval[posicioneval],10);
  */
  porcentaje = parseInt(intervalosuma / diferencia * 100);
  $('#porcentaje-avance-texto')
    .text(String('Avance ' + porcentaje + '%'));
  $('#porcentaje-avance-barra')
    .width(porcentaje + '%');
  //$(this).css('left',);


}


function suma(ini, fin, vector) {
  var sumatotal = 0;

  for (var i = ini; i < fin; i++) {
    sumatotal += parseInt(vector[i], 10);
  }
  return sumatotal;
}


function showcurrentpage() {
  //alert(page,array_menu[0]);
  txtcurrpage = page - (array_menu[0] - 1);
  totalpages = total_pages;

  var numpage = document.getElementById('number_page');
  var cadenanumpage = txtcurrpage + ' de ' + totalpages;
  numpage.innerHTML = cadenanumpage;
}


function setScore(score) {
  if (!debug) {
    ScormProcessSetValue('cmi.score.min', 0);
    ScormProcessSetValue('cmi.score.max', 100);
    ScormProcessSetValue('cmi.score.raw', score);
    ScormProcessSetValue('cmi.score.scaled', score / 100);

    if (score < 60) {
      ScormProcessSetValue('cmi.success_status', 'failed');
    } else {
      ScormProcessSetValue('cmi.success_status', 'passed');
    }
    if (!debug) {
      ScormProcessCommit();
    }
    return true;
  }
}


function getCurrentPage() {
  return page;
}

function setLocation(locationpage) {
  ScormProcessSetValue('cmi.location', locationpage);
  if (!debug) {
    ScormProcessCommit();
  }
  return true;

}


function scormcompleted() {
  completionStatus = 'Completed';
  console.log('scormcompleted');
  ScormProcessSetValue('cmi.completion_status', 'completed');
  if (!debug) {
    ScormProcessCommit();
  }


}


function doUnload(pressedExit) {

  //don't call this function twice
  if (processedUnload == true) {
    return;
  }

  processedUnload = true;
  //record the session time
  var endTimeStamp = new Date();
  var totalMilliseconds = (endTimeStamp.getTime() - startTimeStamp.getTime());
  var scormTime = ConvertMilliSecondsIntoSCORM2004Time(totalMilliseconds);

  ScormProcessSetValue('cmi.session_time', scormTime);


  //record the session time
  //always default to saving the runtime data in this example
  ScormProcessSetValue('cmi.exit', 'suspend');
  if (!debug) {
    ScormProcessCommit();
  }
  ScormProcessTerminate();
}


function ConvertMilliSecondsIntoSCORM2004Time(intTotalMilliseconds) {

  var ScormTime = '';

  var HundredthsOfASecond; //decrementing counter - work at the hundreths of a second level because that is all the precision that is required

  var Seconds; // 100 hundreths of a seconds
  var Minutes; // 60 seconds
  var Hours; // 60 minutes
  var Days; // 24 hours
  var Months; // assumed to be an "average" month (figures a leap year every 4 years) = ((365*4) + 1) / 48 days - 30.4375 days per month
  var Years; // assumed to be 12 "average" months

  var HUNDREDTHS_PER_SECOND = 100;
  var HUNDREDTHS_PER_MINUTE = HUNDREDTHS_PER_SECOND * 60;
  var HUNDREDTHS_PER_HOUR = HUNDREDTHS_PER_MINUTE * 60;
  var HUNDREDTHS_PER_DAY = HUNDREDTHS_PER_HOUR * 24;
  var HUNDREDTHS_PER_MONTH = HUNDREDTHS_PER_DAY * (((365 * 4) + 1) / 48);
  var HUNDREDTHS_PER_YEAR = HUNDREDTHS_PER_MONTH * 12;

  HundredthsOfASecond = Math.floor(intTotalMilliseconds / 10);

  Years = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_YEAR);
  HundredthsOfASecond -= (Years * HUNDREDTHS_PER_YEAR);

  Months = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_MONTH);
  HundredthsOfASecond -= (Months * HUNDREDTHS_PER_MONTH);

  Days = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_DAY);
  HundredthsOfASecond -= (Days * HUNDREDTHS_PER_DAY);

  Hours = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_HOUR);
  HundredthsOfASecond -= (Hours * HUNDREDTHS_PER_HOUR);

  Minutes = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_MINUTE);
  HundredthsOfASecond -= (Minutes * HUNDREDTHS_PER_MINUTE);

  Seconds = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_SECOND);
  HundredthsOfASecond -= (Seconds * HUNDREDTHS_PER_SECOND);

  if (Years > 0) {
    ScormTime += Years + 'Y';
  }
  if (Months > 0) {
    ScormTime += Months + 'M';
  }
  if (Days > 0) {
    ScormTime += Days + 'D';
  }

  //check to see if we have any time before adding the "T"
  if ((HundredthsOfASecond + Seconds + Minutes + Hours) > 0) {

    ScormTime += 'T';

    if (Hours > 0) {
      ScormTime += Hours + 'H';
    }

    if (Minutes > 0) {
      ScormTime += Minutes + 'M';
    }

    if ((HundredthsOfASecond + Seconds) > 0) {
      ScormTime += Seconds;

      if (HundredthsOfASecond > 0) {
        ScormTime += '.' + HundredthsOfASecond;
      }

      ScormTime += 'S';
    }

  }

  if (ScormTime == '') {
    ScormTime = '0S';
  }

  ScormTime = 'P' + ScormTime;

  return ScormTime;
}

function behaviorscero() {
  //var citrus = fruits.slice(2, 4);

  //Ocultar header y footer en la página 0
  $('header')
    .hide();
  $('footer')
    .hide();
  $('#menuitems')
    .empty();

  //Estilos para la página 0
  $('body')
    .addClass('pagina-0');


  $('.menuppal .botonmenuppal')
    .on('click', function (e) {
      e.preventDefault();
      modulo = $(this)
        .data('page');
      //progress.theme = page;
      getJson(modulo);


      if (posmenuinicial[page] < progress.posicionactualmodulo[page]) {
        page = progress.posicionactualmodulo[modulo];
        goToPage(page);
      } else {
        page = posmenuinicial[modulo];
        goToPage(page);
      }
    });


}

function behaviorsgral() {

  //Quitar estilos de la página 0
  $('body')
    .removeClass('pagina-0');

  //Mostrar header y footer en las páginas diferentes a la 0
  $('header')
    .show();
  $('footer')
    .show();
}


function menubehave() {

  $('.menu ul li a')
    .on('click', function (e) {

      e.preventDefault();

      closemenu();

      page = $(this)
        .data('page');
      //$('#page_' + page).css('display','block');
      goToPage(page);

      //$('.advance_bar').width((page/total_pagers_bar)*100 + '%');


      //$('.prev_button').removeClass('prev_button_off');

      //$('.next_button').removeClass('next_button_off');


      document.location.hash = 'pagina_' + page;

    });
}

export { doStart };


