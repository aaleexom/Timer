var active = false;
var paused = true;
var timeInSeconds = 0;
var hour = 0;
var minutes = 0;
var seconds = 0;
var sound = new Audio('https://aaleexom.github.io/sounds/timer.mp3');
var seriesActivated = false;
var seriesArray = new Array();
var repeticiones = 0;
var bucleInfinito = false;
var counterRepetitionsSize = 0;
var inLiveCounter = 0;
var repetitionCounter = 0;
var finishedFnc = true; 
sound.volume = 0.75;

$("#start").click(function (){
	if (seriesActivated == false){	
		if (active == false){
			timeInSeconds = $("#numberInput").val();
			active = true;
			paused = false;
			$("#reset").prop("disabled", false);
			$("#start").html("<i class=\"fa fa-pause\" aria-hidden=\"true\"></i>");
		} else {
			if (paused == false) {
				paused = true;
				$("#reset").prop("disabled", true);
				$("#start").html("<i class=\"fa fa-play\" aria-hidden=\"true\"></i>");
			} else {
				paused = false;
				$("#reset").prop("disabled", false);
				$("#start").html("<i class=\"fa fa-pause\" aria-hidden=\"true\"></i>");
			}
		}
		timer();
	} else {
		if (active == false) {
			if (finishedFnc == true){
				$("#start").html("<i class=\"fa fa-pause\" aria-hidden=\"true\"></i>");
				$("#reset").prop("disabled", false);
				active = true;
				paused = false;
				getArray();
			}
		} else {
			if (paused == false){
				paused = true;
				$("#reset").prop("disabled", true);
				$("#start").html("<i class=\"fa fa-play\" aria-hidden=\"true\"></i>");
			} else {
				paused = false;
				$("#reset").prop("disabled", false);
				$("#start").html("<i class=\"fa fa-pause\" aria-hidden=\"true\"></i>");
				loopCounter();
			}
			// stopSeries();
		}
	}
});

$("#reset").click(function(){
	stopSeries();
});	

function getArray(){
	var detect = "0123456789;";
	var inputTextPattern = $("#serie").val();
	var allJfalse = false;

	if($("#serie").val() == ""){
		bucleInfinito = true;
	} else {
		bucleInfinito = false;
	}

	for (var i = inputTextPattern.length - 1; i >= 0; i--) {
		var char = inputTextPattern[i];
		for (var j = detect.length - 1; j >= 0; j--) {
			if (char == detect[j]) {
				// console.log("Compatible con la letra " + detect[j] + "\nRompiendo bucle");
				allJfalse = false;
				break;
			} else {
				// console.log("No es compatible con la letra " + detect[j]);
				if (j == 0) {
					allJfalse = true;
				}
			}
		}
		if (allJfalse == true) {
			// console.log("Hay caracteres inválidos");
			invalidChars();
			break;
		} else {
			if (i == 0) {
				// console.log("No hay problemas");
				createArrays();
			}
		}
	}
	// $("#start").html("<i class=\"fa fa-play\" aria-hidden=\"true\"></i>");
	// active = false;
}

function createArrays(){
	seriesArray = new Array();
	var newstr = "";
	var newval = 0;
	var serie = $("#serie").val();

	for (var i = 0; i <= serie.length; i++) {
		if (serie[i] != ";" && i != serie.length){
			newstr += serie[i];
		} else {
			newval = parseInt(newstr);
			// console.log(newval);
			if (newval > 0) {
				seriesArray.push(newval);
			}
			newstr = "";
			newval = 0;
		}
		// console.log("newstr: " +  newstr + "\nnewval: " + newval);
	}
	for (var j = 0; j <= seriesArray.length; j++) {
		// console.log(seriesArray[j]);
	}

	if (seriesArray.length == 0){
		settingsError();
	} else {
		centralSystem();
	}
}

function centralSystem(){
	if ($("#repetitions").val() == ""){
		repetitions = -1;
	} else {
		repetitions = $("#repetitions").val();
	}
	counterRepetitionsSize = seriesArray.length;
	inLiveCounter = 0;
	loopSystem();
}

function loopSystem(){
	finishedFnc = false;
	timeInSeconds = seriesArray[inLiveCounter];
	// console.log(time);
	if (inLiveCounter < counterRepetitionsSize) {
		inLiveCounter++;
		loopCounter();
	} else if (inLiveCounter == counterRepetitionsSize) {
		newRepetition();
	}
	finishSyst();
}

function loopCounter(){
	finishedFnc = false;
	console.log(repetitions);
	// console.log("Executed");
	// console.log(timeInSeconds);
	// console.log("active: " + active + "\npaused: " +  paused + "\ntimeInSeconds: " +  timeInSeconds);
	if (active == true){	
		if (paused == false){
			if (timeInSeconds <= 0) {
				sound.play();
				$("#hour").text("00");
				$("#minutes").text("00");
				$("#seconds").text("00");
				loopSystem();
			} else {
				if (timeInSeconds > 3600){
					hour = parseInt(timeInSeconds / 3600);
				}
				if (timeInSeconds > 60){
					minutes = parseInt((timeInSeconds - (hour * 3600)) / 60);
					// console.log("Actualizar minutos");
				}
				if (timeInSeconds >= 0) {
					if (timeInSeconds < 60) {
						minutes = 0;
					}
					seconds = timeInSeconds - ((hour * 3600) + (minutes * 60));
					// console.log("Actualizar segundos");
				}

				if (hour.toString().length < 2){
					hour = "0" + hour;
				}
				if (minutes.toString().length < 2){
					minutes = "0" + minutes;
				}
				if (seconds.toString().length < 2){
					seconds = "0" + seconds;
				}

				$("#hour").text(hour);
				$("#minutes").text(minutes);
				$("#seconds").text(seconds);
				timeInSeconds--;
				// console.log("Horas: " + hour + "\nMinutos: " + minutes + "\nSegundos: " + seconds);
				setTimeout(loopCounter, 1000);
			}
		}
	}
	finishSyst();
}

