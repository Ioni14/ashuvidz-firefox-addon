(
    () => {
        let isLive = 1;

        function twitchCheck() {
            $.ajax({
                url: "https://api.twitch.tv/helix/streams?user_login=ashuvidz",
                headers: {"Client-ID": "yufsibfdh5gwli5nzdj01ceghc1ubv"},
                type: "GET",
                success: function () {
                    console.log('Success!');
                }
            }).done(function (channel) {

                    if (channel.data.length <= 0) {
                        //live is offline Youtube player appened
                        browser.browserAction.setIcon({path: "images/offline.png"});
                        console.log("set icon offline");

                        if (isLive === 0) return;

                        browser.notifications.create('notifTwitchOnline', {
                            'type': 'basic',
                            'message': 'hi i am offline, bonne nuit ! ',
                            'title': 'go to bed !!!'
                        });
                        isLive = 0;

                    } else {
                        //live is online Twitch player
                        browser.browserAction.setIcon({path: "images/online.png"});
                        console.log("set icon online");

                        if (isLive === 1) return;

                        browser.notifications.create('notifTwitchOffline', {
                            'type': 'basic',
                            'message': 'hi i am online, réveille toi ! ',
                            'title': 'ici ici !!!'
                        });
                        isLive = 1;
                    }
                }
            );
        }

        twitchCheck();

        browser.alarms.create('twitchAlarm', {delayInMinutes: 1, periodInMinutes: 1});

        browser.alarms.onAlarm.addListener(() => {
            twitchCheck();
        });

    }
)();