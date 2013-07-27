// JavaScript Document
var flickrTest = {	
	utils: {
		removeClass: function(el, rmvClass){
			var curClass = el.className;
			curClass = curClass.replace(' '+rmvClass, '');
			curClass = curClass.replace(rmvClass+' ', '');
			el.className = curClass;
		},
		addClass: function(el, newClass){
			var curClass = el.className;
			if(curClass.indexOf(newClass) == -1){
				el.className = curClass + ' ' + newClass;
			};
		},
		html: {
			clearfloat: function(){
				var clearFloat = document.createElement('div');	
				clearFloat.className = 'cleft';
				return clearFloat;
			}
		}	
	},
	
	props: {
		url: 'http://api.flickr.com/services/rest/?method=flickr.photos.search',
		tokens: '&api_key=3adea58584c1edc262792b21cffffbcf&format=json&nojsoncallback=1',
		photoArray: [],
		itemsPerPage: 10,
		pageCount: 0,
		currentPage: 0
	},
	
	methods:{
		
		// AJAX fetching data into array
		fetch: function(){
			var string = document.forms["frmFlickrSearch"]["searchTerm"].value;
			var iPPel = document.getElementById('itemsPerPage');
			flickrTest.props.itemsPerPage = iPPel.options[iPPel.selectedIndex].value;
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
							if(length % flickrTest.props.itemsPerPage != 0){
								flickrTest.props.pageCount = flickrTest.props.pageCount + 1
							}
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
			
			// display images for this page
			flickrTest.props.currentPage = page;			
			document.getElementById('photoBoard').innerHTML = '';
			var upperBound = flickrTest.props.itemsPerPage * page;
			var lowerBound = upperBound - flickrTest.props.itemsPerPage;
			for(var i=lowerBound; i<upperBound; i++){
				if(flickrTest.props.photoArray[i] != undefined){
					var image = document.createElement('img');
					image.src = flickrTest.props.photoArray[i];
					image.width = '150';
					image.height = '150';
					document.getElementById('photoBoard').appendChild(image);
				};
			};
			document.getElementById('photoBoard').appendChild(flickrTest.utils.html.clearfloat());
			
			// adjust paging information
			document.getElementById('pageNo').innerHTML = flickrTest.props.currentPage + ' of ' + flickrTest.props.pageCount;
			
			//
			document.getElementById('pagination').innerHTML = '';
			for(var p=1; p<=flickrTest.props.pageCount; p++){
				var pageLink = document.createElement('a');
				pageLink.appendChild(document.createTextNode(p));
				pageLink.href = '#'+p;
				pageLink.onclick = function(e){
					e.preventDefault();
					var page = this.href.split('#')[1];
					flickrTest.methods.displayPage(page);
				}
				if(p == flickrTest.props.currentPage){
					pageLink.className = 'selected';
				};
				document.getElementById('pagination').appendChild(pageLink);
			}
			
			// adjust controls
			var controls = document.getElementById('controls').getElementsByTagName('a');
			for(var c=0; c<controls.length; c++){
				flickrTest.utils.removeClass(controls[c], 'disabled');
				flickrTest.utils.removeClass(controls[c], 'displayNone');
			};
			if(page == 1){
				flickrTest.utils.addClass(controls[0], 'disabled');	
			};
			if(page == flickrTest.props.pageCount){
				flickrTest.utils.addClass(controls[1], 'disabled');	
			};
			
		},
		pageSwitch: function(e){

			// Provides paging feature
			e.preventDefault(); 
			var control = e.target;
			if(control.className.indexOf('disabled') == -1){
				if(control.className.indexOf('prev') != -1){
					flickrTest.methods.displayPage(parseInt(flickrTest.props.currentPage) - 1);
				} else {
					flickrTest.methods.displayPage(parseInt(flickrTest.props.currentPage) + 1);
				};
			}; 
			
		}
	},
	
	init: function(){
		
		// Assign fetching event
		document.getElementById('frmFlickrSearch').onsubmit = flickrTest.methods.fetch;
		
		// Previus and Next controls events
		var controls = document.getElementById('controls').getElementsByTagName('a');
		for(var c=0; c<controls.length; c++){
			controls[c].onclick = flickrTest.methods.pageSwitch;	
		};
		
	}	
}

window.onload = function () {
	flickrTest.init();
};