function func_post(post_data, url, callback) {
	$.ajax({
		type: 'POST',
		data: post_data,
        url: url,
        dataType: "json",
        success: function(data) {
            //console.log("http post result data:  " + JSON.stringify(data));
            callback(JSON.stringify(data));
        }
    });
}

function func_post_multipart(url, post_data, callback) {
	$.ajax({
        url: url,
        type: "POST",
        data: post_data,
        mimeType: "multipart/form-data",
        processData: false,
        contentType: false,
        cache: false,
        crossDomain: true,
        success: function (data) {
            callback(JSON.stringify(data));
        },
        error: function (error) {
            console.log("Something went wrong! : " + error);
        }
    });
}

function func_get(url, callback) {                    
	$.ajax({
		type: 'GET',
        url: url,						
        success: function(data) {
            //console.log("http get result data:  " + data);
            callback(data);
        }
    });
}

