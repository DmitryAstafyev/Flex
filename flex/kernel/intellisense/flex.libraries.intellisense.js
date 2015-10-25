(function () {
    if (!flex) {
        flex = {};
    }
    flex.libraries = {
        /// Basic events controller
        events  : { 
			create : function(){
				/// <signature>
				/// <summary>Create instance of controller</summary>
				/// </signature>					
			}
		},
        /// Collection of tools for management of DOM
        html    : { 
			create : function(){
				/// <signature>
				/// <summary>Create instance of controller</summary>
				/// </signature>					
			}
		},
        css     : {
            /// Controller CSS animation
            animation   : { 
				create : function(){
					/// <signature>
					/// <summary>Create instance of controller</summary>
					/// </signature>					
				}
			},
            /// Controller CSS events
            events      : { 
				create : function(){
					/// <signature>
					/// <summary>Create instance of controller</summary>
					/// </signature>					
				}
			},
        },
        /// Collection of UI elements
        ui      : {
            /// Controller of window
            window      : {
                /// Controller of window movement
                move    : { 
					create : function(){
						/// <signature>
						/// <summary>Create instance of controller</summary>
						/// </signature>					
					}
				},
                /// Controller of window resize
                resize  : { 
					create : function(){
						/// <signature>
						/// <summary>Create instance of controller</summary>
						/// </signature>					
					}
				},
                /// Controller of window resize
                focus   : { 
					create : function(){
						/// <signature>
						/// <summary>Create instance of controller</summary>
						/// </signature>					
					}
				},
                /// Controller of window maximize / restore
                maximize: { 
					create : function(){
						/// <signature>
						/// <summary>Create instance of controller</summary>
						/// </signature>					
					}
				},
            },
            /// Controller of templates
            templates   : { 
				create : function(){
					/// <signature>
					/// <summary>Create instance of controller</summary>
					/// </signature>					
				}
			},
            /// Controller of scrollbox
            scrollbox   : { 
				create : function(){
					/// <signature>
					/// <summary>Create instance of controller</summary>
					/// </signature>					
				}
			},
            /// Controller of itemsbox
            itemsbox    : { 
				create : function(){
					/// <signature>
					/// <summary>Create instance of controller</summary>
					/// </signature>					
				}
			},
            /// Controller of areaswitcher
            areaswitcher: { 
				create : function(){
					/// <signature>
					/// <summary>Create instance of controller</summary>
					/// </signature>					
				}
			},
            /// Controller of areascroller
            areascroller: { 
				create : function(){
					/// <signature>
					/// <summary>Create instance of controller</summary>
					/// </signature>					
				}
			},
            /// Controller of arearesizer
            arearesizer : { 
				create : function(){
					/// <signature>
					/// <summary>Create instance of controller</summary>
					/// </signature>					
				}
			},
        },
    };
})();