	

$(function(){
//<!-- 导航栏ajax -->
	$.ajax({
		url:'http://192.168.70.39:9900/api/nav',

		success:function(data){
			data=JSON.parse(data);///为什么要进行parse转换，不是ajax中已经转换了码？
			for (var i = 0; i < data.length; i++) {
				var listring='<li><a href="#" type="'+data[i].type+'">'+data[i].name+'</a></li>';
				$('#nav .w .navul').append(listring);
			};
		}
	})

 //<!-- 导航栏nav  li标签移入显示hideul -->
	 	var hideulFlagShow=true;//假设可以显示了
	 	$('#nav  .navul').on('mouseover','a',function(){
	 		// $('.hideul ').html('');//为什么这句会报
	 		var type=$(this).attr('type');
	 		if(type!=''){
	 			$('.hide-nav').stop().slideDown(1000);
	 			$('.hideul >li').remove();
	 			$.ajax({
	 				url:'http://192.168.70.39:9900/api/nav',
	 				data:{
	 					type:$(this).attr('type')
	 				},
	 				success:function(data){
	 					console.log($(this).attr('type'));
	 					data=JSON.parse(data);
	 					for (var i = 0; i < data.length; i++) {		
	 						var result=template('hide-nav-ul',data[i]);
	 						$('.hideul').append(result);
	 					}
	 					}
	 				})
	 		}
	 	})

		$('#nav  .navul').on('mouseout',function(){
			$('.hide-nav').stop().slideUp(1000);
			})
		$('.hide-nav').mouseover(function(){
			$(this).stop().slideDown(1000);
		})
		$('.hide-nav').mouseout(function(){
			$(this).stop().slideUp(1000);
		})

	//<!-- banner区域 -->
		//轮播图侧边栏
		
		$.ajax({
			url:'http://192.168.70.39:9900/api/items',
			success:function(data){
				data=JSON.parse(data);
				for (var i = 0; i < data.length; i++) {
					var linew='<li type="'+data[i].type+'">'+data[i].content+'</li>'
					$('#banner .sort').append(linew);
				};
				
			}
		})
		$('#banner .sort ').on('mouseover','li',function(){
					$('#banner .catogaryBox').find('ul').remove();
					$('.catogary').show();
					$('.sort  >li').removeClass('active');
					$(this).addClass('active');
					var sortType=$(this).attr('type');
					// console.log(sortType)
					$.ajax({
						url:'http://192.168.70.39:9900/api/items',
						data:{type:sortType},
						success:function(data){
							data=JSON.parse(data);
							// console.log(data);
							// console.log(data.length);
							var numberColumn=Math.floor(data.length/6);//列
							var numberRow=data.length%6;//最后一列的行数
							// console.log(numberColumn,numberRow)
							for (var i = 0; i < numberColumn; i++) {
								var $ul='<ul class="clearfix catogaryItem"><ul>';
								$('.catogaryBox').append($ul);
								for (var j = 0; j < 6; j++) {
									var result=template('catogary',data[6*i+j]);
									// console.log(result);
									$('.catogaryItem').eq(i).append(result);
								};
							};
							var $ul='<ul class="clearfix catogaryItem"><ul>';
							$('.catogaryBox').append($ul);
							for (var i = 0; i < numberRow; i++) {
								$('.catogaryItem').last().append(template('catogary',data[6*numberColumn+i]));
							};
						}
					})
		})
				$('#banner .sort ').on('mouseout','li',function(){
					$(this).removeClass('active');
					$('.catogary').hide();
				})
				$('.catogary').mouseover(function(){
					$(this).show();
				})
				$('.catogary').mouseout(function(){
					$(this).hide();
				})

		//轮播图
		
			$.ajax({
				url:'http://192.168.70.39:9900/api/lunbo',
				success:function(data){
					data=JSON.parse(data);
					for (var i = 0; i < data.length; i++) {
						$('.slideUl').append(template('slideTemplate',data[i]))
					};
					var slideIndex=0;//定义index
					var slidewidth=$('.slide').width();
					var slideLiNum=$('.slideUl li').length;//li标签的个数
					$('#banner .next').click(function(){
						autoSlide();
					})
					$('#banner .prev').click(function(){
						if(slideIndex<=0){
							slideIndex=slideLiNum-1;
						}else{
							slideIndex--;
						}
						// console.log(slideIndex)
						$('.slideUl li').hide().eq(slideIndex).fadeIn(1000);;
					})
					var slideId=null;
					//自动轮播
					slideId=setInterval(autoSlide, 2000);
					 //slide移入移出开启关闭定时器
					 $('.slide').mouseover(function(){
					 	clearInterval(slideId);
					 })
					 $('.slide').mouseout(function(){
					 	slideId=setInterval(autoSlide, 2000)
					 })

					function autoSlide(){
						if(slideIndex>=slideLiNum-1){
							slideIndex=0;
						}else{
							slideIndex++;
						}
						// console.log(slideIndex)
						$('.slideUl li').hide().eq(slideIndex).fadeIn(1000);;
					}




				}
			})

	//智能硬件
		$.ajax({
			url:'http://192.168.70.39:9900/api/hardware',
			dataType:'json',
			success:function(data){
				// console.log(data);
				for (var i = 0; i < data.length; i++) {
					$('.goods').append(template('hardwareTem',data[i]));
					var text=data[i]['discount'];
					// if(text=="享九折"){
					// 	$('.good').find('del').html(data[i]['price']/0.9)
					// }
				};

			}
		})

	//周边
		$.ajax({
		url:'http://192.168.70.39:9900/api/product',
		// dataType:'json',
		data:{
			toptitle:'around'
		},
		success:function(data){
			// console.log(data);
			var $span='<span>'+data.topTitleName+'</span>';
			$('#around').find('.topTitle').append($span);
			$('#around').find('.groups-left >ul').append(template('groupleft',data));
			$('#around').find('.topTitle >ul').append(template('grouptitle',data));
			$('#around').find('.topTitle a').first().addClass('active');
			for (var i = 0; i < data.hotcloths.length-1; i++) {
				$('#around').find('.groups-right >ul').append(template('groupright',data.hotcloths[i]));
			}
			// console.log(data.hotcloths[7])
			$('#around').find('.groups-right >ul').append(template('groupsLast',data.hotcloths[7]));
		}
	})


	//搭配
		$.ajax({
		url:'http://192.168.70.39:9900/api/product',
		// dataType:'json',
		data:{
			toptitle:'match'
		},
		success:function(data){
			// console.log(data);
			var $span='<span>'+data.topTitleName+'</span>';
			$('#groups').find('.topTitle').append($span);
			$('#groups').find('.groups-left >ul').append(template('groupleft',data));
			$('#groups').find('.topTitle >ul').append(template('grouptitle',data));
			$('#groups').find('.topTitle a').first().addClass('active');
			for (var i = 0; i < data.hotgoods.length-1; i++) {
				$('#groups').find('.groups-right >ul').append(template('groupright',data.hotgoods[i]));
			}
			$('#groups').find('.groups-right >ul').append(template('groupsLast',data.hotgoods[7]));
		}
	})


	//<!-- 配件 -->


	//配件部分
		$.ajax({
			url:'http://192.168.70.39:9900/api/product',
			// dataType:'json',
			data:{
				toptitle:'accessories'
			},
			success:function(data){
				// console.log(data);
				var $span='<span>'+data.topTitleName+'</span>';
				$('#parts').find('.topTitle').append($span);
				$('#parts').find('.groups-left >ul').append(template('groupleft',data));
				$('#parts').find('.topTitle >ul').append(template('grouptitle',data));
				$('#parts').find('.topTitle a').first().addClass('active');
				for (var i = 0; i < data.hot.length-1; i++) {
					$('#parts').find('.groups-right >ul').append(template('groupright',data.hot[i]));
				}
				// console.log(data.hot[7])
				$('#parts').find('.groups-right >ul').append(template('groupsLast',data.hot[7]));
			}
		})
	//搭配、配件、周边 部分内选项卡切换数据获取
	 data('#parts');
	 data('#groups');
	 data('#around');
		function data(id){
			$(id).find('.topTitle >ul').on('mouseover','a',function(){
			$(id).find('.topTitle >ul').find('a').removeClass('active');
			$(this).addClass('active');
			var $key=$(this).attr('key');
			console.log($key);
			$.ajax({
				url:'http://192.168.70.39:9900/api/product',
				data:{
					key:$key
				},
				success:function(data){
					// console.log(data);
					// var result=template('groupdatas',data);
					$(id).find('.groups-right >ul').html('');
					for (var i = 0; i < data.datas.length-1; i++) {
					$(id).find('.groups-right >ul').append(template('groupright',data.datas[i]));
				}
				// console.log(data.datas[7])
				$(id).find('.groups-right >ul').append(template('groupsLast',data.datas[7]));
				}
			})
		})
		}


	//<!--  为你推荐-->


		
		for (var i = 0; i < 3; i++) {
			recommendAjax(i);
		};

		function recommendAjax(mypage){
			$.ajax({
				url:'http://192.168.70.39:9900/api/recommend',
				data:{
					page:mypage
				},
				success:function(data){
					var result=template('recommendBody',data);
					$('.recommend-body').find('ul').append(result)
				},dataType:'json'
			})
			
		}
		var recommendIndex=0;
		var slidewidth=$('.recommend-body').width();
		// setInterval(function(){
		// 	if(recommendIndex>=0){
		// 		recommendSlideLeft();
		// 	}
		// 	if(recommendIndex>=3){
		// 		recommendSlideRight();
		// 	}
			
		// },1000)
		$('#recommend .header ul .next').click(function(){
			recommendSlideLeft();
		})
		function recommendSlideLeft(){
			//向左滑动
			var $this=$('#recommend .header ul .next');
			if($this.hasClass('disabled')){
				return;
			}else{
				$('#recommend .header ul >li').removeClass('disabled');
				$this.removeClass('disabled')
				recommendIndex++;
				$('#recommend .recommend-body ul').animate({
					left:-slidewidth*recommendIndex-13
				}, 1000,function(){
					if(recommendIndex>=2){
						$this.addClass('disabled');
					}
				})
			}	
		
		}
			$('#recommend .header ul .prev').addClass('disabled')
			function recommendSlideRight(){
				var $this=$('#recommend .header ul .prev');
			if($this.hasClass('disabled')){
				// $(this).addClass('disabled');
				return;
			}else{
				// $this.removeClass('disabled');
			$('#recommend .header ul >li').removeClass('disabled');
				recommendIndex--;
			$('#recommend .recommend-body ul').animate({
				left:-slidewidth*recommendIndex-13
			}, 1000,function(){
				if(recommendIndex==0){
					$this.addClass('disabled');	
			}
			})
			}
			}
		$('#recommend .header ul .prev').on('click',function(){
			recommendSlideRight();
		})

	//<!-- 热评产品 -->

		$.ajax({
			url:'http://192.168.70.39:9900/api/hotcomment',
			dataType:'json',
			success:function(data){
				// console.log(data);
				var result=template('hotbody',data);
				// console.log(result);
				$('.hot-body ul').append(result);
			}
		})


	//<!-- 内容 -->
		$.ajax({
			url:'http://192.168.70.39:9900/api/content',
			dataType:'json',
			success:function(data){
				console.log(data);
					var result=template('content-Body',data);
							 $('.content-body').append(result);	
					for (var i = 0; i < data.contents.length; i++) {
						for (var j = 0; j < data.contents[i].list.length; j++) {
							if(data.contents[i].list[j].btnTxt==""){
								var resultli=template('content-Body-ul1',data.contents[i].list[j]);
							}else{
								var resultli=template('content-Body-ul2',data.contents[i].list[j]);
							}
							$('.content-body .content-item').eq(i).find('.ul-out').append(resultli)
						};
					};
				var contentWidth=$('#content .content-item:eq(0)').width();
				var indexObj={};
					var contentIndex=0;
		$('#content .next' ).on('click',function(){
				var type=$(this).parent().attr('type');
				if( indexObj[type]>=3){
						return;
					}		
				if(indexObj[type]){
				     indexObj[type]++;
				   }else {
				     indexObj[type] = 1;
				   }
				console.log(indexObj[type] )				
						$(this).siblings('.dot ').find('span').removeClass('current').eq( indexObj[type]).addClass('current');
						$(this).siblings('ul').animate({
							left:- indexObj[type]*contentWidth
						},1000)
					})
		$('#content .prev' ).on('click',function(){
						var type=$(this).parent().attr('type');
						if( indexObj[type]<=0){
							return;
						}
						 indexObj[type]--;
						$(this).siblings('.dot').find('span').removeClass('current').eq( indexObj[type]).addClass('current');
						$('.dot span').eq( indexObj[type]);
						$(this).siblings('ul').animate({
							left:- indexObj[type]*contentWidth
						},1000)
					})
				}
		})
	
//<!-- 视频 -->
$.ajax({
	url:'http://192.168.70.39:9900/api/video',
	dataType:'json',
	success:function(data){
		console.log(data);
		$('#vedio .video-body ul').append(template('video-body',data))
		$('#vedio .video-body ul li').find('a').click(function(){
			// console.log($(this).data('url'))
			$('#mask').find('.title').html($(this).data('title'))
			var urlLink=$(this).data('url')
			$('#mask').find('iframe').attr('src',urlLink);
			$('#mask').fadeIn(1000);
		})
	}
})	
$('#mask .close').click(function(){
	$('#mask').fadeOut(1000);
})



//搜索框
	var config=$("#search").data('search-config');
	// var config=$("#search").data('search-config');
	// console.log(typeof (config))
	// var data=eval(config)
	// console.log(config)
	// jsondadta=JSON.parse(config)
	// console.log(jsondadta)

var config=[{'Key':'小米6','Rst':7},
		{'Key':'红米Note 4X','Rst':8},
		{'Key':'小米MIX','Rst':1},
		{'Key':'小米Max2','Rst':3}
		,{'Key':'小米手机5c','Rst':3},
		{'Key':'手环','Rst':6},
		{'Key':'耳机','Rst':19},
		{'Key':'充电宝','Rst':19},
		{'Key':'运动鞋','Rst':2},
		{'Key':'路由器','Rst':17},
		{'Key':'小米盒子','Rst':8}];

for (var i = 0; i < config.length; i++) {
	$('ul.keywords').append(template('searchKeywords',config[i]))
};

$('#search').focus(function(){
	console.log('haha')
	$('.nav-right').addClass('active')
	$('.keywords').slideDown();
	$('.keywords').on('mouseover','li',function(){
		$(this).siblings('li').removeClass('current');
		$(this).addClass('current')
	})
	$('.keywords').on('click','li',function(){
		$('#search').val($(this).find('.name').html())
		$('.keywords').slideUp()
	})
})
$('#search').blur(function(){
	console.log('blur')
	$('.nav-right').removeClass('active');
	$('.keywords').slideUp();
})













})




			
// function  bodyGetData(api){
// 	$.ajax({
// 	url:'http://192.168.70.39:9900/api/product',
// 	// dataType:'json',
// 	data:{
// 		toptitle:api
// 	},
// 	success:function(data){
// 		console.log(data);
// 		$('#groups').find('.groups-left >ul').append(template('groupleft',data));
// 		$('#groups').find('.topTitle >ul').append(template('grouptitle',data));
// 		$('#groups').find('.topTitle a').first().addClass('active');
// 		for (var i = 0; i < data.hotgoods.length-1; i++) {
// 			$('#groups').find('.groups-right >ul').append(template('groupright',data.hotgoods[i]));
// 		}
// 		console.log(data.hotgoods[7])
// 		$('#groups').find('.groups-right >ul').append(template('groupsLast',data.hotgoods[7]));
// 	}
// })
// }						
				

