let proxy_url = "https://cors-anywhere.herokuapp.com/"; //if browser is blocking server call & CORS problem
let url = proxy_url + "https://api.flickr.com/services/feeds/photos_public.gne?tags=puppies&format=json";
url += "&nojsoncallback=true";

fetch(url) // Call the fetch function passing the url of the API as a parameter
    .then(function (response) {
        return response.json();
        //Code for handling the data you get from the API
    })
    .then(function (myJson) {
        const data = myJson.items;
        let container = document.getElementById("container");
        data.forEach((photo, index) => { //a loop for creating multiple images for the grids
            const card = document.createElement('div');
            card.setAttribute('class', 'card');
            const img = document.createElement('img');
            img.src = photo.media.m;
            img.setAttribute('data-id', index);
            card.appendChild(img);
            container.appendChild(card);
        });
        return container;
    }).then(function (containerElements) { //once images have been loaded to the grid, then add onclick functionality for lightbox
        let allimages = document.getElementsByTagName("img");
        let cardPictureslength = document.getElementsByClassName("card").length;
        for (let i = 0; i < allimages.length; i++) { //going through the loop
            allimages[i].onclick = function () { //when user clicks on one of the images for modal
                document.getElementById('modal').style.display = "block";
                const pic = document.createElement('img');
                pic.setAttribute('id', 'lightbox_picture'); //use id to display
                pic.setAttribute('data-slideid', i);
                pic.src = allimages[i].src;
                if (document.getElementById("lightbox_picture")) { //if modal is displaying currently
                    document.getElementById("content").removeChild(document.getElementById("lightbox_picture"));
                }

                //create previous button
                const clickPrevious = document.createElement('a');
                clickPrevious.setAttribute('id', 'prev');
                clickPrevious.onclick = function () {
                    slidesMovement(this.nextElementSibling, cardPictureslength, -1); //-1 is for decrement when user click previous 
                }
                clickPrevious.innerHTML = "&larr;";

                //create next button
                const clickNext = document.createElement('a');
                clickNext.setAttribute('id', 'next');
                clickNext.onclick = function () {
                    slidesMovement(this.previousElementSibling, cardPictureslength, 1); //1 is for increment when user click next
                }
                clickNext.innerHTML = "&rarr;";

                document.getElementById("content").appendChild(clickPrevious);
                document.getElementById("content").appendChild(pic);
                document.getElementById("content").appendChild(clickNext);

            }
        }
    }).then(() => {
        let close_sign = document.getElementsByClassName('close')[0]; //when user press "X" button to close modal
        close_sign.onclick = function () {
            if (document.getElementById("prev")) {
                document.getElementById("prev").outerHTML = ""; //remove previous button so that when user clicks on another image, only one previous button shows up
            }
            if (document.getElementById("next")) {
                document.getElementById("next").outerHTML = ""; //remove next button so that when user clicks on another image, only one next button shows up
            }            
            document.getElementById('modal').style.display = "none"; //exit out of modal
        }

        let close_modal = document.getElementById('modal'); //when user clicks anything outside of the modal
        close_modal.onclick = function () {
            const content = document.getElementById('modalcontent'); //to prevent user from existing modal when they click on image or any of modal content
            content.onclick = function (event) {
                event.preventDefault()
                event.stopPropagation();
                return false;
            }

            if (document.getElementById("prev")) {
                document.getElementById("prev").outerHTML = ""; //remove previous button so that when user clicks on another image, only one previous button shows up
            }

            if (document.getElementById("next")) {
                document.getElementById("next").outerHTML = ""; //remove next button so that when user clicks on another image, only one next button shows up
            }      
            document.getElementById('modal').style.display = "none"; //exit out of modal

        };
    })
    .catch(function () {
        let container = document.getElementById("container");
        container.innerHTML = "You don't have CORS to support this site :("
        // This code will run if the server returns any errors
    });



function slidesMovement(img, length, num) {
    let the_id = Number(img.dataset.slideid); //so JavaScript can evaluate to Number type
    num = Number(num); //so JavaScript can evaluate to Number type
    document.getElementById("content").removeChild(document.getElementById("lightbox_picture")); //removes current modal picture
    document.getElementById("content").removeChild(document.getElementById("prev")); //removes current previous button because the functionality only works for current image
    document.getElementById("content").removeChild(document.getElementById("next")); //removes current next button because the functionality only works for current image

    let new_id = the_id;
    if(the_id == 0 && num < 0){ //for first image and when user clicks previous button
        new_id = length-1;
    }else{ //recycles through the images content
        new_id = Math.abs(eval((the_id+num))%(length));
    }
    let picSlide = document.createElement('img'); //create a new image for Lightbox modal
    let newPic = document.querySelectorAll("[data-id='" + new_id + "']")[0].src; //grab new_id picture source
    picSlide.setAttribute('data-slideid', new_id); 
    picSlide.setAttribute('id', 'lightbox_picture');
    picSlide.src = newPic;

    let clickPrevious = document.createElement('a');
    clickPrevious.setAttribute('id', 'prev');
    clickPrevious.onclick = function () {
        slidesMovement(picSlide, length, -1);
    }
    clickPrevious.innerHTML = "&larr;";

    let clickNext = document.createElement('a');
    clickNext.setAttribute('id', 'next');
    clickNext.onclick = function () {
        slidesMovement(picSlide, length, 1);
    }
    clickNext.innerHTML = "&rarr;";

    document.getElementById("content").appendChild(clickPrevious);
    document.getElementById("content").appendChild(picSlide);
    document.getElementById("content").appendChild(clickNext);
}
