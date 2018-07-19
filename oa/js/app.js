$.ajax({
    method: "get",
    url: "/api/getCEREMA/0"
}).done(function (data) {
    $.ajax({
        method: "get",
        url: "/api/getMarchesOnline"
    }).done(function (dx) {
        var list = [];
        var ndx = [];
        var CPX = {};
        var CEREMA_MOD = {};
        var CEREMA_MODX = {};
        $.ajax({
            method: "get",
            url: "/api/mid"
        }).done(function (ex) {
            for (var j = 0; j < ex.length; j++) {
                if (!CEREMA_MOD[ex[j].id]) CEREMA_MOD[ex[j].id] = [];
                if (!CEREMA_MODX[ex[j].id]) CEREMA_MODX[ex[j].id] = [];
                CEREMA_MOD[ex[j].id].push(ex[j].mid);
                CEREMA_MODX[ex[j].id].push(ex[j].title);
            };

            for (var i = 0; i < dx.length; i++) {
                ndx.push(dx[i].id);
                list.push(dx[i].title);
            };

            function getID(n) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i] == n) return ndx[i];
                }
            };

            function selector(id) {
                var select = $('<select class="form-control" name="' + "select_" + id + '" id="' + "select_" + id + '" placeholder="Cliquer ici pour sélectionner une ou des rubriques de MarchesOnline" multiple></select>');
                $('dl').append(select);
                for (var z = 0; z < list.length; z++) {
                    var opt = document.createElement('option');
                    opt.id = "T" + list[z].id;
                    opt.innerHTML = list[z];
                    $(select).append(opt);
                };
                var vvv = [];
                if (CEREMA_MODX[id]) vvv = CEREMA_MODX[id];
                CPX[id] = new Choices(document.getElementById("select_" + id), {
                    removeItemButton: true,
                    renderSelectedChoices: 'auto',
                    loadingText: 'Chargement...',
                    duplicateItems: false,
                    noResultsText: '',
                    noChoicesText: '',
                    itemSelectText: 'Cliquez pour sélectionner',
                    addItemText: function (value) {
                        return `Press Enter to add <b>"${value}"</b>`;
                    }
                }).setValue(vvv);
                document.getElementById("select_" + id).addEventListener('addItem', function (event) {

                    var id = event.srcElement.id.split('select_')[1];
                    var mid = getID(event.detail.value);
                    if (!CEREMA_MOD[id]) CEREMA_MOD[id] = [];
                    if (!CEREMA_MODX[id]) CEREMA_MODX[id] = [];
                    CEREMA_MOD[id].push(mid);
                    CEREMA_MODX[id].push(event.detail.value);
                    for (var el in CPX) CPX[el].disable();
                    $.ajax({
                        method: "post",
                        url: "/api/update",
                        data: {
                            items: JSON.stringify(CEREMA_MOD)
                        }
                    }).done(function (ex) {
                        for (var el in CPX) CPX[el].enable();
                    });
                }, false);
                document.getElementById("select_" + id).addEventListener('removeItem', function (event) {
                    var id = event.srcElement.id.split('select_')[1];
                    var mid = getID(event.detail.value);
                    if (!CEREMA_MOD[id]) CEREMA_MOD[id] = [];
                    if (!CEREMA_MODX[id]) CEREMA_MODX[id] = [];
                    CEREMA_MOD[id].splice(event.detail.id - 1);
                    CEREMA_MODX[id].splice(event.detail.id - 1);
                    for (var el in CPX) CPX[el].disable();
                    $.ajax({
                        method: "post",
                        url: "/api/update",
                        data: {
                            items: JSON.stringify(CEREMA_MOD)
                        }
                    }).done(function (ex) {
                        for (var el in CPX) CPX[el].enable();
                    });
                }, false);
            };

            function get(data, i, cb) {
                if (!data[i]) return cb();
                $('dl').append('<dt id="p' + data[i].id + '" style="padding:15px"><b>' + data[i].title + '</b></dt>');
                $.ajax({
                    method: "get",
                    url: "/api/getCEREMA/" + data[i].id,
                }).done(function (d) {
                    for (var j = 0; j < d.length; j++) {
                        $('dl').append('<dd style="padding-top:1px;padding-left:15px;padding-bottom:5px">' + d[j].title + '</dl>');
                        selector(d[j].id);
                    };
                    get(data, i + 1, cb);
                });
            };
            get(data, 0, function () {

            });
        });


    });


})