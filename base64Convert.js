var http = require('http');
var fs = require('fs');

//处理

var arr = [
	'demo1.css',
	'demo2.css'
];

for(var i in arr){
	doConvert(arr[i]);
}

function doConvert(cssName){
	var fsStr = fs.readFileSync(cssName, 'utf8');
	var imgLength = fsStr.split('//i.thsi.cn').length-1; //获取css中图片地址链接有多少个
	getBase64(fsStr,imgLength,cssName);
}

function getBase64(fsStr,imgLength,cssName){
	var originUrl = getUrl(fsStr);
	var url = sethttp(originUrl);
	if(imgLength <= 0){
		// console.log();
		fs.writeFile(cssName, fsStr);
		console.log('写入成功');
		return;
	}

	http.get(url,function(res){
	　　var chunks = []; //用于保存网络请求不断加载传输的缓冲数据
	　　var size = 0;　　 //保存缓冲数据的总长度

	　　res.on('data',function(chunk){
	　　　　chunks.push(chunk);　 
	　　　　size += chunk.length;
	　　});

	　　res.on('end',function(err){
	　　　　var data = Buffer.concat(chunks, size);
	　　　　var base64Img = data.toString('base64');
			
			base64Img = 'data:image/png;base64,'+base64Img;
			fsStr = fsStr.replace(originUrl, base64Img);
			imgLength--;
			getBase64(fsStr,imgLength,cssName);
	　　});
	});
}

function sethttp(url){
	if(url.indexOf("http:") > -1 && url.indexOf("https:") > -1){
		return url;
	}
	return 'http:'+url;
}

function getUrl(data){ //获取当前数据的第一个图片链接的位置和url
	var start = 0;
	var end = 0;
	if(data.indexOf('//i.thsi.cn') > -1){
		start = data.indexOf('//i.thsi.cn');
		end = data.indexOf(".png", start);
		urlStr = data.slice(start, end+4);
		return urlStr;
	}else{
		return '';
	}
}
