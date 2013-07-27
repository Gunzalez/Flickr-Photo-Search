
(function(){	
	FlickrSearch = function(options){				
		this.props = {
			url: 'http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3adea58584c1edc262792b21cffffbcf&format=json&nojsoncallback=1',
			photoArray: [],
			itemsPerPage: options.itemsPerPage || 10,
			maxItems: options.maxItems || 100,
			pageCount: 0,
			currentPage: 0,
			html: $('#flickrSearch')
		};
		
		this.utils = {
			html: {
				clearfloat: function(){
					return $clearFloat = $('<div class="cleft"></div>');
				}
			}	
		};
		
		var that = this;
		this.methods = {		
			// pull in image via ajax, fill array
			fetch: function(){								
				var form = that.props.html.find('form');
				var string = form.find('.searchTerm').val();
				var url = that.props.url + '&per_page=' + that.props.maxItems + '&tags=' + string + '&text=' + string; 				
				if($.trim(string).length > 0){
					that.props.photoArray = [];
					$.getJSON(url, function(data) {
						$.each(data.photos.photo, function(key, val) {
							var imgSrc = 'http://farm'+ val.farm +'.static.flickr.com/'+ val.server +'/'+ val.id +'_'+ val.secret +'_q.jpg';
							that.props.photoArray.push(imgSrc);
						});
						var count = that.props.photoArray.length;
						that.props.pageCount = parseInt(count / that.props.itemsPerPage);
						if(count % that.props.itemsPerPage != 0){
							that.props.pageCount = that.props.pageCount + 1
						}
						that.methods.displayPage(1);
					});
				}				
			},
			
			displayPage: function(page){				
				// display images for this page				
				var photoBoard = that.props.html.find('.photoBoard');
				photoBoard.empty();
				that.props.currentPage = page;				
				var upperBound = that.props.itemsPerPage * page;
				var lowerBound = upperBound - that.props.itemsPerPage;
											
				for(var i=lowerBound; i<upperBound; i++){
					if(that.props.photoArray[i] != undefined){
						photoBoard.append($('<img src="'+that.props.photoArray[i]+'" width="150" height="150" />'));
					};
				};
				photoBoard.append(that.utils.html.clearfloat());
				
				// adjust paging information
				that.props.html.find('.pageNo').html('page ' + that.props.currentPage + ' of ' + that.props.pageCount);
				
				that.props.html.find('.pagination').empty();
				for(var p=1; p<=that.props.pageCount; p++){		
					var $link = $('<a href="#page'+p+'">'+p+'</a>');					
					if(p == that.props.currentPage){
						$link.addClass('selected');						
					};
					$link.on('click',function(e){
						e.preventDefault()
						that.methods.displayPage($(this).attr('href').split('#page')[1]);
					})			
					that.props.html.find('.pagination').append($link);
				};			
				
				// adjust controls
				that.props.html.find('.controls a').removeClass('displayNone').removeClass('disabled');
				if(page == 1){
					that.props.html.find('.controls .prev').addClass('disabled');
				};
				if(page == that.props.pageCount){
					that.props.html.find('.controls .next').addClass('disabled');
				};				
			},
			
			switchPage: function($link){	 			
				if(!$($link).hasClass('disabled')){
					if($($link).hasClass('prev')){
						that.methods.displayPage(parseInt(that.props.currentPage) - 1);
					} else {
						that.methods.displayPage(parseInt(that.props.currentPage) + 1);
					};
				};
			}			
		};		
		
		// assign fetching event
		this.props.html.find('form').submit(function(){
			that.methods.fetch();
			return false;
		});
		
		// previous and Next controls events
		this.props.html.find('.controls a').on('click', function(e){
			e.preventDefault()
			that.methods.switchPage(this);
		});
	}	
	
	$(document).ready(function(){
				
		flickrSearch = new FlickrSearch({
			itemsPerPage: 25, 	// set items per page
			maxItems: 125		// set total number of items to fetch
		});	
			
	});		
}())