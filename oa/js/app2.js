Array.prototype.remove = function () {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

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
                CEREMA_MOD[ex[j].id].push(ex[j].mid);
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
                var select = $('<select id="select_' + id + '" class="contacts" placeholder="Cliquer ici pour sélectionner une ou des rubriques de MarchesOnline"></select>');
                $('dl').append(select);
                var options = [];
                for (var z = 0; z < list.length; z++) {
                    options.push({
                        _id: "T" + ndx[z],
                        _value: list[z]
                    });
                };

                var s = $('#select_' + id).selectize({
                    persist: false,
                    maxItems: null,
                    plugins: ['remove_button'],
                    valueField: '_id',
                    labelField: '_value',
                    searchField: ['_value'],
                    options: options,
                    onItemAdd: function (a) {
                        $("select").prop('disabled', true);
                        a = a.split('T')[1];
                        if (!CEREMA_MOD[id]) CEREMA_MOD[id] = [];
                        if (CEREMA_MOD[id].indexOf(a) == -1) CEREMA_MOD[id].push(a);
                        $.ajax({
                            method: "post",
                            url: "/api/update",
                            data: {
                                items: JSON.stringify(CEREMA_MOD)
                            }
                        }).done(function (ex) {

                        });

                    },
                    onItemRemove: function (a) {
                        a = a.split('T')[1];
                        if (!CEREMA_MOD[id]) CEREMA_MOD[id] = [];
                        if (CEREMA_MOD[id].indexOf(a) == -1) CEREMA_MOD[id].remove(a);
                        $.ajax({
                            method: "post",
                            url: "/api/rm",
                            data: {
                                id: id,
                                a: a
                            }
                        }).done(function (ex) {

                        });
                    }
                })
                var values = [];
                try {
                    for (var i = 0; i < CEREMA_MOD[id].length; i++) values.push('T' + CEREMA_MOD[id][i]);
                    s[0].selectize.setValue(values);
                } catch (e) {}

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