/**
 * 创建并打开画廊photoswipe。
 * @namespace createPhotoSwipe
 * @requires jQuery,PhotoSwipe
 * @author zhangzicao
 * @version 0.3.1
 * @param {string|object} [indexEl] 可选（indexEl和items中至少要有一个），当前图片的figure容器对象或选择器，方法内部会解析dom获取画廊所有图片数据和当前index值
 * @param {array} [items] 可选（indexEl和items中至少要有一个），图廊图片的json数据。如果indexEl也存在时，这些数据会添加到解析出来的数据后面
 * @param {string} items[].src 图片地址
 * @param {string} items[].title 图片标题
 * @param {string} [items[].msrc] 可选，缩略图地址
 * @param {string} [items[].size] 可选,图片大小
 * @param {object} option 支持所有PhotoSwipe的配置参数，另外新增几个参数如下：
 * @param {object} [option.index] 可选，可以设置从第几张图片开始预览
 * @param {boolean} option.rotatable=true 是否开启旋转
 * @param {boolean} option.rotateAnim=true 是否开启旋转动画
 * @param {string,object} option.pswp 自定义的pswp容器
 * @param {string} option.containerEl=.photo-gallery,[data-pswp-uid] 图集容器
 * @param {string} option.figureEl=.photo-gallery__figure item外层容器
 * @param {string} option.itemEl=.photo-gallery__item item容器
 * @return {object} 返回PhotoSwipe对象
 */