// $('#banner .next').click(function(){
// 	if(slideIndex>=slideLiNum-1){
// 		slideIndex=0;
// 		console.log(slideIndex);
// 		$('.slideUl').css('left',0)
// 	}
// 	slideIndex++;
// 	$('.slideUl').animate({
// 		left:-slideIndex*slidewidth
// 	}, 1000,function(){
		
// 	})
// })
// console.log(slideIndex);
// $('#banner .prev').click(function(){
// 	if(slideIndex<=0){
// 		slideIndex=slideLiNum-1;
// 		console.log(slideIndex);
// 		$('.slideUl').css('left',-slideIndex*slidewidth+'px')
// 	}
// 	slideIndex--;
// 	$('.slideUl').animate({
// 		left:-slideIndex*slidewidth
// 	},1000,function(){
		
// 	})
// })
// bodyGetData('accessories','#parts','hot')
// function bodyGetData(api,id,dataName){
// 	$.ajax({
// 	url:'http://192.168.70.39:9900/api/product',
// 	// dataType:'json',
// 	data:{
// 		toptitle:api
// 	},
// 	success:function(data){
// 		console.log(data);
// 		$(id).find('.groups-left >ul').append(template('groupleft',data));
// 		$(id).find('.topTitle >ul').append(template('grouptitle',data));
// 		$(id).find('.topTitle a').first().addClass('active');
// 		for (var i = 0; i < 7; i++) {
// 			// console.log(data.dataName[0]);
// 			$(id).find('.groups-right >ul').append(template('groupright',data[dataName][i]));
// 		}
// 		console.log(data.dataName[7])
// 		$(id).find('.groups-right >ul').append(template('groupsLast',data[dataName][7]));
// 	}
// 	})
// }