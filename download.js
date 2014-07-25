function prettyOutput() {
	document.getElementById('result').style.display = "inline-block";
	document.getElementById('result').innerText = calculateCSS();
}

function getNums (input) {
	input = input.split(' - ');
	input.shift();
	input.forEach(function(n, i) {
		input[i]=parseInt(n);
	});
	return input;
}

function calculateCSS() {
	var mincss = "";
	var details = {
		general: false,
		headings: false,
		buttons: false,
		inputs: false,
		navbar: false,
		tables: false,
		icons: false,
		grid: false,
	};
	
	for (var i=0; i<document.getElementById('checkboxes').children.length; i++) {
		var currentTypeName = document.getElementById('checkboxes').children[i].children[0].name;
		var isChecked = document.getElementsByName(currentTypeName)[0].checked;
		
		details[currentTypeName] = isChecked;
		
		if (isChecked) {
			mincss += css[currentTypeName];
		}
	}

	var http = new XMLHttpRequest();
	var url = "http://8b51d1abd8.test-url.ws/gzipsize.php";
	var params = "encode="+mincss;
	http.open("POST", url, true);

	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.setRequestHeader("Content-length", params.length);
	http.setRequestHeader("Connection", "close");

	http.onreadystatechange = function() {
		//Call a function when the state changes.
		if (http.readyState == 4 && http.status == 200) {
			details.totalmingzip = parseInt(http.responseText);
			document.getElementById('details').innerHTML = document.getElementById('details').innerHTML.replace(' and', ',');
			document.getElementById('details').innerHTML += ", and " + details.totalmingzip + " bytes minified and gzipped.";
			mixpanel.track('Calculate CSS', details);
		}
	};
	http.send(params);

	document.getElementById('details').innerHTML = "Your download of min is " + mincss.length + " bytes minified and un-gzipped."

	console.log(details);
	return mincss;
}