function newRepetition(){
	finishedFnc = false;
	// console.log("repetitionCounter: " + repetitionCounter + "\nrepetitions: " + repetitions + "\n=====================");
	repetitions--;
	if (repetitions != 0) {
		inLiveCounter = 0;
		loopSystem();
	} else if (repetitionCounter >= repetitions - 1) {
		stopSeries();
	}
	finishSyst();
}

function invalidChars(){
	$("#messageNotify").text("Carácteres inválidos");
	setTimeout(function(){
		$("#messageNotify").text("");
	}, 1500);
}

function settingsError(){
	$("#messageNotify").text("Error en la creación de las series");
	setTimeout(function(){
		$("#messageNotify").text("");
	}, 1500);
}

function timer(){
	finishedFnc = false;
	if (active == true) {
		if (paused == false) {
			if (timeInSeconds <= 0) {
				sound.play();
				active = false;
				$("#start").html("<i class=\"fa fa-play\" aria-hidden=\"true\"></i>");
				$("#hour").text("00");
				$("#minutes").text("00");
				$("#seconds").text("00");
				timeInSeconds = $("#numberInput").val();
			} else {
					if (active == true){
					if (timeInSeconds > 3600){
						hour = parseInt(timeInSeconds / 3600);
					}
					if (timeInSeconds > 60){
						minutes = parseInt((timeInSeconds - (hour * 3600)) / 60);
						// console.log("Actualizar minutos");
					}
					if (timeInSeconds >= 0) {
						if (timeInSeconds < 60) {
							minutes = 0;
						}
						seconds = timeInSeconds - ((hour * 3600) + (minutes * 60));
						// console.log("Actualizar segundos");
					}

					if (hour.toString().length < 2){
						hour = "0" + hour;
					}
					if (minutes.toString().length < 2){
						minutes = "0" + minutes;
					}
					if (seconds.toString().length < 2){
						seconds = "0" + seconds;
					}

					$("#hour").text(hour);
					$("#minutes").text(minutes);
					$("#seconds").text(seconds);
					timeInSeconds--;
					// console.log("Horas: " + hour + "\nMinutos: " + minutes + "\nSegundos: " + seconds);
					setTimeout(timer, 1000);
				}
			}
		}
	}
	finishSyst();
}

$("#activeDeactive").click(function(){
	if ($("#numberInput").prop("readonly") == true){
		//Se activa el modo simple
		$("#numberInput").prop("readonly", false);
		seriesActivated = false;
		$("#activeDeactive").text("Activar temporizador");
		stopSeries();
		setTimeout(function (){
			finishedFnc = true;
			$("#start").prop("disabled", false);
		},1000);
	} else {
		//Se activa el modo repeticiones
		$("#numberInput").prop("readonly", true);
		seriesActivated = true;
		$("#activeDeactive").text("Desactivar temporizador");
		stopSeries();
		setTimeout(function (){
			finishedFnc = true;
			$("#start").prop("disabled", false);
		},1000);
	}
});

function stopSeries(){
	$("#start").html("<i class=\"fa fa-play\" aria-hidden=\"true\"></i>");
	$("#reset").prop("disabled", true);
	$("#start").prop("disabled", true);
	active = false;
	timeInSeconds = 0;
	hour = 0;
	minutes = 0;
	seconds = 0;
	seriesArray = new Array();
	repeticiones = 0;
	bucleInfinito = false;
	counterRepetitionsSize = 0;
	inLiveCounter = 0;
	repetitionCounter = 0;
	$("#hour").text("00");
	$("#minutes").text("00");
	$("#seconds").text("00");
}

function finishSyst(){
	if (active == false) {
		finishedFnc = true;
		$("#start").prop("disabled", false);
	}
}

//CONVERSOR

$("#conversor").on('input', function() {
    var cnvHoras = 0;
    var cnvMinutos = 0;
    var cnvSegundos = 0;
    var cnvHorasTxt = "00";
    var cnvMinutosTxt = "00";
    var cnvSegundosTxt = "00";
    var cnvTime = "00:00:00";

    var cnvTimeInSeconds = $("#conversor").val();
    // console.log(cnvTimeInSeconds);
    // console.log("input");

    if (cnvTimeInSeconds > 3600){
		cnvHoras = parseInt(cnvTimeInSeconds / 3600);
	}
	if (cnvTimeInSeconds > 60){
		cnvMinutos = parseInt((cnvTimeInSeconds - (cnvHoras * 3600)) / 60);
		// console.log("Actualizar minutos");
	}
	if (cnvTimeInSeconds >= 0) {
		if (cnvTimeInSeconds < 60) {
			cnvSegundos = 0;
		}
		cnvSegundos = cnvTimeInSeconds - ((cnvHoras * 3600) + (cnvMinutos * 60));
		// console.log("Actualizar segundos");
	}

	if (cnvHoras.toString().length < 2) {
		cnvHorasTxt = "0" + cnvHoras;
	} else {
		cnvHorasTxt = cnvHoras;
	}
	if (cnvMinutos.toString().length < 2) {
		cnvMinutosTxt = "0" + cnvMinutos;
	} else {
		cnvMinutosTxt = cnvMinutos;
	}
	if (cnvSegundos.toString().length < 2) {
		cnvSegundosTxt = "0" + cnvSegundos;
	} else {
		cnvSegundosTxt = cnvSegundos;
	}

	cnvTime = cnvHorasTxt + ":" + cnvMinutosTxt + ":" + cnvSegundosTxt;

	$("#cnvTime").text(cnvTime);

});