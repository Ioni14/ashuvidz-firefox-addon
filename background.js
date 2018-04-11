(
    () => {

        function onGot(item) {
            if (!item.isLive) {
                browser.storage.local.set({
                    isLive:  "0"
                });
                buffer = browser.storage.local.get('isLive')
                buffer.then(onGot, onError);
            } else {

                buffer.then(twitchCheck)

            }
            let linkUrl = "";
        }

        function onError(error) {
            console.log(`Error: ${error}`);
        }

        let buffer = browser.storage.local.get('isLive')
        buffer.then(onGot, onError);

        function twitchCheck(item){
            $.ajax({
                url: "https://api.twitch.tv/helix/streams?user_login=ashuvidz",
                headers: { "Client-ID": "b90nfoacg9807542cq15o2qbv2g05q" },
                type: "GET",
                success: function() { console.log('Success!'); }
            }).done(( channel ) => {

                    //live is offline Youtube player appened
                    if (channel.data.length <= 0) {
                        console.log(channel.data.length)
                        browser.browserAction.setIcon({path: "images/offline.png"});
                        console.log("set icon offline");

                        linkUrl = "http://youtube.com/ashuvidz/";

                        if (item.isLive === '0') return;

                        browser.notifications.create('notifTwitchOnline', {
                            'type': 'basic',
                            'message': 'hi i am offline, bonne nuit ! ',
                            'title': 'go to bed !!!'
                        });
                        browser.storage.local.set({
                            isLive:  "0"
                        });
                        buffer = browser.storage.local.get('isLive')

                        //live is online Twitch player
                    } else {
                        linkUrl = "http://twitch.tv/ashuvidz/";

                        browser.browserAction.setIcon({path: "images/online.png"});
                        console.log("set icon online");

                        if (item.isLive === '1') return;
                      browser.notifications.create('notifTwitchOffline', {
                            'type': 'basic',
                            'message': 'hi i am online, réveille toi ! ',
                            'title': 'here here here!!!'
                        });
                        browser.storage.local.set({
                            isLive:  "1"
                        });
                        buffer = browser.storage.local.get('isLive')

                    }
                }
            );
        }

        browser.alarms.create('twitchAlarm', {delayInMinutes: 1, periodInMinutes: 1});

        browser.alarms.onAlarm.addListener(() => {
            buffer.then(twitchCheck);
        });

        browser.browserAction.onClicked.addListener(() =>
        {
            browser.tabs.create({ url: linkUrl });
        });

        /*function increment() {
            browser.browserAction.setBadgeText({text: (13).toString()});
        }

        increment()*/
    }
)();