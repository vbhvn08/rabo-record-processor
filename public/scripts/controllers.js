(function(){

angular.module('app')
.controller('FileProcessorController', FileProcessorController);

function FileProcessorController(FileProcessorService, ValidateRecords){
    var ctrl = this;
    var failedRecords = [];
    ctrl.errorMessage = "";

    ctrl.getFile = function (inputFile) {
        var type = "";
        var fileItem = document.getElementById("recordFile");
        var extensionXML = /(\.xml)$/i;
        var extensionscsv = /(\.csv)$/i;

        if(extensionscsv.exec(fileItem.value)){
            type = "CSV";
        }else if(extensionXML.exec(fileItem.value)){
            type = "XML"
        }

        if(!!fileItem.files[0]){
            if(!type){
                //error
                ctrl.errorMessage = "Please select CSV or XML file";
            }else{
                FileProcessorService.processFile(fileItem.files[0], type).then(function(data){
                    if(!!data && data.length > 0){
                        ctrl.records = ValidateRecords.validate(data);
                        console.log(ctrl.records);
                    }
                    
                }, function(error){
                    ctrl.errorMessage = "Something Went Wrong";
    
                });
            }
            
        }else{
            //error
            ctrl.errorMessage = "Please select proper file";
        }
        
    }
    
    this.fileFocus = function(){
        ctrl.errorMessage = "";
    }
}

})();