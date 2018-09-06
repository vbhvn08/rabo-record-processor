(function(){

angular.module('app')
.service('FileProcessorService', fileProcessorService)
.service('ValidateRecords', validateRecords);

function fileProcessorService($q){
	
	var fileReader = new FileReader();

	this.processFile = function(file, type){
		var deferred = $q.defer();
		fileReader.readAsText(file)
		fileReader.onload = function(e){
			var jsonData;
			if(type == "CSV"){
				jsonData = processCSV(e.target.result);
			}else if(type == "XML"){
				var jsObj = processXML(e.target.result);
				if(!!jsObj && jsObj.records && jsObj.records.record){
					jsonData = jsObj.records.record;
				}else{
					deferred.reject("file error");
				}
			}
			deferred.resolve(jsonData);
		}
		return deferred.promise
	}

	/**
	 * take csv string input
	 * return js object
	 */
	function processCSV(csv){
		var lines=csv.split("\n");
		var result = [];
		var headers=lines[0].split(",");
	  
		for(var i=1;i<lines.length;i++){
			var obj = {};
			var currentline=lines[i].split(",");
			
			if(currentline.length>1){
				for(var j=0;j<headers.length;j++){
					obj[camelize(headers[j])] = currentline[j];
				}
				result.push(obj);
			}
			
		}
		
		return result; //JavaScript object	
	};
	
	/**
	 * proceXML will take xml string input
	 * uses abdmob/x2js library to convert it to js object
	 */
	function processXML(xml){
		var x2js = new X2JS();
		var jsObj = x2js.xml_str2json(xml);
		return jsObj;
	}

	/**
	 * take str and convert it to camelCase string
	 *  used to convert object keys to camelcase
	 */
	function camelize(str) {
		return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
		  return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
		}).replace(/\s+/g, '');
	  }
	  
}


function validateRecords(){
	
	this.validate = function(records){
		var refArr = [];
		for(var i= 0; i<records.length; i++){
			if(!!records[i].reference){
				var endBal = parseFloat(records[i].startBalance) + parseFloat(records[i].mutation); 
				if(refArr.indexOf(records[i].reference) != -1){
					records[i].status = "failed";
					records[i].reason = "Duplicate Transaction Reference";
					records[refArr.indexOf(records[i].reference)].status = "failed";
					records[refArr.indexOf(records[i].reference)].reason = "Duplicate Transaction Reference"; 
					
				}else if( parseFloat(Number(endBal).toFixed(2)) !== parseFloat(records[i].endBalance)){
					records[i].status = "failed";
					records[i].reason = "Invalid End balance";
				}else{
					records[i].status = "success";
				}
				refArr.push(records[i].reference);
			}

		}
		
		return records;

	}

}

})();