(function() {
    function setName()
    {
        document.getElementById('name').innerHTML = 'My name is Bula';
    }

    function alertUser()
    {
        setTimeout(function() {
            alert('Hello!!!')
        }, 2000);
    }

    setName();
    alertUser();
})();
