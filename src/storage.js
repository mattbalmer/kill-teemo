module.exports = {
    read: function() {
        var raw = localStorage.getItem('killteemo') || {};

        return JSON.parse(raw);
    },
    update: function(key, value) {
        var raw = localStorage.getItem('killteemo');

        var data = JSON.parse(raw) || {};

        data[key] = value;

        var string = JSON.stringify(data);

        localStorage.setItem('killteemo', string);

        return data;
    },
    write: function(data) {
        var string = JSON.stringify(data || {});

        localStorage.setItem('killteemo', data);
    },
    clear: function() {
        localStorage.setItem('killteemo', '{}');
    }
};