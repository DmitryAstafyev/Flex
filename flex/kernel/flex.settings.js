/// <reference path="flex.core.js" />
/// <module>
///     <summary>
///         Settings of [flex].
///     </summary>
/// </module>
(function () {
    "use strict";
    var init = function () {
            flex.init({
                resources: {
                    MODULES         : [
                        'flex.presentation'
                    ],
                    EXTERNAL        : [
                        { url: '/program/body.css', hash: 'TESTHASHPROPERTY' }
                    ],
                    ASYNCHRONOUS    : [
                        {
                            resources: [
                                { url: 'http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js' },
                                { url: '/program/highcharts/highcharts.js',         after: ['http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js'] },
                                { url: '/program/highcharts/highcharts-more.js',    after: ['/program/highcharts/highcharts.js'] },
                                { url: '/program/highcharts/exporting.js',          after: ['/program/highcharts/highcharts.js'] },
                            ],
                            storage : true,
                            finish  : null
                        }
                    ],
                    USE_STORAGED    : true,
                },
                paths   : {
                    CORE: '/kernel'
                },
                events  : {
                    onFlexLoad: function () {
                    },
                    onPageLoad: function () {
                        var presentation = flex.libraries.presentation.create();
                        presentation.start();
                    }
                }
            });
        },
        start = function () {
            if (typeof flex !== 'undefined') {
                init();
            } else {
                setTimeout(start, 50);
            }
        };
    start();
}());