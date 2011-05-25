#jQuery.tooltip()
Easy to use image-free HTML5 tooltips for jQuery 1.5.2+.
Automatically positions to avoid going off the screen.
Uses delgates and re-uses the tooltip chrome for extra optimization.

##Credit

Created by [Dylan Greene](http://http://github.com/dylang) at OPOWER.


##HTML5 Data attribute usage
    <div data-tooltip=".example">
        This is going to have a great tooltip.
        <div class="example hide">This is one way to do tooltips.<div>
    <div>

###Data Attribute API

Put any of these attrbutes on a div, span, input, text area, etc to give it a tooltip.

`data-tooltip` This attribute is required. The value is an optional selector for the tip.
`data-tooltip-html` Optional HTML - only used if data-tooltip has no value.
`data-tooltip-style` Optional CSS class.  Defaults to a nice tip above.  `side` will show tips to the left or right of the element.
`data-tooltip-disable` Disables the tooltip.
`data-tooltip-offset` Pixel distance to show the tooltip from trigger. Defaults to 2px.

##Another HTML5 Data attribute example
    <div data-tooltip data-tooltip-html="This is <strong>cool</strong>"
         data-tooltip-style="side"
         data-tootlip-offset="-10">
        Side will make the tooltip show to the side.  The negative offset will make it overlap a little.
    <div>

##Javascript Usage
    $(triggerElement).tooltip({selector: '.example'});

###jQuery API

####Attributes
`selector` Optional selector or jquery object.
`html` Optional html if content is not used.
`style` Optional className.
`offset` Pixel distance from trigger

####Actions
    // Show a tooltip, should never be needed
    $(triggerElement).tooltip({action: 'show'});

    // Hide a tooltip, should never be needed
    $(triggerElement).tooltip({action: 'hide'});

    // Enable/Disable the tooltip
    $(triggerElement).tooltip({action: 'enable|disable'});

##Trigger Element

The trigger element is what triggers the tooltip to show.
It will trigger the tooltip on `mouseenter` and `focus`.
It will hide the tooltip on `mouseleave` and `blur` - unless the tooltip has `hover` or `focus`.
The trigger element always gets the class `highlight` while the tooltip is visible.

##CSS

CSS is included for the graphics-free tooltip.  It can be easily modifed.

##Compatiblity
Works with every modern browser as well as IE6.

* Chrome
* Safari
* Firefox
* Internet Explorer 6 - 10
* iPhone/Android

## Examples

These three tooltips show how flexable the tooltip content can be.

    <!DOCTYPE html>
    <html>
    <head>
    <link rel="Stylesheet" media="screen" href="jquery.tooltip.css" />
    </head>
    <body>

        <!-- Tooltip is a child of trigger -->
        <div data-tooltip=".tooltip">
            I like tooltips.
            <div class="tooltip hide">Child tooltip</div>
        </div>

        <!-- Tooltip is somewhere else in the dom -->
        <div data-tooltip=".tooltip1">I want a tooltip</div>

        <!-- Tooltip is inline -->
        <div data-tooltip data-tooltip-html="Inline Tooltip">I have a tooltip.</div>

        <script src="http://code.jquery.com/jquery-1.6.1.min.js"></script>
        <script src="jquery.tooltip.js"></script>
    </body>
    </html>



#License

TBD. (If you'd like to use this let Dylan know and he'll create a license that works for us.)
