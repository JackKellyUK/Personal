function OMDb (searchField, searchButton, resetFilters, sortButtons, filterFields, gridContainer, modal, modeToggleButton) {
    this.searchField = document.getElementById(searchField);
    this.searchButton = document.getElementById(searchButton);
    this.resetFilters = document.getElementById(resetFilters);
    this.gridContainer = document.getElementById(gridContainer);
    this.modal = document.getElementById(modal);
    this.modeToggleButton = document.getElementById(modeToggleButton);

    this.displayed = [];
    this.apiKey = "63c45db9";
    this.apiURL = "http://www.omdbapi.com/?apikey=" + this.apiKey + "&s=";

    this.sortButtons = {
        az: document.getElementById(sortButtons.az),
        year: document.getElementById(sortButtons.year)
    }

    this.filterFields = {
        year: document.getElementById(filterFields.year)
    }

    this._init();
}

OMDb.prototype._init = function () {
    this.searchButton.addEventListener("click",this.search.bind(this));
    this.sortButtons.az.addEventListener("click",this.sortBy.bind(this, 'Title'));
    this.sortButtons.year.addEventListener("click",this.sortBy.bind(this, 'Year'));
    this.filterFields.year.addEventListener("input", this.applyFilters.bind(this));
    this.resetFilters.addEventListener("click", this.clearFilters.bind(this));
    this.modeToggleButton.addEventListener("click", this.modeToggle.bind(this));
}

OMDb.prototype.search = function (event) {
    event.preventDefault();

    this.appliedSort = {
        Title: "",
        year: ""
    };

    var searchLink = this.apiURL + this.searchField.value;
    var that = this;
    this.filtered = undefined;
    this.result = true;

    $.ajax({
        type: 'GET',
        url: searchLink,
        success: function(data) {
            if (data.Response == "True") {
                that.displayed = data.Search;
                that.render(that);
            } else {
                that.gridContainer.innerHTML = "";

                var result = document.createElement('p');
                result.innerHTML = "No results found, please try again!";
                that.gridContainer.appendChild(result);    
            }
        }
    })
}

OMDb.prototype.render = function (that) {

    that.gridContainer.innerHTML = "";
    var movieArray = that.getArray();
    
    if (this.result) {
        for (var i = 0; i < movieArray.length; i++) {

            var container = document.createElement('div');
            container.classList.add("column","medium-4","callout");

            if (movieArray[i].Poster != "N/A") {
                var image = document.createElement('img');
                image.src = movieArray[i].Poster;
                container.appendChild(image);
            }

            var title = document.createElement('h2');
            title.innerHTML = movieArray[i].Title;
            container.appendChild(title);

            var year = document.createElement('p');
            year.innerHTML = "Year: " + movieArray[i].Year;
            container.appendChild(year);


            var moreInfo = document.createElement('button');
            moreInfo.innerHTML = "Get more information <i class='fas fa-arrow-right'></i>";
            moreInfo.classList.add("button","expanded");
            moreInfo.setAttribute("data-open","revealInfo");
            moreInfo.addEventListener("click",that.getMoreInfo.bind(that,i));
            container.appendChild(moreInfo);

            that.gridContainer.appendChild(container);
        }
    } else {
        that.gridContainer.innerHTML = "No results, be less specific";
    }
}

OMDb.prototype.sortBy = function (type) {

    var movieArray = this.getArray();
    var that = this;

    if (that.appliedSort[type] == "dsc") {
        that.appliedSort[type] = "asc";

        movieArray.sort(function(a, b) {
            var aName = a[type].toLowerCase();
            var bName = b[type].toLowerCase();

            if (aName > bName) {
                return -1;
            }
        
            if (aName < bName) {
                return 1;
            }
        
            return 0;
        })
    } else {
        that.appliedSort[type] = "dsc";

        movieArray.sort(function(a, b) {
            var aName = a[type].toLowerCase();
            var bName = b[type].toLowerCase();

            if (aName < bName) {
                return -1;
            }
        
            if (aName > bName) {
                return 1;
            }
        
            return 0;
        })
    }

    this.render(this);
};

OMDb.prototype.applyFilters = function () {
    this.filtered = [];
    this.result = true;
    var filtersApplied = 0;

    //Year filtering
    var yearValue = this.filterFields.year.value;

    function filterYear(item) {
        return item.Year.indexOf(yearValue) > -1;
    }

    if (yearValue && yearValue.trim()) {
        this.filtered = this.displayed.filter(filterYear);
        filtersApplied += 1;
    }

    //Check if there are any matches
    if (this.filtered.length == 0 && filtersApplied > 0) {
        this.result = false;
    }

    this.render(this);
}

OMDb.prototype.getArray = function () {
    if (this.filtered === undefined || this.filtered.length == 0) {
        return this.displayed;
    } else {
        return this.filtered;
    }
}

OMDb.prototype.clearFilters = function () {
    for (key in this.filterFields) {
        if (this.filterFields.hasOwnProperty(key)) {
            this.filterFields[key].value = "";
        }
    }

    this.applyFilters(this);
}

OMDb.prototype.getMoreInfo = function (i) {
    this.modal.innerHTML = "";
    var item = (this.getArray()[i]);
    var that = this;
    
    $.ajax({
        type: 'GET',
        url: this.apiURL + "&i=" + item.imdbID,
        success: function(data) {
            if (data.Response == "True") {
                that.renderModal(data);
            }
        }
    })
}

OMDb.prototype.renderModal = function (data) {
    var close = document.createElement('button');
    close.classList.add("close-button");
    close.setAttribute("data-close","");
    close.innerHTML = "&times;";
    this.modal.appendChild(close);

    var title = document.createElement('h2');
    title.innerHTML = data.Title;
    this.modal.appendChild(title);

    var information = document.createElement('p');
    information.innerHTML += "<i class='fas fa-film'></i> " + "Genre: " + data.Genre + "<br>";
    information.innerHTML += "<i class='fas fa-user'></i> " + "Actors: " + data.Actors + "<br>";
    information.innerHTML += "<i class='fas fa-star'></i> " + "Rating: " + data.imdbRating + " / 10.0 <br>";
    information.innerHTML += "<i class='fas fa-calendar-week'></i> " + "Released: " + data.Released + "<br>";
    information.innerHTML += "<i class='fas fa-clock'></i> " + "Runtime: " + data.Runtime + "<br>";
    this.modal.appendChild(information);

    var imdb = document.createElement('a');
    imdb.href = "https://www.imdb.com/title/" + data.imdbID;
    imdb.target = "_blank";
    imdb.innerHTML = "View on IMDb";
    imdb.classList.add("button");
    this.modal.appendChild(imdb);
}

OMDb.prototype.modeToggle = function () {
    if (document.body.classList.contains("invert")) {
        document.body.classList.remove("invert");
        this.modeToggleButton.innerHTML = '<i class="fas fa-sun"></i>'
    } else {
        document.body.classList.add("invert");
        this.modeToggleButton.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

var sortButtons = {
    az: 'sortAZ',
    year: 'sortYear',
}

var filterFields = {
    year: 'yearFilter'
}

new OMDb('searchField', 'searchButton', 'resetFilters', sortButtons, filterFields, 'grid-container', 'revealInfo', 'modeToggle');