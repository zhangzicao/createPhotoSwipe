# createPhotoSwipe
``` bash
基于photoSwipe封装了一个方便调用的方法，支持旋转，且item.w和item.h不再是必须的参数
```

## 介绍
有经验前端开发者都知道photoSwipe是一个强大的图廊javascript插件，然而却有一些缺陷。第一，插件不支持旋转功能，作者虽有说过未来可能支持，但是几年过去，插件依旧不支持旋转功能，而且插件现在更新速度实在太缓慢，我们不得不自己实现旋转功能。第二，图片的宽度和高度都是插件必备的参数，但是后台我们拿不到宽和高的情况下，这插件就废了，我只能自己封装代码处理这个问题。针对上面两个主要问题，我封装了一个方法，在不修改源码的基础上，实现了图片的旋转，处理了item.w和item.h，同时简化了插件的调用方式、实现了一个简易的图片列表。

## 调用
#### HTML配合javascript的调用方式：
``` html
<div class="photo-gallery photo-gallery--responsed" data-pswp-uid="212">
    <div class="photo-gallery__figure">
      <a class="photo-gallery__item" href="images/demo1.jpg" data-thumb="images/demo1-thumb.jpg" title="demo1" data-size="1920x1038">
        <span class="photo-gallery__thumb" style="background-image:url(images/demo1-thumb.jpg);"></span>
      </a>
    </div>
    <div class="photo-gallery__figure">
      <a class="photo-gallery__item" href="images/demo2.jpg" data-thumb="images/demo2-thumb.jpg" title="demo2">
        <span class="photo-gallery__thumb" style="background-image:url(images/demo2-thumb.jpg);"></span>
      </a>
    </div>
</div>
```
``` javascript
$('.photo-gallery').on('click','.photo-gallery__figure',function (e) {
  e.preventDefault();
  createPhotoSwipe(e.currentTarget);
});
```
#### 纯javascript调用方式：
``` javascript
createPhotoSwipe([
  {
    src: "images/demo1.jpg",//大图地址
    msrc: "images/demo1-thumb.jpg",//缩略图地址
    title:"图片一"
  },
  {
    src: "images/demo2.jpg",//大图地址
    msrc: "images/demo2-thumb.jpg",//缩略图地址
    title:"图片二"
  }
]);
```

## createPhotoSwipe参数

 参数名称  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | 类型 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;默认值&nbsp;&nbsp; | 描述|
-|-|-|-
indexEl|{object}|-|可选（indexEl和items中至少要有一个），当前图片的figure容器对象或选择器，方法内部会解析dom获取画廊所有图片数据和当前index值
items|{array}|-|可选（indexEl和items中至少要有一个），图廊图片的json数据。如果indexEl也存在时，这些数据会添加到解析出来的数据后面
items[].src|{string}|-|图片地址
items[].msrc|{string}|-|缩略图地址
items[].title|{string}|-|图片标题
items[].size|{string}|-|图片大小,格式如2100x1240
option|{object}|选填，支持所有PhotoSwipe的配置参数，另外新增几个参数如下
option.index|{number}|-|可选，可以设置从第几张图片开始预览
option.rotatable|{boolean}|true|是否开启旋转
option.rotateAnim|{boolean}|true|是否开启旋转动画
option.pswp|{string|object}|要自定义的pswp容器,默认使用插件内部定制好的画廊
option.containerEl|{string}|.photo-gallery,[data-pswp-uid]|画集容器，用来定位当前所在画集
option.figureEl|{string}|.photo-gallery__figure|item外层容器
option.itemEl|{string}|.photo-gallery__item|item容器

## 返回
> {object} PhotoSwipe对象

## 依赖
> jquery、photoswipe


## 目录
下面主要介绍几个重要的目录

``` bash
|-dist  代码发布目录
|-doc  文档和demo所在文件夹
```