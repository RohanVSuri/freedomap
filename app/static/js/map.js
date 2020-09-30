let panelElement;
let map;
let form;
let formSubmit;
let lngInput;
let latInput;
let heatmapData;
let heatmapLayer;
let marker;
let submission;
let locationButton;
let exitButton;
const tags = ['womens', 'religious', 'racial', 'political', 'lgbtq', 'gun', 'foreign', 'environmental', 'domestic', 'covid'];
const protestSizes = ['Very small', 'Small', 'Average', 'Large', 'Very large'];

function initMap() {


    const center = { lat: 39.0119, lng: -98.4842 };
    map = new google.maps.Map(document.getElementById("map"), {
        center,
        zoom: 4,
        styles: mapStyles,
        streetViewControl: false,
        mapTypeControl: false,
        gestureHandling: 'greedy'
    });

    panelElement = document.getElementsByClassName('submission-panel')[0];
    locationButton = document.getElementById('location-button');
    exitButton = document.getElementsByClassName('exit-button')[0];

    lngInput = document.getElementById('lng-input');
    latInput = document.getElementById('lat-input');

    locationButton.addEventListener('click', (event) => {
        document.getElementById('address').value = 'Loading...';
        window.navigator.geolocation.getCurrentPosition(async (position) => {
            let { latitude, longitude } = position.coords;
            lngInput.value = longitude;
            latInput.value = latitude;

            document.getElementById('address').value = await coordsToAddress(latitude, longitude);
            marker.setPosition(new google.maps.LatLng(latitude, longitude));
        }, (e) => console.log(e), { enableHighAccuracy: true, maximumAge: 10000 });
    });

    exitButton.addEventListener('click', () => {
        closeSubmissionPanel();
    });

    map.addListener('click', async (event) => {
        let latLng = event.latLng;
        toggleSubmissionPanel(latLng);
    });

    form = document.getElementById('submission-form');
    formSubmit = document.getElementById('form-submit');
    formSubmit.addEventListener('click', async () => {
        let formData = new FormData(form);
        formData.delete('issue_type');

        const tagInputs = [...document.querySelectorAll('input[type="checkbox"]')];
        formData.append('issue_type', tagInputs
                                        .filter((input) => input.checked)
                                        .map((input => input.value))
                                        .join(','));

        let submission = await fetch('/map/protest-submission', {
            method: 'POST',
            body: formData
        }).then((res) => res.json());
        heatmapData.push({ location: new google.maps.LatLng(submission.lat, submission.lng), weight: submission.size / 5 });
        closeSubmissionPanel();
    });

    renderHeatmap(map);
    renderProtestIcons(map);


    window.onload = () => {

        $('.hover_bkgr_fricc').click(function(){
            $('.hover_bkgr_fricc').hide();
        });
        $('.popupCloseButton').click(function(){
            $('.hover_bkgr_fricc').hide();
        });
    }



}

function sleep(millis) {
    return new Promise((resolve) => setTimeout(resolve, millis));
}

async function coordsToAddress(latitude, longitude){
    const link = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=AIzaSyDf93zsxvm5pnCx3dzDVloGpmppk6ZRy7I";
    const data = await fetch(link).then(response => response.json());
    return data.status !== 'ZERO_RESULTS' ? data.results[0].formatted_address : 'No Address Found';
}

async function renderHeatmap(map) {
    submissions = await fetch('/map/protest-submission', {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    }).then((res) => res.json());
    heatmapData = heatmapData || new google.maps.MVCArray(submissions.map((submission) => {
        return new google.maps.LatLng(submission.lat, submission.lng); 
    }));

    // heatmapData = heatmapData.map((submission) => submission);
    
    // Create heatmap layer
    heatmapLayer = new google.maps.visualization.HeatmapLayer({
        data: heatmapData
    });

    // Display heatmap on the map
    heatmapLayer.setMap(map);
}

async function renderProtestIcons(map) {
    let protests = await fetch('/map/protests', {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    }).then((res) => res.json());
    
    protests = protests.filter((protest) => protest.submissions.length > 0);

    for (let protest of protests) {
        const tag = tagsFromProtest(protest)[0];

        marker = new google.maps.Marker({
            position: new google.maps.LatLng(protest.lat, protest.lng),
            icon: icons.fromTag(tag || tags[Math.floor(Math.random() * tags.length)]),
            map,
        });

        marker.addListener("click", () => {
            //     <p class="locality"></p>
            //     <p class = "tag"></p> 
            //     <p class = "size"></p>
            //     <p class = "description">Descriptions:</p>
            //     <div class="descriptions"></div>
            coordsToAddress(protest.lat, protest.lng).then((address) => $('.location').text(address));
            const tagsList = document.getElementsByClassName('tags-list')[0];
            let i = 0;
            let badChildren = [];
            for (let child of tagsList.children) {
                if (child.src) badChildren.push(child);
            }
            for (let bad of badChildren) {
                bad.remove();
            }
            for (let tag of tagsFromProtest(protest)) {
                if (tag == 'domestic' || tag == 'political') continue;
                const elem = document.createElement('img');
                elem.src = icons.fromTag(tag, 'circles/');
                elem.style.setProperty('--icon-index', i);
                tagsList.append(elem);
                i++;
            }
            $('size').text(protestSizes[protest.submissions[0].size])
            const descriptions = document.getElementsByClassName('descriptions')[0];
            for (let description of protest.submissions.map((sub) => sub.description)) {
                const descriptionText = document.createElement('p');
                descriptionText.textContent = description;
                descriptionText.classList.add('description-text');
                descriptions.append(descriptionText);
            }
            $('.hover_bkgr_fricc').show();
        });
    }
}

function toggleSubmissionPanel(latLng) {
    if (panelElement.classList.contains('shown')) {
        closeSubmissionPanel();
    } else {
        openSubmissionPanel(latLng, true);
    }
}

function openSubmissionPanel(latLng, createMarker) {
    document.getElementById('address').value = 'Loading...';
    coordsToAddress(latLng.lat(), latLng.lng()).then((address) => {
        document.getElementById('address').value = address;
    });

    panelElement.classList.add('shown');
    latInput.value = latLng.lat();
    lngInput.value = latLng.lng();

    if (createMarker) {
        marker = new google.maps.Marker({
            position: latLng,
            map,
            draggable: true,
            title: 'Document a protest here',
        });
        marker.addListener('dragend', () => {
            openSubmissionPanel(marker.getPosition(), false);
        });
    }
}

function closeSubmissionPanel() {
    marker.setMap(null);
    panelElement.classList.remove('shown');
    document.getElementById('address').value = null;
    document.getElementById('slider').value = 3;
    document.getElementById('textbox').value = null; 
    const tags = document.querySelectorAll('input[type="checkbox"]');
    for (let tagElem of tags) {
        tagElem.checked = false;
    }
}

const icons = {
    BASE_URL: '/static/img/icons/',
    fromTag: (tag, folder) => {
        return icons.BASE_URL + (folder || '') + tag + 'icon.png';
    }
}

function tagsFromProtest(protest) {
    const tagMap = new Map();

    for (let submission of protest.submissions) {
        for (let issueType of submission.issue_type) {
            tagMap.set(issueType, (tagMap.get(issueType) || 0) + 1);
        }
    }

    let sortedMap = [...tagMap];

    sortedMap.sort((a, b) => b[1] - a[1]);
    sortedMap = sortedMap.map((elem) => elem[0]);

    return sortedMap;
}

var mapStyles = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#616161"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#616161"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e5e5e5"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dadada"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e5e5e5"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c9c9c9"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "weight": 1
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    }
];