(function(root,factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define(['jquery', 'PhotoSwipe'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS.
    module.exports = factory(require('jquery'),require('PhotoSwipe'));
  } else {
    // Browser globals.
    root.createPhotoSwipe = factory(root.jQuery, root.PhotoSwipe);
  }
})(this,function(jquery, PhotoSwipe){
  var $ = jquery;

  //touch
  $.support=$.extend($.support,{
    touch:!!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch)
  })

  var defaultOption={
      containerEl:".photo-gallery,[data-pswp-uid]",
      figureEl:".photo-gallery__figure",
      itemEl:".photo-gallery__item",
      rotatable:true,//是否开启旋转
      rotateAnim:true//是否开启旋转动画
      //还支持PhotoSwipe的option配置
    }

  function createPhotoSwipe(indexEl ,items ,option) {
    //非必选转换
    if(indexEl instanceof Array) {
      option=items, items=indexEl, indexEl=null;
    }else if(!(items instanceof Array)){
      option=items,items=null;
    }
    if (!option) option={};

    option=$.extend({},defaultOption,option);

    var index = 1,
        gid = "qk"+parseInt(Math.random()*10000);

    if(indexEl){
      var $indexEl=$(indexEl);
      if($indexEl.is(option.itemEl)){
        $indexEl=$indexEl.closest(option.figureEl);
        if($indexEl.length==0){
          $indexEl=$(indexEl);
        }
      }
      var $container=$indexEl.closest(option.containerEl);
      var $figures=$container.find(option.figureEl);
      var $items=$container.find(option.itemEl);
      if($figures.length==0) $figures=$items;
      index=$figures.index($indexEl);
      items = parseThumbnailElements($container,option).concat(items||[]);
      gid = $container.attr('data-pswp-uid');
    }

    index=typeof option.index ==='number'? option.index: index;


    openPhotoSwipe(index, items, $.extend({
      gid: gid,
      disableAnimation:false,
      fromURL:false
    },option))
  }

  function openPhotoSwipe(index, items, option) {
    var disableAnimation=option.disableAnimation
    var fromURL=option.fromURL

    if (option.pswp) {
      var $pswp = $(option.pswp);
    }else{
      var pswpHTML='<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">\
        <div class="pswp__bg"></div>\
        <div class="pswp__scroll-wrap">\
          <div class="pswp__container">\
            <div class="pswp__item"></div>\
            <div class="pswp__item"></div>\
            <div class="pswp__item"></div>\
          </div>\
          <div class="pswp__ui pswp__ui--hidden">\
            <div class="pswp__top-bar">\
              <div class="pswp__counter"></div>\
              <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>\
              <button class="pswp__button pswp__button--share" title="Share"></button>\
              <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>\
              <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>\
              <button class="pswp__button pswp__button--rotation--right"></button>\
              <button class="pswp__button pswp__button--rotation--left"></button>\
              <div class="pswp__preloader">\
                <div class="pswp__preloader__icn">\
                  <div class="pswp__preloader__cut">\
                    <div class="pswp__preloader__donut"></div>\
                  </div>\
                </div>\
              </div>\
            </div>\
            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">\
              <div class="pswp__share-tooltip"></div>\
            </div>\
            <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">\
            </button>\
            <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">\
            </button>\
            <div class="pswp__caption">\
              <div class="pswp__caption__center"></div>\
            </div>\
          </div>\
        </div>\
      </div>'
      var $pswp = $(pswpHTML).appendTo('body');
    }
    var gallery,
      options;

    // 这里可以定义参数
    options = {
      barsSize: {
        top: 100,
        bottom: 100
      },
      shareButtons:[
        // { id: 'download', label: '保存图片', url: '{{raw_image_url}}', download: true }
      ], // 分享按钮

      // define gallery index (for URL)
      galleryUID: option.gid,
      tapToClose: true,
      fullscreenEl:false,
      getThumbBoundsFn: function(index) {
        //打开画廊的boundIn动画初始图片大小和位置
        if(typeof items[index].el=='undefined') return;
        var thumbnail = items[index].el.find('.photo-gallery__thumb,.photo-gallery__img,img').get(0); // find thumbnail
        if(thumbnail){
          var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
          var pageXScroll = window.pageXOffset || document.documentElement.scrollLeft;
          var rect = thumbnail.getBoundingClientRect();
          var left = rect.left;
          var top = rect.top;
          var width = rect.width;
          var height = rect.height;
          if(!$(thumbnail).is('img')){
            var $img = items[index].el.find('.photo-gallery__thumb');
            var sizeStr=$img.data('size');
            var imgWidth,imgHeight,bgWidth,bgHeight;
            if(!sizeStr){
              var img=new Image()
              img.src=items[index].msrc; 
              if(img.naturalWidth&&img.naturalWidth>0){
                $img.data('size',img.naturalWidth+'x'+img.naturalHeight);
                imgWidth=img.naturalWidth
                imgHeight=img.naturalHeight 
                if(!items[index].w){
                  items[index].w=img.naturalWidth
                  items[index].h=img.naturalHeight 
                }
              }
              img=null;
            }else{
              imgWidth = parseInt(sizeStr.substring(0 ,sizeStr.indexOf('x')),10);
              imgHeight = parseInt(sizeStr.substring(sizeStr.indexOf('x')+1),10);
            }
            if(imgWidth && imgHeight){
              if(width*imgHeight < height*imgWidth){
                bgWidth = parseInt(imgWidth*height/imgHeight,10);
                left-=parseInt((bgWidth - width)/2);
                width=bgWidth;
              }else{
                bgHeight = parseInt(imgHeight*width/imgWidth,10);
                top-=parseInt((bgHeight - height)/2);
              }
            } 
          }
          return { x: left + pageXScroll, y: top + pageYScroll, w: width };
        }
      }

    };

    // PhotoSwipe opened from URL
    if (fromURL) {
      if (options.galleryPIDs) {
        // parse real index when custom PIDs are used 
        for (var j = 0; j < items.length; j++) {
          if (items[j].pid == index) {
            options.index = j;
            break;
          }
        }
      } else {
        // in URL indexes start from 1
        options.index = parseInt(index, 10) - 1;
      }
    } else {
      options.index = parseInt(index, 10);
    }

    // exit if index not found
    if (isNaN(options.index)) {
      return;
    }

    if (disableAnimation) {
      options.showAnimationDuration = 0;
    }
    option=$.extend({},options,option);
    // Pass data to PhotoSwipe and initialize it
    gallery = new PhotoSwipe($pswp[0], PhotoSwipeUI_Default, items, option);

    gallery.listen('gettingData', function(index, item) { 
      //没有宽和高时使用缩略图的宽高
      var notHasEl = typeof items[index].el=='undefined';
      if(!notHasEl){
        var $item = items[index].el.find(option.itemEl);
        if($item.length==0){
          items[index].el.filter(option.itemEl);
        }
        var $img = items[index].el.find('.photo-gallery__thumb,.photo-gallery__img,img');
      }
      if((notHasEl && typeof item.w=='undefined') || (!notHasEl && !$img.data('size')) ){
        var img=new Image()
        img.src=item.msrc;
        if(img.naturalWidth&&img.naturalWidth>0){
          if(!notHasEl) $img.data('size',img.naturalWidth+'x'+img.naturalHeight);
          if(notHasEl || !$item.data('size') ){
            item.w=img.naturalWidth
            item.h=img.naturalHeight
          }
        }
        img=null
      }
      if((notHasEl && typeof item.w=='undefined') || (!notHasEl &&!$item.data('size')) ){
        var img2=new Image()
        img2.src=item.src; 
        if(img2.naturalWidth&&img2.naturalWidth>0){
          if(!notHasEl) $item.data('size',img2.naturalWidth+'x'+img2.naturalHeight);
          item.w=img2.naturalWidth
          item.h=img2.naturalHeight 
          img2=null
        }else{
          img2.onload=function() {
            if(img2.naturalWidth&&img2.naturalWidth>0 && (notHasEl || !$item.data('size'))){
              if(!notHasEl) $item.data('size',img2.naturalWidth+'x'+img2.naturalHeight);
              item.w=img2.naturalWidth
              item.h=img2.naturalHeight
              gallery.updateSize(true)
              img2=null
            }
          }
        }
      }
      if(!item.w){
        item.w=300
        item.h=200 
      }
    });

    gallery.listen('imageLoadComplete', function(index, item) { 
      //大图加载完毕时重新设置图片宽和高
      if(typeof items[index].el!=='undefined'){
        var $item = items[index].el.find(option.itemEl);
        if($item.length==0){ $item=items[index].el.filter(option.itemEl) }
        if($item.data('size')) return;
      }
      var img=new Image()
      img.src=item.src;
      if(img.naturalWidth && img.naturalWidth>0){
        item.w=img.naturalWidth
        item.h=img.naturalHeight
        if(typeof items[index].el!=='undefined')
          $item.data('size',item.w+'x'+item.h);
        gallery.updateSize(true)
      }
      img=null
    });

    gallery.listen('destroy', function() {
      if(option.rotatable){
        $pswp.find(".pswp__button--rotation--left,.pswp__button--rotation--right").off()
      }
      $pswp.remove();
      $pswp=null
    });


    gallery.init();

    //旋转图片
    var rotateImg=function(deg) {
      var $img=$(gallery.currItem.container).find('img').not('.pswp__img--placeholder');
      var imgNaturalWidth=getImgNaturalDimensions($img[0])[0];
      var imgNaturalHeight=getImgNaturalDimensions($img[0])[1];

      if(!imgNaturalWidth) return;
      if($img.hasClass('pswp__img_animing')) return;

      //计算纯transform旋转的缩放比例
      var ctWidth = $img.closest('.pswp__container').width();
      var ctHeight = $img.closest('.pswp__container').height()-gallery.currItem.vGap.top-gallery.currItem.vGap.bottom;
      var scaleData=getScaleData(ctWidth,ctHeight,imgNaturalWidth,imgNaturalHeight);
      var imgWidth = scaleData[1];
      // var imgHeight = scaleData[2];
      var scaleData2 = getScaleData(ctWidth,ctHeight,imgNaturalHeight,imgNaturalWidth);
      // var afterRotateWidth = scaleData2[1];
      var afterRotateHeight = scaleData2[2];
      var multiple= parseInt(afterRotateHeight*10000/imgWidth)/10000;
      var lastDeg=$img.data('deg')||0;
      $img.data('deg',deg);
      $img.addClass('pswp__img_animing')

      if(option.rotateAnim ){
        $img.addClass('pswp__img_anim')
      }else{
        $img.removeClass('pswp__img_anim')
      }

      if (deg%180===0) {
        var rotateBackFn=function () {
          $img.css({
            '-o-transform':'scale(1) rotate('+deg+'deg)',
            '-ms-transform':'scale(1) rotate('+deg+'deg)',
            '-moz-transform':'scale(1) rotate('+deg+'deg)',
            '-webkit-transform':'scale(1) rotate('+deg+'deg)',
            'transform':'scale(1) rotate('+deg+'deg)'
          });
        }

        //改回纯transform旋转
        $img.removeClass('pswp__img_anim')
        //图片大小重置
        gallery.currItem.h=imgNaturalHeight;
        gallery.currItem.w=imgNaturalWidth;
        gallery.updateSize(true);

        if(option.rotateAnim){
          $img.css({
            '-o-transform':'scale('+multiple+') rotate('+lastDeg+'deg)',
            '-ms-transform':'scale('+multiple+') rotate('+lastDeg+'deg)',
            '-moz-transform':'scale('+multiple+') rotate('+lastDeg+'deg)',
            '-webkit-transform':'scale('+multiple+') rotate('+lastDeg+'deg)',
            'transform':'scale('+multiple+') rotate('+lastDeg+'deg)'
          });
          setTimeout(function () {
            $img.addClass('pswp__img_anim')
            $img.on('transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd',function(){
              $img.off('transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd');
              $img.removeClass('pswp__img_animing')
            });
            rotateBackFn();
          },70)
        }else{
          rotateBackFn();
          $img.removeClass('pswp__img_animing')
        }
      }else{
        //旋转前缩放回原大小
        gallery.updateSize(true);

        //width和height配合transfrom做旋转
        var rotateFn=function () {
          var widthScale= parseInt(imgNaturalHeight*10000/imgNaturalWidth)/10000;
          var heightScale= parseInt(imgNaturalWidth*10000/imgNaturalHeight)/10000;

          gallery.currItem.h=imgNaturalWidth;
          gallery.currItem.w=imgNaturalHeight;
          gallery.updateSize(true)
          $img.css({
            '-o-transform':'scale('+widthScale+','+heightScale+') rotate('+deg+'deg)',
            '-ms-transform':'scale('+widthScale+','+heightScale+') rotate('+deg+'deg)',
            '-moz-transform':'scale('+widthScale+','+heightScale+') rotate('+deg+'deg)',
            '-webkit-transform':'scale('+widthScale+','+heightScale+') rotate('+deg+'deg)',
            'transform':'scale('+widthScale+','+heightScale+') rotate('+deg+'deg)'
          });
        }

        if(option.rotateAnim){
          $img.on('transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd',function(){
            $img.off('transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd');
            $img.removeClass('pswp__img_anim');
            rotateFn();
            setTimeout(function () {
              $img.addClass('pswp__img_anim');
              $img.removeClass('pswp__img_animing')
            },70)
          });

          //纯transfrom旋转
          $img.css({
            '-o-transform':'scale('+multiple+') rotate('+deg+'deg)',
            '-ms-transform':'scale('+multiple+') rotate('+deg+'deg)',
            '-moz-transform':'scale('+multiple+') rotate('+deg+'deg)',
            '-webkit-transform':'scale('+multiple+') rotate('+deg+'deg)',
            'transform':'scale('+multiple+') rotate('+deg+'deg)'
          });
        }else{
          rotateFn();
          $img.removeClass('pswp__img_animing')
        }

      }
    };

    //返回图片的实际尺寸
    var getImgNaturalDimensions=function(img) { 
      var nWidth, nHeight 
      if (img.naturalWidth) { // 现代浏览器 
        nWidth = img.naturalWidth 
        nHeight = img.naturalHeight 
      } else { // IE6/7/8 
        var imgae = new Image(); 
        image.src = img.src; 
        nWidth=image.width;
        nHeight=image.height;
      } 
      return [nWidth, nHeight] 
    };

    //返回图片在固定宽高的容器的缩放比例、缩放后的宽和高
    var getScaleData=function(ctWidth,ctHeight,imgWidth,imgHeight) { 
      if(ctWidth>=imgWidth && ctHeight>=imgHeight){
        return [1,imgWidth,imgHeight]
      }
      var scaleNum = Math.min(ctWidth/imgWidth, ctHeight/imgHeight);
      var rsWidth = ctWidth*imgHeight<ctHeight*imgWidth?ctWidth:(ctHeight*imgWidth/imgHeight);
      var rsHeight = ctWidth*imgHeight<ctHeight*imgWidth?ctWidth*imgHeight/imgWidth:ctHeight;
      return [scaleNum,rsWidth,rsHeight]
    };

    //事件绑定
    if(option.rotatable){
      if ($pswp.find('.pswp__button--rotation--left').length==0) {
        var $leftRotation=$('<button class="pswp__button pswp__button--rotation--left"></button>');
        var $rightRotation=$('<button class="pswp__button pswp__button--rotation--right"></button>');
        $pswp.find('.pswp__top-bar .pswp__preloader').before($rightRotation).before($leftRotation);
      }else{
        var $leftRotation=$pswp.find('.pswp__button--rotation--left').show();
        var $rightRotation=$pswp.find('.pswp__button--rotation--right').show();
      }
      $leftRotation.off().on($.support.touch?'touchstart':'mousedown',function(e) {
        e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
        var $img=$(gallery.currItem.container).find('img').not('.pswp__img--placeholder');
        var currentdeg=$img.data('deg')||0;
        rotateImg(currentdeg-90);
      });
      $rightRotation.off().on($.support.touch?'touchstart':'mousedown',function(e) {
        e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
        var $img=$(gallery.currItem.container).find('img').not('.pswp__img--placeholder');
        var currentdeg=$img.data('deg')||0;
        rotateImg(currentdeg+90);
      });
    }else{
      $pswp.find('.pswp__button--rotation--left,.pswp__button--rotation--right').hide();
    }
    if(!option.shareButtons || option.shareButtons.length==0){
      $pswp.find('.pswp__button--share').hide();
    }else{
      $pswp.find('.pswp__button--share').show();
    }
  };

  // 解析来自DOM元素幻灯片数据（URL，标题，大小...）
  function parseThumbnailElements($container,option){
    var $figures=$container.find(option.figureEl);
    var $items=$container.find(option.itemEl);
    if($figures.length==0) $figures=$items;

    var items = [];
    $items.each(function(i) {
      var item={};
      //src设置
      item.src = $(this).data("href") || $(this).attr("href");
      //title设置
      item.title = $(this).data("title") || $(this).attr("title") || $figures.eq(i).find('.caption,figcaption').eq(0).text();
      //缩略图设置
      var msrc = $(this).data("thumb") || $(this).find("img").attr('src');
      item.msrc=msrc || item.src;

      item.el = $figures.eq(i); // 保存链接元素 for getThumbBoundsFn

      //宽高设置使用item上的data-size（否则暂时使用缩略图的data-size）
      var sizeStr=$(this).data('size');
      if(!sizeStr){ sizeStr = $(this).find('.photo-gallery__thumb,.photo-gallery__img,img').data('size'); }
      if(sizeStr){
        item.w = parseInt(sizeStr.substring(0 ,sizeStr.indexOf('x')),10)
        item.h = parseInt(sizeStr.substring(sizeStr.indexOf('x')+1),10)
      }

      items.push(item)
    })
    return items;
  }


  // 从url解析当前要打开的图片 (#&pid=1&gid=2)
  var photoswipeParseHash = function() {
    var hash = window.location.hash.substring(1),
      params = {};

    if (hash.length < 5) {
      return params;
    }

    var vars = hash.split('&');
    for (var i = 0; i < vars.length; i++) {
      if (!vars[i]) {
        continue;
      }
      var pair = vars[i].split('=');
      if (pair.length < 2) {
        continue;
      }
      params[pair[0]] = pair[1];
    }

    if (params.gid) {
      params.gid = parseInt(params.gid, 10);
    }

    return params;
  };

  // URL解析
  var hashData = photoswipeParseHash();
  if (hashData.pid && hashData.gid && $('[data-pswp-uid="'+hashData.gid+'"]').length>0) {

    var items2 = parseThumbnailElements($('[data-pswp-uid="'+hashData.gid+'"]'),defaultOption);

    openPhotoSwipe(hashData.pid,items2,$.extend({},defaultOption,{
      gid: hashData.gid,
      disableAnimation:true,
      fromURL:true
    }));
  }
  return createPhotoSwipe;
}); 