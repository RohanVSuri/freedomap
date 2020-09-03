const scrollIndicator = document.getElementsByClassName('scroll-indicator')[0];
const mainText = document.getElementsByClassName('ptext')[0];

scrollIndicator.addEventListener('click', function(){ mainText.scrollIntoView({ behavior: 'smooth' }); });