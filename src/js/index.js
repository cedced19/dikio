import debounce from 'debounce';
import notie from 'notie';
import $ from 'jquery';

const introSection = $('#intro-section');
const languagesSection = $('#languages-section');
const searchInput = $('#search');
const detectedLanguagesList = $('#detected-languages-list');
const capitalize = function (text) {
  return text.charAt(0).toUpperCase()+text.substring(1)
};

let spokenLanguages = JSON.parse(localStorage.getItem('spoken-languages')) || [];

searchInput.on('keyup', debounce(function () {
  if (this.value) {
    introSection.hide();
    languagesSection.hide();
  } else {
    introSection.show();
    languagesSection.show();
  }
}, 400));

searchInput.onclick = function () {
  if (!spokenLanguages.length) {
    notie.alert(2, 'You have to select some languages before search.', 10)
  }
}

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
