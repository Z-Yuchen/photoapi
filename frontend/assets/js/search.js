const form = document.querySelector('#search-query');

form.addEventListener('submit', async function (e) {


  e.preventDefault();
  const inputElement = document.getElementById('message-input');
  const searchTerm = inputElement.value;
  const params = {q:searchTerm}

  apigClient.searchGet(params,{},{})
    .then(function(result){
      console.log(result)
      console.log(result['data'])
      makeImages(result.data['results'])
    }).catch( function(result){
      console.log(result)
    });
  })  

const makeImages = (shows) => {
  const imageContainer = document.getElementById('imageContainer');
  function clearImageContainer() {
    while (imageContainer.firstChild) {
        imageContainer.removeChild(imageContainer.firstChild);
    }
  }
  clearImageContainer();
  for (let img of shows) {
    imgElement = document.createElement('img');
    imgElement.src = img['url']
    imageContainer.appendChild(imgElement)
  } 
  console.log(imageContainer)
};