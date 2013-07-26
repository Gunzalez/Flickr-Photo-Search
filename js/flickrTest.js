// JavaScript Document

var flickrTest = {
	props: {
		url: 'http://api.flickr.com/services/rest/?method=flickr.photos.search',
		tokens: '&api_key=927bb231f3362cb5acbb3dd0b06a4122&format=json&nojsoncallback=1',
		photoArray: [],
		itemsperPage: 20,
		currentPage: 0
	},
	methods:{
		fetch: function(){
			var string = document.forms["frmFlickrSearch"]["searchTerm"].value;
			if(string.length > 0){								
				searchUrl = flickrTest.props.url + '&tags=' + string +  flickrTest.props.tokens;
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.onreadystatechange = function(){
					if (xmlhttp.readyState==4 && xmlhttp.status==200){		
						var JSONObject = JSON.parse(xmlhttp.responseText);
						if(JSONObject.stat == 'ok'){							
							var length = JSONObject.photos.photo.length
							flickrTest.props.photoArray = [];
							for(var i=0; i<length; i++){
								var photo = JSONObject.photos.photo[i];
								var imageSrc = 'http://farm'+ photo.farm +'.static.flickr.com/'+ photo.server +'/'+ photo.id +'_'+ photo.secret +'_q.jpg';
								flickrTest.props.photoArray.push(imageSrc);
							}
						}
						flickrTest.methods.displayPage(1);
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
			var upperBound = flickrTest.props.itemsperPage * page
			var lowerBound = upperBound - flickrTest.props.itemsperPage;
			for(var i=lowerBound; i<upperBound; i++){
				var image = document.createElement('img');
				image.src = flickrTest.props.photoArray[i];
				image.width = '150';
				image.height = '150';
				document.getElementById('photoBoard').appendChild(image);
			}
		}
	},
	init: function(){
		document.getElementById('frmFlickrSearch').onsubmit = flickrTest.methods.fetch;
	}	
}

window.onload = function () {
	flickrTest.init();

}