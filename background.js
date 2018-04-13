(
    () => {

        // Bootstraps the plugin.

        function linkManager(item) {
            if (!item.linkUrl || !item.isLive) {
                browser.storage.local.set({
                    linkUrl:  "https://youtube.com/ashuvidz/",
                    isLive: "0"
                });
                local = item;
                linkManager();
            } else {
                local = item;
                console.log(local);
                twitchCheck();
            }
        }

        // Error manager for all localstorage try.
        function onError(error) {
            console.log(`Error: ${error}`);
        }

        // This is the actual logic of the plugin.
        function twitchCheck(){
            console.log(local);

            // We first get data from Twitch Using Helix API using new nodejs fetch methode
            // Setting the API Request to Twitch
            const twitchUrl = 'https://api.twitch.tv/helix/streams?user_login=jvtv';

            const twitchApiGetter = {
                method: 'GET',
                headers: { "Client-ID": "b90nfoacg9807542cq15o2qbv2g05q" }
            };

            // Fetching data from twitch API
            fetch(twitchUrl, twitchApiGetter).then(( response ) => {
                return response.json()}).then( (channel)=> {
                    //live is offline Youtube player appened
                    if (channel.data.length <= 0) {

                        // If status changed, change status back to not streaming and save it in local storage without notifications.
                        browser.browserAction.setIcon({path: "images/offline.png"});

                        // If status didn't changed do Nothing
                        if (local.isLive === '0') return;

                        browser.storage.local.set({
                            isLive:  "0",
                            linkUrl: "http://youtube.com/ashuvidz/"
                        });
                        buffer = browser.storage.local.get();
                        buffer.then(linkManager, onError);

                    } else {

                        // If live, append the link to Twitch and change images
                        browser.browserAction.setIcon({path: "images/online.png"});

                        if (local.isLive === '1') return;

                        // This sends a notification
                        // TODO: Insert a link so when clicking on notification it open live stream channel in a new tab.
                        browser.notifications.create('notifTwitchOffline', {
                            'type': 'basic',
                            'message': 'hi i am online, réveille toi ! ',
                            'title': 'here here here!!!'
                        });

                        // Then update the local variable and get it again to ensure the promise is fired.
                        browser.storage.local.set({
                            isLive:  "1",
                            linkUrl: "http://twitch.tv/ashuvidz/"
                        });
                        buffer = browser.storage.local.get();
                        buffer.then(linkManager, onError);

                    }
                }
            );
        }

        // This starts the plugin by geeting the saved previous status.
        let local;
        let buffer = browser.storage.local.get();
        buffer.then(linkManager, onError);

        // Borwser Event Listeners. This keep application running after bootstrap.
        // This create the delay that trigger a new check every minutes
        browser.alarms.create('twitchAlarm', {delayInMinutes: 1, periodInMinutes: 1});

        // This manage the behavior when an Alarm Event is Fired
        browser.alarms.onAlarm.addListener(() => {
            buffer.then(twitchCheck);
        });

        // This manager the behavior when plugin icon is clicked
        browser.browserAction.onClicked.addListener(() =>
        {
            console.log(local.linkUrl);
            browser.tabs.create({ url: local.linkUrl });
        });

        /*function increment() {
            browser.browserAction.setBadgeText({text: (13).toString()});
        }

        increment()*/
    }
)();