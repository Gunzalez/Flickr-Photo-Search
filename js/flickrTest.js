// JavaScript Document

var flickrTest = {
	props: {
		url: 'http://api.flickr.com/services/rest/?method=flickr.photos.search',
		tokens: '&api_key=3adea58584c1edc262792b21cffffbcf&format=json&nojsoncallback=1',
		photoArray: [],
		itemsPerPage: 20,
		pageCount: 0,
		currentPage: 0
	},
	methods:{
		fetch: function(){
			var string = document.forms["frmFlickrSearch"]["searchTerm"].value;
			if(string.length > 0){								
				searchUrl = flickrTest.props.url + '&tags=' + string + '&text=' + string +  flickrTest.props.tokens;
				flickrTest.props.photoArray = [];
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.onreadystatechange = function(){
					if (xmlhttp.readyState==4 && xmlhttp.status==200){		
						var JSONObject = JSON.parse(xmlhttp.responseText);
						if(JSONObject.stat == 'ok'){							
							var length = JSONObject.photos.photo.length;
							for(var i=0; i<length; i++){
								var photo = JSONObject.photos.photo[i];
								var imageSrc = 'http://farm'+ photo.farm +'.static.flickr.com/'+ photo.server +'/'+ photo.id +'_'+ photo.secret +'_q.jpg';
								flickrTest.props.photoArray.push(imageSrc);
							}
							flickrTest.props.pageCount = parseInt(length / flickrTest.props.itemsPerPage);
							flickrTest.methods.displayPage(1);
						}
					}
				}
				xmlhttp.open("GET",searchUrl,true);
				xmlhttp.send();				
			}
			return false;
		},
		displayPage: function(page){
			flickrTest.props.currentPage = page;
			document.getElementById('photoBoard').innerHTML = '';
			var upperBound = flickrTest.props.itemsPerPage * page
			var lowerBound = upperBound - flickrTest.props.itemsPerPage;
			for(var i=lowerBound; i<upperBound; i++){
				var image = document.createElement('img');
				image.src = flickrTest.props.photoArray[i];
				image.width = '150';
				image.height = '150';
				document.getElementById('photoBoard').appendChild(image);
			}
			
			document.getElementById('pageNo').innerHTML =  flickrTest.props.currentPage + ' of ' + flickrTest.props.pageCount;
			
		},
		pageSwitch: function(e){
			var control = e.target;
			if(control.className.indexOf('prev') != -1){
				flickrTest.methods.displayPage(flickrTest.props.currentPage - 1);
			} else {
				flickrTest.methods.displayPage(flickrTest.props.currentPage + 1);
			};
			e.preventDefault(); 
		}
	},
	init: function(){
		// Assign fetching event
		document.getElementById('frmFlickrSearch').onsubmit = flickrTest.methods.fetch;
		
		// Previus and Next controls
		var controls = document.getElementById('controls').getElementsByTagName('a');
		for(var c=0; c<controls.length; c++){
			controls[c].onclick = flickrTest.methods.pageSwitch;	
		}
	}	
}

window.onload = function () {
	flickrTest.init();

}