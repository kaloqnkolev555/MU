import { ajax } from '/BG/SiteAssets/httpRequestBase.js';
document.addEventListener("DOMContentLoaded", function () {
	let listName = 'Useful links';
	let scriptId = 'usefulLinksMenu';
	fetchViewFields(listName, scriptId, usefulLinksMenuTemplate);

	listName = 'Footer links';
	scriptId = 'footerLinksMenu';
	fetchViewFields(listName, scriptId, footerLinksMenuTemplate);

	mobileMenus();
	toggleContrastTheme();
	toggleLogin();
	getYear();
});

function getTranslation(name) {
	const dataBase = {
		1033: {
			usefulLinks: "Useful links"
		},
		1026: {
			usefulLinks: "Полезни връзки"
		}
	}
	return dataBase[_spPageContextInfo.webLanguage][name];
}

const usefulLinksMenuTemplate = `
<div class="useful-links-menu">
	<div class="links-header">
		<a href="">
			<i class="fa fa-external-link-square"></i>
			<span class="pl-2">`+ getTranslation('usefulLinks') +`</span>
		</a>
		<span class="close-button" onclick="toggleHiddenMenu('#usefulLinksMenuOutput')">
			<i class="fal fa-times"></i>
		</span>
	</div>
	<div class="links-list">
		{{#each usefulLinksMenu}}
			{{#if this.imageLink}}
				<hr>
			{{/if}}
			<a href="{{this.link.Url}}">
				{{#if this.iconClassName}}
					<i class="{{this.iconClassName}}"></i>
				{{/if}}
				{{#if this.imageLink}}
					<img src="{{this.imageLink.Url}}" alt="{{this.image.Description}}" style="width: 90px;height: 60px;object-fit: cover;">
				{{/if}}
				<span class="pl-2">{{this.LinkTitle}}</span>
			</a>
		{{/each}}
	</div>
</div>
`;
const footerLinksMenuTemplate = `
	{{#each footerLinksMenu}}
		<div class="d-flex flex-column">
			{{#each this}}
				{{#if (isLinkPropertyFooter @key ..)}}
					<a href="{{this.Url}}">{{this.Description}}</a>
				{{/if}}
			{{/each}}
		</div>
	{{/each}}
`;

Handlebars.registerHelper('isLinkPropertyFooter', function(propertyName, parRoot, options) {
	// Check if the property starts with "link" (case-insensitive) and is not null
	return parRoot[propertyName] != null && propertyName.toLowerCase().startsWith("link");
});

function fetchViewFields(listName, scriptId,templateAsString) {
	let siteUrl = _spPageContextInfo.siteAbsoluteUrl;
	// Extract the first part after the first '/' (e.g., '/BG')
	let siteLanguage = _spPageContextInfo.webServerRelativeUrl.match(/^\/[^\/]+/)[0];
	//Special case for AdmissionDE because this is subsite of EN
	if(_spPageContextInfo.webServerRelativeUrl == "/EN/AdmissionDE") {
		siteLanguage = _spPageContextInfo.webServerRelativeUrl;
	}
	$.ajax({
		url: siteUrl + siteLanguage + "/_api/web/lists/getbytitle('" + listName + "')/defaultview/viewfields",
		method: "GET",
		headers: {
			"Accept": "application/json; odata=verbose"
		},
		success: function (response) {
			// Step 2: Extract the field names
			var fields = response.d.Items.results;  // Extracting field names from the response
			// fields[0] = "Title"; // Override "LinkTitle" which is the internal name that Sharepoint use
			let fixedFields = fixColumnNames(fields); 
			var selectFields = "$select=" + fixedFields.join(",");  // Creating the $select parameter
			// Step 3: Use these fields to fetch the data
			ajax(listName, scriptId, selectFields,siteLanguage,templateAsString);
		},
		error: function (error) {
			console.error("Error fetching view fields:", error);
		}
	});
};

// When you query /_api/web/lists/getbytitle('Footerlinks')/defaultview/viewfields, 
// you get internal column names, like _x0055_RL1. 
// However, in SharePoint REST API, some columns—especially 
// custom columns—get prefixed with OData_ when retrieved via /items.
// 
// https://intd.mu-varna.bg/BG/_api/web/lists/getbytitle('Footerlinks')/items?$top=1
// This will return all fields, allowing you to inspect how _x0055_RL1 is actually stored (e.g., OData__x0055_RL1).
// retrieving column names dynamically from /viewfields with fixColumnNames()
function fixColumnNames(columns) {
    return columns.map(col => col.startsWith("_x") ? "OData_" + col : col);
}
//equalHeight function
function equalHeight(group) {
	var tallest = 0;
	group.each(function() {
		var thisHeight = $(this).height();
		if(thisHeight > tallest) {
			tallest = thisHeight;
		}
	});
	group.height(tallest);
}
// Make it globally accessible
window.equalHeight = equalHeight;
window.toggleHiddenMenu = toggleHiddenMenu;

