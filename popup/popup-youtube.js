
    function toto() {
        function btnCheck() {
            console.log("btn check");

            let b = document.getElementsByName("btn")[0];
            b.disable = true;
        }

        btnCheck();
    }

    toto();
