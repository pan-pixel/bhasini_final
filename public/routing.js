const buyNowButtons = document.querySelectorAll('.buy-now-button');
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // event.preventDefault(); // Prevent default behavior of anchor tag
            const id = parseInt(button.getAttribute('id')); // Get id attribute as integer
            if(id == 0){
                var index = 0;
                localStorage.setItem('selectedIndex', index);
            }
            else{
                var index = id - 1; // Calculate index (assuming ids start from 1)
                localStorage.setItem('selectedIndex', index);  
            }
            // Pass the index value to another JavaScript file or perform any other action
            // For example, if you want to call a function from another JavaScript file:
            // anotherJavaScriptFile.someFunction(index);
            console.log('Index of clicked card:', index);

        });
    });