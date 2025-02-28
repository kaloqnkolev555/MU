let _siteUrl;
let siteUrl = _spPageContextInfo.webAbsoluteUrl
export function ajax(listName,scriptId,selectFields,modifySiteUrl,templateAsString) {
    let _templateAsString = templateAsString
    if(modifySiteUrl) {
        _siteUrl = modifySiteUrl
    } else {
        _siteUrl =  _spPageContextInfo.webAbsoluteUrl
    }

    $.ajax({
        url: _siteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items?" + selectFields,
        method: "GET",
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        success: function (data) {
            // mainAdmission = data.d.results
            // Compile the Handlebars template
            const source = document.getElementById(scriptId)?.innerHTML;
            let template;
            if(_templateAsString != undefined) {
                template = Handlebars.compile(templateAsString);
            } else {
                template = Handlebars.compile(source);
            }
            // Create context with items array
            let sortedResults = data.d.results
            const hasPositionProperty = data.d.results.some(item => item.hasOwnProperty('position'));

            if (hasPositionProperty) {
                sortedResults = data.d.results.sort((a, b) => a.position - b.position);
            }
            const context = { [scriptId]: sortedResults };
    
            // Generate the HTML using the template and context
            const html = template(context);
    
            // Inject the rendered HTML into the DOM
            document.getElementById(scriptId + 'Output').innerHTML = html;
            if(listName == 'main-carousel') {
                var carouselList = document.querySelector('.main-carousel-list');
                var items = document.querySelectorAll('.main-carousel-item');
                var prevBtn = document.getElementById('carousel-prevBtn');
                var nextBtn = document.getElementById('carousel-nextBtn');
                var paginationDotsContainer = document.querySelector('.carousel-pagination-dots');
                customCarousel(carouselList,items,prevBtn,nextBtn,paginationDotsContainer,1);
            }

            if(scriptId == 'mainVideoGallery') {
                setThumbnailImages();
                carouselList = document.querySelector('.main-gallery.videos .overview');
                items = document.querySelectorAll('.main-gallery.videos .gallery-thumb');
                prevBtn = document.querySelector('.main-gallery.videos .gallery-button.prev');
                nextBtn = document.querySelector('.main-gallery.videos .gallery-button.next');
                paginationDotsContainer = document.querySelector('.main-gallery.videos .gallery-paginator');
                customCarousel(carouselList,items,prevBtn,nextBtn,paginationDotsContainer,4);
            }
            if(scriptId == 'mainPhotoGallery') {
                getFoldersWithThumbnails(data.d.results);
                carouselList = document.querySelector('.main-gallery.photos .overview');
                items = document.querySelectorAll('.main-gallery.photos .gallery-thumb');
                // items[0].classList.add('big-thumb');
                // items[1].classList.add('big-thumb');
                prevBtn = document.querySelector('.main-gallery.photos .gallery-button.prev');
                nextBtn = document.querySelector('.main-gallery.photos .gallery-button.next');
                paginationDotsContainer = document.querySelector('.main-gallery.photos .gallery-paginator');
                customCarousel(carouselList,items,prevBtn,nextBtn,paginationDotsContainer,4);
            }
        }
    })
}
let _itemsPerPage=1;
function updateItemsPerPage(itemsPerPage) {
    if ($(window).width() < 768) {
        _itemsPerPage = 1;
    } else {
        _itemsPerPage = itemsPerPage; // Reset to default value if screen size is above 768
    }
    return _itemsPerPage;
}
function customCarousel(carouselList, items, prevBtn, nextBtn, paginationDotsContainer, itemsPerPage) {
    let _itemsPerPage = updateItemsPerPage(itemsPerPage);
    let currentIndex = 0;
    const totalItems = items.length;
    // const itemsPerPage = 4;  // Number of items to show per page
    const totalPages = Math.ceil(totalItems / _itemsPerPage); // Total pages
    let autoRotate = false; // Set to true for automatic rotation
    let autoRotateInterval;
    let isAutoRotating = true; // Track if auto-rotation is running


    $(window).resize(() => {
        _itemsPerPage = updateItemsPerPage(itemsPerPage);
    });
    // Function to update the carousel position
    function updateCarousel() {
        let translateXValue = -currentIndex * (100 / _itemsPerPage); // Move by percentage of the visible items
        carouselList.style.transform = `translateX(${translateXValue}%)`;

        // Update pagination dots
        document.querySelectorAll('.' + paginationDotsContainer.className + '-main-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Disable buttons if at the start or end
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalItems - _itemsPerPage;
    }

    // Create pagination dots
    function createPaginationDots() {
        for (let i = 0; i < totalItems; i++) {
            const dot = document.createElement('div');
            dot.classList.add(paginationDotsContainer.className + '-main-dot');
            if (i === currentIndex) {
                dot.classList.add('active');
            }
            // Add click event to each dot
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
                resetAutoRotate();
            });
            paginationDotsContainer.appendChild(dot);
        }
    }

    // Function to handle automatic rotation
    function startAutoRotate() {
        stopAutoRotate(); // Clear any existing interval first
        isAutoRotating = true; // Set to True if you want auto rotate the carousel
        autoRotateInterval = setInterval(() => {
            // _itemsPerPage == 1 means that one item fill 100% of the carousel container
            if (_itemsPerPage == 1) {
                currentIndex = (currentIndex + 1) % totalItems;
            } else {
                if (currentIndex == totalItems - (_itemsPerPage)) {
                    currentIndex = 0;
                } else {
                    currentIndex = (currentIndex + 1) % totalItems;
                }
            }
            updateCarousel();
        }, 4000); // Change slides every 4 seconds
    }

    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
        isAutoRotating = false;
    }

    function resetAutoRotate() {
        if (autoRotate) {
            startAutoRotate();
        }
    }

    // Pause rotation on item hover and resume on mouse leave
    items.forEach(item => {
        item.addEventListener('mouseenter', stopAutoRotate);
        item.addEventListener('mouseleave', resetAutoRotate);
    });

    // Event listeners for the buttons
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
            resetAutoRotate();  // Restart auto-rotation after manual action
        }
    });


    const swipeThreshold = 50; // Minimum swipe distance in pixels
    let touchStartX = 0;
    let touchStartY = 0;

    carouselList.addEventListener("touchstart", (event) => {
        const touch = event.touches[0];
        touchStartX = touch.clientX; // Store the starting X position
        touchStartY = touch.clientY;
    });

    carouselList.addEventListener("touchend", (event) => {
        const touch = event.changedTouches[0];
        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;

        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        // Check for horizontal or vertical swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                    resetAutoRotate();  // Restart auto-rotation after manual action
                }
            } else {
                if (currentIndex < totalItems - 1) {
                    currentIndex++;
                    updateCarousel();
                    resetAutoRotate();  // Restart auto-rotation after manual action
                }
            }
        } else if (Math.abs(diffY) > swipeThreshold) {
            if (diffY > 0) {
                console.log("Swipe down");
            } else {
                console.log("Swipe up");
            }
        }

    });


    nextBtn.addEventListener('click', () => {
        if (_itemsPerPage == 1) {
            if (currentIndex < totalItems - 1) {
                currentIndex++;
                updateCarousel();
                resetAutoRotate();  // Restart auto-rotation after manual action
            }
        } else {
            if (currentIndex == totalItems - _itemsPerPage) {
                // if (currentIndex < totalItems - _itemsPerPage) {
                //     currentIndex++;
                //     updateCarousel();
                //     resetAutoRotate();  // Restart auto-rotation after manual action
                // }
            } else {
                if (currentIndex < totalItems - 1) {
                    currentIndex++;
                    updateCarousel();
                    resetAutoRotate();  // Restart auto-rotation after manual action
                }
            }
        }

    });

    // Initialize carousel state
    
    updateCarousel();
    createPaginationDots();
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
            autoRotate = true
            resetAutoRotate()
        }
        });
    });
    observer.observe(carouselList);
    // Start automatic rotation if enabled
    if (autoRotate) {
        

        // Pause rotation on mouse hover over the entire carousel and resume on mouse leave
        document.querySelector('.main-carousel').addEventListener('mouseenter', stopAutoRotate);
        document.querySelector('.main-carousel').addEventListener('mouseleave', resetAutoRotate);
    }
}
// After the template is rendered, find all images and set their src attributes
function setThumbnailImages() {
    const images = document.querySelectorAll('img[data-video-url]');
    images.forEach((img) => {
        const videoUrl = img.getAttribute('data-video-url');
        const thumbnail = getYouTubeThumbnail(videoUrl);
        if (thumbnail) {
            img.src = thumbnail.medium;  // Use default or any other resolution
        }
    });
}
function getYouTubeThumbnail(url) {
    const videoID = getYouTubeVideoID(url);
    if (videoID) {
        return {
            default: `https://img.youtube.com/vi/${videoID}/default.jpg`,
            medium: `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`,
            high: `https://img.youtube.com/vi/${videoID}/hqdefault.jpg`,
            standard: `https://img.youtube.com/vi/${videoID}/sddefault.jpg`,
            maxRes: `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`
        };
    }
    return null;
}
function getYouTubeVideoID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\/|watch\?.+&v=)|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
async function getFoldersWithThumbnails(folderData) {
    try {
        const folders = folderData;
        let thumbnails = []
        // Loop through each folder and get the first image
        const images = document.querySelectorAll('img[data-photo-url]');
        // images.forEach((img) => {
        //     img.src = firstImage.ServerRelativeUrl;  // Use default or any other resolution

        // });
        for (let index = 0; index < folders.length; index++) {
            const folder = folders[index];
            const folderRelativeUrl = folder.FileRef; // The folder path
            
            // Fetch the first image from the folder
            const imageResponse = await fetch(`${siteUrl}/_api/web/GetFolderByServerRelativeUrl('${folderRelativeUrl}')/Files?$filter=substringof('.jpg', Name) or substringof('.png', Name)or substringof('.JPG', Name)&$orderby=TimeCreated asc&$top=1`, {
                method: "GET",
                headers: {
                    "Accept": "application/json;odata=verbose"
                }
            });

            const imageData = await imageResponse.json();
            const firstImage = imageData.d.results[0];
            
            if (firstImage) {
                thumbnails.push(firstImage.ServerRelativeUrl)
                images[index].src = firstImage.ServerRelativeUrl
                // console.log(`Folder: ${folder.FileLeafRef}, First Image: ${firstImage.ServerRelativeUrl}`);
            } else {
                // console.log(`Folder: ${folder.FileLeafRef}, No images found.`);
            }
        }

    } catch (error) {
        // console.log()
        console.log("Error fetching folders or images: ", error);
    }
}
document.addEventListener("DOMContentLoaded", () => {

    function insertItem(reqBody) {
        // _spPageContextInfo.webAbsoluteUrl
        const restendpoint = _spPageContextInfo.siteAbsoluteUrl + "/BG/_api/web/lists/getByTitle('Subscriptions')/items";
        const body = {
            __metadata: { type: "SP.Data.SubscriptionsListItem" },
            ...reqBody
        };

        // Disable the submit button to prevent multiple submissions
        document.querySelector('.subscribe-button').disabled = true;

        // Provide feedback to the user during the request
        const statusElement = document.querySelector('#thankYouMessage p');
        // statusElement.textContent = 'Submitting...';
        // statusElement.style.display = 'block';

        fetch(restendpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose',
                'X-RequestDigest': document.querySelector('#__REQUESTDIGEST').value,
            },
            body: JSON.stringify(body),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                // Hide input fields and button, show thank-you message
                document.querySelector('.subscribe-wrapper-form').style.display = 'none';
                document.querySelector('.subscribe-wrapper-thanks-message').style.display = 'block';
                // statusElement.style.display = 'none'; // Hide status message
            })
            .catch(error => {
                // Provide feedback about the error
                statusElement.textContent = 'An error occurred. Please try again.';
                // statusElement.style.color = 'red';
            })
            .finally(() => {
                // Re-enable the submit button
                document.querySelector('.subscribe-button').disabled = false;
            });
    }

    function clearSubscribeForm() {
        // Manually reset input fields
        $("#name").val('');
        $("#email").val('');
        $("#newsCheckbox").prop('checked', false);
        $("#admissionCheckbox").prop('checked', false);
        $("#scienceCheckbox").prop('checked', false);

        // Optionally, hide the thanks message and show the form
        $(".subscribe-wrapper-thanks-message").hide();
        $(".subscribe-wrapper-form").show();
    };
        
    $('.subscribe-trigger-button').click(function () {
        $('.popup-subscribe').fadeIn("slow");
        $('.overlay-subscribe').fadeIn("slow"); // Show the overlay (background dim)
    });

    // Close popup when clicking on the close (X) button
    $('.close-btn').click(function () {
        $('.popup-subscribe').fadeOut("slow",() => {
            clearSubscribeForm()
        })
        $('.overlay-subscribe').fadeOut("slow");
    });

    $(document).click(function (event) {
        // If the click is outside the .popup-content and not on the calendar
        if (!$(event.target).closest('.popup-content, .subscribe-trigger-button').length) {
            $('.popup-subscribe').fadeOut("slow",() => {
                clearSubscribeForm()
            })
            $('.overlay-subscribe').fadeOut("slow"); 

        }
    });

    $('.subscribe-button').on('click', async (e) => {
        e.preventDefault();
    // document.getElementById('formFields').addEventListener('submit', async (e) => {
    //     e.preventDefault();

        const name = $('#name').val();
        const email = $('#email').val();

        // Retrieve checkbox values
        const formData = {
        Title: name,
        email: email,
        'news_x0020_and_x0020_events': $('#newsCheckbox').is(':checked'),
            admission: $('#admissionCheckbox').is(':checked'),
            science: $('#scienceCheckbox').is(':checked'),
        };
        const emailField = document.querySelector('#email'); // Replace with the correct selector for your email input field
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex

        if (!emailRegex.test(email)) {
            // emailStatus.textContent = 'Please enter a valid email address.';
            // emailStatus.style.color = 'red';
            // emailStatus.style.display = 'block';
            return; // Stop submission if email is invalid
        } else {
            // emailStatus.style.display = 'none'; // Hide error message if email is valid
        }
        // if (!emailField[0].checkValidity()) {
        //     event.preventDefault();
        //     alert(emailField[0].validationMessage);
        // }

        if (!name || !email || (!formData['news_x0020_and_x0020_events'] && !formData.admission && !formData.science)) {
        // alert('Please fill out all fields and select at least one category.');
        return;
        }

        await insertItem(formData);

        // Optionally display the output for debugging or confirmation
    //   $('#output').html(`
    //     <p><strong>Submitted Data:</strong></p>
    //     <p>Name: ${formData.Title}</p>
    //     <p>Email: ${formData.Email}</p>
    //     <p>Subscribed to:</p>
    //     <ul>
    //       ${formData['news-and-events'] ? '<li>News and Events</li>' : ''}
    //       ${formData.admission ? '<li>Admission</li>' : ''}
    //       ${formData.science ? '<li>Science</li>' : ''}
    //     </ul>
    //   `);
    });
});



