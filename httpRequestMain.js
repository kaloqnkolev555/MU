document.addEventListener("DOMContentLoaded", () => {
    document.head.innerHTML += '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
    siteUrl = langVersion + siteUrl

      
    function customCarousel(carouselList, items, prevBtn, nextBtn, paginationDotsContainer, itemsPerPage) {
        let currentIndex = 0;
        const totalItems = items.length;
        // const itemsPerPage = 4;  // Number of items to show per page
        const totalPages = Math.ceil(totalItems / itemsPerPage); // Total pages
        let autoRotate = false; // Set to true for automatic rotation
        let autoRotateInterval;
        let isAutoRotating = true; // Track if auto-rotation is running

        // Function to update the carousel position
        function updateCarousel() {
            let translateXValue = -currentIndex * (100 / itemsPerPage); // Move by percentage of the visible items
            carouselList.style.transform = `translateX(${translateXValue}%)`;

            // Update pagination dots
            document.querySelectorAll('.' + paginationDotsContainer.className + '-main-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });

            // Disable buttons if at the start or end
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === totalItems - itemsPerPage;
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
                // itemsPerPage == 1 means that one item fill 100% of the carousel container
                if (itemsPerPage == 1) {
                    currentIndex = (currentIndex + 1) % totalItems;
                } else {
                    if (currentIndex == totalItems - (itemsPerPage)) {
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
            if (itemsPerPage == 1) {
                if (currentIndex < totalItems - 1) {
                    currentIndex++;
                    updateCarousel();
                    resetAutoRotate();  // Restart auto-rotation after manual action
                }
            } else {
                if (currentIndex == totalItems - itemsPerPage) {
                    // if (currentIndex < totalItems - itemsPerPage) {
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

    function getYouTubeVideoID(url) {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\/|watch\?.+&v=)|youtu\.be\/)([^&\n?#]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
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

    // Calendar
    // Show popup when clicking on the .calendar div
    $('.calendar-trigger-button').click(function () {
        $('.popup').fadeIn("slow");  // Show the popup
        $('.overlay').fadeIn("slow"); // Show the overlay (background dim)
    });

    // Close popup when clicking on the close (X) button
    $('.close-btn').click(function () {
        $('.popup').fadeOut("slow");
        $('.overlay').fadeOut("slow");
    });

    // Close popup when clicking outside of the popup
    $(document).click(function (event) {
        // If the click is outside the .popup-content and not on the calendar
        if (!$(event.target).closest('.popup-content, .calendar-trigger-button').length) {
            $('.popup').fadeOut("slow");
            $('.overlay').fadeOut("slow");
        }
    });

    function getUpcomingEvents(events) {
        const now = new Date();

        return events
            .filter(event => {
                const eventDate = new Date(event.EventStartDate);
                return eventDate >= now || eventDate.toDateString() === now.toDateString();
            })
            .sort((a, b) => new Date(a.EventStartDate) - new Date(b.EventStartDate))
            .slice(0, 2); // Return only the first 2 events;
    }
    async function getCalendarEvents(data) {
        eventCalendarData = data;
        let currentMonth = new Date().getMonth(); // Month is zero-based
        let currentYear = new Date().getFullYear();
        renderCalendar(currentMonth, currentYear, eventCalendarData)
    }
    Handlebars.registerHelper('isStartOfWeek', function (index) {
        return (index % 7 === 0);
    });

    Handlebars.registerHelper('isEndOfWeek', function (index) {
        return (index % 7 === 6);
    });


    // Compile Handlebars template
    const source = document.getElementById('calendar-template').innerHTML;
    const template = Handlebars.compile(source);

    function getLocalizedWeekDays() {
        // Determine weekDays based on language
        if (langVersion === "/BG") {
            return ['Пон', 'Вт', 'Ср', 'Четв', 'Пет', 'Съб', 'Нед']; // Bulgarian names
        }
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; // Default to English
    }

    function getLocalizedMonths() {
        // Determine month names based on language
        if (langVersion === "/BG") {
            return [
                'Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни',
                'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'
            ]; // Bulgarian names
        }
        return [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ]; // Default to English
    }

    function generateDaysForMonth(month, year, eventCalendarData) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        let firstDay = new Date(year, month, 1).getDay();

        // Adjust firstDay to start on Monday
        firstDay = (firstDay === 0 ? 6 : firstDay - 1);

        // Get localized weekDays and months
        let weekDays = getLocalizedWeekDays();
        const today = new Date();

        // Helper function to format date into YYYY-MM-DD
        function formatDate(date) {
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        }

        // Create a map to group events by day
        const eventsByDay = {};

        eventCalendarData.forEach(event => {
            const eventDate = new Date(event.EventStartDate);
            const eventDateKey = formatDate(eventDate);

            // Initialize the array for the date if not yet created
            if (!eventsByDay[eventDateKey]) {
                eventsByDay[eventDateKey] = [];
            }

            let buttontText = '';
            if (langVersion === "/EN") {
                buttontText = 'More';
            }
            if (langVersion === "/BG") {
                buttontText = 'Виж още';
            }
            eventsByDay[eventDateKey].push({
                title: event.Title,
                description: event.MyPageContent,
                url: event.FileRef,
                eventDate: eventDate,
                buttontText: buttontText
            });
        });

        // Populate days array with empty placeholders for days before the 1st
        for (let i = 0; i < firstDay; i++) {
            days.push({ date: '' });
        }

        // Populate days array with actual days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

            days.push({
                date: day,
                isToday: isToday,
                events: eventsByDay[dateKey] || []
            });
        }

        // Ensure days array has exactly 7 columns per row
        while (days.length % 7 !== 0) {
            days.push({ date: '' });
        }

        return { days, weekDays };
    }

    function renderCalendar(month, year, data) {
        // Get localized weekDays and months
        const { days, weekDays } = generateDaysForMonth(month, year, data);
        const months = getLocalizedMonths();

        const eventsData = { days, weekDays };

        // Generate the HTML using the template and data
        const html = template(eventsData);

        // Inject the generated HTML into the DOM
        document.getElementById('calendar-container').innerHTML = html;

        // Update the current month and year display with localized month name
        const monthName = months[month];
        document.getElementById('current-month').textContent = monthName;

        // Ensure the year dropdown reflects the current year
        document.getElementById('year-select').value = year;

        // Add event listeners for each day
        addDayClickListeners(eventsData);

        // Select the nearest day with an event
        selectNearestDayWithEvent(eventsData);
    }

    function addDayClickListeners(eventsData) {
        const days = document.querySelectorAll('.day.has-event');
        const eventContentDiv = document.getElementById('event-content');

        let previouslySelectedDay = null; // Keep track of the previously selected day

        days.forEach(day => {
            day.addEventListener('click', function () {
                // Remove 'selected' class from the previously selected day
                if (previouslySelectedDay) {
                    previouslySelectedDay.classList.remove('selected');
                }

                // Add 'selected' class to the currently clicked day
                this.classList.add('selected');
                previouslySelectedDay = this; // Update the previously selected day

                // Get the index and retrieve events for the clicked day
                const index = this.getAttribute('data-index');
                const dayData = eventsData.days[index];

                if (dayData && dayData.events.length) {
                    // Display the events in the 'event-content' div
                    eventContentDiv.innerHTML = `
            <div class="tiles-wrapper">
                ${dayData.events.map(event => `
                    <div class="tile-box">
                        <div class="tile-content">
                            <div class="tile-texts-wrapper">
                                <div class="tile-title">${event.title}</div>
                                <div class="tile-text">${event.description}</div>
                            </div>
                            <div class="tile-buttons-wrapper">
                                <div class="tile-button">
                                    <a target="_blank" href="${event.url}" >
                                        <i class="fal fa-arrow-right"></i>
                                        <span>${event.buttontText}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                `).join('')
                        }
            </div>
                `;
                    // eventContentDiv.innerHTML = `
                    //     <strong>${dayData.date}</strong>
                    //     <ul>${dayData.events.map(event => `<li>${event}</li>`).join('')}</ul>
                    // `;
                } else {
                    // If no events, display a message
                    eventContentDiv.innerHTML = `
                    <strong>${dayData.date}</strong>
                    <p>No events for this day.</p>
                `;
                }
            });
        });
    }
    // Find and select the nearest day with an event
    function selectNearestDayWithEvent(eventsData) {
        const today = new Date();
        const todayIndex = eventsData.days.findIndex(day => day.isToday);

        // Find the nearest day with an event
        let nearestDayIndex = null;
        let minDiff = Infinity;

        eventsData.days.forEach((day, index) => {
            if (day?.events?.length > 0) {
                const dayDiff = Math.abs(index - todayIndex);
                if (dayDiff < minDiff) {
                    nearestDayIndex = index;
                    minDiff = dayDiff;
                }
            }
        });

        if (nearestDayIndex !== null) {
            const nearestDayElement = document.querySelectorAll('.day')[nearestDayIndex];
            nearestDayElement.classList.add('selected');
            nearestDayElement.click(); // Simulate click to display event content
        }
    }




    // Get current date for initial calendar load
    let currentMonth = new Date().getMonth(); // Month is zero-based
    let currentYear = new Date().getFullYear();
    let eventCalendarData = []
    // Add event listeners for month navigation buttons
    document.getElementById('prev-month').addEventListener('click', function () {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear -= 1;
        } else {
            currentMonth -= 1;
        }
        renderCalendar(currentMonth, currentYear, eventCalendarData);
    });

    document.getElementById('next-month').addEventListener('click', function () {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear += 1;
        } else {
            currentMonth += 1;
        }
        renderCalendar(currentMonth, currentYear, eventCalendarData);
    });

    // Add event listener for year dropdown change
    document.getElementById('year-select').addEventListener('change', function () {
        currentYear = parseInt(this.value, 10);
        renderCalendar(currentMonth, currentYear, eventCalendarData);
    });
    // Render year dropdown
    function renderYearDropdown(startYear, endYear) {
        const yearSelect = document.getElementById('year-select');
        for (let year = startYear; year <= endYear; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
        yearSelect.value = currentYear; // Set the current year
    }
    // Initial rendering of the year dropdown and calendar
    const startYear = 2020;
    const endYear = 2030;
    renderYearDropdown(startYear, endYear);
    renderCalendar(currentMonth, currentYear, eventCalendarData);


    function ajax(listName, scriptId, selectFields) {
        // selectFields = "$select=ID,Title,link,image,description,buttonText,flipped";
        $.ajax({
            url: siteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items?" + selectFields,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                // Compile the Handlebars template
                const source = document.getElementById(scriptId).innerHTML;
                const template = Handlebars.compile(source);

                // Create context with items array
                let sortedResults = data.d.results
                const hasPositionProperty = data.d.results.some(item => item.hasOwnProperty('position'));

                if (hasPositionProperty) {
                    sortedResults = data.d.results.sort((a, b) => a.position - b.position);
                } else {

                }
                const context = { [scriptId]: sortedResults };

                // Generate the HTML using the template and context
                const html = template(context);

                // Inject the rendered HTML into the DOM
                document.getElementById(scriptId + 'Output').innerHTML = html;
                if (scriptId == 'calendarEvents') {
                    const eventCalendarData = [
                        {
                            EventStartDate: '2024-11-01T21:00:00Z',
                            Title: 'Meeting with Team',
                            Description: 'Let\'s have a meeting dudes',
                            Url: 'www.google.com'
                        },
                        {
                            EventStartDate: '2024-11-01T21:10:00Z',
                            Title: 'Meeting with Team',
                            Description: 'Let\'s have a meeting dudes',
                            Url: 'www.google.com'
                        },
                        {
                            EventStartDate: '2024-11-03T22:00:00Z',
                            Title: 'Project Deadline',
                            Description: 'Finish the project',
                            Url: 'www.google.com'
                        },
                        {
                            EventStartDate: '2024-11-05T22:00:00Z',
                            Title: 'Client Call',
                            Description: 'Discussion with the client',
                            Url: 'www.google.com'
                        },
                        {
                            EventStartDate: '2024-11-19T22:01:00Z',
                            Title: 'Product Launch',
                            Description: 'Launching new product',
                            Url: 'www.google.com'
                        }
                    ];
                    let _source = document.getElementById('mainEvents').innerHTML;
                    let _template = Handlebars.compile(_source);
                    let _context = { ['mainEvents']: getUpcomingEvents(data.d.results) };
                    // Inject the rendered HTML into the DOM
                    document.getElementById('mainEvents' + 'Output').innerHTML = _template(_context);

                    getCalendarEvents(data.d.results);
                }


                if (listName == 'main-carousel') {
                    var carouselList = document.querySelector('.main-carousel-list');
                    var items = document.querySelectorAll('.main-carousel-item');
                    var prevBtn = document.getElementById('carousel-prevBtn');
                    var nextBtn = document.getElementById('carousel-nextBtn');
                    var paginationDotsContainer = document.querySelector('.carousel-pagination-dots');
                    customCarousel(carouselList, items, prevBtn, nextBtn, paginationDotsContainer, 1);
                }
                if (scriptId == 'mainVideoGallery') {
                    setThumbnailImages();
                    carouselList = document.querySelector('.main-gallery.videos .overview');
                    items = document.querySelectorAll('.main-gallery.videos .gallery-thumb');
                    prevBtn = document.querySelector('.main-gallery.videos .gallery-button.prev');
                    nextBtn = document.querySelector('.main-gallery.videos .gallery-button.next');
                    paginationDotsContainer = document.querySelector('.main-gallery.videos .gallery-paginator');
                    customCarousel(carouselList, items, prevBtn, nextBtn, paginationDotsContainer, 4);
                }
                if (scriptId == 'mainPhotoGallery') {
                    getFoldersWithThumbnails(data.d.results);
                    carouselList = document.querySelector('.main-gallery.photos .overview');
                    items = document.querySelectorAll('.main-gallery.photos .gallery-thumb');
                    // items[0].classList.add('big-thumb');
                    // items[1].classList.add('big-thumb');
                    prevBtn = document.querySelector('.main-gallery.photos .gallery-button.prev');
                    nextBtn = document.querySelector('.main-gallery.photos .gallery-button.next');
                    paginationDotsContainer = document.querySelector('.main-gallery.photos .gallery-paginator');
                    customCarousel(carouselList, items, prevBtn, nextBtn, paginationDotsContainer, 4);
                }
            }
        })

    }

    var selectFields = "$select=ID,Title,link,description,position";
    ajax('main-carousel', 'mainCarousel', selectFields);

    var listName = "Страници";
    if (langVersion == "/EN") {
        listName = "Pages";
    }
    selectFields = "$select=ID,Title,FileRef,MyImagesFolder";
    filter = "&$filter=ContentType eq 'InternetNews'";
    sort = "&$orderby=Created%20desc"
    itemsToShow = "&$top=4"
    // https://www.mu-varna.bg/BG/_api/web/Lists/getbytitle(%27Страници%27)/items?$select=ID,Title,FileRef?$filter=ContentType eq 'InternetNews'
    // $select=ID,Title,FileRef,MyImagesFolder&$filter=ContentType%20eq%20%27InternetNews%27&$orderby=Created%20desc
    ajax(listName, 'internetNews', selectFields + filter + sort + itemsToShow);

    selectFields = "$select=ID,Title,MyPageContent,FileRef,EventStartDate";
    filter = "&$filter=ContentType eq 'Events'";
    sort = "&$orderby=EventStartDate%20desc"
    itemsToShow = "&$top=20"
    ajax(listName, 'calendarEvents', selectFields + filter + sort + itemsToShow);


    selectFields = "$select=ID,description,position,url";
    ajax('main-important', 'mainImportant', selectFields);

    selectFields = "$select=ID,Title,link,image,buttonText,buttonHide,bigTile,description";
    ajax('main-news', 'mainNews', selectFields);

    selectFields = "$select=ID,Title,link,image,description,buttonText,flipped";
    ajax('main-admission', 'mainAdmission', selectFields);
    ajax('main-current', 'mainCurrent', selectFields);
    ajax('main-learn-bases', 'mainLearnBases', selectFields);
    

    listName = "External videos links";
    selectFields = "$select=Title,VideoUrl,ImageUrl";
    filter = "&$filter=ContentType eq 'InternetNews'";
    sort = "&$orderby=Created%20desc"
    itemsToShow = "&$top=10"
    ajax('External videos links', 'mainVideoGallery', selectFields + sort + itemsToShow);

    listName = "Изображения";

    if (langVersion == "/EN") {
        listName = "Images";
    }
    if (siteUrl == "/EN/AdmissionDE/") {
        listName = "Галерия прием";
    }

    selectFields = "$select=Title,FileLeafRef,UniqueId,FileRef,OData__ModerationStatus";
    filter = "&$filter=FSObjType eq 1 and OData__ModerationStatus eq 0";
    sort = "&$orderby=Created%20desc"
    itemsToShow = "&$top=10"
    // https://intd.mu-varna.bg/BG/_api/web/Lists/getbytitle('Изображения')/items?$filter=FSObjType%20eq%201&$select=Title,FileLeafRef,UniqueId&$orderby=Created%20desc

    ajax(listName, 'mainPhotoGallery', selectFields + sort + filter + itemsToShow);

    selectFields = "$select=ID,Title,link,description,buttonText,Created";
    itemsToShow = "&$top=2";
    sort = "&$orderby=Created%20desc";
    // ajax('main-events','mainEvents',selectFields + sort + itemsToShow);

    selectFields = "$select=ID,Title,link,image";
    ajax('main-sponsors', 'mainSponsors', selectFields);
     
    //Todo these should be removed from here and request base should be imported in mainCewp
    function insertItem(reqBody) {
        const restendpoint = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Subscriptions')/items";
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