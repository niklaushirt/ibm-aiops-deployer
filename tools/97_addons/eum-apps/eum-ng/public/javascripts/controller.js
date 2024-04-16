
(() => {

    // helper for backend calls
    function getdata(path) {
        $.getJSON(path).done((data) => {
            console.log('got data OK', path);
            //console.log('data', data);
        }).fail((jqxhr, textStatus, error) => {
            console.error('Failed to get config', textStatus, error);
        });
    }

    // help for page fragments aka transitions
    function loadFragment(t) {
        console.log('loadFragment', t.title);
        $('#fragment').load('/fragment' + t.path);
        ineum('page', t.title);

        // nested ajax
        t.ajax.forEach((a) => {
            console.log('nested ajax', a);
            setTimeout(getdata, _.random(100, 1000), '/api' + a.call);
        });

        // throw fragment error
        if(! _.isEmpty(t.error)) {
            if(t.error.weightpct >= _.random(1, 100)) {
                setTimeout(() => {
                    throw new Error(t.error.text);
                }, _.random(10, 200));
            }
        }
    }

    // call backend
    ajax.forEach((a) => {
        console.log('ajax', a);
        setTimeout(getdata, _.random(100, 1000), '/api' + a);
    });

    // perform transitions
    transitions.forEach((t) => {
        if (t.weightpct >= _.random(1, 100)) {
            console.log('transition', t.title);
            setTimeout(loadFragment, _.random(3000, 10000), t);
        }
    });

    // flag page finished to loadgen
    setTimeout(() => {
        document.getElementById('finished').textContent = 'done';
    }, _.random(1000, 2000));

    // throw exception if set
    if(! _.isEmpty(pageError)) {
        if(_.random(1, 100) <= pageError.weightpct) {
            setTimeout(() => {
                throw new Error(pageError.text);
            }, _.random(10, 200));
        }
    }


})();

