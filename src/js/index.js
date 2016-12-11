const introSection = document.querySelector('#intro-section');
import debounce from 'debounce';

document.querySelector('#search').onkeyup = debounce(function () {
  if (this.value) {
    introSection.style.display = 'none';
  } else {
    introSection.style.display = 'block';
  }
  console.log('ok')
}, 400);
