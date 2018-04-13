(
    () => {

        // Bootstraps the plugin.
        function bootstrap(item) {

            // For the first time running after install. Set the status at 0 for non live.
            if (!item.isLive) {
                browser.storage.local.set({
                    isLive:  "0"
                });

                // To be sure that the variable is localy saved.
                buffer = browser.storage.local.get('isLive');
                buffer.then(bootstrap, onError);
            } else {

                buffer.then(twitchCheck)

            }
        }

        function linkManager(item) {
            if (!item.linkUrl) {
                browser.storage.local.set({
                    linkUrl:  "https://youtube.com/ashuvidz/"
                });

                // To be sure that the variable is localy saved.
                linkUrl = browser.storage.local.get('linkUrl');
                linkUrl.then(linkManager, onError);
            }
        }

        // Error manager for all localstorage try.
        function onError(error) {
            console.log(`Error: ${error}`);
        }

        // This is the actual logic of the plugin.
        function twitchCheck(item){


            // Old methode to fetch twitch api using Jquery lib
            /*$.ajax({
                url: "https://api.twitch.tv/helix/streams?user_login=ashuvidz",
                headers: { "Client-ID": "b90nfoacg9807542cq15o2qbv2g05q" },
                type: "GET"
            }).done*/

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

                        // If status didn't changed do Nothing
                        if (item.isLive === '0') return;

                        // If status changed, change status back to not streaming and save it in local storage without notifications.
                        browser.browserAction.setIcon({path: "images/offline.png"});

                        browser.storage.local.set({
                            isLive:  "0",
                            linkUrl: "http://youtube.com/ashuvidz/"
                        });
                        buffer = browser.storage.local.get('isLive')

                    } else {

                        if (item.isLive === '1') return;

                        // If live, append the link to Twitch and change images
                        browser.browserAction.setIcon({path: "images/online.png"});

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
                        buffer = browser.storage.local.get('isLive')

                    }
                }
            );
        }

        // This starts the plugin by geeting the saved previous status.
        let linkUrl = browser.storage.local.get('linkUrl');
        linkUrl.then(linkManager, onError);
        let buffer = browser.storage.local.get('isLive');
        buffer.then(bootstrap, onError);

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
            console.log(linkUrl);
            browser.tabs.create({ url: linkUrl });
        });

        /*function increment() {
            browser.browserAction.setBadgeText({text: (13).toString()});
        }

        increment()*/
    }
)();