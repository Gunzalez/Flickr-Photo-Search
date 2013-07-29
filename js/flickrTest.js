
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
		}
		
		this.utils = {
			html: {
				clearfloat: function(){
					return $clearFloat = $('<div class="cleft"></div>');
				}
			}	
		}
		
		var that = this;
		this.methods = {
					
			// pull in data via ajax, fill up the array
			fetch: function(){	
										
				var form = that.props.html.find('form');
				var string = $.trim(form.find('.searchTerm').val());
				var params = { 'per_page': that.props.maxItems, 'tags': string, 'text': string }				
				var url = that.props.url + '&' + $.param(params);
								
				if(string.length > 0){	
								
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
								
						if(that.props.pageCount > 0){
																				
							// create pagination
							var $pagination = that.props.html.find('.pagination');
							$pagination.empty();
							for(var p=1; p<=that.props.pageCount; p++){		
								var $link = $('<a href="#page'+p+'">'+p+'</a>');			
								$pagination.append($link);
							};				
							$pagination.on('click', 'a', function(e){
								e.preventDefault();
								that.methods.displayPage($(this).attr('href').split('#page')[1]);
							});	
							
							// set paging info 
							var $pageNo = that.props.html.find('.pageNo');
							$pageNo.find('.total-images').html(that.props.photoArray.length);
							$pageNo.find('.current-page').html(that.props.currentPage);
							$pageNo.find('.total-pages').html(that.props.pageCount);							
		
							// set previous and next controls events
							var $controls = that.props.html.find('.controls');
							$controls.find('a.unset').on('click', function(e){
								e.preventDefault() 
								that.methods.switchPage(this);
							});
							// stops multiple event calls
							$controls.find('a.unset').removeClass('unset');
							
							// display controls
							$controls.removeClass('displayNone');
							
							// display page 1 of results						
							that.methods.displayPage(1); 
								
						}
												
					});
				}
								
			},
			
			displayPage: function(page){
								
				// set current page
				that.props.currentPage = page;
				
				// display images for this page				
				var photoBoard = that.props.html.find('.photoBoard');	
				photoBoard.empty();				
				
				// set start and end points of the loop				
				var upperBound = that.props.itemsPerPage * page;
				var lowerBound = upperBound - that.props.itemsPerPage;
				
				// loop through and add images to page								
				for(var i=lowerBound; i<upperBound; i++){
					if(that.props.photoArray[i] != undefined){
						photoBoard.append($('<img src="'+that.props.photoArray[i]+'" width="150" height="150" />'));
					}
				}
				photoBoard.append(that.utils.html.clearfloat());
				
				// adjust paging info 
				var $pageNo = that.props.html.find('.pageNo');
				$pageNo.find('.current-page').html(that.props.currentPage);
				
				// adjust pagination
				var $pagination = that.props.html.find('.pagination');
				$pagination.find('.selected').removeClass('selected');
				$pagination.find('a:eq('+(page-1)+')').addClass('selected');
								
				// adjust controls
				var $controls = that.props.html.find('.controls') 
				$controls.find('a').removeClass('disabled');
				if(parseInt(page) === 1){
					$controls.find('.prev').addClass('disabled');
				}
				if(parseInt(page) === parseInt(that.props.pageCount)){
					$controls.find('.next').addClass('disabled');
				}				
			},
			
			switchPage: function($link){				
				if(!$($link).hasClass('disabled')){
					if($($link).hasClass('prev')){
						that.methods.displayPage(parseInt(that.props.currentPage) - 1);
					} else {
						that.methods.displayPage(parseInt(that.props.currentPage) + 1);
					}
				}
			}
						
		};		
		
		// assign fetching event
		this.props.html.find('form').submit(function(){
			that.methods.fetch();
			return false;
		});
	}	
	
	$(document).ready(function(){
				
		var flickrSearch = new FlickrSearch({
			itemsPerPage: 25, 	// set items per page
			maxItems: 124		// set total number of items to fetch
		});	
			
	});		
}())