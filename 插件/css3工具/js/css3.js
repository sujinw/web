/*Code by Peter Funk*/
var PFunkGen = function () {
	'use strict';
	var boxStyle, sliderBR, sliderBS, sliderO, useOldMoz, useOldMS, useOldWebkit, useMoz, useMS, useO, useWebkit, showComments, cssStyle;
	/*****BASICS*****/
	function setBasics() {
		var bwValue = 0, bcValue = 0, bgcValue = 0;
		bwValue = document.getElementById('bwInput').value;
		bcValue = document.getElementById('bcHiddenInput').value;
		bgcValue = document.getElementById('bgHiddenInput').value;
		if (isNaN(bwValue)) {
			bwValue = 2;
		} else if (Number(bwValue) < 0) {
			bwValue = 0;
		}
		bwValue = cssStyle.borderWidth = Number(bwValue);
		document.getElementById('changedDiv').style.borderWidth = bwValue + 'px';
		document.getElementById('changedDiv').style.margin = (-bwValue) + 'px 0 0 ' + (-bwValue) + 'px';
		document.getElementById('changedDiv').style.borderColor = cssStyle.borderColor = bcValue;
		document.getElementById('changedDiv').style.backgroundColor = cssStyle.backgroundColor = bgcValue;
	}
	/*****END BASICS*****/
	/*****BORDER RADIUS*****/
	function updateBorderRadius(newRadius) {
		if (isNaN(newRadius) || Number(newRadius) < 0) {
			cssStyle.borderRadius[0] = cssStyle.borderRadius[1] = cssStyle.borderRadius[2] = cssStyle.borderRadius[3] = 0;
		} else {
			cssStyle.borderRadius[0] = cssStyle.borderRadius[1] = cssStyle.borderRadius[2] = cssStyle.borderRadius[3] = Number(newRadius);
		}
		newRadius = cssStyle.borderRadius[0];
		document.getElementById("brInput").value = newRadius;
		document.getElementById('brTLInput').value = newRadius;
		document.getElementById('brTRInput').value = newRadius;
		document.getElementById('brBLInput').value = newRadius;
		document.getElementById('brBRInput').value = newRadius;
		boxStyle.MozBorderRadius = newRadius + 'px';
		boxStyle.WebkitBorderRadius = newRadius + 'px';
		boxStyle.borderRadius = newRadius + 'px';
	}
	function setBorderRadii() {
		var brtl = 0, brtr = 0, brbl = 0, brbr = 0, newRadius = 0;
		brtl = document.getElementById('brTLInput').value;
		brtr = document.getElementById('brTRInput').value;
		brbl = document.getElementById('brBLInput').value;
		brbr = document.getElementById('brBRInput').value;
		if (isNaN(brtl) || Number(brtl) < 0) {
			cssStyle.borderRadius[0] = 0;
		} else {
			cssStyle.borderRadius[0] = Number(brtl);
		}
		if (isNaN(brtr) || Number(brtr) < 0) {
			cssStyle.borderRadius[1] = 0;
		} else {
			cssStyle.borderRadius[1] = Number(brtr);
		}
		if (isNaN(brbr) || Number(brbr) < 0) {
			cssStyle.borderRadius[2] = 0;
		} else {
			cssStyle.borderRadius[2] = Number(brbr);
		}
		if (isNaN(brbl) || Number(brbl) < 0) {
			cssStyle.borderRadius[3] = 0;
		} else {
			cssStyle.borderRadius[3] = Number(brbl);
		}
		newRadius = cssStyle.borderRadius[0] + 'px ' + cssStyle.borderRadius[1] + 'px ' + cssStyle.borderRadius[2] + 'px ' + cssStyle.borderRadius[3] + 'px';
		boxStyle.MozBorderRadius = newRadius;
		boxStyle.WebkitBorderRadius = newRadius;
		boxStyle.borderRadius = newRadius;
	}
	/*****END BORDER RADIUS*****/
	/*****BOX SHADOW*****/
	function getIEDirection(horz, vert) {
		var absH = 0, absV = 0, change = 0, returnNum = -1;
		horz = Number(horz);
		vert = Number(vert);
		absH = Math.abs(horz);
		absV = Math.abs(vert);
		if (isNaN(horz) || isNaN(vert) || (!horz && !vert)) {
			returnNum = 0;
		} else if (horz === 0 && vert > 0) {
			returnNum = 180;
		} else if (horz === 0 && vert < 0) {
			returnNum = 0;
		} else if (vert === 0 && horz > 0) {
			returnNum = 90;
		} else if (vert === 0 && horz < 0) {
			returnNum = 270;
		} else if (absV === absH && vert < 0 && horz > 0) {
			returnNum = 45;
		} else if (absV === absH && vert > 0 && horz > 0) {
			returnNum = 135;
		} else if (absV === absH && vert > 0 && horz < 0) {
			returnNum = 225;
		} else if (absV === absH && vert < 0 && horz < 0) {
			returnNum = 315;
		}
		if (returnNum !== -1) {
			return returnNum;
		}
		if (horz > 0 && vert < 0 && absV > absH) {
			change = (absH / absV) * 45;
		} else if (horz > 0 && vert < 0) {
			change = (absV / absH) * 45 + 45;
		} else if (horz > 0 && vert > 0 && absH > absV) {
			change = (absV / absH) * 45 + 90;
		} else if (horz > 0 && vert > 0) {
			change = (absH / absV) * 45 + 135;
		} else if (horz < 0 && vert > 0 && absV > absH) {
			change = (absH / absV) * 45 + 180;
		} else if (horz < 0 && vert > 0) {
			change = (absV / absH) * 45 + 225;
		} else if (horz < 0 && vert < 0 && absH > absV) {
			change = (absV / absH) * 45 + 270;
		} else if (horz < 0 && vert < 0) {
			change = (absH / absV) * 45 + 315;
		}
		return change;
	}
	function updateBoxShadow(newBoxShadow) {
		var boxShadowDirection = 0, newBoxShadowSpread = "", newBoxShadowInset = "";
		if (isNaN(newBoxShadow)) {
			newBoxShadow = 0;
		}
		document.getElementById("bsInput").value = newBoxShadow;
		document.getElementById('bsBlurInput').value = newBoxShadow;
		cssStyle.boxShadow[2] = Number(newBoxShadow);
		if (cssStyle.boxShadow[3]) {
			newBoxShadowSpread = cssStyle.boxShadow[3] + "px ";
		}
		if (cssStyle.boxShadow[4]) {
			newBoxShadowInset = "inset ";
		}
		newBoxShadow = newBoxShadowInset + cssStyle.boxShadow[0] + "px " + cssStyle.boxShadow[1] + "px " + newBoxShadow + "px " + newBoxShadowSpread + cssStyle.boxShadowColor;
		boxStyle.MozBoxShadow = newBoxShadow;
		boxStyle.WebkitBoxShadow = newBoxShadow;
		boxStyle.boxShadow = newBoxShadow;
		boxShadowDirection = getIEDirection(cssStyle.boxShadow[0], cssStyle.boxShadow[1]);
		if (useOldMS) {
			boxStyle.filter = "progid:DXImageTransform.Microsoft.Shadow(strength = " + Math.max(Math.abs(cssStyle.boxShadow[0]), Math.abs(cssStyle.boxShadow[1])) + ", direction = " + boxShadowDirection + ", color = '" + cssStyle.boxShadowColor + "')";
			boxStyle.msfilter = "\"progid:DXImageTransform.Microsoft.Shadow(strength = " + Math.max(Math.abs(cssStyle.boxShadow[0]), Math.abs(cssStyle.boxShadow[1])) + ", Direction = " + boxShadowDirection + ", Color = '" + cssStyle.boxShadowColor + "')\";";
		}
	}
	function setBoxShadow() {
		var bsHorz = document.getElementById('bsHorzInput').value, bsVert = document.getElementById('bsVertInput').value, bsBlur = document.getElementById('bsBlurInput').value, bsSpread = document.getElementById('bsSpreadInput').value, bsInset = document.getElementById('insetShadowBtn').className === 'outsetBtn' ? true : false, bsColor = document.getElementById('bsColorHiddenInput').value, boxShadowDirection = 0, newBoxShadow = "";
		if (isNaN(bsHorz)) {
			cssStyle.boxShadow[0] = 0;
			document.getElementById('bsHorzInput').value = 0;
		} else {
			cssStyle.boxShadow[0] = Number(bsHorz);
		}
		if (isNaN(bsVert)) {
			cssStyle.boxShadow[1] = 0;
			document.getElementById('bsVertInput').value = 0;
		} else {
			cssStyle.boxShadow[1] = Number(bsVert);
		}
		if (isNaN(bsBlur)) {
			cssStyle.boxShadow[2] = 0;
			document.getElementById('bsBlurInput').value = 0;
		} else {
			cssStyle.boxShadow[2] = Number(bsBlur);
		}
		if (isNaN(bsSpread)) {
			cssStyle.boxShadow[3] = 0;
			document.getElementById('bsSpreadInput').value = 0;
		} else {
			cssStyle.boxShadow[3] = Number(bsSpread);
		}
		cssStyle.boxShadow[4] = bsInset;
		cssStyle.boxShadowColor = bsColor;
		if (cssStyle.boxShadow[4]) {
			newBoxShadow = "inset " + cssStyle.boxShadow[0] + "px " + cssStyle.boxShadow[1] + "px " + cssStyle.boxShadow[2] + "px " + cssStyle.boxShadow[3] + "px " + cssStyle.boxShadowColor;
		} else {
			newBoxShadow = cssStyle.boxShadow[0] + "px " + cssStyle.boxShadow[1] + "px " + cssStyle.boxShadow[2] + "px " + cssStyle.boxShadow[3] + "px " + cssStyle.boxShadowColor;
		}
		boxStyle.MozBoxShadow = newBoxShadow;
		boxStyle.WebkitBoxShadow = newBoxShadow;
		boxStyle.boxShadow = newBoxShadow;
		boxShadowDirection = getIEDirection(cssStyle.boxShadow[0], cssStyle.boxShadow[1]);
		if (useOldMS) {
			boxStyle.filter = "progid:DXImageTransform.Microsoft.Shadow(strength = " + Math.max(Math.abs(cssStyle.boxShadow[0]), Math.abs(cssStyle.boxShadow[1])) + ", direction = " + boxShadowDirection + ", color = '" + cssStyle.boxShadowColor + "')";
			boxStyle.msfilter = "\"progid:DXImageTransform.Microsoft.Shadow(strength = " + Math.max(Math.abs(cssStyle.boxShadow[0]), Math.abs(cssStyle.boxShadow[1])) + ", Direction = " + boxShadowDirection + ", Color = '" + cssStyle.boxShadowColor + "')\";";
		}
	}
	/*****END BOX SHADOW*****/
	/*****GRADIENT*****/
	function updateGradient() {
		var hasGradient = (document.getElementById('gradientSwitch').className === "gradSwitch gradOn"), newFromColor = '', newToColor = '';
		if (hasGradient) {
			newFromColor = cssStyle.backgroundFromColor = document.getElementById('bgFromHiddenInput').value;
			newToColor = cssStyle.backgroundToColor = document.getElementById('bgToHiddenInput').value;
			if (document.getElementById('bgL2R').className === 'radioBtn radioChecked') {
				cssStyle.backgroundDirection = "l2r";
				if (navigator.userAgent.indexOf('MSIE') === -1) {
					boxStyle.backgroundImage = "-moz-linear-gradient(left, " + newFromColor + ", " + newToColor + ")";
					boxStyle.backgroundImage = "-webkit-gradient(linear, left top, right top, from(" + newFromColor + "), to(" + newToColor + "))";
					boxStyle.backgroundImage = "-o-linear-gradient(left, " + newFromColor + ", " + newToColor + ")";
					boxStyle.backgroundImage = "linear-gradient(left, " + newFromColor + ", " + newToColor + ")";
				} else {
					if (useOldMS) {
						boxStyle.filter = "progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr = '" + newFromColor + "', endColorstr = '" + newToColor + "')";
						boxStyle.msfilter = "progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr = '" + newFromColor + "', endColorstr = '" + newToColor + "')";
					} else if (navigator.userAgent.indexOf('MSIE 9') !== -1) {
						boxStyle.backgroundImage = "linear-gradient(left, " + newFromColor + ", " + newToColor + ")";
					}
				}
			} else if (document.getElementById('bgR2L').className === 'radioBtn radioChecked') {
				cssStyle.backgroundDirection = "r2l";
				if (navigator.userAgent.indexOf('MSIE') === -1) {
					boxStyle.backgroundImage = "-moz-linear-gradient(left, " + newToColor + ", " + newFromColor + ")";
					boxStyle.backgroundImage = "-webkit-gradient(linear, left top, right top, from(" + newToColor + "), to(" + newFromColor + "))";
					boxStyle.backgroundImage = "-o-linear-gradient(left, " + newToColor + ", " + newFromColor + ")";
					boxStyle.backgroundImage = "linear-gradient(left, " + newToColor + ", " + newFromColor + ")";
				} else {
					if (useOldMS) {
						boxStyle.filter = "progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr = '" + newToColor + "', endColorstr = '" + newFromColor + "')";
						boxStyle.msfilter = "progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr = '" + newToColor + "', endColorstr = '" + newFromColor + "')";
					} else if (navigator.userAgent.indexOf('MSIE 9') !== -1) {
						boxStyle.backgroundImage = "linear-gradient(left, " + newToColor + ", " + newFromColor + ")";
					}
				}
			} else {
				cssStyle.backgroundDirection = "t2b";
				if (navigator.userAgent.indexOf('MSIE') === -1) {
					boxStyle.backgroundImage = "-moz-linear-gradient(top, " + newFromColor + ", " + newToColor + ")";
					boxStyle.backgroundImage = "-webkit-gradient(linear, center top, center bottom, from(" + newFromColor + "), to(" + newToColor + "))";
					boxStyle.backgroundImage = "-o-linear-gradient(top, " + newFromColor + ", " + newToColor + ")";
					boxStyle.backgroundImage = "linear-gradient(top, " + newFromColor + ", " + newToColor + ")";
				} else {
					if (useOldMS) {
						boxStyle.filter = "progid:DXImageTransform.Microsoft.gradient(startColorstr = '" + newFromColor + "', endColorstr = '" + newToColor + "')";
						boxStyle.msfilter = "progid:DXImageTransform.Microsoft.gradient(startColorstr = '" + newFromColor + "', endColorstr = '" + newToColor + "')";
					} else if (navigator.userAgent.indexOf('MSIE 9') !== -1) {
						boxStyle.backgroundImage = "linear-gradient(top, " + newFromColor + ", " + newToColor + ")";
					}
				}
			}
		} else {
			boxStyle.backgroundImage = "";
			boxStyle.backgroundColor = document.getElementById('bgHiddenInput').value;
			if (useOldMS) {
				boxStyle.filter = '';
				boxStyle.msfilter = '';
			}
			cssStyle.backgroundDirection = "";
		}
	}
	function setGradient() {
	}
	function bgRadioChecked(id) {
		document.getElementById('bgT2B').className = 'radioBtn';
		document.getElementById('bgL2R').className = 'radioBtn';
		document.getElementById('bgR2L').className = 'radioBtn';
		document.getElementById(id).className = 'radioBtn radioChecked';
		updateGradient();
	}
	/*****END GRADIENT*****/
	/*****OPACITY*****/
	function updateOpacity(newOpacity) {
		if (isNaN(newOpacity) || Number(newOpacity) > 100) {
			newOpacity = 100;
		} else if (Number(newOpacity) < 0) {
			newOpacity = 0;
		}
		cssStyle.opacity = Number(newOpacity);
		document.getElementById("oInput").value = cssStyle.opacity;
		boxStyle.opacity = (cssStyle.opacity / 100);
		if (useOldMS) {
			boxStyle.msfilter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity = ' + cssStyle.opacity + ')';
			boxStyle.filter = 'alpha(opacity = ' + cssStyle.opacity + ')';
		}
	}
	function setOpacity() {
		var newOpacity = document.getElementById("oInput").value;
		if (isNaN(newOpacity) || Number(newOpacity) > 100) {
			newOpacity = 100;
		} else {
			if (Number(newOpacity) < 0) {
				newOpacity = 0;
			}
		}
		cssStyle.opacity = Number(newOpacity);
		sliderO.moveThumb(sliderO.posPercToPx(cssStyle.opacity + "%"));
		document.getElementById("oInput").value = cssStyle.opacity;
		boxStyle.opacity = (cssStyle.opacity / 100);
		if (useOldMS) {
			boxStyle.msfilter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity = ' + cssStyle.opacity + ')';
			boxStyle.filter = 'alpha(opacity = ' + cssStyle.opacity + ')';
		}
	}
	/*****END OPACITY*****/
	/*****EXTERNAL FUNCTIONS*****/
	function centerModal(mdlId) {
		var modalToCenter = document.getElementById(mdlId), currH = 0, currW = 0;
		modalToCenter.style.display = 'block';
		currH = modalToCenter.offsetHeight;
		currW = modalToCenter.offsetWidth;
		if ((document.documentElement && Number(document.documentElement.clientHeight) !== 0 && document.documentElement.clientHeight < currH + 20) || (document.body.offsetHeight && document.body.offsetHeight < currH + 20) || (window.innerHeight && window.innerHeight < currH + 20)) {
			modalToCenter.style.position = 'absolute';
			modalToCenter.style.top = "20px";
			modalToCenter.style.marginTop = '0px';
			window.scroll(0, 0);
		} else {
			modalToCenter.style.position = 'fixed';
			modalToCenter.style.top = "50%";
			modalToCenter.style.marginTop = -(currH / 2) + 'px';
		}
		modalToCenter.style.left = "50%";
		modalToCenter.style.marginLeft = -(currW / 2) + 'px';
	}
	/*****END EXTERNAL FUNCTIONS*****/
	/*****SHOW CODE*****/
	function showBorderRadiusCode() {
		var radAll = "", radMoz = "", radWeb = "", stringToPrint = "";
		if (cssStyle.borderRadius[0] === 0 && cssStyle.borderRadius[1] === 0 && cssStyle.borderRadius[2] === 0 && cssStyle.borderRadius[3] === 0) {
			return stringToPrint;
		}
		if (cssStyle.borderRadius[0] === cssStyle.borderRadius[2] && cssStyle.borderRadius[1] === cssStyle.borderRadius[3] && cssStyle.borderRadius[2] === cssStyle.borderRadius[3]) {
			radAll = radMoz = radWeb = cssStyle.borderRadius[0] + 'px;';
		} else if (cssStyle.borderRadius[0] === cssStyle.borderRadius[2] && cssStyle.borderRadius[1] === cssStyle.borderRadius[3]) {
			radAll = radMoz = cssStyle.borderRadius[0] + 'px ' + cssStyle.borderRadius[1] + 'px;';
			radWeb = cssStyle.borderRadius[0] + 'px ' + cssStyle.borderRadius[1] + 'px ' + cssStyle.borderRadius[2] + 'px ' + cssStyle.borderRadius[3] + 'px;';
			if (showComments) {
				radWeb += '/*This is the correct shorthand for webkit*/';
			}
		} else if (cssStyle.borderRadius[1] === cssStyle.borderRadius[3]) {
			radAll = radMoz = cssStyle.borderRadius[0] + 'px ' + cssStyle.borderRadius[1] + 'px ' + cssStyle.borderRadius[2] + 'px;';
			radWeb = cssStyle.borderRadius[0] + 'px ' + cssStyle.borderRadius[1] + 'px ' + cssStyle.borderRadius[2] + 'px ' + cssStyle.borderRadius[3] + 'px;';
			if (showComments) {
				radWeb += '/*This is the correct shorthand for webkit*/';
			}
		} else {
			radAll = radMoz = radWeb = cssStyle.borderRadius[0] + 'px ' + cssStyle.borderRadius[1] + 'px ' + cssStyle.borderRadius[2] + 'px ' + cssStyle.borderRadius[3] + 'px;';
		}
		if (useOldMoz) {
			stringToPrint = stringToPrint + '-moz-border-radius: ' + radMoz + '\n';
		}
		if (useOldWebkit) {
			stringToPrint = stringToPrint + '-webkit-border-radius: ' + radWeb + '\n';
		}
		stringToPrint = stringToPrint + 'border-radius: ' + radAll + '\n';
		if (useOldMS && showComments) {
			stringToPrint = stringToPrint + "/*IE 7 AND 8 DO NOT SUPPORT BORDER RADIUS*/\n";
		}
		return stringToPrint;
	}
	function showBoxShadowCode() {
		var newBoxShadowInset = '', newShadowB = '', newShadowS = '', stringToPrint = '', newBoxShadow = '';
		if (cssStyle.boxShadow[4]) {
			newBoxShadowInset = "inset ";
		}
		if (cssStyle.boxShadow[2] && cssStyle.boxShadow[3]) {
			newShadowB = cssStyle.boxShadow[2] + "px ";
			newShadowS = cssStyle.boxShadow[3] + "px ";
		} else if (cssStyle.boxShadow[2]) {
			newShadowB = cssStyle.boxShadow[2] + "px ";
		} else if (cssStyle.boxShadow[3]) {
			newShadowB = "0px ";
			newShadowS = cssStyle.boxShadow[3] + "px ";
		}
		newBoxShadow = newBoxShadowInset + cssStyle.boxShadow[0] + "px " + cssStyle.boxShadow[1] + "px " + newShadowB + newShadowS + cssStyle.boxShadowColor;
		if (cssStyle.boxShadow[0] || cssStyle.boxShadow[1] || cssStyle.boxShadow[2] || cssStyle.boxShadow[3]) {
			if (useOldMoz) {
				stringToPrint = stringToPrint + "-moz-box-shadow: " + newBoxShadow + ";\n";
			}
			if (useOldWebkit) {
				stringToPrint = stringToPrint + "-webkit-box-shadow: " + newBoxShadow + ";\n";
			}
			stringToPrint = stringToPrint + "box-shadow: " + newBoxShadow + ";\n";
			if (cssStyle.boxShadow[4] && showComments) {
				stringToPrint = stringToPrint + "/*Inner elements should not cover inner shadows*/\n";
				if (cssStyle.borderRadius[0] || cssStyle.borderRadius[1] || cssStyle.borderRadius[2] || cssStyle.borderRadius[3]) {
					stringToPrint = stringToPrint + "/*Chrome renders inset shadows incorrectly with border-radius*/\n";
				}
			}
			if (useOldMS) {
				if (cssStyle.boxShadow[4] && showComments) {
					stringToPrint = stringToPrint + "/*IE 7 AND 8 DO NOT SUPPORT INSET SHADOWS*/\n";
				} else {
					if (cssStyle.boxShadow[0] || cssStyle.boxShadow[1]) {
						stringToPrint = stringToPrint + "filter: progid:DXImageTransform.Microsoft.Shadow(strength = " + Math.max(cssStyle.boxShadow[0], cssStyle.boxShadow[1]) + ", direction = " + getIEDirection(cssStyle.boxShadow[0], cssStyle.boxShadow[1]) + ", color = '" + cssStyle.boxShadowColor + "');\n-ms-filter: \"progid:DXImageTransform.Microsoft.Shadow(strength = " + Math.max(cssStyle.boxShadow[0], cssStyle.boxShadow[1]) + ", Direction = " + getIEDirection(cssStyle.boxShadow[0], cssStyle.boxShadow[1]) + ", Color = '" + cssStyle.boxShadowColor + "')\";\n";
						if (showComments) {
							stringToPrint = stringToPrint + "/*Shadows look very different in IE (Only cardinal directions supported)*/\n/*INNER ELEMENTS MUST NOT BREAK THIS ELEMENTS BOUNDARIES*/\n/*Element should have a background-color*/\n/*All filters must be placed together*/\n";
						}
					}
					if (cssStyle.boxShadow[2] && showComments) {
						stringToPrint = stringToPrint + "/*IE 7 AND 8 DO NOT SUPPORT BLUR PROPERTY OF SHADOWS*/\n";
					}
					if (cssStyle.boxShadow[3] && showComments) {
						stringToPrint = stringToPrint + "/*IE 7 AND 8 DO NOT SUPPORT SPREAD PROPERTY OF SHADOWS*/\n";
					}
				}
			}
		}
		return stringToPrint;
	}
	function showBackgroundGradientCode() {
		var stringToPrint = "";
		if (cssStyle.backgroundDirection === 'l2r') {
			if (useOldMS) {
				stringToPrint = stringToPrint + "filter: progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr = '" + cssStyle.backgroundFromColor + "', endColorstr = '" + cssStyle.backgroundToColor + "');\n";
				if (showComments) {
					stringToPrint += "/*INNER ELEMENTS MUST NOT BREAK THIS ELEMENTS BOUNDARIES*/\n/*Element must have a height (not auto)*/\n/*All filters must be placed together*/\n";
				}
				stringToPrint += "-ms-filter: \"progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr = '" + cssStyle.backgroundFromColor + "', endColorstr = '" + cssStyle.backgroundToColor + "')\";\n";
				if (showComments) {
					stringToPrint += "/*Element must have a height (not auto)*/\n/*All filters must be placed together*/\n";
				}
			}
			if (useMoz) {
				stringToPrint = stringToPrint + 'background-image: -moz-linear-gradient(left, ' + cssStyle.backgroundFromColor + ', ' + cssStyle.backgroundToColor + ');\n';
			}
			if (useMS) {
				stringToPrint = stringToPrint + 'background-image: -ms-linear-gradient(left, ' + cssStyle.backgroundFromColor + ', ' + cssStyle.backgroundToColor + ');\n';
			}
			if (useO) {
				stringToPrint = stringToPrint + 'background-image: -o-linear-gradient(left, ' + cssStyle.backgroundFromColor + ', ' + cssStyle.backgroundToColor + ');\n';
			}
			if (useOldWebkit) {
				stringToPrint = stringToPrint + 'background-image: -webkit-gradient(linear, left top, right top, from(' + cssStyle.backgroundFromColor + '), to(' + cssStyle.backgroundToColor + '));\n';
			}
			if (useWebkit) {
				stringToPrint = stringToPrint + 'background-image: -webkit-linear-gradient(left, ' + cssStyle.backgroundFromColor + ', ' + cssStyle.backgroundToColor + ');\n';
			}
			stringToPrint = stringToPrint + 'background-image: linear-gradient(left, ' + cssStyle.backgroundFromColor + ', ' + cssStyle.backgroundToColor + ');\n';
		} else if (cssStyle.backgroundDirection === 'r2l') {
			if (useOldMS) {
				stringToPrint = stringToPrint + "filter: progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr = '" + cssStyle.backgroundToColor + "', endColorstr = '" + cssStyle.backgroundFromColor + "');\n";
				if (showComments) {
					stringToPrint += "/*INNER ELEMENTS MUST NOT BREAK THIS ELEMENTS BOUNDARIES*/\n/*Element must have a height (not auto)*/\n/*All filters must be placed together*/\n";
				}
				stringToPrint += "-ms-filter: \"progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr = '" + cssStyle.backgroundToColor + "', endColorstr = '" + cssStyle.backgroundFromColor + "')\";\n";
				if (showComments) {
					stringToPrint += "/*Element must have a height (not auto)*/\n/*All filters must be placed together*/\n";
				}
			}
			if (useMoz) {
				stringToPrint = stringToPrint + 'background-image: -moz-linear-gradient(left, ' + cssStyle.backgroundToColor + ', ' + cssStyle.backgroundFromColor + ');\n';
			}
			if (useMS) {
				stringToPrint = stringToPrint + 'background-image: -ms-linear-gradient(left, ' + cssStyle.backgroundToColor + ', ' + cssStyle.backgroundFromColor + ');\n';
			}
			if (useO) {
				stringToPrint = stringToPrint + 'background-image: -o-linear-gradient(left, ' + cssStyle.backgroundToColor + ', ' + cssStyle.backgroundFromColor + ');\n';
			}
			if (useOldWebkit) {
				stringToPrint = stringToPrint + 'background-image: -webkit-gradient(linear, left top, right top, from(' + cssStyle.backgroundToColor + '), to(' + cssStyle.backgroundFromColor + '));\n';
			}
			if (useWebkit) {
				stringToPrint = stringToPrint + 'background-image: -webkit-linear-gradient(left, ' + cssStyle.backgroundToColor + ', ' + cssStyle.backgroundFromColor + ');\n';
			}
			stringToPrint = stringToPrint + 'background-image: linear-gradient(left, ' + cssStyle.backgroundToColor + ', ' + cssStyle.backgroundFromColor + ');\n';
		} else if (cssStyle.backgroundDirection === 't2b') {
			if (useOldMS) {
				stringToPrint = stringToPrint + "filter: progid:DXImageTransform.Microsoft.gradient(startColorstr = '" + cssStyle.backgroundFromColor + "', endColorstr = '" + cssStyle.backgroundToColor + "');\n";
				if (showComments) {
					stringToPrint += "/*INNER ELEMENTS MUST NOT BREAK THIS ELEMENTS BOUNDARIES*/\n/*Element must have a height (not auto)*/\n/*All filters must be placed together*/\n";
				}
				stringToPrint += "-ms-filter: \"progid:DXImageTransform.Microsoft.gradient(startColorstr = '" + cssStyle.backgroundFromColor + "', endColorstr = '" + cssStyle.backgroundToColor + "')\";\n";
				if (showComments) {
					stringToPrint += "/*Element must have a height (not auto)*/\n/*All filters must be placed together*/\n";
				}
			}
			if (useMoz) {
				stringToPrint = stringToPrint + 'background-image: -moz-linear-gradient(top, ' + cssStyle.backgroundFromColor + ', ' + cssStyle.backgroundToColor + ');\n';
			}
			if (useMS) {
				stringToPrint = stringToPrint + 'background-image: -ms-linear-gradient(top, ' + cssStyle.backgroundFromColor + ', ' + cssStyle.backgroundToColor + ');\n';
			}
			if (useO) {
				stringToPrint = stringToPrint + 'background-image: -o-linear-gradient(top, ' + cssStyle.backgroundFromColor + ', ' + cssStyle.backgroundToColor + ');\n';
			}
			if (useOldWebkit) {
				stringToPrint = stringToPrint + 'background-image: -webkit-gradient(linear, center top, center bottom, from(' + cssStyle.backgroundFromColor + '), to(' + cssStyle.backgroundToColor + '));\n';
			}
			if (useWebkit) {
				stringToPrint = stringToPrint + 'background-image: -webkit-linear-gradient(top, ' + cssStyle.backgroundFromColor + ', ' + cssStyle.backgroundToColor + ');\n';
			}
			stringToPrint = stringToPrint + 'background-image: linear-gradient(top, ' + cssStyle.backgroundFromColor + ', ' + cssStyle.backgroundToColor + ');\n';
		}
		if (cssStyle.backgroundDirection !== "") {
			if (cssStyle.borderRadius[0] !== 0 && cssStyle.borderRadius[1] !== 0 && cssStyle.borderRadius[2] !== 0 && cssStyle.borderRadius[3] !== 0) {
				if (useOldMoz) {
					stringToPrint += '-moz-background-clip: padding;\n';
				}
				if (useOldWebkit) {
					stringToPrint += '-webkit-background-clip: padding-box;\n';
				}
				stringToPrint += 'background-clip: padding-box;\n';
				if (showComments) {
					stringToPrint += '/*Use "background-clip: padding-box" when using rounded corners to avoid the gradient bleeding through the corners*/\n';
				}
				if (useOldMS && showComments) {
					stringToPrint = stringToPrint + "/*--IE9 WILL PLACE THE FILTER ON TOP OF THE ROUNDED CORNERS--*/\n";
				} else if (useMS && showComments) {
					stringToPrint = stringToPrint + "/*--IE9 DOES NOT SUPPORT CSS3 GRADIENT BACKGROUNDS--*/\n";
				}
			} else {
				if (useMS && showComments) {
					stringToPrint = stringToPrint + "/*--IE9 DOES NOT SUPPORT CSS3 GRADIENT BACKGROUNDS--*/\n";
				}
			}
		}
		return stringToPrint;
	}
	function showOpacityCode() {
		var stringToPrint = "";
		if (cssStyle.opacity !== 100) {
			stringToPrint = stringToPrint + 'opacity: ' + (cssStyle.opacity / 100) + ';\n';
			if (useOldMS) {
				stringToPrint = stringToPrint + "-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity = " + cssStyle.opacity + ");\n";
				if (showComments) {
					stringToPrint += "/*-ms-filter must come before filter*/\n";
				}
				stringToPrint += "filter: alpha(opacity = " + cssStyle.opacity + ");\n";
				if (showComments) {
					stringToPrint += "/*INNER ELEMENTS MUST NOT BREAK THIS ELEMENTS BOUNDARIES*/\n/*All filters must be placed together*/\n";
				}
			}
		}
		return stringToPrint;
	}
	function showBasics() {
		var stringToPrint = "";
		if (document.getElementById('defaultPanelContent').style.display === 'block') {
			stringToPrint += "background-color: " + cssStyle.backgroundColor + ";\n";
			if (cssStyle.borderWidth > 0) {
				stringToPrint += "border: " + cssStyle.borderWidth + "px solid " + cssStyle.borderColor + ";\n";
			}
		}
		return stringToPrint;
	}
	function showCode() {
		var stringToPrint = "";
		stringToPrint += showBasics();
		stringToPrint += showBorderRadiusCode();
		stringToPrint += showBoxShadowCode();
		stringToPrint += showBackgroundGradientCode();
		stringToPrint += showOpacityCode();
		document.getElementById('codeToCopy').value = stringToPrint;
	}
	function updateShowCode() {
		var checkBoxCookieNum = 0;
		useOldMS = document.getElementById('oldMSCheck').checked;
		if (!!useOldMS) {
			checkBoxCookieNum += 1;
		}
		useOldMoz = document.getElementById('oldMozCheck').checked;
		if (!!useOldMoz) {
			checkBoxCookieNum += 2;
		}
		useOldWebkit = document.getElementById('oldWebkitCheck').checked;
		if (!!useOldWebkit) {
			checkBoxCookieNum += 4;
		}
		showComments = document.getElementById('commentsCheck').checked;
		if (!!showComments) {
			checkBoxCookieNum += 8;
		}
		useMS = document.getElementById('msCheck').checked;
		if (!!useMS) {
			checkBoxCookieNum += 16;
		}
		useMoz = document.getElementById('mozCheck').checked;
		if (!!useMoz) {
			checkBoxCookieNum += 32;
		}
		useO = document.getElementById('operaCheck').checked;
		if (!!useO) {
			checkBoxCookieNum += 64;
		}
		useWebkit = document.getElementById('webkitCheck').checked;
		if (!!useWebkit) {
			checkBoxCookieNum += 128;
		}
		setCookie("codeCheckBoxes", checkBoxCookieNum);
		showCode();
	}
	/*****END SHOW CODE*****/
	function setCodeCheckBoxes(checkBoxCode) {
		checkBoxCode = Number(checkBoxCode);
		//console.log(checkBoxCode.toString(2));
		if (checkBoxCode & 1) {
			document.getElementById("oldMSCheck").checked = "checked";
		} else if (!!document.getElementById("oldMSCheck").getAttribute("checked")) {
			document.getElementById("oldMSCheck").checked = false;
			document.getElementById("oldMSCheck").removeAttribute("checked");
		} else {
			document.getElementById("oldMSCheck").checked = false;
		}
		checkBoxCode = checkBoxCode >> 1;
		if (checkBoxCode & 1) {
			document.getElementById("oldMozCheck").checked = "checked";
		} else if (!!document.getElementById("oldMozCheck").getAttribute("checked")) {
			document.getElementById("oldMozCheck").checked = false;
			document.getElementById("oldMozCheck").removeAttribute("checked");
		} else {
			document.getElementById("oldMozCheck").checked = false;
		}
		checkBoxCode = checkBoxCode >> 1;
		if (checkBoxCode & 1) {
			document.getElementById("oldWebkitCheck").checked = "checked";
		} else if (!!document.getElementById("oldWebkitCheck").getAttribute("checked")) {
			document.getElementById("oldWebkitCheck").checked = false;
			document.getElementById("oldWebkitCheck").removeAttribute("checked");
		} else {
			document.getElementById("oldWebkitCheck").checked = false;
		}
		checkBoxCode = checkBoxCode >> 1;
		if (checkBoxCode & 1) {
			document.getElementById("commentsCheck").checked = "checked";
		} else if (!!document.getElementById("commentsCheck").getAttribute("checked")) {
			document.getElementById("commentsCheck").checked = false;
			document.getElementById("commentsCheck").removeAttribute("checked");
		} else {
			document.getElementById("commentsCheck").checked = false;
		}
		checkBoxCode = checkBoxCode >> 1;
		if (checkBoxCode & 1) {
			document.getElementById("msCheck").checked = "checked";
		} else if (!!document.getElementById("msCheck").getAttribute("checked")) {
			document.getElementById("msCheck").checked = false;
			document.getElementById("msCheck").removeAttribute("checked");
		} else {
			document.getElementById("msCheck").checked = false;
		}
		checkBoxCode = checkBoxCode >> 1;
		if (checkBoxCode & 1) {
			document.getElementById("mozCheck").checked = "checked";
		} else if (!!document.getElementById("mozCheck").getAttribute("checked")) {
			document.getElementById("mozCheck").checked = false;
			document.getElementById("mozCheck").removeAttribute("checked");
		} else {
			document.getElementById("mozCheck").checked = false;
		}
		checkBoxCode = checkBoxCode >> 1;
		if (checkBoxCode & 1) {
			document.getElementById("operaCheck").checked = "checked";
		} else if (!!document.getElementById("operaCheck").getAttribute("checked")) {
			document.getElementById("operaCheck").checked = false;
			document.getElementById("operaCheck").removeAttribute("checked");
		} else {
			document.getElementById("operaCheck").checked = false;
		}
		checkBoxCode = checkBoxCode >> 1;
		if (checkBoxCode & 1) {
			document.getElementById("webkitCheck").checked = "checked";
		} else if (!!document.getElementById("webkitCheck").getAttribute("checked")) {
			document.getElementById("webkitCheck").checked = false;
			document.getElementById("webkitCheck").removeAttribute("checked");
		} else {
			document.getElementById("webkitCheck").checked = false;
		}
	}
	function getCookies() {
		var cookies = { };
		if (document.cookie && document.cookie != '') {
			var split = document.cookie.split(';');
			for (var i = 0; i < split.length; i++) {
				var name_value = split[i].split("=");
				name_value[0] = name_value[0].replace(/^ /, '');
				cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);
			}
		}
		return cookies;
	}
	function getCookie(name) {
		var cookies = getCookies();
		if (cookies[name]) {
			return cookies[name];
		} else {
			return null;
		}
	}
	function setCookie(c_name, value, exdays) {
		var exdate = new Date();
		if (typeof exdays === "undefined") {
			exdays = 356;
		}
		exdate.setDate(exdate.getDate() + exdays);
		var c_value = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toUTCString());
		document.cookie = c_name + "=" + c_value;
	}
	function init() {
		var codeCheckBoxesCookie = getCookie("codeCheckBoxes");
		sliderBR = new SliderObj({'id' : 'brSlider', 'thumbId' : 'brThumb', 'max' : '253', 'min' : '-4', 'startPos' : '0%'});
		sliderBS = new SliderObj({'id' : 'bsSlider', 'thumbId' : 'bsThumb', 'max' : '253', 'min' : '-4', 'startPos' : '0%'});
		sliderO = new SliderObj({'id' : 'oSlider', 'thumbId' : 'oThumb', 'max' : '253', 'min' : '-4', 'startPos' : '100%'});
		useOldMoz = true;
		useOldMS = true;
		useOldWebkit = true;
		useMoz = true;
		useMS = true;
		useO = true;
		useWebkit = true;
		showComments = true;
		boxStyle = document.getElementById('changedDiv').style;
		cssStyle = {
			backgroundColor : "#ffffff",
			backgroundDirection : "",//top, right, bottom, left
			backgroundFromColor : "#ffffff",
			backgroundToColor : "#000000",
			borderColor : "#999999",
			borderRadius : [0, 0, 0, 0],//[[0, 0], [0, 0], [0, 0], [0, 0]];
			borderWidth : 2,
			boxShadow : [0, 0, 0, 0, false],//H, V, V, S, I
			boxShadowColor : "#000000",
			opacity : 100,//0 - 100
			rotation : 0
		};
		if (!!codeCheckBoxesCookie) {
			setCodeCheckBoxes(codeCheckBoxesCookie);
		} else {
			setCodeCheckBoxes(255);//8 checkboxes; 2^8 = 256
		}
		sliderBR.createSnapToEveryPercent(2);
		sliderBS.createSnapToEveryPercent(5);
		sliderO.createSnapToEveryPercent(1);
		sliderBR.extStartFunc = function () {
			updateBorderRadius(Math.round(sliderBR.posPxToPerc() / 2));
		};
		sliderBS.extStartFunc = function () {
			updateBoxShadow(Math.round(sliderBS.posPxToPerc() / 5));
		};
		sliderO.extStartFunc = function () {
			updateOpacity(sliderO.posPxToPerc());
		};
		sliderBR.extMoveFunc = function (e) {
			sliderBR.extStartFunc(e);
		};
		sliderBS.extMoveFunc = function (e) {
			sliderBS.extStartFunc(e);
		};
		sliderO.extMoveFunc = function (e) {
			sliderO.extStartFunc(e);
		};
		sliderBR.extEndFunc = function (e) {
			sliderBR.extStartFunc(e);
		};
		sliderBS.extEndFunc = function (e) {
			sliderBR.extStartFunc(e);
		};
		sliderO.extEndFunc = function (e) {
			sliderBR.extStartFunc(e);
		};
		sliderBR.extClickFunc = function (e) {
			sliderBR.extStartFunc(e);
		};
		sliderBS.extClickFunc = function (e) {
			sliderBS.extStartFunc(e);
		};
		sliderO.extClickFunc = function (e) {
			sliderO.extStartFunc(e);
		};
		sliderBR.extStartFunc(sliderBR);
		sliderBS.extStartFunc(document.getElementById(sliderBS.id));
		sliderO.extStartFunc(document.getElementById(sliderO.id));
		return {
			'sliderBR' : sliderBR,
			'sliderBS' : sliderBS,
			'sliderO' : sliderO,
			'useOldMoz' : useOldMoz,
			'useOldMS' : useOldMS,
			'useOldWebkit' : useOldWebkit,
			'useMoz' : useMoz,
			'useMS' : useMS,
			'useO' : useO,
			'useWebkit' : useWebkit,
			'showComments' : showComments,
			'setBasics' : setBasics,
			'updateBorderRadius' : updateBorderRadius,
			'setBorderRadii' : setBorderRadii,
			/*'getIEDirection' : getIEDirection*/
			'updateBoxShadow' : updateBoxShadow,
			'setBoxShadow' : setBoxShadow,
			'updateGradient' : updateGradient,
			'setGradient' : setGradient,
			'bgRadioChecked' : bgRadioChecked,
			'updateOpacity' : updateOpacity,
			'setOpacity' : setOpacity,
			'centerModal' : centerModal,
			'updateShowCode' : updateShowCode,
			'showCode' : showCode
		};
	}
	return init();
};
var CSS3ME = new PFunkGen();