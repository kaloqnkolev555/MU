import { ajax } from '/BG/SiteAssets/httpRequestBase.js';
document.addEventListener("DOMContentLoaded", () => {
    // siteUrl = langVersion + siteUrl

var listName = "adm-navigation";
var selectFields = "$select=ID,Title,link,position";
var filter;
var sort;
var itemsToShow;

ajax(listName,'admNavigation',selectFields);

listName = "adm-events";
selectFields = "$select=ID,Title,link,picture,button,description,bigTile";
sort = "&$orderby=Created%20desc";

ajax(listName,'admEvents',selectFields + sort);

listName = "adm-choose-content";
selectFields = "$select=ID,Title,link,picture";

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

});