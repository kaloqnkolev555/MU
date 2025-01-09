import { ajax } from '/BG/SiteAssets/httpRequestBase.js';
document.addEventListener("DOMContentLoaded", () => {
var selectFields = "";
var filter;
var sort;
var itemsToShow;
var listName;

selectFields = "$select=ID,Title,link,image,description,buttonText,flipped";
ajax('alumni-important','alumniImportant',selectFields);
ajax('alumni-important-news','alumniImportantNews',selectFields);
ajax('alumni-prize','alumniPrize',selectFields);
ajax('alumni-prize-news','alumniPrizeNews',selectFields);


selectFields = "$select=ID,Title,picture,job_x002d_position,phone,mobile,email";
ajax('alumni-contacts','alumniContacts',selectFields);

selectFields = "$select=ID,Title,image";
ajax('alumni-members','alumniMembers',selectFields);


listName = "Изображения";
if(_spPageContextInfo.webServerRelativeUrl.split('/')[1] == "/EN") {
    listName = "Images";
}

selectFields = "$select=Title,FileLeafRef,UniqueId,FileRef";
filter = "&$filter=FSObjType%20eq%201";
sort = "&$orderby=Created%20desc"
itemsToShow = "&$top=10"
// https://intd.mu-varna.bg/BG/_api/web/Lists/getbytitle('Изображения')/items?$filter=FSObjType%20eq%201&$select=Title,FileLeafRef,UniqueId&$orderby=Created%20desc

ajax(listName,'mainPhotoGallery',selectFields + sort + filter+ itemsToShow);
});