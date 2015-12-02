/**
 * ======================================================================================================================
 * 此文件包括三个插件（导航基本插件 && 平均分配各个按钮  &&  自动滚到下一个（基于iscroll））｛三个插件都基于gmu｝
 * ======================================================================================================================
 */
/**
 * @file 导航栏组件
 * @import core/widget.js, extend/highlight.js
 * @module GMU
 */
(function( gmu, $, undefined ) {
    
    /**
     * 导航栏组件
     *
     * @class Navigator
     * @constructor Html部分
     * ```html
     * 
     * ```
     *
     * javascript部分
     * ```javascript
     * 
     * ```
     * @param {dom | zepto | selector} [el] 用来初始化导航栏的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:Navigator:options)
     * @grammar $( el ).navigator( options ) => zepto
     * @grammar new gmu.Navigator( el, options ) => instance
     */
    gmu.define( 'Navigator', {
        options: {

            /**
             * @property {Array} [content=null] 菜单数组
             * @namespace options
             */
            content: null,

            /**
             * @property {String} [event='click'] 交互事件名
             * @namespace options
             */
            event: 'click'
        },

        template: {
            list: '<ul>',
            item: '<li><a<% if( href ) { %> href="<%= href %>"<% } %>>' +
                    '<%= text %></a></li>'
        },

        _create: function() {
            var me = this,
                opts = me._options,
                $el = me.getEl(),
                $list = $el.find( 'ul' ).first(),
                name = 'ui-' + me.widgetName,
                renderer,
                html;

            // 如果没有包含ul节点，则说明通过指定content来create
            // 建议把create模式给拆出去。很多时候都是先写好在dom中了。
            if ( !$list.length && opts.content ) {
                $list = $( me.tpl2html( 'list' ) );
                renderer = me.tpl2html( 'item' );

                html = '';
                opts.content.forEach(function( item ) {

                    // 如果不提供默认值，然后同时某些key没有传值，parseTpl会报错
                    item = $.extend( {
                        href: '',
                        text: ''
                    }, typeof item === 'string' ? {
                        text: item
                    } : item );

                    html += renderer( item );
                });

                $list.append( html ).appendTo( $el );
            } else {
                
                // 处理直接通过ul初始化的情况
                if ( $el.is( 'ul, ol' ) ) {
                    $list = $el.wrap( '<div>' );
                    $el = $el.parent();
                }

                if ( opts.index === undefined ) {

                    // 如果opts中没有指定index, 则尝试从dom中查看是否有比较为ui-state-active的
                    opts.index = $list.find( '.ui-state-active' ).index();
                    
                    // 没找到还是赋值为0
                    ~opts.index || (opts.index = 0);
                }
            }

            me.$list = $list.addClass( name + '-list' );
            me.trigger( 'done.dom', $el.addClass( name ), opts );

            // bind Events
            $list.highlight( 'ui-state-hover', 'li' );
            $list.on( opts.event + me.eventNs,
                    'li:not(.ui-state-disable)>a', function( e ) {
                me._switchTo( $( this ).parent().index(), e );
            } );

            me.index = -1;
            me.switchTo( opts.index );
        },

        _switchTo: function( to, e ) {
            if ( to === this.index ) {
                return;
            }

            var me = this,
                list = me.$list.children(),
                evt = gmu.Event( 'beforeselect', e ),
                cur;
                
            me.trigger( evt, list.get( to ) );
            
            if ( evt.isDefaultPrevented() ) {
                return;
            }

            cur = list.removeClass( 'ui-state-active' )
                    .eq( to )
                    .addClass( 'ui-state-active' );

            me.index = to;
            return me.trigger( 'select', to, cur[ 0 ] );
        },

        /**
         * 切换到导航栏的某一项
         * @param {Number} to 序号
         * @method switchTo
         */
        switchTo: function( to ) {
            return this._switchTo( ~~to );
        },

        /**
         * 取消选择
         * @method unselect
         */
        unselect: function() {
            this.index = -1;
            this.$list.children().removeClass( 'ui-state-active' );
        },

        /**
         * 获取当前选中的序号
         * @method getIndex
         */
        getIndex: function() {
            return this.index;
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发。
         */

        /**
         * @event beforeselect
         * @param {Event} e gmu.Event对象
         * @param {Element} 目标元素
         * @description 当选择的序号发生切换前触发
         */
        
        /**
         * @event select
         * @param {Event} e gmu.Event对象
         * @param {Event} 当前选择的序号
         * @param {Element} 上一次选择的元素
         * @description 当选择的序号发生切换后触发
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 组件在销毁的时候触发
         */
    } );
})( gmu, gmu.$ );

/**
 * ======================================================================================================================
 * 平均分配按钮（navigator拓展功能）
 * ======================================================================================================================
 */

/**
 * @file 平均分配按钮，根据传入的visibleCount, 来平均分配宽度, 此插件主要用来加强
 * scrollable, 如果内容不可滚，用纯样式就能实现这块。
 * @import widget/navigator/gmu_extend.js, widget/navigator/$scrollable.js
 */
(function( gmu, $, undefined ) {
    gmu.Navigator.options.visibleCount = 4;

    /**
     * 平均分配按钮，根据传入的visibleCount, 来平均分配宽度, 此插件主要用来加强
     * scrollable, 如果内容不可滚，用纯样式就能实现这块。
     * @class visibleCount
     * @namespace Navigator
     * @pluginfor Navigator
     */
    gmu.Navigator.option( 'visibleCount', '*', function() {
        var me = this,
            opts = me._options,
            counts = $.type( opts.visibleCount ) === 'number' ? {
                portrait: opts.visibleCount,
                landscape: Math.floor( opts.visibleCount * 3 / 2 )
            } : opts.visibleCount;

        me.on( 'init.iScroll refresh.iScroll', arrage );

        function arrage( e ) {

            // todo 采用一种更精准的方法来获取横竖屏
            var ort = window.innerWidth > window.innerHeight ?
                    'landscape' : 'portrait',
                count = counts[ ort ],
                $el = me.$el;

            //TODO 横竖屏切换时，不能自动调整宽度
            me.$list.children().width( $el.width() / count );
            me.$list.width($el.width() / count * me.$list.children().length);
        }
    } );
})( gmu, gmu.$ );

/**
 * ======================================================================================================================
 * Navigator的可滚插件， 采用iScroll来实现
 * ======================================================================================================================
 */
/**
 * @file Navigator的可滚插件， 采用iScroll来实现。
 * @module GMU
 * @import widget/navigator/gmu_extend.js, extend/iscroll.js, extend/event.ortchange.js
 */
(function( gmu, $, undefined ) {

    /**
     * @property {Object} [iScroll={}] iScroll配置
     * @namespace options
     * @for Navigator
     * @uses Navigator.scrollable
     */
    gmu.Navigator.options.iScroll = {
        hScroll: true,
        vScroll: false,
        hScrollbar: false,
        vScrollbar: false
    };

    /**
     * Navigator的可滚插件， 采用iScroll来实现。
     *
     * @class scrollable
     * @namespace Navigator
     * @pluginfor Navigator
     */
    gmu.Navigator.register( 'scrollable', {

        _init: function() {
            var me = this,
                opts = me._options;

            me.on( 'done.dom', function() {
                me.$list.wrap( '<div class="ui-scroller"></div>' );

                me.trigger( 'init.iScroll' );
                me.$el.iScroll( $.extend( {}, opts.iScroll ) );
            } );

            $( window ).on( 'ortchange' + me.eventNs,
                $.proxy( me.refresh, me ) );

            me.on('destroy', function(){
                me.$el.iScroll( 'destroy' );
                $( window ).off( 'ortchange' + me.eventNs );
            } );
        },

        /**
         * 刷新iscroll
         * @method refresh
         * @for Navigator
         * @uses Navigator.scrollable
         */
        refresh: function() {
            this.trigger( 'refresh.iScroll' ).$el.iScroll( 'refresh' );
        }

        /**
         * @event refresh.iScroll
         * @param {Event} e gmu.Event对象
         * @description iscroll刷新前触发
         */
    } );
})( gmu, gmu.$ );
/**
 * ======================================================================================================================
 * 自动滚到下一个
 * ======================================================================================================================
 */
/**
 * @file 当滚动到边缘的时候，自动把下一个滚出来
 * @import widget/navigator/gmu_extend.js, widget/navigator/$scrollable.js
 */
(function( gmu, $, undefined ) {
    gmu.Navigator.options.isScrollToNext = true;

    /**
     * 当滚动到边缘的时候，自动把下一个滚出来
     * @class isScrollToNext
     * @namespace Navigator
     * @pluginfor Navigator
     */
    gmu.Navigator.option( 'isScrollToNext', true, function() {
        var me = this,
            prevIndex;

        me.on( 'select', function( e, to, el ) {

            // 第一调用的时候没有prevIndex, 固根据this.index来控制方向。
            if ( prevIndex === undefined ) {
                prevIndex = me.index ? 0 : 1;
            }

            var dir = to > prevIndex,

            // 如果是想左则找prev否则找next
                target = $( el )[ dir ? 'next' : 'prev' ](),

            // 如果没有相邻的，自己的位置也需要检测。存在这种情况
            // 被点击的按钮，只显示了一半
                offset = target.offset() || $( el ).offset(),
                within = me.$el.offset(),
                listOffset;

            if ( dir ? offset.left + offset.width > within.left +
                within.width : offset.left < within.left ) {
                listOffset = me.$list.offset();

                me.$el.iScroll( 'scrollTo', dir ? within.width -
                    offset.left + listOffset.left - offset.width :
                    listOffset.left - offset.left, 0, 400 );
            }

            prevIndex = to;
        } );
    } );
})( gmu, gmu.$ );



/**
 * @file 图片轮播组件
 * @import extend/touch.js, extend/event.ortchange.js, core/widget.js
 * @module GMU
 */
(function( gmu, $, undefined ) {
    var cssPrefix = $.fx.cssPrefix,
        transitionEnd = $.fx.transitionEnd,

    // todo 检测3d是否支持。
        translateZ = ' translateZ(0)';

    /**
     * 图片轮播组件
     *
     * @class Slider
     * @constructor Html部分
     * ```html
     * <div id="slider">
     *   <div>
     *       <a href="http://www.baidu.com/"><img lazyload="image1.png"></a>
     *       <p>1,让Coron的太阳把自己晒黑—小天</p>
     *   </div>
     *   <div>
     *       <a href="http://www.baidu.com/"><img lazyload="image2.png"></a>
     *       <p>2,让Coron的太阳把自己晒黑—小天</p>
     *   </div>
     *   <div>
     *       <a href="http://www.baidu.com/"><img lazyload="image3.png"></a>
     *       <p>3,让Coron的太阳把自己晒黑—小天</p>
     *   </div>
     *   <div>
     *       <a href="http://www.baidu.com/"><img lazyload="image4.png"></a>
     *       <p>4,让Coron的太阳把自己晒黑—小天</p>
     *   </div>
     * </div>
     * ```
     *
     * javascript部分
     * ```javascript
     * $('#slider').slider();
     * ```
     * @param {dom | zepto | selector} [el] 用来初始化Slider的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:Slider:options)
     * @grammar $( el ).slider( options ) => zepto
     * @grammar new gmu.Slider( el, options ) => instance
     */
    gmu.define( 'Slider', {

        options: {

            /**
             * @property {Boolean} [loop=false] 是否连续滑动
             * @namespace options
             */
            loop: false,

            /**
             * @property {Number} [speed=400] 动画执行速度
             * @namespace options
             */
            speed: 400,

            /**
             * @property {Number} [index=0] 初始位置
             * @namespace options
             */
            index: 0,

            /**
             * @property {Object} [selector={container:'.ui-slider-group'}] 内部结构选择器定义
             * @namespace options
             */
            selector: {
                container: '.ui-slider-group'    // 容器的选择器
            }
        },

        template: {
            item: '<div class="ui-slider-item"><a href="<%= href %>">' +
                '<img src="<%= pic %>" alt="" /></a>' +
                '<% if( title ) { %><p><%= title %></p><% } %>' +
                '</div>'
        },

        _create: function() {
            var me = this,
                $el = me.getEl(),
                opts = me._options;

            me.index = opts.index;

            // 初始dom结构
            me._initDom( $el, opts );

            // 更新width
            me._initWidth( $el, me.index );
            me._container.on( transitionEnd + me.eventNs,
                $.proxy( me._tansitionEnd, me ) );

            // 转屏事件检测
            $( window ).on( 'ortchange' + me.eventNs, function() {
                me._initWidth( $el, me.index );
            } );
        },

        _initDom: function( $el, opts ) {
            var selector = opts.selector,
                viewNum = opts.viewNum || 1,
                items,
                container;

            // 检测容器节点是否指定
            container = $el.find( selector.container );

            // 没有指定容器则创建容器
            if ( !container.length ) {
                container = $( '<div></div>' );

                // 如果没有传入content, 则将root的孩子作为可滚动item
                if ( !opts.content ) {

                    // 特殊处理直接用ul初始化slider的case
                    if ( $el.is( 'ul' ) ) {
                        this.$el = container.insertAfter( $el );
                        container = $el;
                        $el = this.$el;
                    } else {
                        container.append( $el.children() );
                    }
                } else {
                    this._createItems( container, opts.content );
                }

                container.appendTo( $el );
            }

            // 检测是否构成循环条件
            if ( (items = container.children()).length < viewNum + 1 ) {
                opts.loop = false;
            }
            // 如果节点少了，需要复制几份
            while ( opts.loop && container.children().length < 2 * viewNum ) {
                container.append( items.clone() );
            }

            this.length = container.children().length;

            this._items = (this._container = container)
                .addClass( 'ui-slider-group' )
                .children()
                .addClass( 'ui-slider-item' )
                .toArray();

            this.trigger( 'done.dom', $el.addClass( 'ui-slider' ), opts );
        },

        // 根据items里面的数据挨个render插入到container中
        _createItems: function( container, items ) {
            var i = 0,
                len = items.length;

            for ( ; i < len; i++ ) {
                container.append( this.tpl2html( 'item', items[ i ] ) );
            }
        },

        _initWidth: function( $el, index, force ) {
            var me = this,
                width;

            // width没有变化不需要重排
            if ( !force && (width = $el.width()) === me.width ) {
                return;
            }

            me.width = width;
            me._arrange( width, index );
            me.height = $el.height();
            me.trigger( 'width.change' );
        },

        // 重排items
        _arrange: function( width, index ) {
            var items = this._items,
                i = 0,
                item,
                len;

            this._slidePos = new Array( items.length );

            for ( len = items.length; i < len; i++ ) {
                item = items[ i ];

                item.style.cssText += 'width:' + width + 'px;' +
                    'left:' + (i * -width) + 'px;';
                item.setAttribute( 'data-index', i );

                this._move( i, i < index ? -width : i > index ? width : 0, 0 );
            }

            this._container.css( 'width', width * len );
        },

        _move: function( index, dist, speed, immediate ) {
            var slidePos = this._slidePos,
                items = this._items;

            if ( slidePos[ index ] === dist || !items[ index ] ) {
                return;
            }

            this._translate( index, dist, speed );
            slidePos[ index ] = dist;    // 记录目标位置

            // 强制一个reflow
            immediate && items[ index ].clientLeft;
        },

        _translate: function( index, dist, speed ) {
            var slide = this._items[ index ],
                style = slide && slide.style;

            if ( !style ) {
                return false;
            }

            style.cssText += cssPrefix + 'transition-duration:' + speed +
                'ms;' + cssPrefix + 'transform: translate(' +
                dist + 'px, 0)' + translateZ + ';';
        },

        _circle: function( index, arr ) {
            var len;

            arr = arr || this._items;
            len = arr.length;

            return (index % len + len) % arr.length;
        },

        _tansitionEnd: function( e ) {

            // ~~用来类型转换，等价于parseInt( str, 10 );
            if ( ~~e.target.getAttribute( 'data-index' ) !== this.index ) {
                return;
            }

            this.trigger( 'slideend', this.index );
        },

        _slide: function( from, diff, dir, width, speed, opts ) {
            var me = this,
                to;

            to = me._circle( from - dir * diff );

            // 如果不是loop模式，以实际位置的方向为准
            if ( !opts.loop ) {
                dir = Math.abs( from - to ) / (from - to);
            }

            // 调整初始位置，如果已经在位置上不会重复处理
            this._move( to, -dir * width, 0, true );

            this._move( from, width * dir, speed );
            this._move( to, 0, speed );

            this.index = to;
            return this.trigger( 'slide', to, from );
        },

        /**
         * 切换到第几个slide
         * @method slideTo
         * @chainable
         * @param {Number} to 目标slide的序号
         * @param {Number} [speed] 切换的速度
         * @return {self} 返回本身
         */
        slideTo: function( to, speed ) {
            if ( this.index === to || this.index === this._circle( to ) ) {
                return this;
            }

            var opts = this._options,
                index = this.index,
                diff = Math.abs( index - to ),

            // 1向左，-1向右
                dir = diff / (index - to),
                width = this.width;

            speed = speed || opts.speed;

            return this._slide( index, diff, dir, width, speed, opts );
        },

        /**
         * 切换到上一个slide
         * @method prev
         * @chainable
         * @return {self} 返回本身
         */
        prev: function() {

            if ( this._options.loop || this.index > 0 ) {
                this.slideTo( this.index - 1 );
            }

            return this;
        },

        /**
         * 切换到下一个slide
         * @method next
         * @chainable
         * @return {self} 返回本身
         */
        next: function() {

            if ( this._options.loop || this.index + 1 < this.length ) {
                this.slideTo( this.index + 1 );
            }

            return this;
        },

        /**
         * 返回当前显示的第几个slide
         * @method getIndex
         * @chainable
         * @return {Number} 当前的silde序号
         */
        getIndex: function() {
            return this.index;
        },

        /**
         * 销毁组件
         * @method destroy
         */
        destroy: function() {
            this._container.off( this.eventNs );
            $( window ).off( 'ortchange' + this.eventNs );
            return this.$super( 'destroy' );
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发。
         */

        /**
         * @event done.dom
         * @param {Event} e gmu.Event对象
         * @param {Zepto} $el slider元素
         * @param {Object} opts 组件初始化时的配置项
         * @description DOM创建完成后触发
         */

        /**
         * @event width.change
         * @param {Event} e gmu.Event对象
         * @description slider容器宽度发生变化时触发
         */

        /**
         * @event slideend
         * @param {Event} e gmu.Event对象
         * @param {Number} index 当前slide的序号
         * @description slide切换完成后触发
         */

        /**
         * @event slide
         * @param {Event} e gmu.Event对象
         * @param {Number} to 目标slide的序号
         * @param {Number} from 当前slide的序号
         * @description slide切换时触发（如果切换时有动画，此事件触发时，slide不一定已经完成切换）
         */

        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 组件在销毁的时候触发
         */
    } );

})( gmu, gmu.$ );




/**
 * @file 图片轮播手指跟随插件
 * @import widget/slider/slider.js
 */
(function( gmu, $, undefined ) {

    var map = {
            touchstart: '_onStart',
            touchmove: '_onMove',
            touchend: '_onEnd',
            touchcancel: '_onEnd',
            click: '_onClick'
        },

        isScrolling,
        start,
        delta,
        moved;

    // 提供默认options
    $.extend( gmu.Slider.options, {

        /**
         * @property {Boolean} [stopPropagation=false] 是否阻止事件冒泡
         * @namespace options
         * @for Slider
         * @uses Slider.touch
         */
        stopPropagation: false,

        /**
         * @property {Boolean} [disableScroll=false] 是否阻止滚动
         * @namespace options
         * @for Slider
         * @uses Slider.touch
         */
        disableScroll: false
    } );

    /**
     * 图片轮播手指跟随插件
     * @class touch
     * @namespace Slider
     * @pluginfor Slider
     */
    gmu.Slider.register( 'touch', {
        _init: function() {
            var me = this,
                $el = me.getEl();

            me._handler = function( e ) {
                me._options.stopPropagation && e.stopPropagation();
                return map[ e.type ] && me[ map[ e.type ] ].call( me, e );
            };

            me.on( 'ready', function() {

                // 绑定手势
                $el.on( 'touchstart' + me.eventNs, me._handler );

                // 阻止误点击, 犹豫touchmove被preventDefault了，导致长按也会触发click
                me._container.on( 'click' + me.eventNs, me._handler );
            } );
        },

        _onClick: function() {
            return !moved;
        },

        _onStart: function( e ) {

            // 不处理多指
            if ( e.touches.length > 1 ) {
                return false;
            }

            var me = this,
                touche = e.touches[ 0 ],
                opts = me._options,
                eventNs = me.eventNs,
                num;

            start = {
                x: touche.pageX,
                y: touche.pageY,
                time: +new Date()
            };

            delta = {};
            moved = false;
            isScrolling = undefined;

            num = opts.viewNum || 1;
            me._move( opts.loop ? me._circle( me.index - num ) :
                me.index - num, -me.width, 0, true );
            me._move( opts.loop ? me._circle( me.index + num ) :
                me.index + num, me.width, 0, true );

            me.$el.on( 'touchmove' + eventNs + ' touchend' + eventNs +
                ' touchcancel' + eventNs, me._handler );
        },

        _onMove: function( e ) {

            // 多指或缩放不处理
            if ( e.touches.length > 1 || e.scale &&
                e.scale !== 1 ) {
                return false;
            }

            var opts = this._options,
                viewNum = opts.viewNum || 1,
                touche = e.touches[ 0 ],
                index = this.index,
                i,
                len,
                pos,
                slidePos;

            opts.disableScroll && e.preventDefault();

            delta.x = touche.pageX - start.x;
            delta.y = touche.pageY - start.y;

            if ( typeof isScrolling === 'undefined' ) {
                isScrolling = Math.abs( delta.x ) <
                    Math.abs( delta.y );
            }

            if ( !isScrolling ) {
                e.preventDefault();

                if ( !opts.loop ) {

                    // 如果左边已经到头
                    delta.x /= (!index && delta.x > 0 ||

                        // 如果右边到头
                        index === this._items.length - 1 &&
                        delta.x < 0) ?

                        // 则来一定的减速
                        (Math.abs( delta.x ) / this.width + 1) : 1;
                }

                slidePos = this._slidePos;

                for ( i = index - viewNum, len = index + 2 * viewNum;
                      i < len; i++ ) {

                    pos = opts.loop ? this._circle( i ) : i;
                    this._translate( pos, delta.x + slidePos[ pos ], 0 );
                }

                moved = true;
            }
        },

        _onEnd: function() {

            // 解除事件
            this.$el.off( 'touchmove' + this.eventNs + ' touchend' +
                    this.eventNs + ' touchcancel' + this.eventNs,
                this._handler );

            if ( !moved ) {
                return;
            }

            var me = this,
                opts = me._options,
                viewNum = opts.viewNum || 1,
                index = me.index,
                slidePos = me._slidePos,
                duration = +new Date() - start.time,
                absDeltaX = Math.abs( delta.x ),

            // 是否滑出边界
                isPastBounds = !opts.loop && (!index && delta.x > 0 ||
                    index === slidePos.length - viewNum && delta.x < 0),

            // -1 向右 1 向左
                dir = delta.x > 0 ? 1 : -1,
                speed,
                diff,
                i,
                len,
                pos;

            if ( duration < 250 ) {

                // 如果滑动速度比较快，偏移量跟根据速度来算
                speed = absDeltaX / duration;
                diff = Math.min( Math.round( speed * viewNum * 1.2 ),
                    viewNum );
            } else {
                diff = Math.round( absDeltaX / (me.perWidth || me.width) );
            }

            if ( diff && !isPastBounds ) {
                me._slide( index, diff, dir, me.width, opts.speed,
                    opts, true );

                // 在以下情况，需要多移动一张
                if ( viewNum > 1 && duration >= 250 &&
                    Math.ceil( absDeltaX / me.perWidth ) !== diff ) {

                    me.index < index ? me._move( me.index - 1, -me.perWidth,
                        opts.speed ) : me._move( me.index + viewNum,
                        me.width, opts.speed );
                }
            } else {

                // 滑回去
                for ( i = index - viewNum, len = index + 2 * viewNum;
                      i < len; i++ ) {

                    pos = opts.loop ? me._circle( i ) : i;
                    me._translate( pos, slidePos[ pos ],
                        opts.speed );
                }
            }
        }
    } );
})( gmu, gmu.$ );


/**
 * @file 图片轮播剪头按钮
 * @import widget/slider/slider.js
 */
(function( gmu, $, undefined ) {
    $.extend( true, gmu.Slider, {

        template: {
            prev: '<span class="ui-slider-pre"></span>',
            next: '<span class="ui-slider-next"></span>'
        },

        options: {
            /**
             * @property {Boolean} [arrow=true] 是否显示点
             * @namespace options
             * @for Slider
             * @uses Slider.arrow
             */
            arrow: true,

            /**
             * @property {Object} [select={prev:'.ui-slider-pre',next:'.ui-slider-next'}] 上一张和下一张按钮的选择器
             * @namespace options
             * @for Slider
             * @uses Slider.arrow
             */
            select: {
                prev: '.ui-slider-pre',    // 上一张按钮选择器
                next: '.ui-slider-next'    // 下一张按钮选择器
            }
        }
    } );

    /**
     * 图片轮播剪头按钮
     * @class arrow
     * @namespace Slider
     * @pluginfor Slider
     */
    gmu.Slider.option( 'arrow', true, function() {
        var me = this,
            arr = [ 'prev', 'next' ];

        this.on( 'done.dom', function( e, $el, opts ) {
            var selector = opts.selector;

            arr.forEach(function( name ) {
                var item = $el.find( selector[ name ] );
                item.length || $el.append( item = $( me.tpl2html( name ) ) );
                me[ '_' + name ] = item;
            });
        } );

        this.on( 'ready', function() {
            arr.forEach(function( name ) {
                me[ '_' + name ].on( 'tap' + me.eventNs, function() {
                    me[ name ].call( me );
                } );
            });
        } );

        this.on( 'destroy', function() {
            me._prev.off( me.eventNs );
            me._next.off( me.eventNs );
        } );
    } );
})( gmu, gmu.$ );



/**
 * @file 图片轮播显示点功能
 * @import widget/slider/slider.js
 */
(function( gmu, $, undefined ) {
    $.extend( true, gmu.Slider, {

        template: {
            dots: '<p class="ui-slider-dots"><%= new Array( len + 1 )' +
                '.join("<b></b>") %></p>'
        },

        options: {

            /**
             * @property {Boolean} [dots=true] 是否显示点
             * @namespace options
             * @for Slider
             * @uses Slider.dots
             */
            dots: true,

            /**
             * @property {Object} [selector={dots:'.ui-slider-dots'}] 所有点父级的选择器
             * @namespace options
             * @for Slider
             * @uses Slider.dots
             */
            selector: {
                dots: '.ui-slider-dots'
            }
        }
    } );

    /**
     * 图片轮播显示点功能
     * @class dots
     * @namespace Slider
     * @pluginfor Slider
     */
    gmu.Slider.option( 'dots', true, function() {

        var updateDots = function( to, from ) {
            var dots = this._dots;

            typeof from === 'undefined' || gmu.staticCall( dots[
                from % this.length ], 'removeClass', 'ui-state-active' );

            gmu.staticCall( dots[ to % this.length ], 'addClass',
                'ui-state-active' );
        };

        this.on( 'done.dom', function( e, $el, opts ) {
            var dots = $el.find( opts.selector.dots );

            if ( !dots.length ) {
                dots = this.tpl2html( 'dots', {
                    len: this.length
                } );

                dots = $( dots ).appendTo( $el );
            }

            this._dots = dots.children().toArray();
        } );

        this.on( 'slide', function( e, to, from ) {
            updateDots.call( this, to, from );
        } );

        this.on( 'ready', function() {
            updateDots.call( this, this.index );
        } );
    } );
})( gmu, gmu.$ );


/**
 * @file 自动播放插件
 * @import widget/slider/slider.js
 */
(function( gmu, $ ) {
    $.extend( true, gmu.Slider, {
        options: {
            /**
             * @property {Boolean} [autoPlay=true] 是否开启自动播放
             * @namespace options
             * @for Slider
             * @uses Slider.autoplay
             */
            autoPlay: true,
            /**
             * @property {Number} [interval=4000] 自动播放的间隔时间（毫秒）
             * @namespace options
             * @for Slider
             * @uses Slider.autoplay
             */
            interval: 4000
        }
    } );

    /**
     * 自动播放插件
     * @class autoplay
     * @namespace Slider
     * @pluginfor Slider
     */
    gmu.Slider.register( 'autoplay', {
        _init: function() {
            var me = this;
            me.on( 'slideend ready', me.resume )

                // 清除timer
                .on( 'destory', me.stop );

            // 避免滑动时，自动切换
            me.getEl()
                .on( 'touchstart' + me.eventNs, $.proxy( me.stop, me ) )
                .on( 'touchend' + me.eventNs, $.proxy( me.resume, me ) );
        },

        /**
         * 恢复自动播放。
         * @method resume
         * @chainable
         * @return {self} 返回本身
         * @for Slider
         * @uses Slider.autoplay
         */
        resume: function() {
            var me = this,
                opts = me._options;

            if ( opts.autoPlay && !me._timer ) {
                me._timer = setTimeout( function() {
                    me.slideTo( me.index + 1 );
                    me._timer = null;
                }, opts.interval );
            }
            return me;
        },

        /**
         * 停止自动播放
         * @method stop
         * @chainable
         * @return {self} 返回本身
         * @for Slider
         * @uses Slider.autoplay
         */
        stop: function() {
            var me = this;

            if ( me._timer ) {
                clearTimeout( me._timer );
                me._timer = null;
            }
            return me;
        }
    } );
})( gmu, gmu.$ );

/**
 * @file 返回顶部组件
 * @import core/widget.js, extend/fix.js, extend/throttle.js, extend/event.scrollStop.js, extend/event.ortchange.js
 * @module GMU
 */
(function( gmu, $, undefined ) {

    /**
     * 返回顶部组件
     *
     * @class Gotop
     * @constructor Html部分
     * ```html
     * <div id="gotop"></div>
     * ```
     *
     * javascript部分
     * ```javascript
     * $('#gotop').gotop();
     * ```
     * @param {dom | zepto | selector} [el] 用来初始化组件的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:Gotop:options)
     * @grammar $( el ).gotop( options ) => zepto
     * @grammar new gmu.Gotop( el, options ) => instance
     */
    gmu.define( 'Gotop', {
        options: {
            /**
             * @property {selector} [container=document.body] 组件容器
             * @namespace options
             */
            container:          '',
            /**
             * @property {Boolean} [useFix=true] 是否使用固顶效果
             * @namespace options
             */
            useFix:             true,
            /**
             * @property {Boolean} [useHide=true] 是否在touchmove的时候隐藏gotop图标
             * @namespace options
             */
            useHide:            true,
            /**
             * @property {Boolean} [useAnimation=false] 返回顶部时是否使用动画,在使用iScroll时,返回顶部的动作由iScroll实例执行,此参数无效
             * @namespace options
             */
            useAnimation:       true,
            /**
             * @property {Object} [position={bottom:10,right:10}] 使用fix效果时，要用的位置参数
             * @namespace options
             */
            position:           {bottom: 10, right: 10},
            /**
             * @property {Function} [afterScroll=null] 返回顶部后执行的回调函数
             * @namespace options
             */
            afterScroll:        null
        },

        _init: function() {
            var me = this,
                $el,
                _opts = me._options,
                _eventHandler;

            if($.os.version && $.os.version.substr(0, 3) >= 7.0) {
                _opts.position.bottom = 40;
            }

            me.on( 'ready', function(){
                $el = me.$el;
                _eventHandler = $.proxy(me._eventHandler, me);

                _opts['useHide'] && $(document).on('touchmove', _eventHandler);
                $(window).on('touchend touchcancel scrollStop', _eventHandler);
                $(window).on('scroll ortchange', _eventHandler);
                $el.on('click', _eventHandler);
                me.on('destroy', function() {
                    $(window).off('touchend touchcancel scrollStop', _eventHandler);
                    $(document).off('touchmove', _eventHandler);
                    $(window).off('scroll ortchange', _eventHandler);
                });
                _opts['useFix'] && $el.fix(_opts['position']);
                _opts['root'] = $el[0];
            } );

            // 不管是哪种模式创建的，destroy时都将元素移除
            me.on( 'destroy', function() {
                me.$el.remove();
            } );
        },

        _create: function() {
            var me = this;

            if( !me.$el ) {
                me.$el = $('<div></div>');
            }
            me.$el.addClass('ui-gotop').append('<div></div>').appendTo(me._options['container'] || (me.$el.parent().length ? '' : document.body));

            return me;
        },

        /**
         * 事件处理中心
         */
        _eventHandler: function(e) {
            var me = this;

            switch (e.type) {
                case 'touchmove':
                    me.hide();
                    break;
                case 'scroll':
                    clearTimeout(me._options['_TID']);
                    break;
                case 'touchend':
                case 'touchcancel':
                    clearTimeout(me._options['_TID']);
                    me._options['_TID'] = setTimeout(function(){
                        me._check.call(me);
                    }, 300);
                    break;
                case 'scrollStop':
                    me._check();
                    break;
                case 'ortchange':
                    me._check.call(me);
                    break;
                case 'click':
                    me._scrollTo();
                    break;
            }
        },

        /**
         * 判断是否显示gotop
         */
        _check: function(position) {
            var me = this;

            (position !== undefined ? position : window.pageYOffset) > document.documentElement.clientHeight ? me.show() : me.hide();

            return  me;
        },

        /**
         * 滚动到顶部或指定节点位置
         */
        _scrollTo: function() {
            var me = this,
                from = window.pageYOffset;

            me.hide();
            clearTimeout(me._options['_TID']);
            if (!me._options['useAnimation']) {
                window.scrollTo(0, 1);
                me.trigger('afterScroll');
            } else {
                me._options['moveToTop'] = setInterval(function() {
                    if (from > 1) {
                        window.scrollBy(0, -Math.min(150,from - 1));
                        from -= 150;
                    } else {
                        clearInterval(me._options['moveToTop']);
                        me.trigger('afterScroll');
                    }
                }, 25, true);
            }
            return me;
        },

        /**
         * 显示gotop
         * @method show
         * @return {self} 返回本身
         */
        show: function() {
            this._options.root.style.display = 'block';

            return this;
        },

        /**
         * 隐藏gotop
         * @method hide
         * @chainable
         * @return {self} 返回本身
         */
        hide: function() {
            this._options.root.style.display = 'none';

            return this;
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发
         */

        /**
         * @event afterScroll
         * @param {Event} e gmu.Event对象
         * @description 返回顶部后触发的事件
         */

        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 组件在销毁的时候触发
         */
    });
})( gmu, gmu.$ );


/**
 * @file 选项卡组件
 * @import extend/touch.js, core/widget.js, extend/highlight.js, extend/event.ortchange.js
 * @importCSS transitions.css, loading.css
 * @module GMU
 */

(function( gmu, $, undefined ) {
    var _uid = 1,
        uid = function(){
            return _uid++;
        },
        idRE = /^#(.+)$/;

    /**
     * 选项卡组件
     *
     * @class Tabs
     * @constructor Html部分
     * ```html
     * <div id="tabs">
     *      <ul>
     *         <li><a href="#conten1">Tab1</a></li>
     *         <li><a href="#conten2">Tab2</a></li>
     *         <li><a href="#conten3">Tab3</a></li>
     *     </ul>
     *     <div id="conten1">content1</div>
     *     <div id="conten2"><input type="checkbox" id="input1" /><label for="input1">选中我后tabs不可切换</label></div>
     *     <div id="conten3">content3</div>
     * </div>
     * ```
     *
     * javascript部分
     * ```javascript
     * $('#tabs').tabs();
     * ```
     * @param {dom | zepto | selector} [el] 用来初始化Tab的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:Tabs:options)
     * @grammar $( el ).tabs( options ) => zepto
     * @grammar new gmu.Tabs( el, options ) => instance
     */
    gmu.define( 'Tabs', {
        options: {

            /**
             * @property {Number} [active=0] 初始时哪个为选中状态，如果时setup模式，如果第2个li上加了ui-state-active样式时，active值为1
             * @namespace options
             */
            active: 0,

            /**
             * @property {Array} [items=null] 在render模式下需要必须设置 格式为\[{title:\'\', content:\'\', href:\'\'}\], href可以不设，可以用来设置ajax内容
             * @namespace options
             */
            items:null,

            /**
             * @property {String} [transition='slide'] 设置切换动画，目前只支持slide动画，或无动画
             * @namespace options
             */
            transition: 'slide'
        },

        template: {
            nav:'<ul class="ui-tabs-nav">'+
                '<% var item; for(var i=0, length=items.length; i<length; i++) { item=items[i]; %>'+
                '<li<% if(i==active){ %> class="ui-state-active"<% } %>><a href="javascript:;"><%=item.title%></a></li>'+
                '<% } %></ul>',
            content:'<div class="ui-viewport ui-tabs-content">' +
                '<% var item; for(var i=0, length=items.length; i<length; i++) { item=items[i]; %>'+
                '<div<% if(item.id){ %> id="<%=item.id%>"<% } %> class="ui-tabs-panel <%=transition%><% if(i==active){ %> ui-state-active<% } %>"><%=item.content%></div>'+
                '<% } %></div>'
        },

        _init:function () {
            var me = this, _opts = me._options, $el, eventHandler = $.proxy(me._eventHandler, me);

            me.on( 'ready', function(){
                $el = me.$el;
                $el.addClass('ui-tabs');
                _opts._nav.on('tap', eventHandler).children().highlight('ui-state-hover');
            } );

            $(window).on('ortchange', eventHandler);
        },

        _create:function () {
            var me = this, _opts = me._options;

            if( me._options.setup && me.$el.children().length > 0 ) {
                me._prepareDom('setup', _opts);
            } else {
                _opts.setup = false;
                me.$el = me.$el || $('<div></div>');
                me._prepareDom('create', _opts);
            }
        },

        _prepareDom:function (mode, _opts) {
            var me = this, content, $el = me.$el, items, nav, contents, id;
            switch (mode) {
                case 'setup':
                    _opts._nav =  me._findElement('ul').first();
                    if(_opts._nav) {
                        _opts._content = me._findElement('div.ui-tabs-content');
                        _opts._content = ((_opts._content && _opts._content.first()) || $('<div></div>').appendTo($el)).addClass('ui-viewport ui-tabs-content');
                        items = [];
                        _opts._nav.addClass('ui-tabs-nav').children().each(function(){
                            var $a = me._findElement('a', this), href = $a?$a.attr('href'):$(this).attr('data-url'), id, $content;
                            id = idRE.test(href)? RegExp.$1: 'tabs_'+uid();
                            ($content = me._findElement('#'+id) || $('<div id="'+id+'"></div>'))
                                .addClass('ui-tabs-panel'+(_opts.transition?' '+_opts.transition:''))
                                .appendTo(_opts._content);
                            items.push({
                                id: id,
                                href: href,
                                title: $a?$a.attr('href', 'javascript:;').text():$(this).text(),//如果href不删除的话，地址栏会出现，然后一会又消失。
                                content: $content
                            });
                        });
                        _opts.items = items;
                        _opts.active = Math.max(0, Math.min(items.length-1, _opts.active || $('.ui-state-active', _opts._nav).index()||0));
                        me._getPanel().add(_opts._nav.children().eq(_opts.active)).addClass('ui-state-active');
                        break;
                    } //if cannot find the ul, switch this to create mode. Doing this by remove the break centence.
                default:
                    items = _opts.items = _opts.items || [];
                    nav = [];
                    contents = [];
                    _opts.active = Math.max(0, Math.min(items.length-1, _opts.active));
                    $.each(items, function(key, val){
                        id = 'tabs_'+uid();
                        nav.push({
                            href: val.href || '#'+id,
                            title: val.title
                        });
                        contents.push({
                            content: val.content || '',
                            id: id
                        });
                        items[key].id = id;
                    });
                    _opts._nav = $( this.tpl2html( 'nav', {items: nav, active: _opts.active} ) ).prependTo($el);
                    _opts._content = $( this.tpl2html( 'content', {items: contents, active: _opts.active, transition: _opts.transition} ) ).appendTo($el);
                    _opts.container = _opts.container || ($el.parent().length ? null : 'body');
            }
            _opts.container && $el.appendTo(_opts.container);
            me._fitToContent(me._getPanel());
        },

        _getPanel: function(index){
            var _opts = this._options;
            return $('#' + _opts.items[index === undefined ? _opts.active : index].id);
        },

        _findElement:function (selector, el) {
            var ret = $(el || this.$el).find(selector);
            return ret.length ? ret : null;
        },

        _eventHandler:function (e) {
            var match, _opts = this._options;
            switch(e.type) {
                case 'ortchange':
                    this.refresh();
                    break;
                default:
                    if((match = $(e.target).closest('li', _opts._nav.get(0))) && match.length) {
                        e.preventDefault();
                        this.switchTo(match.index());
                    }
            }
        },

        _fitToContent: function(div) {
            var _opts = this._options, $content = _opts._content;
            _opts._plus === undefined && (_opts._plus = parseFloat($content.css('border-top-width'))+parseFloat($content.css('border-bottom-width')))
            $content.height( div.height() + _opts._plus);
            return this;
        },

        /**
         * 切换到某个Tab
         * @method switchTo
         * @param {Number} index Tab编号
         * @chainable
         * @return {self} 返回本身。
         */
        switchTo: function(index) {
            var me = this, _opts = me._options, items = _opts.items, eventData, to, from, reverse, endEvent;
            if(!_opts._buzy && _opts.active != (index = Math.max(0, Math.min(items.length-1, index)))) {
                to = $.extend({}, items[index]);//copy it.
                to.div = me._getPanel(index);
                to.index = index;

                from = $.extend({}, items[_opts.active]);//copy it.
                from.div = me._getPanel();
                from.index = _opts.active;

                eventData = gmu.Event('beforeActivate');
                me.trigger(eventData, to, from);
                if(eventData.isDefaultPrevented()) return me;

                _opts._content.children().removeClass('ui-state-active');
                to.div.addClass('ui-state-active');
                _opts._nav.children().removeClass('ui-state-active').eq(to.index).addClass('ui-state-active');
                if(_opts.transition) { //use transition
                    _opts._buzy = true;
                    endEvent = $.fx.animationEnd + '.tabs';
                    reverse = index>_opts.active?'':' reverse';
                    _opts._content.addClass('ui-viewport-transitioning');
                    from.div.addClass('out'+reverse);
                    to.div.addClass('in'+reverse).on(endEvent, function(e){
                        if (e.target != e.currentTarget) return //如果是冒泡上来的，则不操作
                        to.div.off(endEvent, arguments.callee);//解除绑定
                        _opts._buzy = false;
                        from.div.removeClass('out reverse');
                        to.div.removeClass('in reverse');
                        _opts._content.removeClass('ui-viewport-transitioning');
                        me.trigger('animateComplete', to, from);
                        me._fitToContent(to.div);
                    });
                }
                _opts.active = index;
                me.trigger('activate', to, from);
                _opts.transition ||  me._fitToContent(to.div);
            }
            return me;
        },

        /**
         * 当外部修改tabs内容好，需要调用refresh让tabs自动更新高度
         * @method refresh
         * @chainable
         * @return {self} 返回本身。
         */
        refresh: function(){
            return this._fitToContent(this._getPanel());
        },

        /**
         * 销毁组件
         * @method destroy
         */
        destroy:function () {
            var _opts = this._options, eventHandler = this._eventHandler;
            _opts._nav.off('tap', eventHandler).children().highlight();
            _opts.swipe && _opts._content.off('swipeLeft swipeRight', eventHandler);

            if( !_opts.setup ) {
                this.$el.remove();
            }
            return this.$super('destroy');
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发。
         */

        /**
         * @event beforeActivate
         * @param {Event} e gmu.Event对象
         * @param {Object} to 包含如下属性：div(内容div), index(位置), title(标题), content(内容), href(链接)
         * @param {Object} from 包含如下属性：div(内容div), index(位置), title(标题), content(内容), href(链接)
         * @description 内容切换之前触发，可以通过e.preventDefault()来阻止
         */

        /**
         * @event activate
         * @param {Event} e gmu.Event对象
         * @param {Object} to 包含如下属性：div(内容div), index(位置), title(标题), content(内容), href(链接)
         * @param {Object} from 包含如下属性：div(内容div), index(位置), title(标题), content(内容), href(链接)
         * @description 内容切换之后触发
         */

        /**
         * @event animateComplete
         * @param {Event} e gmu.Event对象
         * @param {Object} to 包含如下属性：div(内容div), index(位置), title(标题), content(内容), href(链接)
         * @param {Object} from 包含如下属性：div(内容div), index(位置), title(标题), content(内容), href(链接)
         * @description 动画完成后执行，如果没有设置动画，此时间不会触发
         */

        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 组件在销毁的时候触发
         */
    });
})( gmu, gmu.$ );
/**
 * @file 左右滑动手势插件
 * @import widget/tabs/tabs.js
 */

(function ($, undefined) {
    var durationThreshold = 1000, // 时间大于1s就不算。
        horizontalDistanceThreshold = 30, // x方向必须大于30
        verticalDistanceThreshold = 70, // y方向上只要大于70就不算
        scrollSupressionThreshold = 30, //如果x方向移动大于这个直就禁掉滚动
        tabs = [],
        eventBinded = false,
        isFromTabs = function (target) {
            for (var i = tabs.length; i--;) {
                if ($.contains(tabs[i], target)) return true;
            }
            return false;
        }

    function tabsSwipeEvents() {
        $(document).on('touchstart.tabs', function (e) {
            var point = e.touches ? e.touches[0] : e, start, stop;

            start = {
                x:point.clientX,
                y:point.clientY,
                time:Date.now(),
                el:$(e.target)
            }

            $(document).on('touchmove.tabs',function (e) {
                var point = e.touches ? e.touches[0] : e, xDelta;
                if (!start)return;
                stop = {
                    x:point.clientX,
                    y:point.clientY,
                    time:Date.now()
                }
                if ((xDelta = Math.abs(start.x - stop.x)) > scrollSupressionThreshold ||
                    xDelta > Math.abs(start.y - stop.y)) {
                    isFromTabs(e.target) && e.preventDefault();
                } else {//如果系统滚动开始了，就不触发swipe事件
                    $(document).off('touchmove.tabs touchend.tabs');
                }
            }).one('touchend.tabs', function () {
                $(document).off('touchmove.tabs');
                if (start && stop) {
                    if (stop.time - start.time < durationThreshold &&
                        Math.abs(start.x - stop.x) > horizontalDistanceThreshold &&
                        Math.abs(start.y - stop.y) < verticalDistanceThreshold) {
                        start.el.trigger(start.x > stop.x ? "tabsSwipeLeft" : "tabsSwipeRight");
                    }
                }
                start = stop = undefined;
            });
        });
    }

    /**
     * 添加 swipe功能，zepto的swipeLeft, swipeRight不太准，所以在这另外实现了一套。
     * @class swipe
     * @namespace Tabs
     * @pluginfor Tabs
     */
    gmu.Tabs.register( 'swipe', {
        _init:function () {
            var _opts = this._options;

            this.on( 'ready', function(){
                tabs.push(_opts._content.get(0));
                eventBinded =  eventBinded || (tabsSwipeEvents(), true);
                this.$el.on('tabsSwipeLeft tabsSwipeRight', $.proxy(this._eventHandler, this));
            } );
        },
        _eventHandler:function (e) {
            var _opts = this._options, items, index;
            switch (e.type) {
                case 'tabsSwipeLeft':
                case 'tabsSwipeRight':
                    items = _opts.items;
                    if (e.type == 'tabsSwipeLeft' && _opts.active < items.length - 1) {
                        index = _opts.active + 1;
                    } else if (e.type == 'tabsSwipeRight' && _opts.active > 0) {
                        index = _opts.active - 1;
                    }
                    index !== undefined && (e.stopPropagation(), this.switchTo(index));
                    break;
                default://tap
                    return this.origin(e);
            }
        },
        destroy: function(){
            var _opts = this._options, idx;
            ~(idx = $.inArray(_opts._content.get(0), tabs)) && tabs.splice(idx, 1);
            this.$el.off('tabsSwipeLeft tabsSwipeRight', this._eventHandler);
            tabs.length || ($(document).off('touchstart.tabs'), eventBinded = false);
            return this.origin();
        }
    } );
})(Zepto);

/**
 * @file 加载更多组件
 * @import core/widget.js
 * @importCSS loading.css
 * @module GMU
 */

(function( gmu, $, undefined ) {
    
    /**
     * 加载更多组件
     *
     * @class Refresh
     * @constructor Html部分
     * ```html
     * <div class="ui-refresh">
     *    <ul class="data-list">...</ul>
     *    <div class="ui-refresh-down"></div><!--setup方式带有class为ui-refresh-down或ui-refresh-up的元素必须加上，用于放refresh按钮-->
     * </div>

     * ```
     *
     * javascript部分
     * ```javascript
     * $('.ui-refresh').refresh({
     *      load: function (dir, type) {
     *          var me = this;
     *          $.getJSON('../../data/refresh.php', function (data) {
     *              var $list = $('.data-list'),
     *                      html = (function (data) {      //数据渲染
     *                          var liArr = [];
     *                          $.each(data, function () {
     *                              liArr.push(this.html);
     *                          });
     *                          return liArr.join('');
     *                      })(data);
     *              $list[dir == 'up' ? 'prepend' : 'append'](html);
     *              me.afterDataLoading();    //数据加载完成后改变状态
     *          });
     *      }
     *  });
     * ```
     * @param {dom | zepto | selector} [el] 用来初始化Refresh的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:Refresh:options)
     * @grammar $( el ).refresh( options ) => zepto
     * @grammar new gmu.Refresh( el, options ) => instance
     */
    gmu.define( 'Refresh', {
        options: {

            /**
             * @property {Function} load 当点击按钮，或者滑动达到可加载内容条件时，此方法会被调用。需要在此方法里面进行ajax内容请求，并在请求完后，调用afterDataLoading()，通知refresh组件，改变状态。
             * @namespace options
             */
            load: null,

            /**
             * @property {Function} [statechange=null] 样式改变时触发，该事件可以被阻止，阻止后可以自定义加载样式，回调参数：event(事件对象), elem(refresh按钮元素), state(状态), dir(方向)
             * @namespace options
             */
            statechange: null
        },

        _init: function() {
            var me = this,
                opts = me._options;

            me.on( 'ready', function(){
                $.each(['up', 'down'], function (i, dir) {
                    var $elem = opts['$' + dir + 'Elem'],
                        elem = $elem.get(0);

                    if ($elem.length) {
                        me._status(dir, true);    //初始设置加载状态为可用
                        if (!elem.childNodes.length || ($elem.find('.ui-refresh-icon').length && $elem.find('.ui-refresh-label').length)) {    //若内容为空则创建，若不满足icon和label的要求，则不做处理
                            !elem.childNodes.length && me._createBtn(dir);
                            opts.refreshInfo || (opts.refreshInfo = {});
                            opts.refreshInfo[dir] = {
                                $icon: $elem.find('.ui-refresh-icon'),
                                $label: $elem.find('.ui-refresh-label'),
                                text: $elem.find('.ui-refresh-label').html()
                            }
                        }
                        $elem.on('click', function () {
                            if (!me._status(dir) || opts._actDir) return;         //检查是否处于可用状态，同一方向上的仍在加载中，或者不同方向的还未加载完成 traceID:FEBASE-569
                            me._setStyle(dir, 'loading');
                            me._loadingAction(dir, 'click');
                        });
                    }
                });
            } );

            me.on( 'destroy', function(){
                me.$el.remove();
            } );
        },

        _create: function(){
            var me = this,
                opts = me._options,
                $el = me.$el;

            if( me._options.setup ) {
                // 值支持setup模式，所以直接从DOM中取元素
                opts.$upElem = $el.find('.ui-refresh-up');
                opts.$downElem = $el.find('.ui-refresh-down');
                $el.addClass('ui-refresh');
            }
        },

        _createBtn: function (dir) {
            this._options['$' + dir + 'Elem'].html('<span class="ui-refresh-icon"></span><span class="ui-refresh-label">加载更多</span>');

            return this;
        },

        _setStyle: function (dir, state) {
            var me = this,
                stateChange = $.Event('statechange');

            me.trigger(stateChange, me._options['$' + dir + 'Elem'], state, dir);
            if ( stateChange.defaultPrevented ) {
                return me;
            }

            return me._changeStyle(dir, state);
        },

        _changeStyle: function (dir, state) {
            var opts = this._options,
                refreshInfo = opts.refreshInfo[dir];

            switch (state) {
                case 'loaded':
                    refreshInfo['$label'].html(refreshInfo['text']);
                    refreshInfo['$icon'].removeClass();
                    opts._actDir = '';
                    break;
                case 'loading':
                    refreshInfo['$label'].html('加载中...');
                    refreshInfo['$icon'].addClass('ui-loading');
                    opts._actDir = dir;
                    break;
                case 'disable':
                    refreshInfo['$label'].html('没有更多内容了');
                    break;
            }

            return this;
        },

        _loadingAction: function (dir, type) {
            var me = this,
                opts = me._options,
                loadFn = opts.load;

            $.isFunction(loadFn) && loadFn.call(me, dir, type);
            me._status(dir, false);

            return me;
        },

        /**
         * 当组件调用load，在load中通过ajax请求内容回来后，需要调用此方法，来改变refresh状态。
         * @method afterDataLoading
         * @param {String} dir 加载的方向（'up' | 'down'）
         * @chainable
         * @return {self} 返回本身。
         */
        afterDataLoading: function (dir) {
            var me = this,
                dir = dir || me._options._actDir;

            me._setStyle(dir, 'loaded');
            me._status(dir, true);

            return me;
        },

        /**
         * 用来设置加载是否可用，分方向的。
         * @param {String} dir 加载的方向（'up' | 'down'）
         * @param {String} status 状态（true | false）
         */
        _status: function(dir, status) {
            var opts = this._options;

            return status === undefined ? opts['_' + dir + 'Open'] : opts['_' + dir + 'Open'] = !!status;
        },

        _setable: function (able, dir, hide) {
            var me = this,
                opts = me._options,
                dirArr = dir ? [dir] : ['up', 'down'];

            $.each(dirArr, function (i, dir) {
                var $elem = opts['$' + dir + 'Elem'];
                if (!$elem.length) return;
                //若是enable操作，直接显示，disable则根据text是否是true来确定是否隐藏
                able ? $elem.show() : (hide ?  $elem.hide() : me._setStyle(dir, 'disable'));
                me._status(dir, able);
            });

            return me;
        },

        /**
         * 如果已无类容可加载时，可以调用此方法来，禁用Refresh。
         * @method disable
         * @param {String} dir 加载的方向（'up' | 'down'）
         * @param {Boolean} hide 是否隐藏按钮。如果此属性为false，将只有文字变化。
         * @chainable
         * @return {self} 返回本身。
         */
        disable: function (dir, hide) {
            return this._setable(false, dir, hide);
        },

        /**
         * 启用组件
         * @method enable
         * @param {String} dir 加载的方向（'up' | 'down'）
         * @chainable
         * @return {self} 返回本身。
         */
        enable: function (dir) {
            return this._setable(true, dir);
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发。
         */
        
        /**
         * @event statechange
         * @param {Event} e gmu.Event对象
         * @param {Zepto} elem 按钮元素
         * @param {String} state 当前组件的状态('loaded'：默认状态；'loading'：加载中状态；'disabled'：禁用状态，表示无内容加载了；'beforeload'：在手没有松开前满足加载的条件状态。 需要引入插件才有此状态，lite，iscroll，或者iOS5)
         * @param {String} dir 加载的方向（'up' | 'down'）
         * @description 组件发生状态变化时会触发
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 组件在销毁的时候触发
         */

    } );
})( gmu, gmu.$ );


/**
 * @file lite插件，上拉加载更多，利用原生滚动，不使用iscroll
 * @import widget/refresh/refresh.js
 */

(function( gmu, $, undefined ) {
    
    /**
     * lite插件，上拉加载更多，利用原生滚动，不使用iscroll
     * @class lite
     * @namespace Refresh
     * @pluginfor Refresh
     */
    /**
     * @property {Number} [threshold=5] 加载的阀值，默认手指在屏幕的一半，并且拉动距离超过10px即可触发加载操作，配置该值后，可以将手指在屏幕位置进行修重情重改，若需要实现连续加载效果，可将该值配置很大，如1000等
     * @namespace options
     * @for Refresh
     * @uses Refresh.lite
     */
    /**
     * @property {Boolean} [seamless=false] 是否连续加载，解决设置threshold在部分手机上惯性滚动，或滚动较快时不触发touchmove的问题
     * @namespace options
     * @for Refresh
     * @uses Refresh.lite
     */
    gmu.Refresh.register( 'lite', {
        _init: function () {
            var me = this,
                opts = me._options,
                $el = me.$el;

            opts.seamless && $(document).on('scrollStop', $.proxy(me._eventHandler, me));
            $el.on('touchstart touchmove touchend touchcancel', $.proxy(me._eventHandler, me));
            opts.wrapperH = $el.height();
            opts.wrapperTop = $el.offset().top;
            opts._win = window;
            opts._body = document.body;
            return me;
        },
        _changeStyle: function (dir, state) {
            var me = this,
                refreshInfo = me._options.refreshInfo[dir];

            if (state == 'beforeload') {
                refreshInfo['$icon'].removeClass('ui-loading');
                refreshInfo['$label'].html('松开立即加载');
            }
            return me.origin(dir, state);
        },
        _startHandler: function (e) {
            this._options._startY = e.touches[0].pageY;
        },
        _moveHandler: function (e) {
            var me = this,
                opts = me._options,
                startY = opts._startY,
                movedY = startY - e.touches[0].pageY,
                winHeight = opts._win.innerHeight,
                threshold = opts.threshold || (opts.wrapperH < winHeight ? (opts.wrapperH / 2 + opts.wrapperTop || 0) : winHeight / 2);     //默认值为可视区域高度的一半，若wrapper高度不足屏幕一半时，则为list的一半

            if (!me._status('down') || movedY < 0) return;
            if (!opts['_refreshing'] && (startY >= opts._body.scrollHeight - winHeight + threshold) && movedY > 10) {    //下边按钮，上拉加载
                me._setStyle('down', 'beforeload');
                opts['_refreshing'] = true;
            }
            return me;
        },

        _endHandler: function () {
            var me = this,
                opts = me._options;
            me._setStyle('down', 'loading');
            me._loadingAction('down', 'pull');
            opts['_refreshing'] = false;
            return me;
        },

        _eventHandler: function (e) {
            var me = this,
                opts = me._options;

            switch (e.type) {
                case 'touchstart':
                    me._startHandler(e);
                    break;
                case 'touchmove':
                    clearTimeout(opts._endTimer);        //解决部分android上，touchmove未禁用时，touchend不触发问题
                    opts._endTimer = setTimeout( function () {
                        me._endHandler();
                    }, 300);
                    me._moveHandler(e);
                    break;
                case 'touchend':
                case 'touchcancel':
                    clearTimeout(opts._endTimer);
                    opts._refreshing && me._endHandler();
                    break;
                case 'scrollStop':
                    (!opts._refreshing && opts._win.pageYOffset >= opts._body.scrollHeight - opts._win.innerHeight + (opts.threshold || -1)) && me._endHandler();
                    break;
            }
            return me;
        }
    } );
})( gmu, gmu.$ );