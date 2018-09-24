function hover(element){
  var img = element.getElementsByTagName('img')[0];
  var src = img.src;
  console.log(src);
  document.getElementById('full-img').src = src;
}
      
