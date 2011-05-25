/*
    Astro Tooltips
    @dylang, created May 17 2011

    ------------------------------------------------------------------
    Recommended Usage: Data attribute.

    data-tooltip="optional selector for the tip"
    data-tooltip-html="If <pre>data-tooltip</pre> is empty then <pre>data-tooltip-html</pre> is required"
    data-tooltip-style="optional className" //defaults to showing tip above content, "side" will show the tip to the left or right
    data-tooltip-disable //disables the tooltip
    data-tooltip-offset="2" //px distance from trigger

    ------------------------------------------------------------------
    Optional Usage: jQuery Plugin

    // You should never need this. Adding the data attributes should be enough.
    $(triggerElement).tooltip({
        selector: 'optional selector or jquery object',
        style: 'optional className',
        html: 'optional html if content is not used'
        offset: 2 //px distance from trigger
        });

    // Show a tooltip, should never be needed
    $(triggerElement).tooltip({action: 'show'});

    // Hide a tooltip, should never be needed
    $(triggerElement).tooltip({action: 'hide'});

    // Enable/Disable the tooltip
    $(triggerElement).tooltip({action: 'enable|disable'});

    ------------------------------------------------------------------
    Tips and Examples

    The trigger element always gets the class "highlight" while the tooltip is active.

    Tooltips activate on mouse hover and keyboard focus.

    The selector can be a child of the trigger or an element elsewhere in the DOM.
    Child: <div data-tooltip=".tooltip"><div class="tooltip hide">Child tooltip</div></div>
    DOM: <div data-tooltip=".tooltip1"></div><div class=".tooltip1 hide">Tooltip in DOM</div>
    Inline: <div data-tooltip data-tooltip-html="Inline Tooltip"></div>

 */

