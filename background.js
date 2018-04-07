(
    () => {
        function twitchCheck(){
            $.ajax({
                url: "https://api.twitch.tv/helix/streams?user_login=arkadiumstream",
                headers: { "Client-ID": "yufsibfdh5gwli5nzdj01ceghc1ubv" },
                type: "GET",
                success: function() { console.log('Success!'); }
            }).done(function( channel ) {

                //live is offline Youtube player appened
                console.log(channel.data.length);
                if (channel.data.length <= 0) {
                    console.log('offline');
                    browser.browserAction.setIcon({path: "images/offline.png"});
                    console.log("set icon offline");

                    //live is online Twitch player
                } else {
                    console.log('live');
                    browser.browserAction.setIcon({path: "images/online.png"});
                    console.log("set icon online");
                }
            })
        };

        twitchCheck();

        browser.alarms.create('twitchAlarm', {
            delayInMinutes: 5, periodInMinutes: 5
        });

        browser.alarms.onAlarm.addListener(function( twitchAlarm ) {
            twitchCheck();
        })
    }
)();