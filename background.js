(
    function () {
        var estEnLigne = 0;

        function twitchCheck() {
            $.getJSON(
                "https://api.twitch.tv/kraken/streams/tarmacbe?client_id=yufsibfdh5gwli5nzdj01ceghc1ubv",
                function (channel) {

                    //live is offline Youtube player appened
                    if (channel["stream"] == null) {
                        browser.browserAction.setIcon({path: "images/offline.png"});
                        console.log("set icon offline");

                        if (estEnLigne == 0) return;

                        browser.notifications.create('notifTwitchOnline', {
                            'type': 'basic',
                            'message': 'hi i am offline, bonne nuit ! ',
                            'title': 'go to bed !!!'
                        });
                        estEnLigne = 0;


                        //live is online Twitch player
                    } else {

                        browser.browserAction.setIcon({path: "images/online.png"});
                        console.log("set icon online");

                        if (estEnLigne == 1) return;

                        browser.notifications.create('notifTwitchOffline', {
                            'type': 'basic',
                            'message': 'hi i am online, réveille toi ! ',
                            'title': 'here here here!!!'
                        });
                        estEnLigne = 1;

                    }
                }
            );
        }

        twitchCheck();

        browser.alarms.create('twitchAlarm', {delayInMinutes: 1, periodInMinutes: 1});

        browser.alarms.onAlarm.addListener(function (twitchAlarm) {
            twitchCheck();
        });

    }
)();