(function() {
    function sayHello()
    {
        document.getElementById('app').innerHTML = 'Hello new Year ' + getTime() + ' my name is Cristina.';
    }

    function getTime()
    {
        var date = new Date();
        return date.getFullYear().toString();
    }

    sayHello();

})()
