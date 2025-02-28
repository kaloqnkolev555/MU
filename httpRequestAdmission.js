// window.document.head.innerHTML += '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">'
import { ajax } from '/BG/SiteAssets/httpRequestBase.js';

document.addEventListener("DOMContentLoaded", () => {
    const pageTitle = _spPageContextInfo.webTitle;
    const source = document.getElementById('slider-title')?.innerHTML;
    if(source) {
        const template = Handlebars.compile(source);
        const context = pageTitle;
        const html = template(context);
        document.querySelector('.slider-title').innerHTML = html;
    }
// Load JSON data using $.ajax
function loadJson(scriptIds) {
    $.ajax({
        url: '/BG/Admission/SiteAssets/' + 'custom-data.txt', // Path to your JSON file
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            scriptIds.forEach(scriptId => {
                const source = document.getElementById(scriptId)?.innerHTML;
                if (source) {
                    const template = Handlebars.compile(source);
                    const context = data[scriptId];

                    // Generate the HTML using the template and context
                    const html = template(context);

                    // Inject the rendered HTML into the DOM
                    document.getElementById(scriptId + 'Output').innerHTML = html;
                }
            });
        },
        error: function (xhr, status, error) {
            console.error('Error loading JSON file:', error);
        }
    });
}

var listName = "adm-navigation";
var selectFields = "$select=ID,Title,link,position";
var filter;
var sort;
var itemsToShow;

ajax(listName,'admNavigation',selectFields);

listName = "adm-events";
selectFields = "$select=ID,Title,link,picture,button,description,bigTile,position";
sort = "&$orderby=Created%20desc";

ajax(listName,'admEvents',selectFields + sort);

listName = "adm-choose-content";
selectFields = "$select=ID,Title,link,picture,position";

ajax(listName,'admChoice',selectFields);

listName = "adm-Testemonials";
selectFields = "$select=ID,Title,image,country,speciality,description";

if(_spPageContextInfo.webServerRelativeUrl == "/EN/AdmissionDE" || _spPageContextInfo.webServerRelativeUrl.split('/')[1] == "EN") {
    ajax(listName,'admTestemonials',selectFields);
}

listName = "adm-contacts";
selectFields = "$select=ID,Title,picture,job_x002d_position,phone,email";

ajax(listName,'admContacts',selectFields);

// Галерия прием
listName = "Галерия прием";
if(_spPageContextInfo.webServerRelativeUrl == "/EN/AdmissionDE" || _spPageContextInfo.webServerRelativeUrl.split('/')[1] == "EN") {
    listName = "Галерия прием";
}
selectFields = "$select=Title,FileLeafRef,UniqueId,FileRef";
filter = "&$filter=FSObjType%20eq%201";
sort = "&$orderby=Created%20desc"
itemsToShow = "&$top=10"
ajax(listName,'mainPhotoGallery',selectFields + sort + filter+ itemsToShow);

listName = "External videos links";
selectFields = "$select=Title,VideoUrl,position"; //ImageUrl
filter = "&$filter=ContentType eq 'InternetNews'";
sort = "&$orderby=Created%20desc"
itemsToShow = "&$top=10"
// langVersion on the end is /BG which means that this ajax will load the content from main directory
// also the list name should point the responding namelist from the directory
// if you want to load the list from admission just remove langVersion
ajax(listName,'mainVideoGallery',selectFields + sort + itemsToShow);

loadJson([
    'admChooseHeader',
    'admChooseContent',
    'admChooseContentEn',
    'admChooseContentDe',
    'contactsInfo',
    'contactsInfoEn',
    'contactsInfoDe',
    'admFaq',
    'admWhatCanStudyEn',
    'admWhatCanStudyDe',
    'admHowToApplyEn',
    'admHowToApplyDe'
]);



});