(function($){

    //Tooltip container and pointer is shared for all tips
    var $container = $('<div class="tooltip-container">' +
                        '<div class="tooltip-pointer-border"></div>' +
                        '<div class="tooltip-pointer"></div>' +
                       '</div>'),
        $pointer = $container.find('.tooltip-pointer'),
        $pointerBorder = $container.find('.tooltip-pointer-border');

    // For active element
    var $activeTrigger,     // The element that the user hovered over
        $activeContent,     // The specific tooltip content
        activeStyle,        // Current style being used
        hide_timer;         // Timer for hiding the tooltip


    // Constants
    var MILLISECONDS_BEFORE_TIP_HIDES = 30,
        POINTER_OFFSET = 19,
        DEFAULT_OFFSET = 2;

    var $window = $(window);

    function hide() {
        hide_timer = setTimeout(function() {
            $container.fadeOut('fast');
            if ($activeTrigger) { $activeTrigger.removeClass('highlight'); }
        }, MILLISECONDS_BEFORE_TIP_HIDES);
    }

    function positionPointer(direction, side) {

        $container.removeClass('tooltip-left tooltip-right tooltip-down tooltip-up');

        var containerHeight = $container.height();

        if (side) {
            // container is left or right of the trigger
            $pointerBorder.css({top: containerHeight/2});
            $pointer.css({top: containerHeight/2 + 3}); //move pointer up three so there is room for the border
        } else {
            // Container is above or below the trigger

            //Remove modifications from other style of tooltips
            $pointerBorder.css({top: ''});
            $pointer.css({top: ''});
        }

        $container.addClass('tooltip-' + direction);

    }

    function position($trigger, side) {
        var top,
            left,
            direction; //up/down/left/right

        var offset = POINTER_OFFSET + $trigger.data('tooltip-offset');

        var containerSize = {
            width: $container.outerWidth(),
            height: $container.outerHeight()
        };

        var triggerSize = {
            width: $trigger.outerWidth(),
            height: $trigger.outerHeight()
        };

        var triggerPosition = $trigger.offset();

        if (side) {
            //show tip to the left or right side
            top = triggerPosition.top - (containerSize.height/2 - triggerSize.height/2);
            left = triggerPosition.left - containerSize.width - offset;
            direction = 'right';

            if (left < 0) {
                left = triggerPosition.left + triggerSize.width + offset;
                direction = 'left';
            }
        } else {
            //show tip above unless there isn't enough room then show below
            top = triggerPosition.top - containerSize.height - offset;
            left = triggerPosition.left + (triggerSize.width/2 - containerSize.width/2);
            direction = 'down';

            if (top < $window.scrollTop()) {
                top = triggerPosition.top + triggerSize.height + offset;
                direction = 'up';
            }
        }

        return {
            top: top,
            left: left,
            direction: direction
        }
    }

    function show($trigger, $content, style){
        clearTimeout(hide_timer);

        // Hide previous tooltip if it's still showing
        if ($activeTrigger) { $activeTrigger.removeClass('highlight'); }
        if ($activeContent) { $activeContent.hide(); }
        if (activeStyle)    { $container.removeClass(activeStyle); }

        $trigger.addClass('highlight');

        // show this tip content
        $content.show();

        var containerPosition = position($trigger, style === 'side');

        $container
            .stop()              //stop the fade if it was fading
            .addClass(style)
            .show()
            .css({
                top:        containerPosition.top,
                left:       containerPosition.left,
                opacity:    1,  //fade in fully
                zoom:       '', //fix IE6/7 bug that would crop the pointer
                filter:     ''  //fix IE6/7 bug that would crop the pointer
            });

        positionPointer(containerPosition.direction, style === 'side');

        $activeTrigger = $trigger;
        $activeContent = $content;
        activeStyle = style;
    }

    $.fn.tooltip = function(options) {

        options = options || {};

        return this.each(function() {

            var $trigger = $(this),
                tooltipSelector = options.selector || $trigger.data('tooltip'),
                tooltipHTML = options.html || $trigger.data('tooltip-html'),
                style = options.style || $trigger.data('tooltip-style'),
                offset = options.offset || $trigger.data('tooltip-offset') || DEFAULT_OFFSET,
                $content = $trigger.data('$tooltip-content'); //might be cached;

            if (!$content) {

                if (tooltipSelector) {
                    $content = $trigger.find(tooltipSelector); //child of trigger

                    // didn't find, it, look on the whole page
                    if (!$content.length) {
                        //absolute selector
                        $content = $(tooltipSelector);
                    }

                    tooltipHTML = $content.html();
                }

                if (tooltipHTML) {
                    $content = $('<div>')
                        .hide()
                        .html(tooltipHTML)
                        .appendTo($container);

                    // cache it
                    $trigger.data('$tooltip-content', $content);
                }
            }

            $trigger.data('tooltip-offset', offset);

            switch (options.action) {
                case 'show':
                    if (!$trigger.is('[data-tooltip-disable]')) {
                        show($trigger, $content, style);
                    }
                    break;
                case 'hide':
                    hide();
                    break;
                case 'disable':
                    $trigger.attr('data-tooltip-disable', '');
                    break;
                case 'enable':
                    $trigger.removeAttr('data-tooltip-disable');
                    break;
                default:
                    break;
            }

            // If the jquery plugin is used this enables the delegate to work
            if (!$trigger.attr('data-tooltip')){
                $trigger.attr('data-tooltip', '');
            }
        });
    };

    $(function(){
        $container
            .hide()
            .hover(function(){
                // Keep the tooltip up if the user hovers over it
                clearTimeout(hide_timer);
            }, function(){
                // Start the hiding if the user leaves the tooltip
                hide();
            })
            .appendTo('body');
    });

    $.doc.delegate('[data-tooltip]', {
            'mouseenter focus': function() {
                    $(this).tooltip({ action: 'show' });
                },
            'mouseleave blur': function() {
                    hide();
                }
        });

})(jQuery);
