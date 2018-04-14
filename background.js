(
    () => {

        // Bootstraps the plugin.
        function linkManager(item) {
            if (!item.linkUrl || !item.isLive) {
                browser.storage.local.set({
                    linkUrl:  `https://youtube.com/${twitchUserName}/`,
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

            // We first get data from Twitch Using Helix API using new nodejs fetch methode
            // Setting the API Request to Twitch
            const twitchUrl = `https://api.twitch.tv/helix/streams?user_login=${twitchUserName}`;


            const twitchApiGetter = {
                method: 'GET',
                headers: { "Client-ID": twitchApiKey }
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
                            linkUrl: `https://youtube.com/${twitchUserName}/`
                        });
                        buffer = browser.storage.local.get();
                        buffer.then(linkManager, onError);

                    } else {

                        // If live, append the link to Twitch and change images
                        browser.browserAction.setIcon({path: "images/online.png"});

                        if (local.isLive === '1') return;

                        const twitchGameUrl = 'https://api.twitch.tv/helix/games?id=' + channel.data[0].game_id;

                        fetch(twitchGameUrl, twitchApiGetter).then(( response ) => {
                            return response.json()}).then( (game)=> {

                           if (game.data.length <= 0) {
                               return;
                           }

                            let twitchGameName = game.data[0].name;
                            const twitchUserUrl = 'https://api.twitch.tv/helix/users?login=' + twitchUserName;

                            fetch(twitchUserUrl, twitchApiGetter).then(( response ) => {
                                return response.json()}).then( (user)=> {

                                if (user.data.length <= 0) {
                                    return;
                                }
                                // This sends a notification

                                browser.notifications.create('notifTwitchOffline', {
                                    'type': 'basic',
                                    'title': channel.data[0].title,
                                    'message': `${twitchUserName} est en stream sur ${twitchGameName}`,
                                    'iconUrl': user.data[0].profile_image_url
                                });

                                // Then update the local variable and get it again to ensure the promise is fired.
                                browser.storage.local.set({
                                    isLive: "1",
                                    linkUrl: `http://twitch.tv/${twitchUserName}/`
                                });
                                buffer = browser.storage.local.get();
                                buffer.then(linkManager, onError);
                            })
                        });
                    }
                }
            );
        }

        const twitchApiKey = "b90nfoacg9807542cq15o2qbv2g05q";
        const twitchUserName = "ashuvidz";

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
            browser.tabs.create({ url: local.linkUrl });
        });

        // This manage the onclick behavior over the notification.
        browser.notifications.onClicked.addListener(() => {
            browser.tabs.create({ url: local.linkUrl });
        });

        /*function increment() {
            browser.browserAction.setBadgeText({text: (13).toString()});
        }

        increment()*/
    }
)();