(
    () => {
        var isLive = 0;
        function twitchCheck(){
            $.ajax({
                url: "https://api.twitch.tv/helix/streams?user_login=ashuvidz",
                headers: { "Client-ID": "b90nfoacg9807542cq15o2qbv2g05q" },
                type: "GET",
                success: function() { console.log('Success!'); }
            }).done(function( channel ) {

                    //live is offline Youtube player appened
                    if (channel.data.length <= 0) {
                        browser.browserAction.setIcon({path: "images/offline.png"});
                        console.log("set icon offline");

                        linkUrl = "http://youtube.com/ashuvidz/";

                        if (isLive === 0) return;

                        browser.notifications.create('notifTwitchOnline', {
                            'type': 'basic',
                            'message': 'hi i am offline, bonne nuit ! ',
                            'title': 'go to bed !!!'
                        });
                        isLive = 0;


                        //live is online Twitch player
                    } else {
                        linkUrl = "http://twitch.tv/ashuvidz/";

                        browser.browserAction.setIcon({path: "images/online.png"});
                        console.log("set icon online");

                        if (isLive == 1) return;
                      browser.notifications.create('notifTwitchOffline', {
                            'type': 'basic',
                            'message': 'hi i am online, réveille toi ! ',
                            'title': 'here here here!!!'
                        });
                        isLive = 1;

                    }
                }
            );
        }
        var linkUrl = "";
        twitchCheck();

        browser.alarms.create('twitchAlarm', {delayInMinutes: 1, periodInMinutes: 1});

        browser.alarms.onAlarm.addListener(() => {
            twitchCheck();
        });

        browser.browserAction.onClicked.addListener(function()
        {
            browser.tabs.create({ url: linkUrl });
        });

        /*function increment() {
            browser.browserAction.setBadgeText({text: (13).toString()});
        }

        increment()*/
    }
)();