//On page load 
$(function() {
    //fix menu on hover (original effect is on click)
	$('.dropdown, .dropdown-submenu').hover(function(){
		$(this).children('.dropdown-menu').show();
		$(this).children('.dropdown-submenu').hide();
	},function(){
		$(this).children('.dropdown-menu').hide();
		$(this).children('.dropdown-submenu').show();
	});
	$('.dropdown-menu').hover(
		function(){
			$(this).parent('li').addClass('active');
		},
		function(){
			$(this).parent('li').removeClass('active');
		}
	);
	
	
	//Popovers - footer
	$('#contacts').fadeOut();
	$(".map-label").click(function(){
		$("#contacts").removeClass('fade');  // Remove the Bootstrap .fade class
		$("#contacts").fadeToggle();    
		// $("#div2").fadeToggle("slow");
		// $("#div3").fadeToggle(3000);
	  });
	
	//shadow on boxes
	$('.box').shadow('lifted');
	$('.shadow').shadow('lifted');

	//translation
	$('.translation').click(function(){
		$('.lang').after('<div id="MicrosoftTranslatorWidget" class="translation-box"></div>');
		setTimeout(function() { 
			var s = document.createElement("script"); 
			s.type = "text/javascript"; 
			s.charset = "UTF-8"; 
			s.src = ((location && location.href && location.href.indexOf('https') == 0) ? "https://ssl.microsofttranslator.com" : "http://www.microsofttranslator.com" ) + "/ajax/v2/widget.aspx?mode=manual&from=bg&layout=ts"; 
			var p = document.getElementsByTagName('head')[0] || document.documentElement; p.insertBefore(s, p.firstChild); 
		}, 0); 
	});
	

	// Not sure where this is used --------------

	//fix subtitle design
	$('.box-subtitle').each(function(){
		$(this).offsetParent('.row-latest').find('.box-text').css('padding-bottom','39px');
	});
	
	//equalHeight
	setTimeout(function() {
		$('.row-latest').each(function(){
			equalHeight($(this).find('.span3'));
			equalHeight($(this).find('.span4'));
			equalHeight($(this).find('.span6'));
		});
		$('.row-fluid').each(function(){
			equalHeight($(this).find('.box'));
		});
	}, 1000);
	// Not sure where this is used --------------
	
	$('#ctl00_SmallSearchInputBox1_csr_SearchLink').removeClass('ms-srch-sb-searchLink');
	$('#ctl00_SmallSearchInputBox1_csr_SearchLink').addClass('btn btn-primary');
	$('#ctl00_SmallSearchInputBox1_csr_SearchLink').html('<i class="icon-white icon-search"></i>');
	
});
function toggleHiddenMenu(name) {
	// Stop the click event from bubbling up to the document click listener
	event.stopPropagation();
	$(name).toggle("slow");
}
function toggleLogin() {
	const signInLink = document.querySelector('.ms-signInLink');
	if (signInLink) {
		signInLink.style = ""; // Set the desired style
		document.querySelector('.copyrights').addEventListener('click', function() {
			signInLink.classList.toggle('d-block');
		});
	}
}
function getYear() {
	// Get the current year
	const currentYear = new Date().getFullYear();

	// Insert it into the span with id="year"
	document.getElementById("year").textContent = currentYear;
}
function toggleContrastTheme() {
	document.querySelectorAll('.contrast-theme').forEach(item => {
		item.addEventListener('click', function() {
			document.body.classList.toggle('contrast-theme-on');
		});
	});
}
function mobileMenus() {
	// Create the wrapping div with class 'mobileMenuControls'
	const wrapperDiv = document.createElement('div');
	wrapperDiv.classList.add('mobileMenuControls');
	
	// Create the <i> element
	const iconElement = document.createElement('i');
	iconElement.classList.add('fal', 'fa-times');

	
	const leftActionButtonsDiv = document.createElement('div');
	leftActionButtonsDiv.classList.add('d-flex', 'align-items-center');
	const themeToggleDiv = document.createElement('div');
	themeToggleDiv.classList.add('contrast-theme');
	themeToggleDiv.innerHTML = `<i class="fal fa-eye-slash"></i>`;
	
	leftActionButtonsDiv.appendChild(themeToggleDiv);
	// Create the language div
	const languageDiv = document.createElement('div');
	languageDiv.classList.add('language');
	
	// Add the language links
	languageDiv.innerHTML = `
		<a href="/BG">
			<span>BG</span>
		</a> /
		<a href="/EN">
			<span>EN</span>
		</a>
	`;
	leftActionButtonsDiv.appendChild(languageDiv);
	// Append the <i> and language div to the wrapping div
	wrapperDiv.appendChild(iconElement);
	wrapperDiv.appendChild(leftActionButtonsDiv);
	
	// Select the div with class 'second-menu'
	const secondMenuDiv = document.querySelector('.second-menu');
	const navCollapseDiv = document.querySelector('.nav-collapse');
	
	// Insert the wrapping div as the first child of the .second-menu container
	if (secondMenuDiv) {
		secondMenuDiv.insertBefore(wrapperDiv, secondMenuDiv.firstChild);
	} else {
		console.error('Element with class "second-menu" not found');
	}
	
	// Add click event to the <i> element to hide .second-menu
	iconElement.addEventListener('click', () => {
		$(navCollapseDiv).hide('slow');
	});

	

	$(document).click(function (event) {
		// Check if the window width is less than 1200px
		if ($(window).width() < 1200) {
			// Check if the clicked element is NOT inside the .nav-collapse container
			if (!$(event.target).closest('.nav-collapse').length) {
				// Close the menu by hiding it
				$('.nav-collapse').hide("slow");
			}
		}
		if (!$(event.target).closest('.useful-links-wrapper').length) {
			$('#usefulLinksMenuOutput').hide("slow");
		}
	});
	// Listen for window resize events
	$(window).resize(function() {
		// If window width is 1200px or more, show the .nav-collapse menu
		if ($(window).width() >= 1200) {
			$('.nav-collapse').show();
		} else if($(window).width() <= 1200) {
			$('.nav-collapse').hide();
		}
	});
}
