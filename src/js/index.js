import debounce from 'debounce';
import notie from 'notie';
import $ from 'jquery';

// Sections
const introSection = $('#intro-section');
const languagesSection = $('#languages-section');
const resultsSection = $('#results-section');

// Input
const searchInput = $('#search');

// Text
const translatedFrom = $('#translated-from')

// Lists
const detectedLanguagesList = $('#detected-languages-list');
const translationsList = $('#translations-list');

// Variables
let spokenLanguages = JSON.parse(localStorage.getItem('spoken-languages')) || [];
let lastSearch = '';

// Methods
const capitalize = function (text) {
  return text.charAt(0).toUpperCase() + text.substring(1);
};

const showResults = function (from, to = (navigator.language || navigator.userLanguage)) {
  translationsList.empty();
  let uri = 'https://glosbe.com/gapi/translate?from=' + from +  '&dest=' + to +'&format=json&phrase=' + lastSearch + '&callback=?&pretty=true';
  $.getJSON(uri, function (result) {
    if (!result.hasOwnProperty('tuc')) return false;
    // TODO: display a message to show that it's a wrong request
    result.tuc.forEach(function (value) {
        if (!value.hasOwnProperty('phrase')) return false;
        let translation = $('<li>').html(value.phrase.text)
        if (value.hasOwnProperty('meanings')) {
          let meaningsList = $('<ul>');
          value.meanings.forEach((meaning) => {
            $('<li>').html(meaning.text).appendTo(meaningsList);
          });
          meaningsList.appendTo(translation);
        };
        translation.appendTo(translationsList);
    });
  });
}

searchInput.on('keyup', debounce(function () {
  lastSearch = this.value;
  if (lastSearch) {
    introSection.hide();
    languagesSection.hide();
    resultsSection.show();
  } else {
    introSection.show();
    languagesSection.show();
    resultsSection.hide();
    return false;
  }
  $.ajax({
    url: '/api/languages/' + spokenLanguages.join('-') + '/' + lastSearch
  })
  .done(function (data) {
    if (data.length !== 0) {
      if (data[0].code == (navigator.language || navigator.userLanguage)) {
        showResults(data[0].code, data[1].code);
        // TODO: add a button to choose the language to translate to
        translatedFrom.parent().hide();
      } else {
        showResults(data[0].code);
        translatedFrom.parent().show();
        translatedFrom.text(capitalize(data[0].name));
      }
    }
  })
}, 1000));

searchInput.on('click', function () {
  if (spokenLanguages.length == 0) {
    notie.alert(2, 'You have to select some languages before search.', 10)
  }
});

$('.dropdown dt a').on('click', function() {
  $('.dropdown dd ul').slideToggle('fast');
});

$('.dropdown dd ul li a').on('click', function() {
  $('.dropdown dd ul').hide();
});

$(document).bind('click', function(e) {
  var $clicked = $(e.target);
  if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
});

$.ajax({
  url: '/api/detected-languages'
})
.done(function (data) {
  data.forEach((value) => {
    var li = $('<li>');
    $('<input>').attr('value', value)
                .attr('type', 'checkbox')
                .on('click', function() {
                  var title = capitalize($(this).val()) + ',';

                  if ($(this).is(':checked')) {
                    var html = '<span title="' + title + '">' + title + '</span>';
                    $('.multiSel').append(html);
                    $('.hida').hide();
                    spokenLanguages.push($(this).val());
                  } else {
                    spokenLanguages.splice(spokenLanguages.indexOf($(this).val()), 1);
                    $('span[title="' + title + '"]').remove();
                    if ($('.hida:only-child').length) {
                      $('.hida').show();
                    }
                  }
                  localStorage.setItem('spoken-languages', JSON.stringify(spokenLanguages))
                })
                .appendTo(li);
    $('<span>').text(capitalize(value))
               .appendTo(li);
    li.appendTo(detectedLanguagesList);
    if (spokenLanguages.indexOf(value) > -1) {
      $('input[value="' + value + '"]').attr('checked', true);
      var title = capitalize(value) + ',';
      var html = '<span title="' + title + '">' + title + '</span>';
      $('.multiSel').append(html);
      $('.hida').hide();
    }
  });
});
// https://glosbe.com/gapi/translate?from=fra&dest=eng&format=json&phrase=papa
